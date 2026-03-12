import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import CM_PICKER_Vertical1stItem from './CM_PICKER_Vertical1stItem';
import CM_LABEL_Formatted from './CM_LABEL_Formatted';

/**
 * CM_PICKER_Vertical1st Widget Component
 * Source: lv_Vertical_List_1st_Depth.c
 *
 * Features from C code:
 * - Infinite scroll picker with 3 visible items (TOP, MID, LOW)
 * - Value fade animation on selection change (100ms fadeout, 167ms fadein)
 * - Title visibility toggle based on selection index
 * - Picker mask image for gradient effect
 *
 * Keyboard handling:
 * - ArrowUp/ArrowDown: Internal navigation (handled by widget)
 * - Enter: Calls onKey('OK', { index, item })
 * - Escape: Calls onKey('BACK')
 */
const CM_PICKER_Vertical1st = ({
    id = "Vertical_List_1st_Depth",
    items = [],
    titleText = "",
    titleShowAlways = false,
    initialIndex = 0,
    isFocused = true,
    onKey
} = {}) => {
    const [selectedIndex, setSelectedIndex] = useState(initialIndex);
    const [valueOpacity, setValueOpacity] = useState(1);
    const [titleVisible, setTitleVisible] = useState(true);

    const getWrappedIndex = useCallback((idx, length) => {
        if (length === 0) return 0;
        return ((idx % length) + length) % length;
    }, []);

    const count = items.length;
    const currentItem = items[getWrappedIndex(selectedIndex, count)] || {};

    // Sync internal state with initialIndex prop when it changes (e.g., test variant switch)
    useEffect(() => {
        setSelectedIndex(initialIndex);
    }, [initialIndex]);

    // Update title visibility based on C code logic
    // Title shows only at index 0 unless titleShowAlways is true
    // C Logic: if (_d->list_info->title_show_always || lv_picker_get_selected(_d->picker) == 0) -> SHOW
    useEffect(() => {
        if (titleShowAlways || selectedIndex === 0) {
            setTitleVisible(true);
        } else {
            setTitleVisible(false);
        }
    }, [selectedIndex, titleShowAlways]);

    // Keyboard Handler
    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            if (count === 0) return;

            if ((e.key === 'ArrowUp') || (e.key === 'ArrowLeft')) {
                e.preventDefault();
                // Trigger fade animation from C code
                setValueOpacity(0);
                setTimeout(() => {
                    setSelectedIndex(prev => getWrappedIndex(prev - 1, count));
                    setTimeout(() => setValueOpacity(1), 66); // delay from C code
                }, 100); // fadeout time from C code
            } else if ((e.key === 'ArrowDown') || (e.key === 'ArrowRight')) {
                e.preventDefault();
                setValueOpacity(0);
                setTimeout(() => {
                    setSelectedIndex(prev => getWrappedIndex(prev + 1, count));
                    setTimeout(() => setValueOpacity(1), 66);
                }, 100);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                onKey?.('OK', { index: selectedIndex, item: currentItem });
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onKey?.('BACK');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, count, getWrappedIndex, selectedIndex, currentItem, onKey]);

    // Indices for view: Prev, Curr, Next
    const prevIndex = getWrappedIndex(selectedIndex - 1, count);
    const nextIndex = getWrappedIndex(selectedIndex + 1, count);

    // Determine value text color based on item state
    const getValueColor = () => {
        if (!currentItem.enabled) return '#8c8c8c'; // disabled
        if (currentItem.valueIsGuide) return '#cdcdcd'; // guide text
        return '#FFFFFF'; // normal
    };

    return (
        <div
            id={id}
            className="relative w-[310px] h-[240px] bg-black overflow-hidden"
        >
            {/* Title - CM_TITLE_Bar from C code */}
            {titleText && (
                <div
                    id={`${id}-CM_TITLE_Bar`}
                    className="absolute top-0 left-0 w-[310px] h-[36px] flex items-center justify-center z-20 transition-opacity duration-300"
                    style={{ opacity: titleVisible ? 1 : 0 }}
                >
                    <span id={`${id}-CM_TITLE_Bar-text`} className="text-white text-[30px]">
                        {titleText}
                    </span>
                </div>
            )}

            {/* Picker Items Container */}
            <div id={`${id}-picker`} className="absolute top-0 left-0 w-full h-full">
                {/* Render Top Item - Only if not wrapped (Visually Finite) */}
                {selectedIndex > 0 && (
                    <div
                        id={`${id}-slot-top`}
                        className="absolute top-[-24px] left-[5px] transition-opacity duration-300"
                        style={{ opacity: titleVisible ? 0 : 1 }}
                    >
                        <CM_PICKER_Vertical1stItem
                            id={`${id}-item-top`}
                            text={items[prevIndex]?.text || ''}
                            value={items[prevIndex]?.value || ''}
                            enabled={items[prevIndex]?.enabled !== false}
                            position="TOP"
                        />
                    </div>
                )}

                {/* Render Mid Item (Selected) - selectedIndex */}
                {count > 0 && (
                    <div id={`${id}-slot-mid`} className="absolute top-[71px] left-[5px]">
                        <CM_PICKER_Vertical1stItem
                            id={`${id}-item-mid`}
                            text={items[selectedIndex]?.text || ''}
                            value={items[selectedIndex]?.value || ''}
                            enabled={items[selectedIndex]?.enabled !== false}
                            position="MID"
                        />
                    </div>
                )}

                {/* Render Low Item - Only if not wrapped (Visually Finite) */}
                {selectedIndex < count - 1 && (
                    <div id={`${id}-slot-low`} className="absolute top-[167px] left-[5px]">
                        <CM_PICKER_Vertical1stItem
                            id={`${id}-item-low`}
                            text={items[nextIndex]?.text || ''}
                            value={items[nextIndex]?.value || ''}
                            enabled={items[nextIndex]?.enabled !== false}
                            position="LOW"
                        />
                    </div>
                )}
            </div>

            {/* Dividers - from JSON layout */}
            <div
                id={`${id}-divider_upper`}
                className="absolute top-[71px] left-1/2 -translate-x-1/2 w-[270px] h-[2px] bg-[#333333]"
            />
            <div
                id={`${id}-divider_lower`}
                className="absolute top-[167px] left-1/2 -translate-x-1/2 w-[270px] h-[2px] bg-[#333333]"
            />

            {/* Value Label - next_fmtlabel_value from C code */}
            <div
                id={`${id}-next_fmtlabel_value-container`}
                className="absolute top-[125px] w-full flex justify-center pointer-events-none transition-opacity duration-[167ms]"
                style={{ opacity: currentItem.value ? valueOpacity : 0 }}
            >
                <CM_LABEL_Formatted
                    key={currentItem.value}
                    id={`${id}-next_fmtlabel_value`}
                    format={currentItem.value || ""}
                    align="center"
                    maxArea={{ width: 300, height: 34 }}
                    style={{
                        color: getValueColor(),
                        fontSize: '30px',
                    }}
                />
            </div>

            {/* Mask Overlay - picker_mask from C code */}
            <div
                id={`${id}-picker_mask`}
                className="absolute inset-0 pointer-events-none z-10"
            >
                <img
                    id={`${id}-picker_mask-img`}
                    src={titleVisible
                        ? "/ui/images/washer_dryer/Mask/mask_picker_01.png"
                        : "/ui/images/washer_dryer/Mask/mask_picker_03.png"}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
            </div>
        </div>
    );
};

CM_PICKER_Vertical1st.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 리스트 아이템 배열 */
    items: PropTypes.arrayOf(PropTypes.shape({
        /** 왼쪽 메인 텍스트 */
        text: PropTypes.string,
        /** 오른쪽 상세 값 텍스트 */
        value: PropTypes.string,
        /** 활성화 여부 (비활성 시 회색 처리) */
        enabled: PropTypes.bool,
        /** 값 텍스트가 가이드 문구인지 여부 (스타일 다름) */
        valueIsGuide: PropTypes.bool
    })),
    /** 상단 타이틀 텍스트 */
    titleText: PropTypes.string,
    /** 타이틀을 항상 표시할지 여부 */
    titleShowAlways: PropTypes.bool,
    /** 초기 선택 인덱스 */
    initialIndex: PropTypes.number,
    /** 현재 포커스 상태 여부 */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 */
    onKey: PropTypes.func
};

export default CM_PICKER_Vertical1st;

