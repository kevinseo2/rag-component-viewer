import { NextResponse } from 'next/server';

const CHROMA_BASE_URL = process.env.CHROMA_BASE_URL || 'http://localhost:8000';

export async function GET() {
    try {
        const res = await fetch(`${CHROMA_BASE_URL}/api/v1/heartbeat`, { next: { revalidate: 0 } });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 502 });
    }
}
