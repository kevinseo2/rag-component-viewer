'use client';

import React, { useState, useCallback, useEffect } from 'react';

// ─── Type Inference ───────────────────────────────────────────────────────────
function inferType(name) {
    const n = name.toLowerCase();
    if (n.startsWith('on') || n === 'ref') return 'function';
    if (['style', 'classname', 'id'].includes(n)) return 'hidden';
    const boolPrefixes = ['is', 'has', 'show', 'hide', 'enable', 'disable', 'can'];
    if (boolPrefixes.some(p => n.startsWith(p)) || ['focused', 'checked', 'loop', 'autoplay', 'selected', 'active', 'visible'].includes(n)) return 'boolean';
    const numExact = ['percent', 'count', 'value', 'index', 'hour', 'min', 'sec', 'step', 'speed', 'framerate', 'progress', 'duration', 'height', 'width', 'gap', 'size', 'scale', 'max', 'pct', 'temp', 'weight', 'unit', 'rack', 'accessory', 'steam', 'initialpage', 'currentpage', 'initialindex', 'initialampm'];
    if (numExact.includes(n) || n.endsWith('count') || n.endsWith('index') || n.endsWith('pct') || n.endsWith('percent') || n.endsWith('hour') || n.endsWith('min') || n.endsWith('sec')) return 'number';
    const jsonKeys = ['data', 'items', 'listdata', 'courses', 'modes', 'options', 'frames', 'slots', 'dataset', 'playlist', 'list'];
    if (jsonKeys.includes(n) || n.endsWith('data') || n.endsWith('list') || n.endsWith('items') || n.endsWith('arr') || n.endsWith('info')) return 'json';
    return 'text';
}

function formatLabel(name) {
    return name.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();
}

// ─── Single Prop Row ──────────────────────────────────────────────────────────
function PropRow({ name, value, defaultValue, onChange }) {
    const type = inferType(name);
    const [jsonText, setJsonText] = useState(() => {
        if (type === 'json') {
            try { return JSON.stringify(value, null, 2); } catch { return String(value); }
        }
        return '';
    });
    const [jsonError, setJsonError] = useState(null);

    if (type === 'function' || type === 'hidden') return null;

    const isDirty = JSON.stringify(value) !== JSON.stringify(defaultValue);
    const label = formatLabel(name);

    const handleReset = () => {
        onChange(defaultValue);
        if (type === 'json') {
            setJsonText(JSON.stringify(defaultValue, null, 2));
            setJsonError(null);
        }
    };

    return (
        <div className={`px-3 py-2.5 border-b border-gray-100 ${isDirty ? 'bg-amber-50' : ''}`}>
            <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">{name}</span>
                    {isDirty && <span className="text-[9px] bg-amber-200 text-amber-900 px-1 py-0.5 rounded font-semibold">modified</span>}
                </div>
                {isDirty && (
                    <button onClick={handleReset} className="text-xs text-gray-400 hover:text-gray-700 px-1" title="Reset to default">↺</button>
                )}
            </div>

            {type === 'boolean' && (
                <label className="flex items-center gap-2 cursor-pointer">
                    <div
                        onClick={() => onChange(!value)}
                        className={`w-8 h-4 rounded-full transition-colors cursor-pointer relative ${value ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                        <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${value ? 'left-4' : 'left-0.5'}`} />
                    </div>
                    <span className={`text-xs font-mono ${value ? 'text-blue-600' : 'text-gray-400'}`}>{String(value)}</span>
                </label>
            )}

            {type === 'number' && (
                <div className="flex items-center gap-1">
                    <button onClick={() => onChange((Number(value) || 0) - 1)} className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-600 flex items-center justify-center">−</button>
                    <input
                        type="number"
                        value={value ?? 0}
                        onChange={e => onChange(Number(e.target.value))}
                        className="flex-1 text-xs px-2 py-1 border border-gray-200 rounded bg-white text-gray-800 text-center font-mono"
                    />
                    <button onClick={() => onChange((Number(value) || 0) + 1)} className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-600 flex items-center justify-center">+</button>
                </div>
            )}

            {type === 'text' && (
                <input
                    type="text"
                    value={value ?? ''}
                    onChange={e => onChange(e.target.value)}
                    className="w-full text-xs px-2 py-1 border border-gray-200 rounded bg-white text-gray-800 font-mono focus:outline-none focus:border-blue-400"
                />
            )}

            {type === 'json' && (
                <div>
                    <textarea
                        value={jsonText}
                        onChange={e => {
                            setJsonText(e.target.value);
                            try {
                                const parsed = JSON.parse(e.target.value);
                                setJsonError(null);
                                onChange(parsed);
                            } catch (err) {
                                setJsonError(err.message);
                            }
                        }}
                        rows={Math.min(10, jsonText.split('\n').length + 1)}
                        className={`w-full text-[11px] px-2 py-1 border rounded bg-white font-mono resize-y focus:outline-none ${jsonError ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-blue-400'}`}
                    />
                    {jsonError && <p className="text-[10px] text-red-500 mt-0.5 font-mono">{jsonError}</p>}
                </div>
            )}
        </div>
    );
}

// ─── Props Editor ─────────────────────────────────────────────────────────────
export default function PropsEditor({ props, defaultProps, onChange }) {
    const handleChange = useCallback((name, value) => {
        onChange({ ...props, [name]: value });
    }, [props, onChange]);

    const handleResetAll = useCallback(() => {
        onChange({ ...defaultProps });
    }, [defaultProps, onChange]);

    const SKIP = new Set(['onKey', 'onClick', 'onClose', 'onChange', 'onSelect', 'onPress', 'onConfirm', 'onCancel', 'style', 'className', 'id']);

    const propNames = Object.keys(props).filter(n => {
        if (SKIP.has(n)) return false;
        const t = inferType(n);
        return t !== 'function' && t !== 'hidden';
    });

    if (propNames.length === 0) {
        return <div className="p-4 text-xs text-gray-400 text-center mt-4">No editable props</div>;
    }

    const hasDirty = propNames.some(n => JSON.stringify(props[n]) !== JSON.stringify(defaultProps?.[n]));

    return (
        <div>
            {hasDirty && (
                <div className="px-3 py-2 border-b border-gray-100 flex justify-end bg-amber-50">
                    <button
                        onClick={handleResetAll}
                        className="text-xs text-gray-600 hover:text-gray-900 border border-gray-300 bg-white px-2.5 py-0.5 rounded hover:bg-gray-50"
                    >
                        Reset all
                    </button>
                </div>
            )}
            {propNames.map(name => (
                <PropRow
                    key={name}
                    name={name}
                    value={props[name]}
                    defaultValue={defaultProps?.[name]}
                    onChange={value => handleChange(name, value)}
                />
            ))}
        </div>
    );
}
