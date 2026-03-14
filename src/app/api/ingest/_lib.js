/**
 * Shared ingest helpers
 * Used by /api/ingest/[name] and /api/ingest-all
 */

import fs from 'fs';
import path from 'path';

// ─── 설정 ────────────────────────────────────────────────────────────────────
export const CATALOG_DIR   = path.join(process.cwd(), 'data', 'catalog', '2_4inch');
export const ASSET_INDEX_FILE = path.join(process.cwd(), 'data', 'catalog', 'asset_index.json');
export const WIDGETS_DIR   = path.join(process.cwd(), 'src', 'widgets', '2.4_inches');
export const REGISTRY_FILE = path.join(process.cwd(), 'src', 'registry', 'index.js');

export const CHROMA_BASE_URL    = process.env.CHROMA_BASE_URL  || 'http://localhost:8000';
export const CHROMA_TENANT      = process.env.CHROMA_TENANT    || 'default_tenant';
export const CHROMA_DATABASE    = process.env.CHROMA_DATABASE  || 'default_database';
export const CHROMA_V2_PREFIX   = `${process.env.CHROMA_BASE_URL || 'http://localhost:8000'}/api/v2/tenants/${process.env.CHROMA_TENANT || 'default_tenant'}/databases/${process.env.CHROMA_DATABASE || 'default_database'}`;
export const OLLAMA_BASE_URL    = process.env.OLLAMA_BASE_URL  || 'http://localhost:11434';
export const EMBEDDING_MODEL    = process.env.EMBEDDING_MODEL  || 'bge-m3';
export const EMBEDDING_DIMENSION = 1024;

export const COL_DESCRIPTION = 'ui_components_description';
export const COL_CODE        = 'ui_components_code';
export const COL_SAMPLES     = 'ui_components_samples';
export const COL_ASSETS      = 'ui_assets';

function normalizeNameForMatch(value) {
    return String(value || '').replace(/_/g, '').toUpperCase();
}

/**
 * 입력 name/cataloData.name 과 매칭되는 카탈로그 파일명을 canonical component name으로 반환
 * 예: CM_LIST_HorizontalPager -> CM_LIST_HORIZONTAL_PAGER
 */
export function resolveCanonicalComponentName(name, catalogName) {
    const candidates = [name, catalogName].filter(Boolean).map(normalizeNameForMatch);
    if (!fs.existsSync(CATALOG_DIR)) return String(name || catalogName || '').toUpperCase();
    const files = fs.readdirSync(CATALOG_DIR).filter(f => f.endsWith('.json'));
    const match = files.find((f) => {
        const stemNorm = normalizeNameForMatch(f.replace('.json', ''));
        return candidates.includes(stemNorm);
    });
    return match ? match.replace('.json', '').toUpperCase() : String(name || catalogName || '').toUpperCase();
}

// ─── 유틸 ────────────────────────────────────────────────────────────────────

/** 컴포넌트 소스 파일 경로 탐색 */
export function findWidgetSource(name) {
    if (!fs.existsSync(WIDGETS_DIR)) return null;
    const files = fs.readdirSync(WIDGETS_DIR);
    const normTarget = name.toUpperCase().replace(/_/g, '');
    const match = files.find(f =>
        f.endsWith('.jsx') &&
        f.replace('.jsx', '').toUpperCase().replace(/_/g, '') === normTarget
    );
    return match ? path.join(WIDGETS_DIR, match) : null;
}

