#!/usr/bin/env node
/**
 * UI 컴포넌트 ChromaDB 인제스트 스크립트
 *
 * rag-component-viewer/data/catalog/2_4inch/ 의 개별 컴포넌트 JSON과
 * src/widgets/2.4_inches/ 의 소스 코드를 결합하여
 * ChromaDB 3개 컬렉션에 저장합니다:
 *
 *   1. ui_components_description  — 한/영 설명 임베딩 (시맨틱 검색)
 *   2. ui_components_code         — 위젯 JSX 소스 코드 페이로드
 *   3. ui_components_samples      — defaultProps 기반 사용 예시
 *
 * 사용법:
 *   node scripts/ingest-components.js              # 전체 인제스트 (컬렉션 재생성)
 *   node scripts/ingest-components.js --name WD_PROGRESS_CIRCLE   # 단일 upsert
 *   node scripts/ingest-components.js --no-recreate               # 재생성 없이 upsert
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

// ─────────────────────────────────────────────────────────────────────────────
// 설정
// ─────────────────────────────────────────────────────────────────────────────

const PROJECT_ROOT  = path.resolve(__dirname, '..');
const CATALOG_DIR   = path.join(PROJECT_ROOT, 'data', 'catalog', '2_4inch');
const WIDGETS_DIR   = path.join(PROJECT_ROOT, 'src', 'widgets', '2.4_inches');
const REGISTRY_FILE = path.join(PROJECT_ROOT, 'src', 'registry', 'index.js');

const CHROMA_BASE_URL   = process.env.CHROMA_BASE_URL   || 'http://localhost:8000';
const OLLAMA_BASE_URL   = process.env.OLLAMA_BASE_URL   || 'http://localhost:11434';
const EMBEDDING_MODEL   = process.env.EMBEDDING_MODEL   || 'bge-m3';
const EMBEDDING_DIM     = 1024;
const BATCH_SIZE        = 12;

const COL_DESCRIPTION = 'ui_components_description';
const COL_CODE        = 'ui_components_code';
const COL_SAMPLES     = 'ui_components_samples';

// ─────────────────────────────────────────────────────────────────────────────
// CLI 인수
// ─────────────────────────────────────────────────────────────────────────────

const args        = process.argv.slice(2);
const getArg      = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : undefined; };
const singleName  = getArg('--name');
const noRecreate  = args.includes('--no-recreate');

// ─────────────────────────────────────────────────────────────────────────────
// HTTP 유틸 (node 내장 http/https 사용 — 외부 의존 없음)
// ─────────────────────────────────────────────────────────────────────────────

function fetchJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed  = new URL(url);
    const lib     = parsed.protocol === 'https:' ? https : http;
    const reqOpts = {
      hostname: parsed.hostname,
      port:     parsed.port,
      path:     parsed.pathname + parsed.search,
      method:   options.method || 'GET',
      headers:  { 'Content-Type': 'application/json', ...(options.headers || {}) },
    };

    const req = lib.request(reqOpts, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          } else {
            resolve(json);
          }
        } catch (e) {
          reject(new Error(`JSON parse error: ${e.message}\nBody: ${data.slice(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(options.timeout || 60_000, () => {
      req.destroy(new Error(`Request timeout: ${url}`));
    });

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ChromaDB REST
// ─────────────────────────────────────────────────────────────────────────────

async function chromaHeartbeat() {
  await fetchJson(`${CHROMA_BASE_URL}/api/v1/heartbeat`);
}

async function chromaDeleteCollection(name) {
  try {
    await fetchJson(`${CHROMA_BASE_URL}/api/v1/collections/${name}`, { method: 'DELETE' });
    console.log(`  🗑️  Deleted: ${name}`);
  } catch (e) {
    if (e.message.includes('404') || e.message.toLowerCase().includes('does not exist') || e.message.toLowerCase().includes('not found')) {
      console.log(`  ℹ️  Not found (skip): ${name}`);
    } else {
      throw e;
    }
  }
}

async function chromaEnsureCollection(name, metadata) {
  await fetchJson(`${CHROMA_BASE_URL}/api/v1/collections`, {
    method: 'POST',
    body: { name, metadata, get_or_create: true },
  });
}

async function chromaUpsert(collectionName, ids, embeddings, metadatas, documents) {
  const effectiveEmbeddings = embeddings ?? ids.map(() => new Array(EMBEDDING_DIM).fill(0));
  await fetchJson(`${CHROMA_BASE_URL}/api/v1/collections/${collectionName}/upsert`, {
    method: 'POST',
    body: { ids, embeddings: effectiveEmbeddings, metadatas, documents },
    timeout: 120_000,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Ollama 임베딩
// ─────────────────────────────────────────────────────────────────────────────

async function embedBatch(texts) {
  const result = await fetchJson(`${OLLAMA_BASE_URL}/api/embed`, {
    method: 'POST',
    body: { model: EMBEDDING_MODEL, input: texts },
    timeout: 300_000,
  });
  return result.embeddings;
}

async function embedAll(texts) {
  const out = [];
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const vecs  = await embedBatch(batch);
    out.push(...vecs);
    console.log(`   임베딩: ${Math.min(i + BATCH_SIZE, texts.length)}/${texts.length}`);
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// 카탈로그 로드
// ─────────────────────────────────────────────────────────────────────────────

function loadCatalogEntries(nameFilter) {
  if (!fs.existsSync(CATALOG_DIR)) {
    throw new Error(`카탈로그 디렉토리가 없습니다: ${CATALOG_DIR}`);
  }

  const files   = fs.readdirSync(CATALOG_DIR).filter(f => f.endsWith('.json'));
  const entries = [];

  for (const file of files) {
    if (nameFilter) {
      const normFile   = file.replace('.json', '').toUpperCase().replace(/_/g, '');
      const normFilter = nameFilter.toUpperCase().replace(/_/g, '');
      if (normFile !== normFilter) continue;
    }
    try {
      const raw = fs.readFileSync(path.join(CATALOG_DIR, file), 'utf-8');
      entries.push(JSON.parse(raw));
    } catch (e) {
      console.warn(`  ⚠️  파싱 실패: ${file} — ${e.message}`);
    }
  }
  return entries;
}

// ─────────────────────────────────────────────────────────────────────────────
// 위젯 소스 탐색
// ─────────────────────────────────────────────────────────────────────────────

function findWidgetSource(name) {
  if (!fs.existsSync(WIDGETS_DIR)) return null;
  const files      = fs.readdirSync(WIDGETS_DIR);
  const normTarget = name.toUpperCase().replace(/_/g, '');

  const match = files.find(f =>
    f.endsWith('.jsx') &&
    f.replace('.jsx', '').toUpperCase().replace(/_/g, '') === normTarget
  );
  return match ? path.join(WIDGETS_DIR, match) : null;
}

function extractPropsFromSource(code) {
  const props = new Set();

  const ptMatch = code.match(/\.propTypes\s*=\s*\{([\s\S]*?)\};?/);
  if (ptMatch) {
    (ptMatch[1].match(/(\w+)\s*:/g) || []).forEach(n => props.add(n.replace(':', '').trim()));
  }

  const paramMatch = code.match(/function\s+\w+\s*\(\{([\s\S]*?)\}\)|const\s+\w+\s*=\s*\(\{([\s\S]*?)\}\)/);
  if (paramMatch) {
    const raw = paramMatch[1] || paramMatch[2] || '';
    raw.split(',')
      .map(s => s.trim().split(/[=:]/)[0].trim())
      .filter(s => s && /^\w+$/.test(s))
      .forEach(s => props.add(s));
  }

  return Array.from(props);
}

// ─────────────────────────────────────────────────────────────────────────────
// defaultProps 추출 (레지스트리 파일)
// ─────────────────────────────────────────────────────────────────────────────

let _registryCache = null;

function toRegistryKey(name) {
  const parts = name.split('_');
  const prefix = parts.slice(0, 2).map(p => p.toUpperCase()).join('_');
  const rest = parts.slice(2).map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join('');
  return rest ? `${prefix}_${rest}` : prefix;
}

// 언더스코어/대소문자를 무시한 정규화 비교로 레지스트리 키 탐색 (폴백)
function normalizeId(s) {
  return s.replace(/_/g, '').toLowerCase();
}

function findRegistryKey(src, name, convertedKey) {
  for (const key of [name, convertedKey]) {
    if (src.includes(`${key}:`)) return key;
  }
  // fallback: normalized case-insensitive scan
  const normTarget = normalizeId(name);
  const keyRe = /^    (\w+):\s*\{/gm;
  let m;
  while ((m = keyRe.exec(src)) !== null) {
    if (normalizeId(m[1]) === normTarget) return m[1];
  }
  return null;
}

/**
 * 레지스트리에서 defaultProps 스니펫과 variants 목록을 함께 추출
 * @returns {{ defaultPropsSnippet: string, variants: Array<{id:string, description:string}> }}
 */
