import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const ITEM_HEIGHT = 94;
const VIEWPORT_HEIGHT = 240;
const CENTER_OFFSET = (VIEWPORT_HEIGHT - ITEM_HEIGHT) / 2; // 73px

const CM_PICKER_VerticalValue = ({ items = [], onKey, isFocused = true, initialSelectedIndex = 0 }) => {
    const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);

    // Sync index when data changes (e.g. variant switch) or initialSelectedIndex changes
    useEffect(() => {
        setSelectedIndex(initialSelectedIndex);
    }, [items, initialSelectedIndex]);

    const [displayValue, setDisplayValue] = useState("");
    const [isFadingOut, setIsFadingOut] = useState(false);

    // Animation Logic for Value Label
    useEffect(() => {
        if (items.length === 0) return;

        // Start Fade Out
        setIsFadingOut(true);

        const timer = setTimeout(() => {
            // Update Text and Start Fade In
            if (items[selectedIndex]) {
                setDisplayValue(items[selectedIndex].value || "");
            }
            setIsFadingOut(false);
        }, 150); // Small delay to simulate transition

        return () => clearTimeout(timer);
    }, [selectedIndex, items]);

    useEffect(() => {
        if (!isFocused) return;
        const handleKeyDown = (e) => {
            let handled = false;
            if ((e.key === 'ArrowUp') || (e.key === 'ArrowLeft')) {
                setSelectedIndex((prev) => Math.max(0, prev - 1));
                handled = true;
            } else if ((e.key === 'ArrowDown') || (e.key === 'ArrowRight')) {
                setSelectedIndex((prev) => Math.min(items.length - 1, prev + 1));
                handled = true;
            } else if (e.key === 'Enter') {
                onKey?.('OK', { index: selectedIndex, item: items[selectedIndex] });
                handled = true;
            } else if (e.key === 'Backspace' || e.key === 'Escape') {
                onKey?.('BACK');
                handled = true;
            }

            if (handled) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, items.length, selectedIndex, onKey]);

    return (
        <div id="CM_PICKER_VerticalValue-root" className="relative w-[320px] h-[240px] bg-black overflow-hidden">
            {/* Dividers */}
            <div id="upper_divider" className="absolute left-[20px] top-[72px] w-[280px] h-[2px] bg-[#333333] z-10" />
            <div id="lower_divider" className="absolute left-[20px] top-[168px] w-[280px] h-[2px] bg-[#333333] z-10" />

            {/* Fixed Value Label - Centered but below dividers */}
            <div
                id="value_label"
                className={`absolute top-[128px] w-[320px] flex justify-center items-center z-10 transition-opacity duration-150 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
            >
                <span className="font-LG_Smart_UI_HA2023_Regular text-[30px] text-white text-center leading-none">
                    {displayValue}
                </span>
            </div>

            {/* Picker List */}
            <div
                id="picker-list-container"
                className="absolute w-full h-full transition-transform duration-300 ease-out z-0"
                style={{ transform: `translateY(${CENTER_OFFSET - (selectedIndex * ITEM_HEIGHT)}px)` }}
            >
                {items.map((item, index) => {
                    // Visual Curve Logic: +9px for Previous, -10px for Next
                    let translateY = 0;
                    if (index === selectedIndex - 1) translateY = 9;
                    if (index === selectedIndex + 1) translateY = -10;
                    if (index === selectedIndex) translateY = -19; // Center Item Offset from JSON

                    return (
                        <div
                            key={index}
                            id={`picker-item-${index}`}
                            className="flex items-center justify-center w-[320px]"
                            style={{ height: `${ITEM_HEIGHT}px` }}
                        >
                            <div
                                className="transition-transform duration-300 ease-out"
                                style={{ transform: `translateY(${translateY}px)` }}
                            >
                                <span className="font-LG_Smart_UI_HA2023_SemiBold text-[36px] text-white text-center leading-none">
                                    {item.title}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mask Overlay */}
            <img
                id="image-overlay"
                src="/ui/images/mask_vertical_list_depth_first.png"
                alt="Mask"
                className="absolute top-0 left-0 w-[320px] h-[240px] pointer-events-none z-20"
            />
        </div>
    );
};

CM_PICKER_VerticalValue.propTypes = {
    /** 
     * 피커 데이터 배열
     * - title: 메인 표시 텍스트
     * - value: 선택 시 하단에 페이드 인/아웃되는 부가 정보
     */
    items: PropTypes.arrayOf(PropTypes.shape({
        /** 항목 제목 (36px) */
        title: PropTypes.string,
        /** 항목 값 (30px, 하단 표시) */
        value: PropTypes.string
    })),

    /** 키보드 입력 처리 콜백 */
    onKey: PropTypes.func,

    /** 키보드 입력 활성화 */
    isFocused: PropTypes.bool
};

export default CM_PICKER_VerticalValue;

