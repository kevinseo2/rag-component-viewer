import fs from 'fs';
import path from 'path';

export const ASSET_INDEX_FILE = path.join(process.cwd(), 'data', 'catalog', 'asset_index.json');

export const CHROMA_BASE_URL = process.env.CHROMA_BASE_URL || 'http://localhost:8000';
export const CHROMA_TENANT = process.env.CHROMA_TENANT || 'default_tenant';
export const CHROMA_DATABASE = process.env.CHROMA_DATABASE || 'default_database';
export const CHROMA_V2_PREFIX = `${CHROMA_BASE_URL}/api/v2/tenants/${CHROMA_TENANT}/databases/${CHROMA_DATABASE}`;
export const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
export const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'bge-m3';

export const COL_ASSETS = 'ui_assets';

const _collectionIdCache = {};

function toStableAssetId(assetType, assetPath) {
    const cleaned = String(assetPath || '').replace(/^\/+/, '').replace(/[^a-zA-Z0-9_./-]/g, '_');
    return `asset_${assetType}_${cleaned.replace(/[/.]/g, '_')}`;
}

function buildAssetDocument(entry, indexMeta = {}) {
    const tags = [];
    if (entry.scope) tags.push(entry.scope);
    if (entry.extension) tags.push(entry.extension.replace('.', ''));
    if (entry.type === 'image_sequence') {
        tags.push('sequence');
        if (typeof entry.frameCount === 'number') tags.push(`frames:${entry.frameCount}`);
    } else {
        tags.push('image');
    }

    return [
        `Asset Name: ${entry.name || ''}`,
        `Asset Type: ${entry.type || ''}`,
        `Path: ${entry.path || ''}`,
        entry.scope ? `Scope: ${entry.scope}` : '',
        entry.extension ? `Extension: ${entry.extension}` : '',
        entry.namingPattern ? `Naming Pattern: ${entry.namingPattern}` : '',
        typeof entry.frameCount === 'number' ? `Frame Count: ${entry.frameCount}` : '',
        indexMeta.sourceRoot ? `Source Root: ${indexMeta.sourceRoot}` : '',
        tags.length ? `Tags: ${tags.join(', ')}` : '',
    ].filter(Boolean).join('\n');
}

export async function embed(text) {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/embed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: EMBEDDING_MODEL, input: text }),
        signal: AbortSignal.timeout(60_000),
    });
    if (!res.ok) throw new Error(`Ollama embed failed: ${res.status}`);
    const json = await res.json();
    return json.embeddings[0];
}

export async function ensureCollection(name, metadata) {
    const res = await fetch(`${CHROMA_V2_PREFIX}/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, metadata, get_or_create: true }),
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`ensureCollection failed: ${res.status} ${text}`);
    }
    const data = await res.json();
    const id = data.id ?? data._id;
    if (id) _collectionIdCache[name] = id;
}

async function resolveCollectionId(name) {
    if (_collectionIdCache[name]) return _collectionIdCache[name];
    const res = await fetch(`${CHROMA_V2_PREFIX}/collections/${encodeURIComponent(name)}`);
    if (!res.ok) throw new Error(`Cannot resolve collection UUID for "${name}": ${res.status}`);
    const data = await res.json();
    const id = data.id ?? data._id;
    if (!id) throw new Error(`Collection "${name}" has no id field`);
    _collectionIdCache[name] = id;
    return id;
}

export async function chromaUpsert(collectionName, id, embedding, metadata, document) {
    const collectionId = await resolveCollectionId(collectionName);
    const body = {
        ids: [id],
        embeddings: [embedding],
        metadatas: [metadata],
        documents: [document],
    };
    const res = await fetch(`${CHROMA_V2_PREFIX}/collections/${collectionId}/upsert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`ChromaDB upsert failed (${collectionName}): ${res.status} ${text}`);
    }
}

