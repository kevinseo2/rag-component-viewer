import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ITEM_HEIGHT = 68;
const PICKER_TOP_OFFSET = 36; // Title area
const PICKER_HEIGHT = 204;
const CENTER_OFFSET = (PICKER_HEIGHT - ITEM_HEIGHT) / 2; // 68px

const CM_PICKER_VerticalTitled = ({ title = "Title", items = [], onKey, isFocused = true, initialSelectedIndex = 0 }) => {
    const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);

    // Sync index when data changes (e.g. variant switch) or initialSelectedIndex changes
    useEffect(() => {
        setSelectedIndex(initialSelectedIndex);
    }, [items, initialSelectedIndex]);

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
        <div id="CM_PICKER_VerticalTitled-root" className="relative w-[320px] h-[240px] bg-black overflow-hidden">

            {/* Title Container */}
            <div id="title-container" className="absolute top-0 left-0 w-[320px] h-[36px] flex items-center justify-center z-30">
                <span id="screen-title" className="font-LG_Smart_UI_HA2023_SemiBold text-[30px] text-white text-center leading-none">
                    {title}
                </span>
            </div>

            {/* Dividers */}
            <div id="container-boarder-up" className="absolute left-[20px] top-[103px] w-[280px] h-[2px] bg-[#333333] rounded-full z-10" />
            <div id="container-boarder-down" className="absolute left-[20px] top-[171px] w-[280px] h-[2px] bg-[#333333] rounded-full z-10" />

            {/* Picker Area Wrapper */}
            <div id="picker-wrapper" className="absolute top-[36px] w-[320px] h-[204px] overflow-hidden">
                {/* Picker List */}
                <div
                    id="picker-list-container"
                    className="absolute w-full transition-transform duration-300 ease-out"
                    style={{ transform: `translateY(${CENTER_OFFSET - (selectedIndex * ITEM_HEIGHT)}px)` }}
                >
                    {items.map((item, index) => {
                        const isSmallFont = item.isSmallFont || false;
                        const fontSize = isSmallFont ? "text-[32px]" : "text-[40px]";

                        return (
                            <div
                                key={index}
                                id={`picker-item-${index}`}
                                className="flex items-center justify-center w-[320px]"
                                style={{ height: `${ITEM_HEIGHT}px` }}
                            >
                                <span className={`font-LG_Smart_UI_HA2023_SemiBold text-white text-center ${fontSize} leading-none`}>
                                    {item.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mask Overlay - Offset 5px from left per JSON */}
            <img
                id="image-overlay"
                src="/ui/images/mask_picker_02.png"
                alt="Mask"
                className="absolute top-0 left-[5px] w-[310px] h-[240px] pointer-events-none z-20"
            />
        </div>
    );
};

CM_PICKER_VerticalTitled.propTypes = {
    /** 상단 타이틀 */
    title: PropTypes.string,

    /** 
     * 피커 데이터 배열
     */
    items: PropTypes.arrayOf(PropTypes.shape({
        /** 항목 제목 */
        title: PropTypes.string,
        /** 
         * 작은 폰트 사용 여부
         * - true: 32px
         * - false: 40px (기본)
         */
        isSmallFont: PropTypes.bool
    })),

    /** 키보드 입력 처리 콜백 */
    onKey: PropTypes.func,

    /** 키보드 입력 활성화 */
    isFocused: PropTypes.bool
};

export default CM_PICKER_VerticalTitled;

