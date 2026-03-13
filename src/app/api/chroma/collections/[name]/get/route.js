import { NextResponse } from 'next/server';

const CHROMA_BASE_URL = process.env.CHROMA_BASE_URL || 'http://localhost:8000';
const TENANT = process.env.CHROMA_TENANT || 'default_tenant';
const DATABASE = process.env.CHROMA_DATABASE || 'default_database';
const V2_PREFIX = `${CHROMA_BASE_URL}/api/v2/tenants/${TENANT}/databases/${DATABASE}`;

export async function POST(request, { params }) {
    const { name } = await params;

    // Validate name
    if (!name || typeof name !== 'string' || name.length > 200) {
        return NextResponse.json({ error: 'Invalid collection name' }, { status: 400 });
    }

    let body = {};
    try {
        body = await request.json();
    } catch {
        // empty body is ok
    }

    const payload = {
        include: body.include ?? ['metadatas', 'documents'],
        limit: body.limit ?? 100,
        offset: body.offset ?? 0,
    };
    if (body.where)         payload.where = body.where;
    if (body.whereDocument) payload.where_document = body.whereDocument;
    if (body.ids)           payload.ids = body.ids;

    try {
        const res = await fetch(
            `${V2_PREFIX}/collections/${encodeURIComponent(name)}/get`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }
        );

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json({ error: text }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 502 });
    }
}
