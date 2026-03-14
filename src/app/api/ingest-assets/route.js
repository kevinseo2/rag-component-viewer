import { NextResponse } from 'next/server';
import {
    COL_ASSETS,
    EMBEDDING_MODEL,
    ensureCollection,
    ingestAssetsFromIndex,
} from './_lib.js';

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
        await ensureCollection(COL_ASSETS, {
            description: 'UI image and image-sequence asset index',
            model: EMBEDDING_MODEL,
        });
    } catch (e) {
        return NextResponse.json({ error: `ChromaDB collection setup failed: ${e.message}` }, { status: 502 });
    }

    const result = await ingestAssetsFromIndex(options);
    if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
        ok: true,
        collection: COL_ASSETS,
        total: result.total,
        succeeded: result.succeeded,
        failed: result.failed,
        failedList: result.failedList,
    });
}
