import { NextResponse } from 'next/server';

const CHROMA_BASE_URL = process.env.CHROMA_BASE_URL || 'http://localhost:8000';
const TENANT = process.env.CHROMA_TENANT || 'default_tenant';
const DATABASE = process.env.CHROMA_DATABASE || 'default_database';
const V2_PREFIX = `${CHROMA_BASE_URL}/api/v2/tenants/${TENANT}/databases/${DATABASE}`;

export async function GET() {
    try {
        const url = `${V2_PREFIX}/collections`;
        const res = await fetch(url, { next: { revalidate: 0 } });
        if (!res.ok) {
            const body = await res.text().catch(() => '');
            console.error(`[chroma/collections] ${url} → ${res.status}: ${body}`);
            return NextResponse.json({ error: `ChromaDB returned ${res.status}`, url, detail: body }, { status: 502 });
        }
        const list = await res.json();
        const collections = Array.isArray(list) ? list : [];

        // Enrich with document count
        const enriched = await Promise.all(
            collections.map(async (col) => {
                const name = col?.name ?? col?._name ?? 'unknown';
                const metadata = col?.metadata ?? col?._metadata ?? {};
                try {
                    const countRes = await fetch(`${V2_PREFIX}/collections/${encodeURIComponent(name)}/count`);
                    const count = countRes.ok ? await countRes.json() : 0;
                    return { name, count: typeof count === 'number' ? count : 0, metadata };
                } catch {
                    return { name, count: 0, metadata };
                }
            })
        );

        return NextResponse.json(enriched);
    } catch (e) {
        console.error(`[chroma/collections] fetch threw:`, e.message, '| CHROMA_BASE_URL =', CHROMA_BASE_URL);
        return NextResponse.json({ error: e.message, url: `${V2_PREFIX}/collections` }, { status: 502 });
    }
}
