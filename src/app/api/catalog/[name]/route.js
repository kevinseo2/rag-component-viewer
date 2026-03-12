import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'catalog', '2_4inch');

// Find actual file regardless of case (registry uses CamelCase, files may be UPPER_CASE)
function resolveFilePath(name) {
    const exact = path.join(DATA_DIR, `${name}.json`);
    if (fs.existsSync(exact)) return exact;

    // Case-insensitive fallback
    const normalizedTarget = name.replace(/_/g, '').toUpperCase();
    const files = fs.readdirSync(DATA_DIR);
    const match = files.find(f =>
        f.endsWith('.json') && f.replace('.json', '').replace(/_/g, '').toUpperCase() === normalizedTarget
    );
    return match ? path.join(DATA_DIR, match) : null;
}

export async function GET(request, { params }) {
    const { name } = await params;
    const filePath = resolveFilePath(name);
    if (!filePath) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return NextResponse.json(data);
}

export async function PUT(request, { params }) {
    const { name } = await params;
    // Validate name to prevent path traversal
    if (!/^[A-Z0-9_]+$/i.test(name)) {
        return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }
    // Always write to the canonical file (exact name from registry)
    const filePath = resolveFilePath(name) || path.join(DATA_DIR, `${name}.json`);
    const body = await request.json();
    fs.writeFileSync(filePath, JSON.stringify(body, null, 4));
    return NextResponse.json({ ok: true });
}
