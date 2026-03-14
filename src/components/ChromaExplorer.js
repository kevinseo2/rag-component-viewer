'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escHtml(v) {
    return String(v ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function fmtBytes(n) {
    if (typeof n !== 'number') return '-';
    if (n < 1024) return `${n} B`;
    if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1048576).toFixed(2)} MB`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ connected }) {
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${connected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            {connected ? 'Connected' : 'Disconnected'}
        </span>
    );
}

function CollectionCard({ col, selected, onClick }) {
    const colorMap = {
        ui_components_description: 'border-sky-500',
        ui_components_code:        'border-violet-500',
        ui_components_samples:     'border-amber-500',
    };
    const accent = colorMap[col.name] || 'border-slate-500';

    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-4 rounded-lg border-l-4 transition-all duration-150 ${accent}
                ${selected
                    ? 'bg-white/10 ring-1 ring-white/20'
                    : 'bg-white/5 hover:bg-white/8'
                }`}
        >
            <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-bold text-slate-100 font-mono truncate">{col.name}</span>
                <span className="shrink-0 text-[12px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">{col.count.toLocaleString()}</span>
            </div>
            {col.metadata?.description && (
                <p className="text-[11px] text-slate-400 mt-1 truncate">{col.metadata.description}</p>
            )}
            {col.metadata?.model && col.metadata.model !== 'none' && (
                <p className="text-[10px] text-sky-400/60 mt-0.5">model: {col.metadata.model}</p>
            )}
        </button>
    );
}

function PropBadge({ text }) {
    return (
        <span className="inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-300 bg-white/5 border border-white/10 rounded">
            {text}
        </span>
    );
}

