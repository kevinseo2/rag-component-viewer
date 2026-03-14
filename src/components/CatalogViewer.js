'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ComponentRegistry } from '../registry/index.js';
import PropsEditor from './PropsEditor.js';

const INGEST_SELECTION_STORAGE_KEY = 'catalogViewer.checkedForIngest.v1';

function restoreCheckedFromStorage() {
    const allNames = Object.keys(ComponentRegistry);
    const valid = new Set(allNames);
    try {
        const raw = window.localStorage.getItem(INGEST_SELECTION_STORAGE_KEY);
        if (!raw) return new Set(allNames);
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return new Set(allNames);
        const restored = parsed.filter((name) => typeof name === 'string' && valid.has(name));
        return new Set(restored);
    } catch {
        return new Set(allNames);
    }
}

// ─── Category helpers ─────────────────────────────────────────────────────────
function getTopLevel(name) {
    if (name.startsWith('CM_')) return 'Common';
    if (name.startsWith('OV_')) return 'Oven';
    if (name.startsWith('WD_')) return 'Washer-Dryer';
    return 'Other';
}

function getCategory(name) {
    if (name.startsWith('CM_ANIM')) return 'Animation';
    if (name.startsWith('CM_CTRL')) return 'Control/Input';
    if (name.startsWith('CM_DIALOG')) return 'Dialog/Popup';
    if (name.startsWith('CM_DISPLAY')) return 'Display';
    if (name.startsWith('CM_LABEL')) return 'Label';
    if (name.startsWith('CM_LIST')) return 'List/Selection';
    if (name.startsWith('CM_OVERLAY')) return 'Overlay/Feedback';
    if (name.startsWith('CM_PICKER')) return 'Picker/Selection';
    if (name.startsWith('CM_PROGRESS')) return 'Progress/Loading';
    if (name.startsWith('CM_TITLE')) return 'Title';
    
    if (name.startsWith('OV_')) return 'Oven Components';

    if (name.startsWith('WD_ANIM')) return 'Animation';
    if (name.startsWith('WD_CLOCK')) return 'Clock';
    if (name.startsWith('WD_COURSE')) return 'Course';
    if (name.startsWith('WD_DECORATION')) return 'Decoration';
    if (name.startsWith('WD_DIALOG')) return 'Dialog/Popup';
    if (name.startsWith('WD_PAGER')) return 'Pager';
    if (name.startsWith('WD_PROGRESS')) return 'Progress/Loading';
    if (name.startsWith('WD_TOAST')) return 'Toast';
    
    return 'Other';
}

const TOP_LEVELS = ['Common', 'Oven', 'Washer-Dryer', 'Other'];

// ─── LCD Frame ────────────────────────────────────────────────────────────────
function LCDFrame({ children }) {
    return (
        <div className="flex flex-col items-center">
            <div className="inline-block bg-[#111] p-4 rounded-2xl shadow-xl border border-[#333]">
                <div className="w-[320px] h-[240px] bg-black overflow-hidden relative rounded-sm ring-1 ring-black/80">
                    {children}
                </div>
            </div>
            <p className="text-[11px] text-gray-400 font-mono tracking-widest mt-4">
                320 x 240 px · 2.4"
            </p>
        </div>
    );
}

