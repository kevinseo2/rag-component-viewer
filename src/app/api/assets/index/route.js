import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ASSET_INDEX_PATH = path.join(process.cwd(), 'data', 'catalog', 'asset_index.json');
const PUBLIC_ROOT = path.join(process.cwd(), 'public');
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg']);

function validateAssetIndexShape(data) {
    if (!data || typeof data !== 'object') return 'Index must be an object';
    if (!Array.isArray(data.images)) return 'images must be an array';
    if (!Array.isArray(data.sequences)) return 'sequences must be an array';
    return null;
}

function normalizeId(s) {
    return String(s || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

function toWebPath(absPath, root) {
    const rel = path.relative(root, absPath).replace(/\\/g, '/');
    return `/${rel}`;
}

function walkFiles(dir) {
    const out = [];
    if (!fs.existsSync(dir)) return out;
    const stack = [dir];
    while (stack.length > 0) {
        const cur = stack.pop();
        const entries = fs.readdirSync(cur, { withFileTypes: true });
        for (const e of entries) {
            const full = path.join(cur, e.name);
            if (e.isDirectory()) {
                stack.push(full);
            } else if (e.isFile()) {
                out.push(full);
            }
        }
    }
    return out;
}

function guessPattern(fileNames) {
    if (!fileNames.length) return null;
    const m = fileNames[0].match(/^(.*?)(\d+)(\.[^.]+)$/);
    if (!m) return null;
    return `${m[1]}{index:${m[2].length}}${m[3]}`;
}

function buildAssetIndexFromPublic(publicRoot) {
    const allFiles = walkFiles(publicRoot).filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()));

    const sequenceRoot = path.join(publicRoot, 'ui', 'image_sequences');
    const sequenceDirs = fs.existsSync(sequenceRoot)
        ? fs.readdirSync(sequenceRoot, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => path.join(sequenceRoot, e.name)).sort()
        : [];

    const sequences = sequenceDirs.map((dirAbs) => {
        const files = walkFiles(dirAbs)
            .filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
            .sort((a, b) => a.localeCompare(b));

        const webFrames = files.map((f) => toWebPath(f, publicRoot));
        const base = path.basename(dirAbs);
        const fileNames = files.map((f) => path.basename(f));
        const extSet = new Set(files.map((f) => path.extname(f).toLowerCase()));

        return {
            id: normalizeId(base),
            name: base,
            type: 'image_sequence',
            path: `/ui/image_sequences/${base}`,
            frameCount: files.length,
            extensions: [...extSet].sort(),
            namingPattern: guessPattern(fileNames),
            sampleFrames: {
                first: webFrames.slice(0, 3),
                last: webFrames.slice(-3),
            },
        };
    });

    const images = allFiles
        .filter((f) => !toWebPath(f, publicRoot).startsWith('/ui/image_sequences/'))
        .sort((a, b) => a.localeCompare(b))
        .map((f) => {
            const webPath = toWebPath(f, publicRoot);
            const parts = webPath.slice(1).split('/');
            const scope = (() => {
                if (parts[0] === 'assets') return 'assets';
                if (parts[0] === 'ui' && parts[1] === 'images') return 'ui/images';
                if (parts[0] === 'ui' && parts[1] === 'image_sequences') return 'ui/image_sequences';
                return parts.length > 1 ? `${parts[0]}/${parts[1]}` : parts[0];
            })();
            return {
                id: normalizeId(path.basename(f, path.extname(f))),
                name: path.basename(f),
                type: 'image',
                path: webPath,
                extension: path.extname(f).toLowerCase(),
                scope,
            };
        });

    return {
        indexVersion: '1.0.1',
        generatedDate: new Date().toISOString().slice(0, 10),
        sourceRoot: 'public',
        includeExtensions: [...IMAGE_EXTS],
        summary: {
            totalImageFiles: allFiles.length,
            indexedImages: images.length,
            indexedSequences: sequences.length,
        },
        images,
        sequences,
    };
}

export async function GET() {
    if (!fs.existsSync(ASSET_INDEX_PATH)) {
        return NextResponse.json({ error: 'asset_index.json not found' }, { status: 404 });
    }

    try {
        const data = JSON.parse(fs.readFileSync(ASSET_INDEX_PATH, 'utf8'));
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: `asset_index.json parse failed: ${e.message}` }, { status: 500 });
    }
}

export async function PUT(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const validationError = validateAssetIndexShape(body);
    if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
    }

    try {
        fs.writeFileSync(ASSET_INDEX_PATH, `${JSON.stringify(body, null, 2)}\n`, 'utf8');
        return NextResponse.json({ ok: true });
    } catch (e) {
        return NextResponse.json({ error: `Write failed: ${e.message}` }, { status: 500 });
    }
}

// Rebuild asset index from current /public folder snapshot.
export async function POST() {
    if (!fs.existsSync(PUBLIC_ROOT)) {
        return NextResponse.json({ error: `Public root not found: ${PUBLIC_ROOT}` }, { status: 404 });
    }

    try {
        const rebuilt = buildAssetIndexFromPublic(PUBLIC_ROOT);
        fs.writeFileSync(ASSET_INDEX_PATH, `${JSON.stringify(rebuilt, null, 2)}\n`, 'utf8');
        return NextResponse.json({ ok: true, rebuilt });
    } catch (e) {
        return NextResponse.json({ error: `Rebuild failed: ${e.message}` }, { status: 500 });
    }
}