function extractRegistryInfo(name) {
  if (!_registryCache) {
    _registryCache = fs.existsSync(REGISTRY_FILE)
      ? fs.readFileSync(REGISTRY_FILE, 'utf-8')
      : '';
  }
  const src = _registryCache;
  const result = { defaultPropsSnippet: null, variants: [] };

  const resolvedKey = findRegistryKey(src, name, toRegistryKey(name));
  if (resolvedKey) {
    const escaped = resolvedKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // defaultProps 추출
    const dpRe = new RegExp(
      `${escaped}:\\s*\\{[^}]*?defaultProps:\\s*(\\{[\\s\\S]*?\\}),\\s*variants:`
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

// ─────────────────────────────────────────────────────────────────────────────
// 카테고리 추론
// ─────────────────────────────────────────────────────────────────────────────

function inferCategory(name) {
  if (name.startsWith('CM_DIALOG_'))   return 'Dialog/Popup';
  if (name.startsWith('CM_LIST_'))     return 'List/Selection';
  if (name.startsWith('CM_PICKER_'))   return 'Picker/Selection';
  if (name.startsWith('CM_PROGRESS_')) return 'Progress/Loading';
  if (name.startsWith('CM_CTRL_'))     return 'Control/Input';
  if (name.startsWith('CM_LABEL_'))    return 'Text/Label';
  if (name.startsWith('CM_ANIM_'))     return 'Animation';
  if (name.startsWith('CM_OVERLAY_'))  return 'Overlay/Feedback';
  if (name.startsWith('CM_TITLE_'))    return 'Header/Title';
  if (name.startsWith('WD_DIALOG_'))   return 'Washer/Dialog';
  if (name.startsWith('WD_CLOCK_'))    return 'Washer/Clock';
  if (name.startsWith('WD_PROGRESS_')) return 'Washer/Progress';
  if (name.startsWith('WD_'))          return 'Washer/Widget';
  if (name.startsWith('OV_'))          return 'Oven/Widget';
  return 'General/Widget';
}

function dedupe(arr) {
  return [...new Set(arr.map(s => s.trim()).filter(Boolean))];
}

// ─────────────────────────────────────────────────────────────────────────────
// 엔리치
// ─────────────────────────────────────────────────────────────────────────────

function enrich(entry) {
  const name        = entry.name;
  const category    = entry.category || inferCategory(name);
  const descEn      = (entry.descriptionEn || entry.description || '').trim();
  const descKo      = (entry.descriptionKo || '').trim();
  const visualForm  = (entry.visualForm || '').trim();
  const keywords    = Array.isArray(entry.keywords) ? entry.keywords : [];
  const relatedScreens = Array.isArray(entry.relatedScreens) ? entry.relatedScreens : [];
  const catalogProps = Array.isArray(entry.props) ? entry.props : [];

  const sourcePath = findWidgetSource(name);
  let code = '', sourceRelativePath = '', sourceProps = [];

  if (sourcePath) {
    code                = fs.readFileSync(sourcePath, 'utf-8');
    sourceRelativePath  = path.relative(PROJECT_ROOT, sourcePath).replace(/\\/g, '/');
    sourceProps         = extractPropsFromSource(code);
  }

  const props         = dedupe([...catalogProps, ...sourceProps]);
  const { defaultPropsSnippet, variants } = extractRegistryInfo(name);

  return {
    name,
    category,
    descriptionKo: descKo || `${name} 컴포넌트. 카테고리: ${category}.`,
    descriptionEn: descEn || `${name} component. Category: ${category}.`,
    visualForm,
    keywords: dedupe(keywords),
    relatedScreens: dedupe(relatedScreens),
    props,
    code,
    sourceRelativePath,
    sampleSnippet: defaultPropsSnippet,
    variants,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 문서 텍스트 빌드
// ─────────────────────────────────────────────────────────────────────────────

function buildDescriptionText(e) {
  return [
    `Component: ${e.name}`,
    `Category: ${e.category}`,
    e.descriptionKo  ? `설명(KO): ${e.descriptionKo}` : '',
    e.descriptionEn  ? `Description(EN): ${e.descriptionEn}` : '',
    e.visualForm     ? `Visual Form: ${e.visualForm}` : '',
    e.keywords.length > 0 ? `Keywords: ${e.keywords.join(', ')}` : '',
    e.relatedScreens.length > 0 ? `Related Screens: ${e.relatedScreens.join(', ')}` : '',
    e.props.length   > 0 ? `Props: ${e.props.join(', ')}` : '',
  ].filter(Boolean).join('\n');
}

function buildSampleText(e) {
  const lines = [
    `Component: ${e.name}`,
    `Category: ${e.category}`,
    '',
    '## 사용 예시 (defaultProps 기반)',
    e.sampleSnippet,
  ];

  if (e.variants && e.variants.length > 0) {
    lines.push('');
    lines.push(`## Variants (${e.variants.length})`);
    e.variants.forEach(v => lines.push(`- ${v.id}: ${v.description}`));
  }

  lines.push('');
  lines.push('## Props');
  lines.push(e.props.length > 0 ? e.props.map(p => `  - ${p}`).join('\n') : '  (없음)');

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 컬렉션 준비
// ─────────────────────────────────────────────────────────────────────────────

async function recreateCollections() {
  for (const col of [COL_DESCRIPTION, COL_CODE, COL_SAMPLES]) {
    await chromaDeleteCollection(col);
  }
  await chromaEnsureCollection(COL_DESCRIPTION, { description: 'UI component semantic descriptions (KO+EN)', model: EMBEDDING_MODEL });
  await chromaEnsureCollection(COL_CODE,        { description: 'UI component source code payloads', model: 'none' });
  await chromaEnsureCollection(COL_SAMPLES,     { description: 'UI component sample usage (defaultProps)', model: EMBEDDING_MODEL });
  console.log('✅ Collections ready.\n');
}

async function ensureCollections() {
  await chromaEnsureCollection(COL_DESCRIPTION, { description: 'UI component semantic descriptions (KO+EN)', model: EMBEDDING_MODEL });
  await chromaEnsureCollection(COL_CODE,        { description: 'UI component source code payloads', model: 'none' });
  await chromaEnsureCollection(COL_SAMPLES,     { description: 'UI component sample usage (defaultProps)', model: EMBEDDING_MODEL });
}

// ─────────────────────────────────────────────────────────────────────────────
// 인제스트
// ─────────────────────────────────────────────────────────────────────────────

async function ingestEntries(entries) {
  if (entries.length === 0) {
    console.warn('  ⚠️  인제스트할 항목이 없습니다.');
    return;
  }

  // ── 1) 설명 컬렉션
  console.log(`\n🔤 [1/3] ${COL_DESCRIPTION} 임베딩 생성 중...`);
  const descTexts      = entries.map(buildDescriptionText);
  const descEmbeddings = await embedAll(descTexts);

  await chromaUpsert(
    COL_DESCRIPTION,
    entries.map(e => `desc_${e.name}`),
    descEmbeddings,
    entries.map(e => ({
      componentName: e.name,
      category:      e.category,
      descriptionKo: e.descriptionKo.slice(0, 512),
      descriptionEn: e.descriptionEn.slice(0, 512),
      props:         e.props.join(', '),
      keywords:      e.keywords.join(', '),
      relatedScreens: e.relatedScreens.join(', '),
      sourcePath:    e.sourceRelativePath,
    })),
    descTexts
  );
  console.log(`✅ Description vectors 저장: ${entries.length}`);

  // ── 2) 소스 코드 컬렉션
  console.log(`\n📄 [2/3] ${COL_CODE} 저장 중...`);
  await chromaUpsert(
    COL_CODE,
    entries.map(e => `code_${e.name}`),
    null,
    entries.map(e => ({
      componentName: e.name,
      category:      e.category,
      props:         e.props.join(', '),
      sourcePath:    e.sourceRelativePath,
    })),
    entries.map(e => e.code || `// 소스 없음: ${e.name}`)
  );
  console.log(`✅ Code payloads 저장: ${entries.length}`);

  // ── 3) 샘플 컬렉션
  console.log(`\n🧪 [3/3] ${COL_SAMPLES} 임베딩 생성 중...`);
  const sampleTexts      = entries.map(buildSampleText);
  const sampleEmbeddings = await embedAll(sampleTexts);

  await chromaUpsert(
    COL_SAMPLES,
    entries.map(e => `sample_${e.name}`),
    sampleEmbeddings,
    entries.map(e => ({
      componentName: e.name,
      category:      e.category,
      sourcePath:    e.sourceRelativePath,
    })),
    sampleTexts
  );
  console.log(`✅ Sample snippets 저장: ${entries.length}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═'.repeat(64));
  console.log('  NXI UI 컴포넌트 → ChromaDB 인제스터');
  console.log('═'.repeat(64));
  console.log(`  카탈로그:  ${CATALOG_DIR}`);
  console.log(`  위젯 소스: ${WIDGETS_DIR}`);
  console.log(`  ChromaDB:  ${CHROMA_BASE_URL}`);
  console.log(`  Ollama:    ${OLLAMA_BASE_URL} (${EMBEDDING_MODEL})`);
  console.log(`  모드: ${singleName ? `단일(${singleName})` : '전체'} | ${noRecreate ? 'upsert' : 'recreate'}`);
  console.log('');

  // 서비스 헬스 체크
  try {
    await chromaHeartbeat();
    console.log('✅ ChromaDB 연결 OK');
  } catch (e) {
    console.error('❌ ChromaDB에 연결할 수 없습니다.');
    console.error('   docker compose up chroma 로 ChromaDB를 먼저 실행하세요.');
    process.exit(1);
  }

  try {
    await fetchJson(`${OLLAMA_BASE_URL}/api/tags`, { timeout: 5000 });
    console.log('✅ Ollama 연결 OK');
  } catch (e) {
    console.error('❌ Ollama에 연결할 수 없습니다.');
    console.error('   ollama serve 로 Ollama를 먼저 실행하세요.');
    process.exit(1);
  }

  // 카탈로그 로드
  const catalogEntries = loadCatalogEntries(singleName);
  if (catalogEntries.length === 0) {
    console.error(`❌ 카탈로그 항목 없음 (name: ${singleName ?? '전체'})`);
    process.exit(1);
  }
  console.log(`\n📂 카탈로그 항목: ${catalogEntries.length}개`);

  // 엔리치
  const entries   = catalogEntries.map(enrich);
  const noSource  = entries.filter(e => !e.code);
  if (noSource.length > 0) {
    console.warn(`  ⚠️  소스 없는 컴포넌트 ${noSource.length}개: ${noSource.map(e => e.name).join(', ')}`);
  }

  // 컬렉션 준비
  if (!noRecreate && !singleName) {
    await recreateCollections();
  } else {
    await ensureCollections();
  }

  // 인제스트
  await ingestEntries(entries);

  console.log('\n' + '═'.repeat(64));
  console.log('  ✨ 인제스트 완료!');
  console.log('═'.repeat(64));
  console.log(`  ${COL_DESCRIPTION}: ${entries.length}개`);
  console.log(`  ${COL_CODE}:        ${entries.length}개`);
  console.log(`  ${COL_SAMPLES}:     ${entries.length}개`);
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err?.message ?? err);
  process.exit(1);
});