/** 레지스트리 파일에서 defaultProps 스니펫과 variants 목록을 추출 */
export function extractRegistryInfo(name) {
    const result = { defaultPropsSnippet: null, variants: [] };
    if (!fs.existsSync(REGISTRY_FILE)) {
        result.defaultPropsSnippet = `// defaultProps: 레지스트리 없음 (${name})`;
        return result;
    }
    const src = fs.readFileSync(REGISTRY_FILE, 'utf-8');

    const toRegistryKey = (n) => {
        const parts = n.split('_');
        const prefix = parts.slice(0, 2).map(p => p.toUpperCase()).join('_');
        const rest = parts.slice(2).map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join('');
        return rest ? `${prefix}_${rest}` : prefix;
    };

    const normalizeId = (s) => s.replace(/_/g, '').toLowerCase();
    const findRegistryKey = (source, inputName, convertedKey) => {
        for (const k of [inputName, convertedKey]) {
            if (source.includes(`${k}:`)) return k;
        }
        // fallback: underscore/case-insensitive key scan
        const normTarget = normalizeId(inputName);
        const keyRe = /^\s{4}(\w+):\s*\{/gm;
        let m;
        while ((m = keyRe.exec(source)) !== null) {
            if (normalizeId(m[1]) === normTarget) return m[1];
        }
        return null;
    };

    const resolvedKey = findRegistryKey(src, name, toRegistryKey(name));
    if (resolvedKey) {
        const escaped = resolvedKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // defaultProps
        const dpRe = new RegExp(
            String.raw`${escaped}:\s*\{[^}]*?defaultProps:\s*(\{[\s\S]*?\}),\s*variants:`
        );
        const dpMatch = src.match(dpRe);
        if (dpMatch) {
            result.defaultPropsSnippet = `// defaultProps for ${name}\nconst defaultProps = ${dpMatch[1].trim()};`;
        }

        // variants 배열 추출
        const blockStart = src.indexOf(`${resolvedKey}:`);
        if (blockStart !== -1) {
            const variantsPos = src.indexOf('variants: [', blockStart);
            if (variantsPos !== -1 && variantsPos < blockStart + 3000) {
                const arrStart = src.indexOf('[', variantsPos) + 1;
                let depth = 1, pos = arrStart;
                while (pos < src.length && depth > 0) {
                    if (src[pos] === '[') depth++;
                    else if (src[pos] === ']') depth--;
                    pos++;
                }
                const varBlock = src.slice(arrStart, pos - 1);
                const itemRe = /\{\s*id:\s*['"]([^'"]+)['"]\s*,\s*description:\s*['"]([^'"]+)['"]/g;
                let m;
                while ((m = itemRe.exec(varBlock)) !== null) {
                    result.variants.push({ id: m[1], description: m[2] });
                }
            }
        }
    }

    if (result.defaultPropsSnippet === null) {
        result.defaultPropsSnippet = `// defaultProps: 레지스트리에서 찾을 수 없음 (${name})`;
    }
    return result;
}

/** 설명 임베딩용 텍스트 빌드 */
export function buildDescriptionText(data, name) {
    const relatedScreens = Array.isArray(data.relatedScreens) ? data.relatedScreens : [];
    const propNotes = data.propNotes && typeof data.propNotes === 'object' ? data.propNotes : {};
    const propNotesLines = Object.entries(propNotes).map(([k, v]) => `  - ${k}: ${v}`);
    return [
        `Component: ${name}`,
        data.category ? `Category: ${data.category}` : '',
        data.descriptionKo ? `설명(KO): ${data.descriptionKo}` : '',
        data.descriptionEn ? `Description(EN): ${data.descriptionEn}` : '',
        data.visualForm ? `Visual Form: ${data.visualForm}` : '',
        data.keywords?.length ? `Keywords: ${data.keywords.join(', ')}` : '',
        relatedScreens.length ? `Related Screens: ${relatedScreens.join(', ')}` : '',
        data.props?.length ? `Props: ${data.props.join(', ')}` : '',
        propNotesLines.length ? `Prop Value Notes:\n${propNotesLines.join('\n')}` : '',
    ].filter(Boolean).join('\n');
}

/** 샘플 컬렉션용 텍스트 빌드 */
export function buildSampleText(data, name, sampleSnippet, variants = []) {
    const props = Array.isArray(data.props) ? data.props : [];
    const propNotes = data.propNotes && typeof data.propNotes === 'object' ? data.propNotes : {};
    const lines = [
        `Component: ${name}`,
        data.category ? `Category: ${data.category}` : '',
        '',
        '## 사용 예시 (defaultProps 기반)',
        sampleSnippet,
    ].filter((l, i) => i !== 1 || l);

    if (variants.length > 0) {
        lines.push('');
        lines.push(`## Variants (${variants.length})`);
        variants.forEach(v => lines.push(`- ${v.id}: ${v.description}`));
    }

    lines.push('');
    lines.push('## Props');
    lines.push(props.length ? props.map(p => {
        const note = propNotes[p];
        return note ? `  - ${p}: ${note}` : `  - ${p}`;
    }).join('\n') : '  (없음)');

    return lines.join('\n');
}

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

    if (allowedTypes) {
        entries = entries.filter((e) => allowedTypes.has(String(e.type || '').toLowerCase()));
    }
    if (allowedPaths) {
        entries = entries.filter((e) => allowedPaths.has(String(e.path || '')));
    }
    if (allowedAssetIds) {
        entries = entries.filter((e) => allowedAssetIds.has(String(e.id || '')));
    }
    if (limit !== null) {
        entries = entries.slice(0, limit);
    }

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

/** Ollama 단일 텍스트 임베딩 */
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

// name → UUID 캐시 (프로세스 수명 동안 유지)
const _collectionIdCache = {};

/** ChromaDB 컬렉션 생성(없으면), UUID 반환 */
export async function ensureCollection(name, metadata) {
    const res = await fetch(`${CHROMA_V2_PREFIX}/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, metadata, get_or_create: true }),
    });
    if (res.ok) {
        const data = await res.json();
        const id = data.id ?? data._id;
        if (id) _collectionIdCache[name] = id;
    }
}

/** collection name → UUID (캐시 → API 순으로 조회) */
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

/** ChromaDB ids 삭제 */
export async function chromaDeleteByIds(collectionName, ids) {
    const collectionId = await resolveCollectionId(collectionName);
    const body = { ids: Array.isArray(ids) ? ids : [ids] };
    const res = await fetch(`${CHROMA_V2_PREFIX}/collections/${collectionId}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`ChromaDB delete failed (${collectionName}): ${res.status} ${text}`);
    }
}

/** ChromaDB upsert */
export async function chromaUpsert(collectionName, id, embedding, metadata, document) {
    const collectionId = await resolveCollectionId(collectionName);
    const body = {
        ids: [id],
        embeddings: [embedding ?? Array(EMBEDDING_DIMENSION).fill(0)],
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

/**
 * 컴포넌트 1개를 인제스트하는 핵심 로직
 * @param {string} name   컴포넌트 이름 (대문자, e.g. "WD_PROGRESS_BAR")
 * @param {object|null} catalogData  카탈로그 데이터 (null이면 파일에서 로드)
 * @returns {{ ok: boolean, name: string, error?: string }}
 */
export async function ingestOne(name, catalogData = null) {
    const requestedName = name;

    // 카탈로그 데이터 로드 (없으면 파일에서)
    if (!catalogData) {
        const files = fs.existsSync(CATALOG_DIR) ? fs.readdirSync(CATALOG_DIR) : [];
        const normTarget = name.toUpperCase().replace(/_/g, '');
        const file = files.find(f =>
            f.endsWith('.json') &&
            f.replace('.json', '').toUpperCase().replace(/_/g, '') === normTarget
        );
        if (!file) {
            return { ok: false, name, error: `Catalog entry not found: ${name}` };
        }
        try {
            catalogData = JSON.parse(fs.readFileSync(path.join(CATALOG_DIR, file), 'utf-8'));
        } catch (e) {
            return { ok: false, name, error: `Catalog parse error: ${e.message}` };
        }
    }

    // ingest-all / ingest-this가 동일 레코드를 업데이트하도록 canonical 이름으로 통일
    const canonicalName = resolveCanonicalComponentName(requestedName, catalogData?.name);

    // 소스 코드 로드
    const sourcePath = findWidgetSource(canonicalName);
    const code = sourcePath ? fs.readFileSync(sourcePath, 'utf-8') : '';
    const sourceRelativePath = sourcePath
        ? path.relative(process.cwd(), sourcePath).replace(/\\/g, '/')
        : '';

    // 샘플 스니펫 + variants
    const registryLookupName = catalogData?.name || requestedName || canonicalName;
    const { defaultPropsSnippet, variants } = extractRegistryInfo(registryLookupName);

    // 텍스트 빌드
    const descText   = buildDescriptionText(catalogData, canonicalName);
    const sampleText = buildSampleText(catalogData, canonicalName, defaultPropsSnippet, variants);

    // 임베딩
    let descEmbedding, sampleEmbedding;
    try {
        [descEmbedding, sampleEmbedding] = await Promise.all([
            embed(descText),
            embed(sampleText),
        ]);
    } catch (e) {
        return { ok: false, name, error: `Embedding failed: ${e.message}` };
    }

    // Upsert
    const props    = Array.isArray(catalogData.props)    ? catalogData.props    : [];
    const keywords = Array.isArray(catalogData.keywords) ? catalogData.keywords : [];
    const relatedScreens = Array.isArray(catalogData.relatedScreens) ? catalogData.relatedScreens : [];

    try {
        await Promise.all([
            chromaUpsert(
                COL_DESCRIPTION,
                `desc_${canonicalName}`,
                descEmbedding,
                {
                    componentName: canonicalName,
                    category: catalogData.category || '',
                    descriptionKo: (catalogData.descriptionKo || '').slice(0, 512),
                    descriptionEn: (catalogData.descriptionEn || '').slice(0, 512),
                    props: props.join(', '),
                    keywords: keywords.join(', '),
                    relatedScreens: relatedScreens.join(', '),
                    sourcePath: sourceRelativePath,
                },
                descText
            ),
            chromaUpsert(
                COL_CODE,
                `code_${canonicalName}`,
                null,
                {
                    componentName: canonicalName,
                    category: catalogData.category || '',
                    props: props.join(', '),
                    sourcePath: sourceRelativePath,
                },
                code || `// 소스 없음: ${canonicalName}`
            ),
            chromaUpsert(
                COL_SAMPLES,
                `sample_${canonicalName}`,
                sampleEmbedding,
                {
                    componentName: canonicalName,
                    category: catalogData.category || '',
                    sourcePath: sourceRelativePath,
                },
                sampleText
            ),
        ]);
    } catch (e) {
        return { ok: false, name, error: `ChromaDB upsert failed: ${e.message}` };
    }

    return { ok: true, name };
}

/**
 * 컴포넌트 1개의 description/code/samples 엔트리를 삭제
 * @param {string} name 컴포넌트 이름 (registry/canonical 모두 허용)
 * @returns {{ ok: boolean, name: string, canonicalName?: string, error?: string }}
 */
export async function deleteOne(name) {
    const canonicalName = resolveCanonicalComponentName(name, null);
    const ids = {
        desc: `desc_${canonicalName}`,
        code: `code_${canonicalName}`,
        sample: `sample_${canonicalName}`,
    };

    try {
        await Promise.all([
            chromaDeleteByIds(COL_DESCRIPTION, ids.desc),
            chromaDeleteByIds(COL_CODE, ids.code),
            chromaDeleteByIds(COL_SAMPLES, ids.sample),
        ]);
    } catch (e) {
        return { ok: false, name, canonicalName, error: `ChromaDB delete failed: ${e.message}` };
    }

    return { ok: true, name, canonicalName };
}
