import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import CM_TITLE_Bar from './CM_TITLE_Bar';

/**
 * CM_PICKER_HorizontalSel - Unified Horizontal List Picker Widget
 */
const CM_PICKER_HorizontalSel = ({
    id = "CM_PICKER_HorizontalSel",
    showCheckbox = false, // Changed from variant
    title = "",
    items = [],
    currentIndex = 0,
    isFocused = true,
    onKey = null
}) => {
    const [selectedIndex, setSelectedIndex] = useState(currentIndex);
    const [listItems, setListItems] = useState(items);

    const ITEM_WIDTH = 118;
    const GAP = 40;
    const VIEWPORT_WIDTH = 320;
    const VIEWPORT_CENTER = VIEWPORT_WIDTH / 2;

    // Sync state with props
    useEffect(() => {
        setListItems(items);
    }, [items]);

    useEffect(() => {
        setSelectedIndex(currentIndex);
    }, [currentIndex]);

    const handleAction = useCallback((action) => {
        if (action === 'LEFT') {
            if (selectedIndex > 0) {
                const newIndex = selectedIndex - 1;
                setSelectedIndex(newIndex);
                onKey?.('LEFT', { index: newIndex, item: listItems[newIndex] });
            }
        } else if (action === 'RIGHT') {
            if (selectedIndex < listItems.length - 1) {
                const newIndex = selectedIndex + 1;
                setSelectedIndex(newIndex);
                onKey?.('RIGHT', { index: newIndex, item: listItems[newIndex] });
            }
        } else if (action === 'OK') {
            if (showCheckbox) {
                // Multi selection mode (checkbox)
                if (!listItems[selectedIndex]?.disabled) {
                    const newItems = listItems.map((item, i) =>
                        i === selectedIndex ? { ...item, checked: !item.checked } : item
                    );
                    setListItems(newItems);
                    onKey?.('TOGGLE', { index: selectedIndex, item: newItems[selectedIndex], allItems: newItems });
                }
            } else {
                // Single selection mode
                onKey?.('OK', { index: selectedIndex, item: listItems[selectedIndex] });
            }
        } else if (action === 'BACK') {
            onKey?.('BACK');
        }
    }, [isFocused, selectedIndex, listItems, onKey, showCheckbox]);

    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            let handled = false;
            if (e.key === 'ArrowLeft') {
                handleAction('LEFT');
                handled = true;
            } else if (e.key === 'ArrowRight') {
                handleAction('RIGHT');
                handled = true;
            } else if (e.key === 'Enter') {
                handleAction('OK');
                handled = true;
            } else if (e.key === 'Escape' || e.key === 'Backspace') {
                handleAction('BACK');
                handled = true;
            }

            if (handled) e.preventDefault();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, handleAction]);

    // Calculate scroll offset to center current focused item
    const offset = selectedIndex * (ITEM_WIDTH + GAP) - VIEWPORT_CENTER + (ITEM_WIDTH / 2);
    const scrollTransform = `translateX(${-offset}px)`;

    // Checkbox variant has 3px left offset
    const containerLeft = showCheckbox ? 'left-[3px]' : 'left-0';

    return (
        <div id={id} className={`absolute top-0 left-0 w-[320px] h-[240px] bg-transparent`}>
            {/* Title Widget */}
            {title && (
                <CM_TITLE_Bar
                    id={`${id}-title`}
                    title={title}
                />
            )}

            {/* Picker Container */}
            <div id={`${id}-picker`} className={`absolute top-[36px] ${containerLeft} w-[320px] h-[168px] overflow-hidden bg-transparent`}>
                {/* Scrollable Container */}
                <div
                    id={`${id}-scroll-container`}
                    className="flex items-center h-full transition-transform duration-300 ease-out"
                    style={{
                        transform: scrollTransform,
                        gap: `${GAP}px`
                    }}
                >
                    {listItems.map((item, i) => (
                        <div
                            key={`${id}-item-${i}`}
                            id={`${id}-item-${i}`}
                            className="flex-shrink-0 flex items-center justify-center h-full relative"
                            style={{ width: `${ITEM_WIDTH}px` }}
                        >
                            {/* Checkbox Icon */}
                            {showCheckbox && (
                                <img
                                    id={`${id}-item-${i}-checkbox`}
                                    src={item.checked ? "/ui/images/btn_check_on_blue_n.png" : "/ui/images/btn_check_off_blue_n.png"}
                                    className="w-[30px] h-[30px] absolute top-[17px]"
                                    alt={item.checked ? "checked" : "unchecked"}
                                    style={{ opacity: i === selectedIndex ? 1 : 0.6 }}
                                />
                            )}

                            {/* Item Label */}
                            <span
                                id={`${id}-item-${i}-label`}
                                className={`text-[49px] font-semibold text-center transition-colors leading-[1.1] truncate max-w-[150px] flex-shrink-0 ${item.disabled ? 'text-[#8C8C8C]' : 'text-white'
                                    }`}
                                style={{
                                    fontFamily: 'LG Smart UI HA2023 SemiBold, sans-serif'
                                }}
                            >
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Gradient Masks */}
                <img
                    id={`${id}-mask-left`}
                    src="/ui/images/mask_selection_list_left.png"
                    className="absolute left-0 top-0 w-[86px] h-[168px] pointer-events-none"
                    alt=""
                />
                <img
                    id={`${id}-mask-right`}
                    src="/ui/images/mask_selection_list_right.png"
                    className="absolute left-[234px] top-0 w-[86px] h-[168px] pointer-events-none"
                    alt=""
                />
            </div>
        </div>
    );
};

CM_PICKER_HorizontalSel.propTypes = {
    /** 컴포넌트 ID */
    id: PropTypes.string,

    /** 
     * 체크박스 표시 여부
     * - true: 멀티 선택 모드 (체크박스 표시)
     * - false: 단일 선택 모드
     */
    showCheckbox: PropTypes.bool,

    /** 상단 타이틀 */
    title: PropTypes.string,

    /** 
     * 가로 리스트 데이터
     */
    items: PropTypes.arrayOf(PropTypes.shape({
        /** 항목 라벨 (필수) */
        label: PropTypes.string.isRequired,
        /** 체크 상태 (멀티 선택 모드용) */
        checked: PropTypes.bool,
        /** 비활성화 상태 */
        disabled: PropTypes.bool
    })),

    /** 현재 선택 인덱스 */
    currentIndex: PropTypes.number,

    /** 키보드 입력 활성화 */
    isFocused: PropTypes.bool,

    /** 키보드 입력 처리 콜백 */
    onKey: PropTypes.func
};

export default CM_PICKER_HorizontalSel;

