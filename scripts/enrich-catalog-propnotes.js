#!/usr/bin/env node
/**
 * enrich-catalog-propnotes.js
 *
 * 98개의 카탈로그 JSON에 propNotes 필드를 자동으로 추가합니다.
 *
 * 데이터 소스:
 *   1. 레지스트리 defaultProps + variants → 관찰된 값 및 의미 매핑
 *   2. 위젯 소스 (.jsx) → 조건식 패턴 스캔 (=== N, > 0 등)
 *
 * 사용법:
 *   node scripts/enrich-catalog-propnotes.js                     # 전체 처리 (기존 propNotes 없는 것만)
 *   node scripts/enrich-catalog-propnotes.js --dry-run           # 미리보기 (파일 수정 없음)
 *   node scripts/enrich-catalog-propnotes.js OV_PROGRESS_COOKING # 특정 컴포넌트만
 *   node scripts/enrich-catalog-propnotes.js --force             # 기존 propNotes도 덮어쓰기
 *   node scripts/enrich-catalog-propnotes.js --dry-run --verbose # 상세 로그
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── 경로 설정 ────────────────────────────────────────────────────────────────
const CATALOG_DIR   = path.join(__dirname, '../data/catalog/2_4inch');
const REGISTRY_FILE = path.join(__dirname, '../src/registry/index.js');
const WIDGETS_DIR   = path.join(__dirname, '../src/widgets/2.4_inches');

// ─── CLI 옵션 ─────────────────────────────────────────────────────────────────
const args    = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FORCE   = args.includes('--force');
const VERBOSE = args.includes('--verbose');
const TARGET  = args.find(a => !a.startsWith('--'));  // 특정 컴포넌트명 (선택)

// 무시할 범용 props (propNotes 불필요)
const SKIP_PROPS = new Set([
    'id', 'style', 'className', 'onKey', 'onClick', 'onChange', 'onSelect',
    'onPress', 'onClose', 'onConfirm', 'onCancel', 'children',
    // CSS/레이아웃 props — LLM이 컨텍스트에 맞게 자유 생성
    'width', 'height', 'size', 'fontSize', 'padding', 'margin', 'gap',
    'top', 'left', 'right', 'bottom', 'x', 'y', 'z',
]);

// 연속 수치 측정 props — enum 아니므로 skip (단, 소스에서 === 비교 발견 시 예외)
// initial*/reservation*/remain* 접두어가 붙은 측정값도 포함
const MEASUREMENT_RE = /^(?:initial|reservation|remain_?)?(?:hour|hours|min|mins|minute|minutes|sec|secs|second|seconds|percent|temp|temperature|weight|opacity|size|count|duration|delay|speed|width|height|num|number|value|frame|start|end|step|interval|offset|angle|radius|scale|zoom|volume|distance)s?$/i;

// ─── 유틸리티 ─────────────────────────────────────────────────────────────────
const normalizeId = (s) => s.replace(/_/g, '').toLowerCase();

function log(...a)        { console.log(...a); }
function verbose(...a)    { if (VERBOSE) console.log('  [verbose]', ...a); }
function warn(msg)        { console.warn('  ⚠', msg); }

// ─── 레지스트리 파싱 ──────────────────────────────────────────────────────────

/** 레지스트리 소스 전체 로드 */
function loadRegistrySource() {
    return fs.readFileSync(REGISTRY_FILE, 'utf-8');
}

/** 레지스트리에서 컴포넌트 키 찾기 (대소문자/언더스코어 무시) */
function findRegistryKey(source, name) {
    // 정확히 일치하는 키
    const exactRe = new RegExp(`^    ${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*\\{`, 'm');
    if (exactRe.test(source)) return name;

    // 언더스코어/대소문자 무시 매칭
    const normTarget = normalizeId(name);
    const keyRe = /^    (\w+):\s*\{/gm;
    let m;
    while ((m = keyRe.exec(source)) !== null) {
        if (normalizeId(m[1]) === normTarget) return m[1];
    }
    return null;
}

/**
 * 지정된 레지스트리 블록에서 스칼라 props(숫자·문자열·불리언) 추출.
 * 복잡한 eval 없이 정규식 기반 파싱.
 */
function extractScalarProps(blockText) {
    const result = {};
    // key: number  또는  key: 'string'  또는  key: "string"  또는  key: true/false
    const re = /\b(\w+):\s*(?:(-?\d+(?:\.\d+)?)|'([^']*)'|"([^"]*)"|(true|false))\b/g;
    let m;
    while ((m = re.exec(blockText)) !== null) {
        const key = m[1];
        // 구조 키워드, import명, 컴포넌트명 등 제외
        if (/^(id|key|path|url|src|href|Component|import|export|const|let|var|if|else|return|duration|repeatCount|length|from|type|name|label|format|text|title|subtitle|data|frames|animations|is|has|can|should|will|did)$/i.test(key)) continue;
        if (key.length < 2) continue;

        if (m[2] !== undefined)      result[key] = Number(m[2]);
        else if (m[3] !== undefined) result[key] = m[3];
        else if (m[4] !== undefined) result[key] = m[4];
        else if (m[5] !== undefined) result[key] = m[5] === 'true';
    }
    return result;
}

