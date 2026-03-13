import { NextResponse } from 'next/server';

const CHROMA_BASE_URL = process.env.CHROMA_BASE_URL || 'http://localhost:8000';

export async function GET() {
    try {
        const res = await fetch(`${CHROMA_BASE_URL}/api/v1/collections`, { next: { revalidate: 0 } });
        if (!res.ok) {
            return NextResponse.json({ error: `ChromaDB returned ${res.status}` }, { status: 502 });
        }
        const list = await res.json();
        const collections = Array.isArray(list) ? list : [];

        // Enrich with document count
        const enriched = await Promise.all(
            collections.map(async (col) => {
                const name = col?.name ?? col?._name ?? 'unknown';
                const metadata = col?.metadata ?? col?._metadata ?? {};
                try {
                    const countRes = await fetch(`${CHROMA_BASE_URL}/api/v1/collections/${encodeURIComponent(name)}/count`);
                    const count = countRes.ok ? await countRes.json() : 0;
                    return { name, count: typeof count === 'number' ? count : 0, metadata };
                } catch {
                    return { name, count: 0, metadata };
                }
            })
        );

        return NextResponse.json(enriched);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 502 });
    }
}
