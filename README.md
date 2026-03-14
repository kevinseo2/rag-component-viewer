# RAG Component Viewer

LG NXI UX Simulator MVP의 2.4인치 UI 위젯 카탈로그/인제스트 도구입니다.  
카탈로그 편집, 단건/선택 인제스트, DB 엔트리 제거, ChromaDB 탐색을 한 곳에서 수행할 수 있습니다.

## What Is Included

- Catalog Viewer (`/catalog`)
    - 컴포넌트 프리뷰 + props 편집
    - 카탈로그 메타데이터(설명/키워드/relatedScreens) 편집
    - `Ingest This to DB` (단건 인제스트)
    - `Ingest Selected` (체크된 항목만 일괄 인제스트)
    - `Remove DB Entry` (description/code/samples 3개 컬렉션 엔트리 제거)
    - 체크 상태 localStorage 유지 (`catalogViewer.checkedForIngest.v1`)

- ChromaDB Explorer (`/explorer`)
    - 컬렉션 목록/카운트 확인
    - 문서/메타데이터 확인
    - 검색 시 전체 컬렉션 스캔(페이지 누락 없이 검색)

## Quick Start

### Requirements

- Node.js 18+
- npm
- ChromaDB (기본: `http://localhost:8000`)
- Ollama + embedding model (기본: `bge-m3`, URL `http://localhost:11434`)

### Run

```bash
npm install
npm run dev
```

- App: `http://localhost:3002`
- Root route `/` -> `/catalog` redirect

### Build / Start

```bash
npm run build
npm run start
```

## CLI Ingest Commands

```bash
# 전체 인제스트 (컬렉션 recreate)
npm run chroma:ingest

# 단건 인제스트 (upsert)
npm run chroma:ingest:one -- CM_LIST_HORIZONTAL_PAGER
```

## Environment Variables

- `CHROMA_BASE_URL` (default: `http://localhost:8000`)
- `CHROMA_TENANT` (default: `default_tenant`)
- `CHROMA_DATABASE` (default: `default_database`)
- `OLLAMA_BASE_URL` (default: `http://localhost:11434`)
- `EMBEDDING_MODEL` (default: `bge-m3`)

## API Overview

- `GET /api/catalog/[name]`
    - 카탈로그 JSON 조회
- `PUT /api/catalog/[name]`
    - 카탈로그 JSON 저장

- `PUT /api/ingest/[name]`
    - 단건 인제스트 (description/code/samples)
- `DELETE /api/ingest/[name]`
    - 단건 DB 엔트리 제거 (description/code/samples)

- `POST /api/ingest-all`
    - 요청 본문 없이 호출: 전체 인제스트
    - `{ "names": ["CM_LIST_HorizontalPager", ...] }`: 선택 인제스트

- `GET /api/chroma/heartbeat`
- `GET /api/chroma/collections`
- `POST /api/chroma/collections/[name]/get`

## Data and Naming Notes

- 카탈로그 파일: `data/catalog/2_4inch/*.json` (canonical: `UPPER_SNAKE_CASE`)
- 레지스트리 키: `src/registry/index.js` (주로 `CamelCase` suffix)
- 인제스트 시 canonical name으로 통일하여, 단건/전체 인제스트가 동일 ID를 갱신합니다.
    - `desc_<CANONICAL_NAME>`
    - `code_<CANONICAL_NAME>`
    - `sample_<CANONICAL_NAME>`

## Project Structure

```text
rag-component-viewer/
|- src/
|  |- app/
|  |  |- catalog/page.js
|  |  |- explorer/page.js
|  |  |- api/
|  |     |- catalog/[name]/route.js
|  |     |- ingest/[name]/route.js
|  |     |- ingest-all/route.js
|  |     |- chroma/
|  |- components/
|  |  |- CatalogViewer.js
|  |  |- ChromaExplorer.js
|  |- registry/index.js
|  |- widgets/2.4_inches/
|- data/catalog/2_4inch/
|- scripts/ingest-components.js
|- docs/
|  |- RAG_CONTEXT_DESIGN.md
|  |- WIDGET_COMPONENT_CATALOG.md
|  |- DEVELOPER_GUIDE.md
```

## Documentation

- Developer guide: `docs/DEVELOPER_GUIDE.md`
- RAG context design: `docs/RAG_CONTEXT_DESIGN.md`
- Widget catalog reference: `docs/WIDGET_COMPONENT_CATALOG.md`

## License

Private - LG Electronics NXI UX Team
