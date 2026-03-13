/**
 * All-components ChromaDB ingest endpoint
 *
 * POST /api/ingest-all
 *
 * 처리 흐름:
 *   1. data/catalog/2_4inch/*.json 목록을 모두 읽음
 *   2. 각 컴포넌트에 대해 순차적으로 ingestOne() 실행
 *   3. 결과 요약(성공/실패 목록)을 JSON으로 반환
 */

import { NextResponse } from 'next/server';
import fs from 'fs';
import {
    CATALOG_DIR,
    COL_DESCRIPTION, COL_CODE, COL_SAMPLES,
    EMBEDDING_MODEL,
    ensureCollection,
    ingestOne,
} from '../ingest/_lib.js';

export async function POST() {
    // 카탈로그 파일 목록 수집
    let files;
    try {
        files = fs.existsSync(CATALOG_DIR)
            ? fs.readdirSync(CATALOG_DIR).filter(f => f.endsWith('.json'))
            : [];
    } catch (e) {
        return NextResponse.json({ error: `Cannot read catalog dir: ${e.message}` }, { status: 500 });
    }

    if (files.length === 0) {
        return NextResponse.json({ error: 'No catalog files found' }, { status: 404 });
    }

    // 컬렉션 확보 (한 번만)
    try {
        await Promise.all([
            ensureCollection(COL_DESCRIPTION, { description: 'UI component semantic descriptions', model: EMBEDDING_MODEL }),
            ensureCollection(COL_CODE,        { description: 'UI component source code payloads', model: 'none' }),
            ensureCollection(COL_SAMPLES,     { description: 'UI component sample usage', model: EMBEDDING_MODEL }),
        ]);
    } catch (e) {
        return NextResponse.json({ error: `ChromaDB collection setup failed: ${e.message}` }, { status: 502 });
    }

    // 컴포넌트 이름 목록 (파일명 → 대문자)
    const names = files.map(f => f.replace('.json', '').toUpperCase());

    const succeeded = [];
    const failed = [];

    // 순차 처리 (임베딩 서버 과부하 방지)
    for (const name of names) {
        const result = await ingestOne(name, null);
        if (result.ok) {
            succeeded.push(name);
        } else {
            failed.push({ name, error: result.error });
        }
    }

    return NextResponse.json({
        ok: true,
        total: names.length,
        succeeded: succeeded.length,
        failed: failed.length,
        failedList: failed,
        collections: [COL_DESCRIPTION, COL_CODE, COL_SAMPLES],
    });
}