/**
 * 레지스트리에서 컴포넌트의 defaultProps와 variants 추출.
 * Returns: { key, defaultProps, variants: [{id, description, data}] }
 */
function parseRegistryEntry(source, name) {
    const key = findRegistryKey(source, name);
    if (!key) return null;

    const blockStart = source.indexOf(`    ${key}:`);
    // 다음 최상위 레지스트리 키(4칸 들여쓰기 + 단어 + 콜론)를 찾아 블록 끝 결정
    // 주의: '\n    '로 찾으면 내부 들여쓰기(8칸)에도 매칭되므로 비공백 문자를 확인
    const nextKeyRe = /\n    \w[\w_]*:\s*\{/g;
    nextKeyRe.lastIndex = blockStart + key.length + 5;
    const nextKeyMatch = nextKeyRe.exec(source);
    const chunk = source.slice(blockStart, nextKeyMatch ? nextKeyMatch.index : blockStart + 12000);

    // defaultProps 스칼라 추출
    let defaultPropsBlock = '';
    const dpRe = /defaultProps:\s*\{([\s\S]*?)\},?\s*(?:variants|\/\/|\})/;
    const dpMatch = chunk.match(dpRe);
    if (dpMatch) defaultPropsBlock = dpMatch[1];
    const defaultProps = extractScalarProps(defaultPropsBlock);

    // variants 추출
    const variants = [];
    const varPos = chunk.indexOf('variants: [');
    if (varPos !== -1) {
        const varBlock = chunk.slice(varPos);
        // 각 variant: { id: '...', description: '...', data: { ... } }
        // data 블록 경계를 찾기 위해 중괄호 카운팅
        const varItemStartRe = /\{\s*id:\s*'([^']*)'\s*,\s*description:\s*'([^']*)'\s*,\s*data:\s*\{/g;
        let vm;
        while ((vm = varItemStartRe.exec(varBlock)) !== null) {
            const id   = vm[1];
            const desc = vm[2];
            // data 블록 끝 찾기
            let depth = 1;
            let pos   = vm.index + vm[0].length;
            while (pos < varBlock.length && depth > 0) {
                if (varBlock[pos] === '{') depth++;
                else if (varBlock[pos] === '}') depth--;
                pos++;
            }
            const dataText = varBlock.slice(vm.index + vm[0].length - 1, pos); // include opening {
            const data = extractScalarProps(dataText);
            variants.push({ id, description: desc, data });
        }
    }

    return { key, defaultProps, variants };
}

// ─── 위젯 소스 파싱 ───────────────────────────────────────────────────────────

/** 위젯 JSX 소스 파일 경로 찾기 */
function findWidgetSource(name) {
    if (!fs.existsSync(WIDGETS_DIR)) return null;
    const normTarget = normalizeId(name);
    const files = fs.readdirSync(WIDGETS_DIR);
    const match = files.find(f =>
        f.endsWith('.jsx') && normalizeId(f.replace('.jsx', '')) === normTarget
    );
    return match ? path.join(WIDGETS_DIR, match) : null;
}

/**
 * 위젯 소스에서 각 prop의 사용 패턴 스캔.
 * Returns: { propName: [{ type, value, context }] }
 *   type: 'equals' | 'greater' | 'switch' | 'ternary'
 */
function scanSourcePatterns(sourcePath, propNames) {
    if (!sourcePath || !fs.existsSync(sourcePath)) return {};
    const src = fs.readFileSync(sourcePath, 'utf-8');
    const result = {};

    for (const prop of propNames) {
        if (SKIP_PROPS.has(prop)) continue;
        const patterns = [];
        const escaped  = prop.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // 1) prop === N  또는  prop !== N  (직접 비교)
        const eqRe = new RegExp(`\\b${escaped}\\s*===?\\s*(-?\\d+|'[^']*'|"[^"]*")`, 'g');
        let m;
        while ((m = eqRe.exec(src)) !== null) {
            const raw = m[1].replace(/['"]/g, '');
            // 줄 컨텍스트 추출 (최대 80자)
            const lineStart = src.lastIndexOf('\n', m.index) + 1;
            const lineEnd   = src.indexOf('\n', m.index);
            const line = src.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();
            patterns.push({ type: 'equals', value: isNaN(raw) ? raw : Number(raw), context: line });
        }

        // 2) prop > 0  또는  prop < 0  (boolean-like)
        const gtRe = new RegExp(`\\b${escaped}\\s*([><!]=?|===?)\\s*0\\b`, 'g');
        while ((m = gtRe.exec(src)) !== null) {
            const op = m[1];
            patterns.push({ type: 'zero_check', op, context: `${prop} ${op} 0` });
        }

        // 3) switch(prop) case N:
        const switchRe = new RegExp(`switch\\s*\\(\\s*${escaped}\\s*\\)[\\s\\S]*?(?=\\n\\s*(?:default:|\\}))`, 'g');
        while ((m = switchRe.exec(src)) !== null) {
            const block = m[0];
            const caseRe = /case\s+(-?\d+|'[^']*'|"[^"]*")\s*:/g;
            let cm;
            while ((cm = caseRe.exec(block)) !== null) {
                const raw = cm[1].replace(/['"]/g, '');
                patterns.push({ type: 'switch', value: isNaN(raw) ? raw : Number(raw) });
            }
        }

        if (patterns.length > 0) result[prop] = patterns;
    }
    return result;
}

// ─── propNotes 생성 ───────────────────────────────────────────────────────────

// ─── propNotes 생성 ───────────────────────────────────────────────────────────

/**
 * variant description에서 핵심 의미만 추출.
 * - 앞의 시간/숫자 패턴 제거: "10:30 AM" → "AM", "65%" → ""
 * - 괄호 내용 추출 우선: "10:30 AM (Hour focus)" → "Hour focus"
 *   (괄호 외 내용도 남으면 "AM (Hour focus)" 식으로 합산)
 */
function extractMeaning(desc) {
    const parenMatch = desc.match(/\(([^)]+)\)/);
    const paren  = parenMatch ? parenMatch[1].trim() : null;
    const base   = desc
        .replace(/\(.*?\)/g, '')                        // 괄호 제거
        .replace(/\b\d{1,2}:\d{2}(?::\d{2})?\b/g, '')  // HH:MM[:SS] 제거
        .replace(/\b\d+(?:\.\d+)?\s*(?:h\b|m\b|s\b)/gi, '') // Nh Nm Ns 제거
        .replace(/\b\d+%\b/g, '')                       // N% 제거
        .replace(/\s+/g, ' ')
        .trim();
    if (paren && base && base !== paren) return `${base} (${paren})`;
    return paren || base || desc.trim();
}

/**
 * 레지스트리 정보와 소스 패턴을 합쳐 propNotes 객체를 생성.
 * 숫자/열거형 prop에 대해서만 노트를 생성합니다.
 */
function buildPropNotes(catalogProps, registryEntry, sourcePatterns) {
    if (!registryEntry) return {};

    const { defaultProps, variants } = registryEntry;
    const notes = {};

    for (const prop of catalogProps) {
        if (SKIP_PROPS.has(prop)) continue;
        const dflt = defaultProps[prop];

        // 모든 variants에서 이 prop이 취하는 값 수집
        const valueMap = new Map(); // value → [variantDescription, ...]
        if (dflt !== undefined) valueMap.set(dflt, ['default']);

        for (const v of variants) {
            if (prop in v.data) {
                const val = v.data[prop];
                if (!valueMap.has(val)) valueMap.set(val, []);
                valueMap.get(val).push(v.description);
            }
        }

        // 소스 패턴 추가
        const srcPatterns = sourcePatterns[prop] || [];

        // ── 숫자 enum prop 판정 ────────────────────────────────────────────────
        const hasEqualsPattern  = srcPatterns.some(p => p.type === 'equals');
        const hasSwitchPattern  = srcPatterns.some(p => p.type === 'switch');
        const hasZeroCheck      = srcPatterns.some(p => p.type === 'zero_check');

        const isMeasurement = MEASUREMENT_RE.test(prop);

        const isNumericEnum = (() => {
            // 측정값 props는 소스에서 === 비교가 명확히 있을 때만 enum으로 처리
            if (isMeasurement && !hasEqualsPattern && !hasSwitchPattern) return false;

            // 1) 소스에서 명시적 === / switch 비교 발견 → enum 확정
            if (hasEqualsPattern || hasSwitchPattern) return true;

            // 2) variants에서 관찰된 숫자값이 모두 작은 정수 (≤ 10) 이면 enum 가능성
            const numericVals = [...valueMap.keys()].filter(v => typeof v === 'number' && Number.isInteger(v));
            if (numericVals.length === 0) return false;
            const maxVal = Math.max(...numericVals);
            if (maxVal > 10) return false;  // 큰 값(온도/분/무게 등) → 연속값으로 판단

            // 3) 관찰된 값이 2개 이상이거나 zero_check 패턴이 있으면 flag/enum
            if (numericVals.length >= 2 || hasZeroCheck) return true;

            // 4) 기본값이 0이고, zero_check 패턴 있으면 boolean-like flag
            if (typeof dflt === 'number' && dflt === 0 && hasZeroCheck) return true;

            return false;
        })();

        if (!isNumericEnum) continue;  // 문자열/불리언/복잡한 객체 등은 skip

        // ── 노트 문자열 조립 ───────────────────────────────────────────────────
        const parts = [];

        // 관찰된 값 매핑 (variant 기반)
        const sortedVals = [...valueMap.keys()].sort((a, b) => {
            if (typeof a === typeof b) return a < b ? -1 : 1;
            return typeof a === 'number' ? -1 : 1;
        });

        for (const val of sortedVals) {
            const descs = valueMap.get(val);
            const isDefault = defaultProps[prop] === val;
            if (descs[0] === 'default') {
                const varDesc = descs[1] ? extractMeaning(descs[1]) : null;
                parts.push(varDesc ? `${val}=${varDesc}(기본)` : `${val}=기본값`);
            } else {
                const meaning = extractMeaning(descs[0]);
                parts.push(`${val}=${meaning}${isDefault ? '(기본)' : ''}`);
            }
        }

        // 소스 패턴에서 추가 값 보강
        const seenFromSource = new Set(sortedVals.map(String));
        for (const sp of srcPatterns) {
            if (sp.type === 'equals' && sp.value !== undefined) {
                if (!seenFromSource.has(String(sp.value))) {
                    // 소스 컨텍스트에서 의미 추론 (리턴값/유닛 정보/변수명)
                    const unitMatch = sp.context.match(/unit:\s*'([^']+)'/);
                    const strMatch  = sp.context.match(/['"`]([^'"`]{1,20})['"`]/);
                    const varMatch  = sp.context.match(/(?:return|=)\s*([A-Za-z_]\w{1,20})\b/);
                    const hint = unitMatch ? unitMatch[1] : (strMatch ? strMatch[1] : (varMatch ? varMatch[1] : '?'));
                    parts.push(`${sp.value}=${hint}`);
                    seenFromSource.add(String(sp.value));
                } else {
                    // 이미 variant에서 값 매핑됐는데, 소스 컨텍스트로 의미를 보강할 수 있으면 업데이트
                    const idx = parts.findIndex(p => p.startsWith(`${sp.value}=`));
                    if (idx !== -1 && (parts[idx].endsWith('=기본값') || parts[idx].includes('=?'))) {
                        const unitMatch = sp.context.match(/unit:\s*'([^']+)'/);
                        const strMatch  = sp.context.match(/['"`]([^'"`]{1,20})['"`]/);
                        const hint = unitMatch ? unitMatch[1] : (strMatch ? strMatch[1] : null);
                        // 힌트가 값 자신과 다를 때만 업데이트 (예: "orange=orange" 방지)
                        if (hint && hint !== String(sp.value)) {
                            parts[idx] = parts[idx].replace(/=.*$/, `=${hint}`);
                        }
                    }
                }
            } else if (sp.type === 'zero_check') {
                // > 0 패턴: boolean-like flag일 때만 적용 (측정값은 이미 위에서 필터됨)
                if (!parts.some(p => p.startsWith('0='))) {
                    parts.unshift('0=없음(비활성)');
                }
                if (!seenFromSource.has('1') && !parts.some(p => /^[1-9]/.test(p))) {
                    parts.push('1+=활성');
                }
            } else if (sp.type === 'switch' && sp.value !== undefined) {
                if (!seenFromSource.has(String(sp.value))) {
                    parts.push(`${sp.value}=?`);
                    seenFromSource.add(String(sp.value));
                }
            }
        }

        if (parts.length > 0) {
            // 모든 값이 "? "이거나 자기 자신인 경우(=x=x, =?) 노트 제외
            const allUnknown = parts.every(p => {
                const [val, ...rest] = p.split('=');
                const desc = rest.join('=').replace(/\(기본\)$/, '');
                return desc === '?' || desc === val || desc === '';
            });
            if (!allUnknown) {
                notes[prop] = parts.join(', ');
            }
        }
    }

    return notes;
}

// ─── 메인 처리 ────────────────────────────────────────────────────────────────

function processFile(registrySource, catalogFile) {
    const filePath = path.join(CATALOG_DIR, catalogFile);
    let catalog;
    try {
        catalog = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
        warn(`JSON 파싱 실패: ${catalogFile} — ${e.message}`);
        return { status: 'error' };
    }

    // 이미 propNotes 있으면 --force 없이는 skip
    if (catalog.propNotes && !FORCE) {
        verbose(`skip (propNotes 이미 있음): ${catalogFile}`);
        return { status: 'skipped' };
    }

    const name       = catalog.name || catalogFile.replace('.json', '');
    const props      = Array.isArray(catalog.props) ? catalog.props : [];
    const filteredProps = props.filter(p => !SKIP_PROPS.has(p));

    // 레지스트리 파싱
    const regEntry = parseRegistryEntry(registrySource, name);
    if (!regEntry) {
        verbose(`레지스트리 항목 없음: ${name}`);
    }

    // 위젯 소스 스캔
    const srcPath    = findWidgetSource(name);
    const srcPat     = scanSourcePatterns(srcPath, filteredProps);

    // propNotes 생성
    const propNotes  = buildPropNotes(filteredProps, regEntry, srcPat);

    if (Object.keys(propNotes).length === 0) {
        verbose(`propNotes 없음 (매직 넘버 없는 컴포넌트): ${name}`);
        return { status: 'no_notes' };
    }

    if (DRY_RUN) {
        log(`\n[DRY-RUN] ${name}`);
        log(JSON.stringify({ propNotes }, null, 2));
        return { status: 'dry_run', count: Object.keys(propNotes).length };
    }

    // 카탈로그 JSON에 propNotes 추가 (props 필드 다음에 삽입)
    const updated = {
        ...catalog,
        propNotes,
    };
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 4), 'utf-8');
    return { status: 'updated', count: Object.keys(propNotes).length };
}

function main() {
    if (!fs.existsSync(REGISTRY_FILE)) {
        console.error('레지스트리 파일을 찾을 수 없습니다:', REGISTRY_FILE);
        process.exit(1);
    }
    if (!fs.existsSync(CATALOG_DIR)) {
        console.error('카탈로그 디렉터리를 찾을 수 없습니다:', CATALOG_DIR);
        process.exit(1);
    }

    const registrySource = loadRegistrySource();

    let files = fs.readdirSync(CATALOG_DIR).filter(f => f.endsWith('.json'));

    // 특정 컴포넌트만 처리
    if (TARGET) {
        const normTarget = normalizeId(TARGET);
        files = files.filter(f => normalizeId(f.replace('.json', '')) === normTarget);
        if (files.length === 0) {
            console.error(`컴포넌트를 찾을 수 없습니다: ${TARGET}`);
            process.exit(1);
        }
    }

    log(`\n🔍 처리 대상: ${files.length}개 카탈로그 JSON`);
    if (DRY_RUN) log('   (--dry-run 모드: 파일 수정 없음)');
    if (FORCE)   log('   (--force 모드: 기존 propNotes 덮어쓰기)');
    log('');

    const stats = { updated: 0, skipped: 0, no_notes: 0, error: 0, dry_run: 0 };

    for (const file of files) {
        const result = processFile(registrySource, file);
        stats[result.status] = (stats[result.status] || 0) + 1;
        if (result.status === 'updated') {
            log(`  ✅ ${file.replace('.json', '')}  +${result.count} propNotes`);
        }
    }

    log('\n─── 결과 ───────────────────────────────────────');
    if (!DRY_RUN) {
        log(`  업데이트됨    : ${stats.updated ?? 0}개`);
        log(`  건너뜀       : ${stats.skipped ?? 0}개 (기존 propNotes 있음)`);
        log(`  매직넘버없음  : ${stats.no_notes ?? 0}개`);
        log(`  오류         : ${stats.error ?? 0}개`);
    } else {
        log(`  dry-run 대상 : ${stats.dry_run ?? 0}개`);
        log(`  건너뜀       : ${stats.skipped ?? 0}개 (기존 propNotes 있음)`);
        log(`  매직넘버없음  : ${stats.no_notes ?? 0}개`);
    }
    log('');
}

main();