export async function chromaDeleteByIds(collectionName, ids) {
    const collectionId = await resolveCollectionId(collectionName);
    const body = { ids };
    const res = await fetch(`${CHROMA_V2_PREFIX}/collections/${collectionId}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`ChromaDB delete failed (${collectionName}): ${res.status} ${text}`);
    }
}

/**
 * asset_index.json을 ui_assets 컬렉션으로 인제스트
 * @param {{types?: string[], limit?: number, paths?: string[], assetIds?: string[]}|null} options
 */
export async function ingestAssetsFromIndex(options = null) {
    if (!fs.existsSync(ASSET_INDEX_FILE)) {
        return { ok: false, error: `Asset index not found: ${ASSET_INDEX_FILE}` };
    }

    let index;
    try {
        index = JSON.parse(fs.readFileSync(ASSET_INDEX_FILE, 'utf-8'));
    } catch (e) {
        return { ok: false, error: `Asset index parse error: ${e.message}` };
    }

    const images = Array.isArray(index.images) ? index.images : [];
    const sequences = Array.isArray(index.sequences) ? index.sequences : [];

    const allowedTypes = Array.isArray(options?.types) && options.types.length > 0
        ? new Set(options.types.map((t) => String(t).toLowerCase()))
        : null;
    const allowedPaths = Array.isArray(options?.paths) && options.paths.length > 0
        ? new Set(options.paths.map((p) => String(p).trim()))
        : null;
    const allowedAssetIds = Array.isArray(options?.assetIds) && options.assetIds.length > 0
        ? new Set(options.assetIds.map((id) => String(id).trim()))
        : null;
    const limit = Number.isInteger(options?.limit) && options.limit > 0 ? options.limit : null;

    let entries = [
        ...images.map((e) => ({ ...e, type: 'image' })),
        ...sequences.map((e) => ({ ...e, type: 'image_sequence' })),
    ];

    if (allowedTypes) entries = entries.filter((e) => allowedTypes.has(String(e.type || '').toLowerCase()));
    if (allowedPaths) entries = entries.filter((e) => allowedPaths.has(String(e.path || '')));
    if (allowedAssetIds) entries = entries.filter((e) => allowedAssetIds.has(String(e.id || '')));
    if (limit !== null) entries = entries.slice(0, limit);

    const succeeded = [];
    const failed = [];

    for (const entry of entries) {
        const assetType = entry.type === 'image_sequence' ? 'seq' : 'img';
        const id = toStableAssetId(assetType, entry.path || entry.name || entry.id || 'unknown');
        const doc = buildAssetDocument(entry, index);
        try {
            const embedding = await embed(doc);
            await chromaUpsert(
                COL_ASSETS,
                id,
                embedding,
                {
                    assetId: entry.id || '',
                    assetName: entry.name || '',
                    assetType: entry.type || '',
                    path: entry.path || '',
                    scope: entry.scope || '',
                    extension: entry.extension || '',
                    frameCount: typeof entry.frameCount === 'number' ? entry.frameCount : 0,
                    namingPattern: entry.namingPattern || '',
                },
                doc
            );
            succeeded.push(entry.path || entry.name || id);
        } catch (e) {
            failed.push({ path: entry.path || entry.name || id, error: e.message });
        }
    }

    return {
        ok: true,
        total: entries.length,
        succeeded: succeeded.length,
        failed: failed.length,
        failedList: failed,
    };
}

/**
 * asset_index.json 기준으로 ui_assets 컬렉션 엔트리 삭제
 * @param {{types?: string[], limit?: number, paths?: string[], assetIds?: string[]}|null} options
 */
export async function deleteAssetsFromIndex(options = null) {
    if (!fs.existsSync(ASSET_INDEX_FILE)) {
        return { ok: false, error: `Asset index not found: ${ASSET_INDEX_FILE}` };
    }

    let index;
    try {
        index = JSON.parse(fs.readFileSync(ASSET_INDEX_FILE, 'utf-8'));
    } catch (e) {
        return { ok: false, error: `Asset index parse error: ${e.message}` };
    }

    const images = Array.isArray(index.images) ? index.images : [];
    const sequences = Array.isArray(index.sequences) ? index.sequences : [];

    const allowedTypes = Array.isArray(options?.types) && options.types.length > 0
        ? new Set(options.types.map((t) => String(t).toLowerCase()))
        : null;
    const allowedPaths = Array.isArray(options?.paths) && options.paths.length > 0
        ? new Set(options.paths.map((p) => String(p).trim()))
        : null;
    const allowedAssetIds = Array.isArray(options?.assetIds) && options.assetIds.length > 0
        ? new Set(options.assetIds.map((id) => String(id).trim()))
        : null;
    const limit = Number.isInteger(options?.limit) && options.limit > 0 ? options.limit : null;

    let entries = [
        ...images.map((e) => ({ ...e, type: 'image' })),
        ...sequences.map((e) => ({ ...e, type: 'image_sequence' })),
    ];

    if (allowedTypes) entries = entries.filter((e) => allowedTypes.has(String(e.type || '').toLowerCase()));
    if (allowedPaths) entries = entries.filter((e) => allowedPaths.has(String(e.path || '')));
    if (allowedAssetIds) entries = entries.filter((e) => allowedAssetIds.has(String(e.id || '')));
    if (limit !== null) entries = entries.slice(0, limit);

    const ids = entries.map((entry) => {
        const assetType = entry.type === 'image_sequence' ? 'seq' : 'img';
        return toStableAssetId(assetType, entry.path || entry.name || entry.id || 'unknown');
    });

    if (ids.length === 0) {
        return { ok: true, total: 0, deleted: 0, failed: 0, failedList: [] };
    }

    try {
        await chromaDeleteByIds(COL_ASSETS, ids);
        return { ok: true, total: ids.length, deleted: ids.length, failed: 0, failedList: [] };
    } catch (e) {
        return {
            ok: false,
            error: e.message,
            total: ids.length,
            deleted: 0,
            failed: ids.length,
            failedList: ids,
        };
    }
}
