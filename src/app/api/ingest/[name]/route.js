import { NextResponse } from "next/server";
import {
    COL_DESCRIPTION, COL_CODE, COL_SAMPLES,
    EMBEDDING_MODEL,
    ensureCollection,
    ingestOne,
    deleteOne,
} from "../_lib.js";

export async function PUT(request, { params }) {
    const { name } = await params;
    if (!/^[A-Z0-9_]+$/i.test(name)) {
        return NextResponse.json({ error: "Invalid component name" }, { status: 400 });
    }
    let catalogData;
    try {
        const body = await request.json();
        catalogData = body.catalogData ?? body;
    } catch {
        catalogData = null;
    }
    try {
        await Promise.all([
            ensureCollection(COL_DESCRIPTION, { description: "UI component semantic descriptions", model: EMBEDDING_MODEL }),
            ensureCollection(COL_CODE,        { description: "UI component source code payloads", model: "none" }),
            ensureCollection(COL_SAMPLES,     { description: "UI component sample usage", model: EMBEDDING_MODEL }),
        ]);
    } catch (e) {
        return NextResponse.json({ error: "ChromaDB collection setup failed: " + e.message }, { status: 502 });
    }
    const result = await ingestOne(name, catalogData);
    if (!result.ok) {
        const status = result.error?.includes("not found") ? 404 : 502;
        return NextResponse.json({ error: result.error }, { status });
    }
    return NextResponse.json({ ok: true, name, collections: [COL_DESCRIPTION, COL_CODE, COL_SAMPLES] });
}

export async function DELETE(request, { params }) {
    const { name } = await params;
    if (!/^[A-Z0-9_]+$/i.test(name)) {
        return NextResponse.json({ error: "Invalid component name" }, { status: 400 });
    }
    try {
        await Promise.all([
            ensureCollection(COL_DESCRIPTION, { description: "UI component semantic descriptions", model: EMBEDDING_MODEL }),
            ensureCollection(COL_CODE,        { description: "UI component source code payloads", model: "none" }),
            ensureCollection(COL_SAMPLES,     { description: "UI component sample usage", model: EMBEDDING_MODEL }),
        ]);
    } catch (e) {
        return NextResponse.json({ error: "ChromaDB collection setup failed: " + e.message }, { status: 502 });
    }

    const result = await deleteOne(name);
    if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: 502 });
    }
    return NextResponse.json({ ok: true, name: result.canonicalName || name, collections: [COL_DESCRIPTION, COL_CODE, COL_SAMPLES] });
}
