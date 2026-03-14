import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PUBLIC_ROOT = path.join(process.cwd(), 'public');

function getMimeType(ext) {
    const map = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
    };
    return map[ext.toLowerCase()] || 'application/octet-stream';
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const rawPath = String(searchParams.get('path') || '').trim();
    if (!rawPath.startsWith('/')) {
        return NextResponse.json({ error: 'path query is required and must start with /' }, { status: 400 });
    }

    const relative = rawPath.replace(/^\/+/, '');
    const absPath = path.resolve(PUBLIC_ROOT, relative);
    const absPublic = path.resolve(PUBLIC_ROOT);

    if (!absPath.startsWith(absPublic)) {
        return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    if (!fs.existsSync(absPath) || !fs.statSync(absPath).isFile()) {
        return NextResponse.json({ error: `File not found: ${rawPath}` }, { status: 404 });
    }

    try {
        const fileBuffer = fs.readFileSync(absPath);
        const ext = path.extname(absPath);
        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': getMimeType(ext),
                'Cache-Control': 'public, max-age=60',
            },
        });
    } catch (e) {
        return NextResponse.json({ error: `Read failed: ${e.message}` }, { status: 500 });
    }
}