// ─── Left Panel List Item ─────────────────────────────────────────────────────
function ListItem({ name, isSelected, isChecked, onClick, onToggleCheck }) {
    const match = name.match(/^([A-Z]+_[A-Z]+_?)(.+)$/);
    const prefix = match ? match[1] : '';
    const rest = match ? match[2] : name;

    return (
        <div
            className={`w-full px-2 py-1 rounded transition-colors flex items-center gap-2
                ${isSelected ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
            <button
                onClick={onClick}
                className={`flex-1 text-left py-0.5 transition-colors text-[11px] font-mono whitespace-nowrap overflow-hidden text-ellipsis flex items-center
                    ${isSelected
                        ? 'text-black font-bold'
                        : 'text-gray-600 hover:text-gray-900 border-transparent'
                    }`}
            >
                <span className={`${isSelected ? 'text-gray-600' : 'text-gray-400'} font-normal`}>{prefix}</span>{rest}
            </button>
            <input
                type="checkbox"
                checked={!!isChecked}
                onChange={(e) => {
                    e.stopPropagation();
                    onToggleCheck(name, e.target.checked);
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-3.5 h-3.5 accent-gray-500 cursor-pointer opacity-80 hover:opacity-100"
                title="Ingest All 대상 선택"
            />
        </div>
    );
}

// ─── Empty State (Preview) ────────────────────────────────────────────────────
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 text-center p-10 h-full">
            <div className="w-16 h-12 rounded border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                <div className="w-10 h-6 rounded bg-gray-200" />
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-500">No Component Selected</p>
                <p className="text-xs text-gray-400 mt-1">Select a widget from the left panel</p>
            </div>
        </div>
    );
}

// ─── Down Catalog Editor ──────────────────────────────────────────────────────
function CatalogEditor({ name, defaultPropsKeys, selectedNamesForIngestAll = [], onIngested, onDeleted }) {
    const [draft, setDraft] = useState(null);
    const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'saved' | 'error'
    const [ingestStatus, setIngestStatus] = useState(null); // null | 'ingesting' | 'done' | 'error'
    const [showIngestAllModal, setShowIngestAllModal] = useState(false);
    const [ingestAllStatus, setIngestAllStatus] = useState(null); // null | 'ingesting' | 'done' | 'error'
    const [ingestAllResult, setIngestAllResult] = useState(null); // { total, succeeded, failed, failedList }
    const [deleteStatus, setDeleteStatus] = useState(null); // null | 'deleting' | 'done' | 'error'

    // Load from API when component changes
    useEffect(() => {
        if (!name) { setDraft(null); setSaveStatus(null); setIngestStatus(null); setDeleteStatus(null); return; }
        setSaveStatus(null);
        setIngestStatus(null);
        setDeleteStatus(null);
        fetch(`/api/catalog/${name}`)
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                const d = data || {};
                setDraft({
                    name,
                    category: d.category || getCategory(name),
                    type: d.type || 'Widget',
                    descriptionKo: d.descriptionKo || '',
                    descriptionEn: d.descriptionEn || '',
                    visualForm: d.visualForm || '',
                    props: d.props?.length ? d.props : defaultPropsKeys,
                    keywords: d.keywords || [],
                    relatedScreens: d.relatedScreens || d.applicableScreens || [],
                });
            })
            .catch(() => setDraft({ name, category: getCategory(name), type: 'Widget', descriptionKo: '', descriptionEn: '', visualForm: '', props: defaultPropsKeys, keywords: [], relatedScreens: [] }));
    }, [name, defaultPropsKeys]);

    if (!draft) return (
        <div className="h-full flex flex-col items-center justify-center bg-white text-gray-400 text-xs border-t border-gray-200">
            Waiting for component selection to enable catalog editor.
        </div>
    );

    const handleChange = (field, value) => { setDraft(prev => ({ ...prev, [field]: value })); setSaveStatus(null); };

    const handleSave = async () => {
        const finalDraft = { ...draft };
        if (typeof finalDraft.relatedScreens === 'string') {
            finalDraft.relatedScreens = finalDraft.relatedScreens.split(',').map(s => s.trim()).filter(Boolean);
        }
        if (typeof finalDraft.keywords === 'string') {
            finalDraft.keywords = finalDraft.keywords.split(',').map(s => s.trim()).filter(Boolean);
        }
        setSaveStatus('saving');
        try {
            const res = await fetch(`/api/catalog/${name}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalDraft),
            });
            setSaveStatus(res.ok ? 'saved' : 'error');
        } catch {
            setSaveStatus('error');
        }
    };

    const handleIngest = async () => {
        if (!draft) return;
        const finalDraft = { ...draft };
        if (typeof finalDraft.relatedScreens === 'string') {
            finalDraft.relatedScreens = finalDraft.relatedScreens.split(',').map(s => s.trim()).filter(Boolean);
        }
        if (typeof finalDraft.keywords === 'string') {
            finalDraft.keywords = finalDraft.keywords.split(',').map(s => s.trim()).filter(Boolean);
        }
        setIngestStatus('ingesting');
        try {
            const res = await fetch(`/api/ingest/${name}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ catalogData: finalDraft }),
            });
            setIngestStatus(res.ok ? 'done' : 'error');
            if (res.ok) onIngested?.(name);
        } catch {
            setIngestStatus('error');
        }
    };

    const handleIngestAll = async () => {
        setShowIngestAllModal(false);
        setIngestAllStatus('ingesting');
        setIngestAllResult(null);
        try {
            const res = await fetch('/api/ingest-all', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ names: selectedNamesForIngestAll }),
            });
            const json = await res.json();
            if (res.ok) {
                setIngestAllResult(json);
                setIngestAllStatus('done');
            } else {
                setIngestAllStatus('error');
            }
        } catch {
            setIngestAllStatus('error');
        }
    };

    const handleDelete = async () => {
        if (!name) return;
        setDeleteStatus('deleting');
        try {
            const res = await fetch(`/api/ingest/${name}`, { method: 'DELETE' });
            setDeleteStatus(res.ok ? 'done' : 'error');
            if (res.ok) onDeleted?.(name);
        } catch {
            setDeleteStatus('error');
        }
    };

    useEffect(() => {
        const onToolbarAction = (event) => {
            const action = event?.detail;
            if (action === 'save') {
                handleSave();
                return;
            }
            if (action === 'ingest-current') {
                handleIngest();
                return;
            }
            if (action === 'delete-current') {
                handleDelete();
                return;
            }
            if (action === 'ingest-selected-all') {
                if (selectedNamesForIngestAll.length > 0) {
                    setShowIngestAllModal(true);
                }
            }
        };

        window.addEventListener('catalog-toolbar-action', onToolbarAction);
        return () => window.removeEventListener('catalog-toolbar-action', onToolbarAction);
    }, [selectedNamesForIngestAll.length, handleDelete, handleIngest, handleSave]);

    return (
        <div className="flex h-full bg-white flex-col text-sm border-t border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-2 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-700 text-xs uppercase tracking-wider">Catalog Editor</h3>
                    <span className="text-gray-900 font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-gray-300 shadow-sm">{name}</span>
                    {saveStatus === 'saved' && <span className="text-[10px] text-green-600 font-semibold">✓ Saved</span>}
                    {saveStatus === 'error' && <span className="text-[10px] text-red-500 font-semibold">✕ Save failed</span>}
                    {ingestStatus === 'done' && <span className="text-[10px] text-blue-600 font-semibold">↑ DB Updated</span>}
                    {ingestStatus === 'error' && <span className="text-[10px] text-red-500 font-semibold">✕ DB Update failed</span>}
                    {deleteStatus === 'done' && <span className="text-[10px] text-amber-700 font-semibold">DB Entry Removed</span>}
                    {deleteStatus === 'error' && <span className="text-[10px] text-red-500 font-semibold">✕ DB Remove failed</span>}
                    {ingestAllStatus === 'ingesting' && <span className="text-[10px] text-purple-600 font-semibold animate-pulse">⏳ Ingesting all...</span>}
                    {ingestAllStatus === 'done' && ingestAllResult && (
                        <span className="text-[10px] text-purple-600 font-semibold">
                            ↑ All ingested ({ingestAllResult.succeeded}/{ingestAllResult.total})
                            {ingestAllResult.failed > 0 && <span className="text-red-500 ml-1">{ingestAllResult.failed} failed</span>}
                        </span>
                    )}
                    {ingestAllStatus === 'error' && <span className="text-[10px] text-red-500 font-semibold">✕ Selected ingest failed</span>}
                </div>
                <div className="text-[10px] text-gray-500 font-mono">selected: {selectedNamesForIngestAll.length}</div>
            </div>

            {/* Ingest All 확인 모달 */}
            {showIngestAllModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl shadow-2xl w-[420px] p-6 flex flex-col gap-5">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-gray-900 mb-1">전체 컬렉션 인제스트</h2>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    현재 체크된 <strong>{selectedNamesForIngestAll.length}개 컴포넌트</strong>만 ChromaDB에 인제스트합니다.<br />
                                    각 컴포넌트의 <strong>카탈로그(description), 코드(code), 샘플(samples)</strong> 3개 컬렉션이 업데이트됩니다.<br /><br />
                                    컴포넌트 수에 따라 시간이 오래 걸릴 수 있습니다. 계속하시겠습니까?
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowIngestAllModal(false)}
                                className="px-4 py-2 rounded text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleIngestAll}
                                className="px-4 py-2 rounded text-xs text-white bg-purple-600 hover:bg-purple-700 transition-colors font-medium"
                            >
                                확인 — 선택 항목 인제스트
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Form Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-white w-full">
                <div className="grid grid-cols-3 gap-8 w-full h-full">
                    {/* Column 1 */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex-1 flex flex-col">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Description (Ko)</label>
                            <textarea 
                                value={draft.descriptionKo} 
                                onChange={e => handleChange('descriptionKo', e.target.value)} 
                                className="flex-1 w-full border border-gray-300 rounded p-2 text-xs focus:ring-black focus:border-black outline-none resize-none bg-gray-50" 
                            />
                        </div>
                        <div className="flex-1 flex flex-col">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Description (En)</label>
                            <textarea 
                                value={draft.descriptionEn} 
                                onChange={e => handleChange('descriptionEn', e.target.value)} 
                                className="flex-1 w-full border border-gray-300 rounded p-2 text-xs focus:ring-black focus:border-black outline-none resize-none bg-gray-50" 
                            />
                        </div>
                    </div>
                    {/* Column 2 */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex-1 flex flex-col">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Visual Form</label>
                            <textarea 
                                value={draft.visualForm} 
                                onChange={e => handleChange('visualForm', e.target.value)} 
                                className="flex-1 w-full border border-gray-300 rounded p-2 text-xs focus:ring-black focus:border-black outline-none resize-none bg-gray-50" 
                            />
                        </div>
                        <div className="flex-1 flex flex-col">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Related Screens</label>
                            <textarea 
                                placeholder="Comma separated..." 
                                value={Array.isArray(draft.relatedScreens) ? draft.relatedScreens.join(', ') : (draft.relatedScreens || '')} 
                                onChange={e => handleChange('relatedScreens', e.target.value)} 
                                className="flex-1 w-full border border-gray-300 rounded p-2 text-xs focus:ring-black focus:border-black outline-none resize-none bg-gray-50"
                            />
                        </div>
                    </div>
                    {/* Column 3 */}
                    <div className="flex flex-col space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Keywords</label>
                            <input 
                                type="text" 
                                placeholder="Comma separated..." 
                                value={Array.isArray(draft.keywords) ? draft.keywords.join(', ') : (draft.keywords || '')} 
                                onChange={e => handleChange('keywords', e.target.value)} 
                                className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-black focus:border-black outline-none bg-gray-50"
                            />
                        </div>
                        <div className="flex-1 flex flex-col min-h-0">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Props (Auto-extracted)</label>
                            <div className="flex-1 overflow-y-auto p-2 bg-gray-50 border border-gray-200 rounded content-start flex flex-wrap gap-1.5">
                                {draft.props?.map(p => <span key={p} className="px-1.5 py-0.5 rounded bg-white text-gray-700 font-mono text-[10px] border border-gray-300">{p}</span>)}
                                {(!draft.props || draft.props.length === 0) && <span className="text-xs text-gray-400">No props</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Catalog Viewer ──────────────────────────────────────────────────────
export default function CatalogViewer() {
    const [search, setSearch] = useState('');
    const [selectedName, setSelectedName] = useState(null);
    const [liveProps, setLiveProps] = useState({});
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [collapsedCats, setCollapsedCats] = useState({});
    const [checkedForIngest, setCheckedForIngest] = useState(() => new Set(Object.keys(ComponentRegistry)));

    // Restore from localStorage after mount (avoids SSR/hydration mismatch).
    useEffect(() => {
        setCheckedForIngest(restoreCheckedFromStorage());
    }, []);

    // Persist selection whenever it changes.
    useEffect(() => {
        try {
            window.localStorage.setItem(
                INGEST_SELECTION_STORAGE_KEY,
                JSON.stringify(Array.from(checkedForIngest))
            );
        } catch {
            // Ignore storage write failures (private mode, quota, etc).
        }
    }, [checkedForIngest]);

    // Prep components list
    const componentList = useMemo(() =>
        Object.keys(ComponentRegistry).map(name => ({ 
            name, 
            topLevel: getTopLevel(name),
            category: getCategory(name) 
        })),
        []
    );

    // Filter by search
    const filtered = useMemo(() =>
        componentList.filter(c => 
            !search.trim() || c.name.toLowerCase().includes(search.toLowerCase())
        ),
        [componentList, search]
    );

    // Group logic: TopLevel -> Category
    const grouped = useMemo(() => {
        const topGroups = {};
        for(const tl of TOP_LEVELS) topGroups[tl] = {};

        for(const item of filtered) {
           const tl = item.topLevel;
           if(!topGroups[tl]) topGroups[tl] = {};
           if(!topGroups[tl][item.category]) topGroups[tl][item.category] = [];
           topGroups[tl][item.category].push(item);
        }

        return TOP_LEVELS.map(top => {
            const categories = Object.keys(topGroups[top]).sort().map(cat => ({
                cat,
                items: topGroups[top][cat]
            })).filter(g => g.items.length > 0);
            
            return { top, categories };
        }).filter(g => g.categories.length > 0);
    }, [filtered]);

    const isSearching = search.trim().length > 0;

    const toggleCat = (key) => setCollapsedCats(p => ({ ...p, [key]: !p[key] }));

    const handleToggleChecked = useCallback((name, checked) => {
        setCheckedForIngest((prev) => {
            const next = new Set(prev);
            if (checked) next.add(name);
            else next.delete(name);
            return next;
        });
    }, []);

    const handleSelect = useCallback((name) => {
        setSelectedName(name);
        const reg = ComponentRegistry[name];
        if (reg) setLiveProps({ ...reg.defaultProps });
        setSelectedVariant(null);
    }, []);

    const handleVariantChange = useCallback((variantId) => {
        setSelectedVariant(variantId);
        if (!selectedName) return;
        const reg = ComponentRegistry[selectedName];
        if (!reg) return;
        if (!variantId) { setLiveProps({ ...reg.defaultProps }); return; }
        const v = reg.variants?.find(v => v.id === variantId);
        if (v) setLiveProps({ ...reg.defaultProps, ...v.data });
    }, [selectedName]);

    const checkedNamesForIngestAll = useMemo(() => Object.keys(ComponentRegistry).filter((n) => checkedForIngest.has(n)), [checkedForIngest]);
    const totalComponentCount = componentList.length;
    const checkedCount = checkedNamesForIngestAll.length;
    const isAllChecked = checkedCount === totalComponentCount;

    const handleSelectAllChecked = useCallback(() => {
        setCheckedForIngest(new Set(Object.keys(ComponentRegistry)));
    }, []);

    const handleClearAllChecked = useCallback(() => {
        setCheckedForIngest(new Set());
    }, []);

    const emitCatalogToolbarAction = useCallback((action) => {
        window.dispatchEvent(new CustomEvent('catalog-toolbar-action', { detail: action }));
    }, []);

    const handleMarkedIngested = useCallback((name) => {
        setCheckedForIngest((prev) => {
            const next = new Set(prev);
            next.add(name);
            return next;
        });
    }, []);

    const handleMarkedDeleted = useCallback((name) => {
        setCheckedForIngest((prev) => {
            const next = new Set(prev);
            next.delete(name);
            return next;
        });
    }, []);



    // Prep component & safe props
    const selected = selectedName ? ComponentRegistry[selectedName] : null;
    const safeProps = useMemo(() => ({
        ...liveProps,
        onKey: () => {}, onClick: () => {}, onChange: () => {}, onSelect: () => {},
        onPress: () => {}, onClose: () => {}, onConfirm: () => {}, onCancel: () => {},
    }), [liveProps]);
    const SelectedComponent = selected?.Component;

    const defaultPropsKeys = useMemo(() => {
        if (!selectedName) return [];
        const reg = ComponentRegistry[selectedName];
        if (!reg || !reg.defaultProps) return [];
        const SKIP = new Set(['onKey', 'onClick', 'onClose', 'onChange', 'onSelect', 'onPress', 'onConfirm', 'onCancel', 'style', 'className', 'id']);
        return Object.keys(reg.defaultProps).filter(k => !SKIP.has(k));
    }, [selectedName]);

    return (
        <div className="h-screen overflow-hidden bg-white text-gray-900 flex flex-col" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <header className="h-12 px-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-3 flex-shrink-0">
                <div className="min-w-0">
                    <h1 className="text-[11px] font-black text-black tracking-[0.22em] uppercase">UI Widget Catalog</h1>
                    <p className="text-[10px] text-gray-500 font-mono">{componentList.length} components · {checkedCount} checked</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => emitCatalogToolbarAction('save')}
                        disabled={!selectedName}
                        className="text-[11px] px-2.5 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        title="현재 카탈로그 항목 JSON 저장"
                    >
                        Save Catalog
                    </button>
                    <button
                        onClick={() => emitCatalogToolbarAction('ingest-current')}
                        disabled={!selectedName}
                        className="text-[11px] px-2.5 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        title="현재 항목을 DB에 저장"
                    >
                        Save To DB
                    </button>
                    <button
                        onClick={() => emitCatalogToolbarAction('delete-current')}
                        disabled={!selectedName}
                        className="text-[11px] px-2.5 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        title="현재 항목을 DB에서 삭제"
                    >
                        Delete From DB
                    </button>
                    <button
                        onClick={() => emitCatalogToolbarAction('ingest-selected-all')}
                        disabled={checkedCount === 0}
                        className="text-[11px] px-2.5 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        title="체크한 모든 항목을 DB에 저장"
                    >
                        Save Checked To DB
                    </button>
                    <div className="shrink-0 flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 ml-1">
                        <Link href="/catalog" className="px-2 py-1 rounded text-[10px] font-semibold text-gray-800 bg-gray-100 border border-gray-200">Catalog</Link>
                        <Link href="/assets" className="px-2 py-1 rounded text-[10px] font-semibold text-gray-600 hover:bg-gray-100">Asset</Link>
                        <Link href="/explorer" className="px-2 py-1 rounded text-[10px] font-semibold text-gray-600 hover:bg-gray-100">DB</Link>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 min-h-0">

            {/* ═══════════════════════════════════════════════════════════
                LEFT PANEL  –  Tree View Browser
            ══════════════════════════════════════════════════════════════ */}
            <aside className="w-72 flex-shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col z-20">
                {/* App header */}
                <div className="px-5 py-3 border-b border-gray-200 bg-gray-100">
                    <p className="text-[10px] text-gray-600 font-mono">Widget Tree</p>
                </div>

                {/* Search */}
                <div className="p-3 border-b border-gray-200 bg-white">
                    <div className="relative">
                        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search components..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-7 pr-7 py-1.5 text-[11px] bg-gray-50 border border-gray-200 rounded focus:bg-white focus:outline-none focus:border-gray-400 transition-colors placeholder-gray-400 font-mono"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                        <p className="text-[10px] text-gray-500 font-mono">Checked {checkedCount}/{totalComponentCount}</p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleSelectAllChecked}
                                disabled={isAllChecked}
                                className="text-[10px] px-2 py-1 rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                title="전체 항목 체크"
                            >
                                Select All
                            </button>
                            <button
                                onClick={handleClearAllChecked}
                                disabled={checkedCount === 0}
                                className="text-[10px] px-2 py-1 rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                title="체크 전체 해제"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Component Tree */}
                <div className="flex-1 overflow-y-auto pl-1 pr-3 py-4 space-y-4">
                    {grouped.length === 0 ? (
                        <div className="text-center py-6 text-[11px] text-gray-400">No results found</div>
                    ) : grouped.map(({ top, categories }) => (
                        <div key={top} className="space-y-1">
                            <div className="px-4 py-1 flex items-center">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{top}</span>
                            </div>
                            <div className="pl-3 space-y-0.5">
                                {categories.map(({ cat, items }) => {
                                    const key = `${top}-${cat}`;
                                    const isOpen = isSearching || !collapsedCats[key];
                                    return (
                                        <div key={cat}>
                                            <button
                                                onClick={() => toggleCat(key)}
                                                className="flex items-center justify-between w-full text-left px-2 py-1.5 hover:bg-gray-200 rounded outline-none group"
                                            >
                                                <span className="text-[11px] font-bold text-gray-700 group-hover:text-black">{cat}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[9px] text-gray-400 font-mono">{items.length}</span>
                                                    <svg className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                                                </div>
                                            </button>
                                            {isOpen && (
                                                <div className="border-l-2 border-gray-200 ml-2 mt-0.5 mb-2 pl-2 space-y-px">
                                                    {items.map(({ name }) => (
                                                        <ListItem 
                                                            key={name} 
                                                            name={name} 
                                                            isSelected={name === selectedName} 
                                                            isChecked={checkedForIngest.has(name)}
                                                            onClick={() => handleSelect(name)}
                                                            onToggleCheck={handleToggleChecked}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* ═══════════════════════════════════════════════════════════
                RIGHT CONTENT WRAPPER  –  Preview/Props (Top) + Catalog (Bottom)
            ══════════════════════════════════════════════════════════════ */}
            <div className="flex-1 flex flex-col min-w-0 h-full">
                
                {/* ── TOP SECTION (Preview & Props) ── */}
                <div className="flex-1 flex overflow-hidden bg-gray-100">
                    
                    {/* Preview Area */}
                    <main className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-y-auto">
                        {!SelectedComponent ? (
                            <EmptyState />
                        ) : (
                            <>
                                <LCDFrame>
                                    <SelectedComponent {...safeProps} />
                                </LCDFrame>

                                {/* Controls bar (Variant only) */}
                                {selected?.variants && selected.variants.length > 1 && (
                                    <div className="flex items-center gap-3 mt-6 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Variant</span>
                                        <select
                                            value={selectedVariant || ''}
                                            onChange={e => handleVariantChange(e.target.value || null)}
                                            className="bg-transparent text-gray-900 text-xs font-mono outline-none cursor-pointer"
                                        >
                                            <option value="">Default</option>
                                            {selected.variants.map(v => (
                                                <option key={v.id} value={v.id}>{v.description}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </>
                        )}
                    </main>

                    {/* Props Editor Area */}
                    <aside 
                        className="w-80 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col shadow-sm"
                        onKeyDown={(e) => {
                              // 입력 필드(input, textarea) 내부에서의 키보드 이벤트는 상위로 전파하지 않음
                              if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(e.target.tagName)) {
                                  e.stopPropagation();
                              }
                        }}
                    >
                        <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                            <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Props Editor</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {!selectedName ? (
                                <div className="h-full flex items-center justify-center text-xs text-gray-400">
                                    No component selected
                                </div>
                            ) : (
                                <div
                                    onKeyDown={(e) => {
                                          if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(e.target.tagName)) {
                                            e.stopPropagation();
                                        }
                                    }}
                                >
                                    <PropsEditor
                                        key={selectedName}
                                        props={liveProps}
                                        defaultProps={selected?.defaultProps}
                                        onChange={setLiveProps}
                                    />
                                </div>
                            )}
                        </div>
                    </aside>
                </div>

                {/* ── BOTTOM SECTION (Catalog Editor) ── */}
                <div 
                    className="h-[320px] min-h-[250px] flex-shrink-0 relative z-10 w-full shadow-[0_-5px_15px_rgba(0,0,0,0.02)]"
                    onKeyDown={(e) => {
                        if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(e.target.tagName)) {
                            e.stopPropagation();
                        }
                    }}
                >
                    <CatalogEditor 
                        name={selectedName} 
                        defaultPropsKeys={defaultPropsKeys}
                        selectedNamesForIngestAll={checkedNamesForIngestAll}
                        onIngested={handleMarkedIngested}
                        onDeleted={handleMarkedDeleted}
                    />
                </div>
            </div>
            </div>
        </div>
    );
}
