import { NextResponse } from 'next/server';
import * as ingestLib from '../ingest/_lib.js';

/**
 * POST /api/ingest-assets
 * body(optional):
 *   - types: ["image", "image_sequence"]
 *   - limit: number
 *   - paths: ["/ui/images/foo.png", ...]
 *   - assetIds: ["foo_bar", ...]
 */
export async function POST(request) {
    let options = null;
    try {
        const body = await request.json();
        options = {
            types: Array.isArray(body?.types) ? body.types : undefined,
            limit: Number.isInteger(body?.limit) ? body.limit : undefined,
            paths: Array.isArray(body?.paths) ? body.paths : undefined,
            assetIds: Array.isArray(body?.assetIds) ? body.assetIds : undefined,
        };
    } catch {
        options = null;
    }

    try {
        await ingestLib.ensureCollection(ingestLib.COL_ASSETS, {
            description: 'UI image and image-sequence asset index',
            model: ingestLib.EMBEDDING_MODEL,
        });
    } catch (e) {
        return NextResponse.json({ error: `ChromaDB collection setup failed: ${e.message}` }, { status: 502 });
    }

    if (typeof ingestLib.ingestAssetsFromIndex !== 'function') {
        return NextResponse.json({ error: 'ingestAssetsFromIndex is not available from ingest/_lib.js' }, { status: 500 });
    }

    const result = await ingestLib.ingestAssetsFromIndex(options);
    if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
        ok: true,
        collection: ingestLib.COL_ASSETS,
        total: result.total,
        succeeded: result.succeeded,
        failed: result.failed,
        failedList: result.failedList,
    });
}
