'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

function pretty(value) {
    return JSON.stringify(value, null, 2);
}

function parseJsonSafe(text) {
    try {
        return { ok: true, data: JSON.parse(text) };
    } catch (e) {
        return { ok: false, error: e.message };
    }
}

function cloneIndex(indexData) {
    return JSON.parse(JSON.stringify(indexData));
}

function syncRawJson(setter, value) {
    setter(pretty(value));
}

function AssetPreview({ entry }) {
    if (!entry) {
        return (
            <div className="h-full min-h-[220px] rounded-xl border border-dashed border-slate-700 bg-slate-900/60 flex items-center justify-center text-[12px] text-slate-400">
                Select an asset to inspect it.
            </div>
        );
    }

    if (entry.type === 'image') {
        return (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <div className="h-[240px] rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
                    <img src={entry.path} alt={entry.name} className="max-h-full max-w-full object-contain" />
                </div>
            </div>
        );
    }

    const firstFrames = Array.isArray(entry.sampleFrames?.first) ? entry.sampleFrames.first : [];
    const lastFrames = Array.isArray(entry.sampleFrames?.last) ? entry.sampleFrames.last : [];
    const previewFrames = [...firstFrames, ...lastFrames];

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3">
            <div className="overflow-x-auto pb-1">
                {previewFrames.length > 0 ? (
                    <div className="flex items-center gap-3 min-w-max">
                        {previewFrames.map((framePath) => (
                            <div key={framePath} className="shrink-0 w-[120px] rounded-lg border border-slate-800 bg-slate-950 p-2 flex items-center justify-center h-[92px] overflow-hidden">
                                <img src={framePath} alt={framePath} className="max-h-full max-w-full object-contain" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-[92px] rounded-lg border border-dashed border-slate-700 bg-slate-950 flex items-center justify-center text-[11px] text-slate-400">
                        No preview frames available.
                    </div>
                )}
            </div>
            <div className="text-[11px] text-slate-400 space-y-1">
                <p>Frame count: {typeof entry.frameCount === 'number' ? entry.frameCount : '-'}</p>
                <p>Naming pattern: {entry.namingPattern || '-'}</p>
            </div>
        </div>
    );
}

export default function AssetsManager() {
    const [indexData, setIndexData] = useState(null);
    const [rawJsonText, setRawJsonText] = useState('');
    const [entryJsonText, setEntryJsonText] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedPaths, setSelectedPaths] = useState(() => new Set());
    const [activeKey, setActiveKey] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [ingesting, setIngesting] = useState(false);

    const loadIndex = useCallback(async () => {
        setLoading(true);
        setError('');
        setStatus('');
        try {
            const res = await fetch('/api/assets/index', { cache: 'no-store' });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
            setIndexData(json);
            syncRawJson(setRawJsonText, json);
        } catch (e) {
            setError(`Failed to load asset index: ${e.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadIndex();
    }, [loadIndex]);

    const allEntries = useMemo(() => {
        if (!indexData) return [];
        const images = Array.isArray(indexData.images) ? indexData.images.map((entry) => ({ ...entry, type: 'image' })) : [];
        const sequences = Array.isArray(indexData.sequences) ? indexData.sequences.map((entry) => ({ ...entry, type: 'image_sequence' })) : [];
        return [...images, ...sequences].map((entry) => ({
            ...entry,
            key: `${entry.type}:${entry.path}`,
        }));
    }, [indexData]);

    const filteredEntries = useMemo(() => {
        const q = search.trim().toLowerCase();
        return allEntries.filter((entry) => {
            if (selectedType !== 'all' && entry.type !== selectedType) return false;
            if (!q) return true;
            const haystack = [entry.name, entry.path, entry.id, entry.scope, entry.namingPattern]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return haystack.includes(q);
        });
    }, [allEntries, selectedType, search]);

    useEffect(() => {
        if (filteredEntries.length === 0) {
            setActiveKey('');
            setEntryJsonText('');
            return;
        }
        if (!filteredEntries.some((entry) => entry.key === activeKey)) {
            setActiveKey(filteredEntries[0].key);
        }
    }, [filteredEntries, activeKey]);

    const activeEntry = useMemo(() => allEntries.find((entry) => entry.key === activeKey) || null, [allEntries, activeKey]);

    useEffect(() => {
        setEntryJsonText(activeEntry ? pretty(activeEntry) : '');
    }, [activeEntry]);

    const selectedCount = selectedPaths.size;

    const toggleSelect = useCallback((path) => {
        setSelectedPaths((prev) => {
            const next = new Set(prev);
            if (next.has(path)) next.delete(path);
            else next.add(path);
            return next;
        });
    }, []);

    const handleSelectFiltered = useCallback(() => {
        setSelectedPaths(new Set(filteredEntries.map((entry) => entry.path).filter(Boolean)));
    }, [filteredEntries]);

    const handleClearSelection = useCallback(() => {
        setSelectedPaths(new Set());
    }, []);

    const updateIndexData = useCallback((nextIndex, nextStatus) => {
        setIndexData(nextIndex);
        syncRawJson(setRawJsonText, nextIndex);
        if (nextStatus) setStatus(nextStatus);
    }, []);

    const handleApplyEntryJson = useCallback(() => {
        if (!activeEntry || !indexData) return;

        const parsed = parseJsonSafe(entryJsonText);
        if (!parsed.ok) {
            setError(`Entry JSON parse error: ${parsed.error}`);
            return;
        }

        const nextEntry = parsed.data;
        if (!nextEntry || typeof nextEntry !== 'object') {
            setError('Entry JSON must be an object.');
            return;
        }
        if (!nextEntry.path || typeof nextEntry.path !== 'string') {
            setError('Entry JSON must include a string path.');
            return;
        }

        const nextIndex = cloneIndex(indexData);
        const bucket = activeEntry.type === 'image' ? 'images' : 'sequences';
        const list = Array.isArray(nextIndex[bucket]) ? nextIndex[bucket] : [];
        const idx = list.findIndex((entry) => entry.path === activeEntry.path);
        if (idx === -1) {
            setError('Active entry no longer exists in index data. Reload and try again.');
            return;
        }

        const sanitized = { ...nextEntry };
        delete sanitized.type;
        delete sanitized.key;
        list[idx] = sanitized;
        nextIndex[bucket] = list;

        const nextPath = sanitized.path;
        setSelectedPaths((prev) => {
            const next = new Set(prev);
            if (next.has(activeEntry.path)) {
                next.delete(activeEntry.path);
                next.add(nextPath);
            }
            return next;
        });
        setActiveKey(`${activeEntry.type}:${nextPath}`);
        setError('');
        updateIndexData(nextIndex, `Updated in-memory entry: ${sanitized.name || sanitized.path}`);
    }, [activeEntry, entryJsonText, indexData, updateIndexData]);

    const handleSaveJson = useCallback(async () => {
        setSaving(true);
        setError('');
        setStatus('');
        const parsed = parseJsonSafe(rawJsonText);
        if (!parsed.ok) {
            setSaving(false);
            setError(`JSON parse error: ${parsed.error}`);
            return;
        }

        try {
            const res = await fetch('/api/assets/index', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsed.data),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
            setIndexData(parsed.data);
            setStatus('asset_index.json saved');
            setError('');
        } catch (e) {
            setError(`Save failed: ${e.message}`);
        } finally {
            setSaving(false);
        }
    }, [rawJsonText]);

    const runIngest = useCallback(async (payload, label) => {
        setIngesting(true);
        setError('');
        setStatus('');
        try {
            const res = await fetch('/api/ingest-assets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload || {}),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
            setStatus(`${label}: ${json.succeeded}/${json.total} succeeded, ${json.failed} failed`);
        } catch (e) {
            setError(`Ingest failed: ${e.message}`);
        } finally {
            setIngesting(false);
        }
    }, []);

    const handleIngestAll = useCallback(async () => {
        await runIngest({}, 'Ingest all assets');
    }, [runIngest]);

    const handleIngestSelected = useCallback(async () => {
        const paths = Array.from(selectedPaths);
        if (paths.length === 0) {
            setError('Select at least one asset first.');
            return;
        }
        await runIngest({ paths }, 'Ingest selected assets');
    }, [selectedPaths, runIngest]);

    const runDelete = useCallback(async (payload, label) => {
        setIngesting(true);
        setError('');
        setStatus('');
        try {
            const res = await fetch('/api/ingest-assets', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload || {}),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
            setStatus(`${label}: ${json.deleted}/${json.total} deleted, ${json.failed} failed`);
        } catch (e) {
            setError(`Delete failed: ${e.message}`);
        } finally {
            setIngesting(false);
        }
    }, []);

    const handleDeleteSelected = useCallback(async () => {
        const paths = Array.from(selectedPaths);
        if (paths.length === 0) {
            setError('Select at least one asset first.');
            return;
        }
        await runDelete({ paths }, 'Delete selected assets from DB');
    }, [selectedPaths, runDelete]);

    return (
        <div className="h-screen bg-[#07111d] text-slate-100 flex flex-col" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <header className="h-12 px-4 border-b border-slate-800/90 bg-[#0b1726] flex items-center justify-between gap-3 flex-shrink-0">
                <div className="min-w-0">
                    <h1 className="text-[11px] uppercase tracking-[0.22em] font-black text-slate-100">Asset Index Manager</h1>
                    <p className="text-[10px] text-slate-400 font-mono">{loading ? 'Loading...' : `${filteredEntries.length}/${allEntries.length} assets · ${selectedCount} selected`}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        disabled={saving}
                        onClick={handleSaveJson}
                        className="text-[11px] px-2.5 py-1 rounded border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                        title="asset_index.json 저장"
                    >
                        Save Index
                    </button>
                    <button
                        disabled={ingesting}
                        onClick={handleIngestSelected}
                        className="text-[11px] px-2.5 py-1 rounded border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                        title="선택 항목만 DB에 저장"
                    >
                        Save Selected To DB
                    </button>
                    <button
                        disabled={ingesting}
                        onClick={handleDeleteSelected}
                        className="text-[11px] px-2.5 py-1 rounded border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                        title="선택 항목을 DB에서 삭제"
                    >
                        Delete Selected From DB
                    </button>
                    <button
                        disabled={ingesting}
                        onClick={handleIngestAll}
                        className="text-[11px] px-2.5 py-1 rounded border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                        title="전체 항목을 DB에 저장"
                    >
                        Save All To DB
                    </button>
                    <div className="shrink-0 flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 p-1 ml-1">
                        <Link href="/catalog" className="text-[10px] px-2 py-1 rounded text-slate-300 hover:bg-slate-800">Catalog</Link>
                        <Link href="/assets" className="text-[10px] px-2 py-1 rounded text-slate-100 bg-slate-800 border border-slate-700">Asset</Link>
                        <Link href="/explorer" className="text-[10px] px-2 py-1 rounded text-slate-300 hover:bg-slate-800">DB</Link>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 min-h-0">
            <aside className="w-[380px] flex-shrink-0 border-r border-slate-800/90 flex flex-col bg-[#0b1726]">
                <div className="px-4 py-4 border-b border-slate-800/90">
                    <p className="text-[10px] text-slate-400 font-mono">Asset List</p>
                </div>

                <div className="p-3 border-b border-slate-800/90 space-y-2 bg-[#0e1d30]">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, path, scope"
                        className="w-full px-3 py-2 text-[12px] rounded-lg bg-slate-900 border border-slate-700 outline-none focus:border-sky-500"
                    />

                    <div className="flex items-center gap-2 flex-wrap">
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="text-[12px] bg-slate-900 border border-slate-700 px-2 py-1.5 rounded-lg"
                        >
                            <option value="all">All types</option>
                            <option value="image">Images</option>
                            <option value="image_sequence">Sequences</option>
                        </select>
                        <button onClick={handleSelectFiltered} className="text-[11px] px-2 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600">Select Filtered</button>
                        <button onClick={handleClearSelection} className="text-[11px] px-2 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600">Clear</button>
                        <button onClick={loadIndex} className="text-[11px] px-2 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600">Reload</button>
                    </div>

                    {status ? <p className="text-[11px] text-emerald-300">{status}</p> : null}
                    {error ? <p className="text-[11px] text-rose-300">{error}</p> : null}
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                    {filteredEntries.map((entry) => {
                        const checked = selectedPaths.has(entry.path);
                        const active = entry.key === activeKey;
                        return (
                            <div
                                key={entry.key}
                                onClick={() => setActiveKey(entry.key)}
                                className={`rounded-lg border px-2.5 py-2 cursor-pointer transition ${active ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-800 bg-slate-900/80 hover:bg-slate-800/90'}`}
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggleSelect(entry.path)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="accent-cyan-500"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] text-slate-200 truncate">
                                            <span className="font-semibold text-slate-100">{entry.name || '(unnamed)'}</span>
                                            <span className="text-slate-500"> · {entry.path}</span>
                                        </p>
                                    </div>
                                    {entry.scope ? <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">{entry.scope}</span> : null}
                                    {typeof entry.frameCount === 'number' ? <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">{entry.frameCount}f</span> : null}
                                    <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">{entry.type === 'image_sequence' ? 'seq' : 'img'}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </aside>

            <main className="flex-1 min-w-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.08),_transparent_38%),linear-gradient(180deg,_#07111d,_#0a1220)]">
                <section className="min-w-0 h-full flex flex-col">
                    <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-950/50">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="text-sm font-semibold text-slate-100">Asset Review</h2>
                                <p className="text-[11px] text-slate-400 mt-1">썸네일/프레임 미리보기와 항목 메타데이터를 확인하고, 필요 시 항목 JSON만 수정하세요.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        <AssetPreview entry={activeEntry} />

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
                            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-[13px] font-semibold text-slate-100">Current Asset</h3>
                                {activeEntry ? <span className="text-[10px] px-2 py-1 rounded-full bg-slate-800 border border-slate-700">{activeEntry.type}</span> : null}
                            </div>
                            {activeEntry ? (
                                <div className="text-[12px] text-slate-300 space-y-2">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Name</p>
                                        <p className="mt-1 break-all">{activeEntry.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Path</p>
                                        <p className="mt-1 break-all text-slate-200">{activeEntry.path}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">ID</p>
                                            <p className="mt-1 break-all">{activeEntry.id || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Scope</p>
                                            <p className="mt-1 break-all">{activeEntry.scope || '-'}</p>
                                        </div>
                                    </div>
                                    {activeEntry.namingPattern ? (
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Naming Pattern</p>
                                            <p className="mt-1 break-all">{activeEntry.namingPattern}</p>
                                        </div>
                                    ) : null}
                                </div>
                            ) : (
                                <p className="text-[12px] text-slate-400">Select an asset from the left panel.</p>
                            )}
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-[13px] font-semibold text-slate-100">Current Entry JSON</h3>
                                <button
                                    onClick={handleApplyEntryJson}
                                    disabled={!activeEntry}
                                    className="text-[11px] px-2 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50"
                                >
                                    Apply Entry Changes
                                </button>
                            </div>
                            <textarea
                                value={entryJsonText}
                                onChange={(e) => setEntryJsonText(e.target.value)}
                                disabled={!activeEntry}
                                className="w-full min-h-[300px] rounded-xl border border-slate-700 bg-slate-950 text-slate-200 text-[12px] font-mono p-3 outline-none focus:border-cyan-500 disabled:opacity-50"
                                spellCheck={false}
                            />
                        </div>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3">
                            <div>
                                <h3 className="text-[13px] font-semibold text-slate-100">Full asset_index.json</h3>
                                <p className="text-[11px] text-slate-400 mt-1">파일 전체를 직접 편집하고 저장할 수 있습니다. 항목 단위 편집 후에도 이 뷰는 자동으로 동기화됩니다.</p>
                            </div>
                            <textarea
                                value={rawJsonText}
                                onChange={(e) => setRawJsonText(e.target.value)}
                                className="w-full min-h-[320px] rounded-xl border border-slate-800 bg-slate-950/90 text-slate-200 text-[12px] font-mono p-4 outline-none focus:border-cyan-500"
                                spellCheck={false}
                            />
                        </div>
                    </div>
                </section>
            </main>
            </div>
        </div>
    );
}
