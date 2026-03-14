import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PUBLIC_ROOT = path.join(process.cwd(), 'public');
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg']);

function toWebPath(absPath) {
    const rel = path.relative(PUBLIC_ROOT, absPath).replace(/\\/g, '/');
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

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const sequencePath = String(searchParams.get('sequencePath') || '').trim();

    if (!sequencePath.startsWith('/ui/image_sequences/')) {
        return NextResponse.json({ error: 'sequencePath must start with /ui/image_sequences/' }, { status: 400 });
    }

    const relative = sequencePath.replace(/^\/+/, '');
    const absDir = path.resolve(PUBLIC_ROOT, relative);
    const absPublic = path.resolve(PUBLIC_ROOT);

    // Prevent path traversal out of /public.
    if (!absDir.startsWith(absPublic)) {
        return NextResponse.json({ error: 'Invalid sequencePath' }, { status: 400 });
    }

    if (!fs.existsSync(absDir) || !fs.statSync(absDir).isDirectory()) {
        return NextResponse.json({ error: `Sequence directory not found: ${sequencePath}` }, { status: 404 });
    }

    const frames = walkFiles(absDir)
        .filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
        .map(toWebPath);

    return NextResponse.json({
        ok: true,
        sequencePath,
        frameCount: frames.length,
        frames,
    });
}
