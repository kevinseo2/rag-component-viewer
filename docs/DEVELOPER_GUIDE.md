# Developer Guide

This guide explains architecture, ingest/search flows, and practical maintenance steps for `rag-component-viewer`.

## 1. System Overview

The app has two main surfaces:

- `Catalog Viewer` (`/catalog`): component preview, catalog editing, ingest actions.
- `ChromaDB Explorer` (`/explorer`): collection inspection and document search.

Core folders:

- `src/components/`
  - `CatalogViewer.js`: editor + ingest/delete UI.
  - `ChromaExplorer.js`: DB browsing/search UI.
- `src/app/api/`
  - `catalog/[name]/route.js`: read/write catalog JSON.
  - `ingest/[name]/route.js`: single ingest and single delete.
  - `ingest-all/route.js`: bulk ingest (all or selected names).
  - `ingest/_lib.js`: shared ingest helpers and Chroma operations.
  - `chroma/*`: explorer support routes.
- `src/registry/index.js`: component registry (`defaultProps` + `variants`).
- `data/catalog/2_4inch/*.json`: catalog source of truth.

## 2. Canonical Naming Rules

Two naming styles coexist:

- Catalog file names: `UPPER_SNAKE_CASE` (example: `CM_LIST_HORIZONTAL_PAGER.json`)
- Registry keys: often `CM_LIST_HorizontalPager`

To avoid duplicate DB IDs, ingest normalizes names to canonical catalog format.

Implemented helper:

- `resolveCanonicalComponentName(name, catalogName)` in `src/app/api/ingest/_lib.js`

Resulting IDs:

- `desc_<CANONICAL_NAME>`
- `code_<CANONICAL_NAME>`
- `sample_<CANONICAL_NAME>`

This guarantees `Ingest This` and `Ingest Selected/All` update the same records.

## 3. Ingest Flow

### 3.1 Single Ingest

Endpoint: `PUT /api/ingest/[name]`

Flow:

1. Ensure three collections exist.
2. Resolve canonical component name.
3. Load catalog + source + registry info.
4. Build description/sample text.
5. Embed via Ollama (`/api/embed`).
6. Upsert into:
   - `ui_components_description`
   - `ui_components_code`
   - `ui_components_samples`

### 3.2 Bulk Ingest

Endpoint: `POST /api/ingest-all`

Request patterns:

- Full ingest:

```json
{}
```

- Selected ingest:

```json
{
  "names": ["CM_LIST_HorizontalPager", "WD_PROGRESS_Circle"]
}
```

Behavior:

- If `names` is not provided: ingest all catalog entries.
- If `names` is provided: only ingest selected canonical names.
- If explicit selection is empty/invalid: returns `ok: true` with `total: 0`.

### 3.3 Single Delete (DB Entry Removal)

Endpoint: `DELETE /api/ingest/[name]`

Removes one component from all three collections by IDs:

- `desc_<CANONICAL_NAME>`
- `code_<CANONICAL_NAME>`
- `sample_<CANONICAL_NAME>`

Catalog JSON and widget source are not deleted.

## 4. Explorer Search Behavior

`ChromaExplorer` search is intentionally different from pagination mode.

- Normal browsing: paged fetch (`limit=50`, `offset=page*50`)
- Search mode (`query` present): wide fetch (`limit=10000`, `offset=0`) + client filtering

Reason:

- Page-sliced search misses results outside current page.
- Full scan mode is required to find newly ingested items reliably.

Implementation location:

- `src/components/ChromaExplorer.js`

## 5. Catalog Viewer Selection UX

Implemented in `src/components/CatalogViewer.js`:

- Per-component checkbox for ingest selection.
- `Check All / Uncheck All` toggle.
- Selection persisted in localStorage key:
  - `catalogViewer.checkedForIngest.v1`
- `Ingest This to DB` success -> auto-check selected component.
- `Remove DB Entry` success -> auto-uncheck selected component.

## 6. Metadata Coverage in Description Collection

Description payload includes:

- `descriptionKo`
- `descriptionEn`
- `visualForm`
- `keywords`
- `props`
- `relatedScreens`

If retrieval quality degrades, verify `relatedScreens` is populated in catalog JSON and appears in:

- description document text
- description metadata

## 7. Operational Commands

From `package.json`:

```bash
npm run dev
npm run build
npm run start
npm run chroma:ingest
npm run chroma:ingest:one -- CM_LIST_HORIZONTAL_PAGER
```

## 8. Troubleshooting

### 8.1 Ingest Fails with Chroma Connection Error

Symptoms:

- `ChromaDB collection setup failed`
- heartbeat failure

Checks:

- `CHROMA_BASE_URL` reachable
- tenant/database values valid (`default_tenant`, `default_database` by default)

### 8.2 Ingest Fails with Embedding Error

Checks:

- Ollama service running
- model exists (`bge-m3` default)
- `OLLAMA_BASE_URL` correct

### 8.3 defaultProps/variants Not Found

Checks:

- Registry key format matches converter logic.
- `extractRegistryInfo()` fallback normalization still present.
- New widget exists in `src/registry/index.js` with `defaultProps` and `variants`.

### 8.4 Explorer Search Does Not Find New Item

Checks:

- Confirm ingest created IDs in canonical form.
- Confirm searching in the correct collection (`description` vs `code` vs `samples`).
- Use exact canonical name (`CM_*`, `WD_*`, `OV_*`) for quick validation.

## 9. Recommended Extension Points

- Add server-side text query route for Chroma (instead of client filtering large payloads).
- Add selection presets (by category/prefix).
- Add operation history panel (`last ingest`, `last delete`, diff summary).