function DocumentCard({ id, metadata, document: doc }) {
    const [expanded, setExpanded] = useState(false);
    const [codeOpen, setCodeOpen] = useState(false);

    const componentName = metadata?.componentName || '';
    const category      = metadata?.category || '';
    const descKo        = metadata?.descriptionKo || '';
    const descEn        = metadata?.descriptionEn || '';
    const propsStr      = typeof metadata?.props === 'string' ? metadata.props : '';
    const keywords      = typeof metadata?.keywords === 'string' ? metadata.keywords : '';
    const sourcePath    = metadata?.sourcePath || '';
    const props         = propsStr ? propsStr.split(',').map(p => p.trim()).filter(Boolean) : [];
    const kwArr         = keywords ? keywords.split(',').map(k => k.trim()).filter(Boolean) : [];

    const isCode  = id.startsWith('code_');
    const isDesc  = id.startsWith('desc_');
    const isSample = id.startsWith('sample_');

    const typeColor = isCode ? 'border-violet-500 bg-violet-500/5' :
        isDesc ? 'border-sky-500 bg-sky-500/5' :
        isSample ? 'border-amber-500 bg-amber-500/5' :
        'border-slate-600 bg-slate-500/5';

    const typeLabel = isCode ? '📄 Code' : isDesc ? '🔍 Description' : isSample ? '🧪 Sample' : '📦 Document';

    return (
        <div className={`rounded-lg border-l-4 p-4 mb-3 ${typeColor}`}>
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className="text-[11px] font-bold text-slate-400 bg-white/5 px-1.5 py-0.5 rounded shrink-0">{typeLabel}</span>
                    {componentName && (
                        <span className="text-[12px] font-bold text-slate-100 font-mono truncate">{componentName}</span>
                    )}
                    {category && (
                        <span className="text-[10px] text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-full shrink-0">{category}</span>
                    )}
                </div>
                <button
                    onClick={() => setExpanded(v => !v)}
                    className="shrink-0 text-slate-400 hover:text-slate-100 transition-colors"
                    title={expanded ? 'Collapse' : 'Expand'}
                >
                    <svg className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* ID */}
            <p className="text-[10px] text-slate-500 font-mono mb-2 truncate" title={id}>{id}</p>

            {/* Quick info */}
            {(descKo || descEn) && (
                <p className="text-[12px] text-slate-300 leading-relaxed mb-2 line-clamp-2">
                    {descKo || descEn}
                </p>
            )}

            {/* Props chips */}
            {props.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                    {props.slice(0, expanded ? props.length : 6).map(p => <PropBadge key={p} text={p} />)}
                    {!expanded && props.length > 6 && (
                        <span className="text-[10px] text-slate-500">+{props.length - 6} more</span>
                    )}
                </div>
            )}

            {/* Expanded detail */}
            {expanded && (
                <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                    {descKo && descEn && descKo !== descEn && (
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description (EN)</p>
                            <p className="text-[12px] text-slate-300 leading-relaxed">{descEn}</p>
                        </div>
                    )}
                    {sourcePath && (
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Source Path</p>
                            <p className="text-[11px] text-slate-400 font-mono">{sourcePath}</p>
                        </div>
                    )}
                    {kwArr.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Keywords</p>
                            <div className="flex flex-wrap gap-1">
                                {kwArr.map(k => (
                                    <span key={k} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">{k}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* All metadata */}
                    <details className="mt-1">
                        <summary className="cursor-pointer text-[11px] text-sky-400 hover:text-sky-300 font-semibold select-none">
                            All Metadata
                        </summary>
                        <div className="mt-2 grid grid-cols-[140px_1fr] gap-x-3 gap-y-1 text-[11px]">
                            {Object.entries(metadata || {}).map(([k, v]) => (
                                <div key={k} className="contents">
                                    <span className="text-slate-500 font-mono truncate">{k}</span>
                                    <span className="text-slate-300 break-words">{String(v).slice(0, 200)}</span>
                                </div>
                            ))}
                        </div>
                    </details>
                    {/* Document content */}
                    {doc && (
                        <div>
                            <button
                                onClick={() => setCodeOpen(v => !v)}
                                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                            >
                                <svg className={`w-3 h-3 transition-transform ${codeOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                                {isCode ? 'Source Code' : 'Document Text'}
                            </button>
                            {codeOpen && (
                                <pre className="mt-2 p-3 rounded bg-black/40 border border-white/5 text-[11px] text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed">
                                    {doc}
                                </pre>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Main Explorer ────────────────────────────────────────────────────────────

export default function ChromaExplorer() {
    const [connected, setConnected]         = useState(false);
    const [connecting, setConnecting]       = useState(false);
    const [collections, setCollections]     = useState([]);
    const [selectedCol, setSelectedCol]     = useState(null);
    const [items, setItems]                 = useState(null);
    const [loading, setLoading]             = useState(false);
    const [error, setError]                 = useState(null);
    const [searchQuery, setSearchQuery]     = useState('');
    const [page, setPage]                   = useState(0);
    const [totalHint, setTotalHint]         = useState(0);
    const LIMIT = 50;
    const SEARCH_SCAN_LIMIT = 10000;
    const searchRef = useRef();

    const showError = (msg) => {
        setError(msg);
        setTimeout(() => setError(null), 6000);
    };

    const connect = useCallback(async () => {
        setConnecting(true);
        setError(null);
        try {
            const res = await fetch('/api/chroma/heartbeat');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            setConnected(true);
            // Load collections
            const colRes = await fetch('/api/chroma/collections');
            if (!colRes.ok) throw new Error('Failed to load collections');
            const cols = await colRes.json();
            setCollections(Array.isArray(cols) ? cols : []);
        } catch (e) {
            setConnected(false);
            showError(`Connection failed: ${e.message}`);
        } finally {
            setConnecting(false);
        }
    }, []);

    useEffect(() => { connect(); }, [connect]);

    const loadItems = useCallback(async (colName, offset = 0, query = '') => {
        if (!colName) return;
        setLoading(true);
        try {
            const q = query.trim();
            const selectedCollection = collections.find(c => c.name === colName);
            const isSearchMode = q.length > 0;

            // Search must scan the full collection; page-sliced search misses many docs.
            const effectiveLimit = isSearchMode ? SEARCH_SCAN_LIMIT : LIMIT;
            const effectiveOffset = isSearchMode ? 0 : offset;

            const res = await fetch(`/api/chroma/collections/${encodeURIComponent(colName)}/get`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ include: ['metadatas', 'documents'], limit: effectiveLimit, offset: effectiveOffset }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || `HTTP ${res.status}`);
            }
            const data = await res.json();
            let ids        = data.ids || [];
            let metadatas  = data.metadatas || [];
            let documents  = data.documents || [];

            // Client-side filter
            if (isSearchMode) {
                const qLower = q.toLowerCase();
                const filtered = ids.reduce((acc, id, i) => {
                    const meta = JSON.stringify(metadatas[i] || {}).toLowerCase();
                    const doc  = (documents[i] || '').toLowerCase();
                    if (id.toLowerCase().includes(qLower) || meta.includes(qLower) || doc.includes(qLower)) {
                        acc.push(i);
                    }
                    return acc;
                }, []);
                ids        = filtered.map(i => ids[i]);
                metadatas  = filtered.map(i => metadatas[i]);
                documents  = filtered.map(i => documents[i]);
            }

            setItems({ ids, metadatas, documents });
            setTotalHint(isSearchMode ? ids.length : (selectedCollection?.count ?? ids.length));
        } catch (e) {
            showError(`Failed to load: ${e.message}`);
        } finally {
            setLoading(false);
        }
    }, [collections]);

    const selectCollection = (name) => {
        setSelectedCol(name);
        setSearchQuery('');
        setPage(0);
        loadItems(name, 0, '');
    };

    const handleSearch = () => {
        setPage(0);
        loadItems(selectedCol, 0, searchQuery);
    };

    const handleSearchKey = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handlePageNext = () => {
        if (searchQuery.trim()) return;
        const next = page + 1;
        setPage(next);
        loadItems(selectedCol, next * LIMIT, searchQuery);
    };

    const handlePagePrev = () => {
        if (searchQuery.trim()) return;
        const prev = Math.max(0, page - 1);
        setPage(prev);
        loadItems(selectedCol, prev * LIMIT, searchQuery);
    };

    const itemCount = items?.ids?.length ?? 0;

    return (
        <div className="flex h-screen overflow-hidden text-slate-200" style={{ background: '#1a1b1e', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

            {/* ── LEFT SIDEBAR ── */}
            <aside className="w-72 flex-shrink-0 flex flex-col border-r border-white/10" style={{ background: '#0f1012' }}>
                {/* Header */}
                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Link href="/catalog" className="text-slate-400 hover:text-white transition-colors" title="← Widget Catalog">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <h1 className="text-[11px] font-black text-slate-100 tracking-widest uppercase">ChromaDB Explorer</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <StatusBadge connected={connected} />
                            <Link href="/assets" className="text-[10px] px-2 py-0.5 rounded border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/10 transition-colors">Assets</Link>
                        </div>
                    </div>
                    <button
                        onClick={connect}
                        disabled={connecting}
                        className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                        title="Refresh"
                    >
                        <svg className={`w-4 h-4 ${connecting ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>

                {/* Collections list */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {collections.length === 0 && !connecting && (
                        <p className="text-center text-[11px] text-slate-500 py-8">
                            {connected ? 'No collections found.' : 'Not connected.'}
                        </p>
                    )}
                    {collections.map(col => (
                        <CollectionCard
                            key={col.name}
                            col={col}
                            selected={col.name === selectedCol}
                            onClick={() => selectCollection(col.name)}
                        />
                    ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-white/10">
                    <p className="text-[10px] text-slate-500 font-mono">
                        {process.env.NEXT_PUBLIC_CHROMA_BASE_URL || 'localhost:8000'}
                    </p>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 flex flex-col min-w-0">

                {/* Error toast */}
                {error && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-900/90 border border-red-500/50 text-red-200 text-[12px] px-4 py-2.5 rounded-lg shadow-xl max-w-xl">
                        ✕ {error}
                    </div>
                )}

                {/* Content area */}
                {!selectedCol ? (
                    /* Empty state */
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582 4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                            </svg>
                        </div>
                        <p className="text-sm font-semibold text-slate-400">No Collection Selected</p>
                        <p className="text-xs text-slate-600 mt-1">Select a collection from the left panel to browse documents</p>
                    </div>
                ) : (
                    <>
                        {/* Toolbar */}
                        <div className="flex-shrink-0 flex items-center gap-3 px-5 py-3 border-b border-white/10" style={{ background: '#16181c' }}>
                            <div className="flex-1 relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                                </svg>
                                <input
                                    ref={searchRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearchKey}
                                    placeholder="Filter by id, metadata, or document text..."
                                    className="w-full pl-9 pr-4 py-2 text-[12px] bg-white/5 border border-white/10 rounded-lg text-slate-200 placeholder-slate-600 outline-none focus:border-sky-500/50 focus:bg-white/8 transition-all font-mono"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="px-4 py-2 text-[12px] font-semibold bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors"
                            >
                                Search
                            </button>
                            <button
                                onClick={() => { setSearchQuery(''); loadItems(selectedCol, 0, ''); setPage(0); }}
                                className="px-3 py-2 text-[12px] text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                All
                            </button>
                            <div className="text-[11px] text-slate-500 font-mono shrink-0">
                                {selectedCol}
                            </div>
                        </div>

                        {/* Document list */}
                        <div className="flex-1 overflow-y-auto px-5 py-4">
                            {loading ? (
                                <div className="flex items-center justify-center h-32 text-slate-400 text-sm gap-2">
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Loading...
                                </div>
                            ) : items?.ids?.length === 0 ? (
                                <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
                                    No documents found.
                                </div>
                            ) : items ? (
                                <>
                                    <p className="text-[11px] text-slate-500 mb-3">
                                        Showing {itemCount} document{itemCount !== 1 ? 's' : ''}
                                        {searchQuery && ` matching "${searchQuery}"`}
                                        {!searchQuery && totalHint > LIMIT && ` (page ${page + 1}, offset ${page * LIMIT})`}
                                    </p>
                                    {items.ids.map((id, i) => (
                                        <DocumentCard
                                            key={id}
                                            id={id}
                                            metadata={items.metadatas[i]}
                                            document={items.documents ? items.documents[i] : null}
                                        />
                                    ))}
                                    {/* Pagination */}
                                    {!searchQuery && totalHint > LIMIT && (
                                        <div className="flex items-center justify-center gap-3 mt-4 pb-4">
                                            <button
                                                onClick={handlePagePrev}
                                                disabled={page === 0}
                                                className="px-4 py-1.5 text-[12px] bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300 rounded-lg transition-colors"
                                            >
                                                ← Prev
                                            </button>
                                            <span className="text-[11px] text-slate-500 font-mono">Page {page + 1}</span>
                                            <button
                                                onClick={handlePageNext}
                                                disabled={itemCount < LIMIT}
                                                className="px-4 py-1.5 text-[12px] bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300 rounded-lg transition-colors"
                                            >
                                                Next →
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : null}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
