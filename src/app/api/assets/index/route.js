import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ASSET_INDEX_PATH = path.join(process.cwd(), 'data', 'catalog', 'asset_index.json');

function validateAssetIndexShape(data) {
    if (!data || typeof data !== 'object') return 'Index must be an object';
    if (!Array.isArray(data.images)) return 'images must be an array';
    if (!Array.isArray(data.sequences)) return 'sequences must be an array';
    return null;
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
