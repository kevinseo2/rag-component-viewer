/**
 * Shared ingest helpers
 * Used by /api/ingest/[name] and /api/ingest-all
 */

import fs from 'fs';
import path from 'path';

// ─── 설정 ────────────────────────────────────────────────────────────────────
export const CATALOG_DIR   = path.join(process.cwd(), 'data', 'catalog', '2_4inch');
export const WIDGETS_DIR   = path.join(process.cwd(), 'src', 'widgets', '2.4_inches');
export const REGISTRY_FILE = path.join(process.cwd(), 'src', 'registry', 'index.js');

export const CHROMA_BASE_URL    = process.env.CHROMA_BASE_URL  || 'http://localhost:8000';
export const OLLAMA_BASE_URL    = process.env.OLLAMA_BASE_URL  || 'http://localhost:11434';
export const EMBEDDING_MODEL    = process.env.EMBEDDING_MODEL  || 'bge-m3';
export const EMBEDDING_DIMENSION = 1024;

export const COL_DESCRIPTION = 'ui_components_description';
export const COL_CODE        = 'ui_components_code';
export const COL_SAMPLES     = 'ui_components_samples';

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
        return parts.map((p, i) => {
            if (i < 2) return p.toUpperCase();
            return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
        }).join('_');
    };

    for (const key of [name, toRegistryKey(name)]) {
        const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // defaultProps
        const dpRe = new RegExp(
            String.raw`${escaped}:\s*\{[^}]*?defaultProps:\s*(\{[\s\S]*?\}),\s*variants:`
        );
        const dpMatch = src.match(dpRe);
        if (dpMatch) {
            result.defaultPropsSnippet = `// defaultProps for ${name}\nconst defaultProps = ${dpMatch[1].trim()};`;
        }

        // variants 배열 추출
        const blockStart = src.indexOf(`${key}:`);
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
                const itemRe = /\{\s*id:\s*['"]([ ^'"]+)['"]\s*,\s*description:\s*['"]([ ^'"]+)['"]/g;
                let m;
                while ((m = itemRe.exec(varBlock)) !== null) {
                    result.variants.push({ id: m[1], description: m[2] });
                }
            }
        }

        if (result.defaultPropsSnippet !== null || result.variants.length > 0) break;
    }

    if (result.defaultPropsSnippet === null) {
        result.defaultPropsSnippet = `// defaultProps: 레지스트리에서 찾을 수 없음 (${name})`;
    }
    return result;
}

/** 설명 임베딩용 텍스트 빌드 */
export function buildDescriptionText(data, name) {
    return [
        `Component: ${name}`,
        data.category ? `Category: ${data.category}` : '',
        data.descriptionKo ? `설명(KO): ${data.descriptionKo}` : '',
        data.descriptionEn ? `Description(EN): ${data.descriptionEn}` : '',
        data.visualForm ? `Visual Form: ${data.visualForm}` : '',
        data.keywords?.length ? `Keywords: ${data.keywords.join(', ')}` : '',
        data.props?.length ? `Props: ${data.props.join(', ')}` : '',
    ].filter(Boolean).join('\n');
}

/** 샘플 컬렉션용 텍스트 빌드 */
export function buildSampleText(data, name, sampleSnippet, variants = []) {
    const props = Array.isArray(data.props) ? data.props : [];
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
    lines.push(props.length ? props.map(p => `  - ${p}`).join('\n') : '  (없음)');

    return lines.join('\n');
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

/** ChromaDB 컬렉션 생성(없으면) */
export async function ensureCollection(name, metadata) {
    await fetch(`${CHROMA_BASE_URL}/api/v1/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, metadata, get_or_create: true }),
    });
}

/** ChromaDB upsert */
export async function chromaUpsert(collectionName, id, embedding, metadata, document) {
    const body = {
        ids: [id],
        embeddings: [embedding ?? Array(EMBEDDING_DIMENSION).fill(0)],
        metadatas: [metadata],
        documents: [document],
    };
    const res = await fetch(`${CHROMA_BASE_URL}/api/v1/collections/${collectionName}/upsert`, {
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

    // 소스 코드 로드
    const sourcePath = findWidgetSource(name);
    const code = sourcePath ? fs.readFileSync(sourcePath, 'utf-8') : '';
    const sourceRelativePath = sourcePath
        ? path.relative(process.cwd(), sourcePath).replace(/\\/g, '/')
        : '';

    // 샘플 스니펫 + variants
    const { defaultPropsSnippet, variants } = extractRegistryInfo(name);

    // 텍스트 빌드
    const descText   = buildDescriptionText(catalogData, name);
    const sampleText = buildSampleText(catalogData, name, defaultPropsSnippet, variants);

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

    try {
        await Promise.all([
            chromaUpsert(
                COL_DESCRIPTION,
                `desc_${name}`,
                descEmbedding,
                {
                    componentName: name,
                    category: catalogData.category || '',
                    descriptionKo: (catalogData.descriptionKo || '').slice(0, 512),
                    descriptionEn: (catalogData.descriptionEn || '').slice(0, 512),
                    props: props.join(', '),
                    keywords: keywords.join(', '),
                    sourcePath: sourceRelativePath,
                },
                descText
            ),
            chromaUpsert(
                COL_CODE,
                `code_${name}`,
                null,
                {
                    componentName: name,
                    category: catalogData.category || '',
                    props: props.join(', '),
                    sourcePath: sourceRelativePath,
                },
                code || `// 소스 없음: ${name}`
            ),
            chromaUpsert(
                COL_SAMPLES,
                `sample_${name}`,
                sampleEmbedding,
                {
                    componentName: name,
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
