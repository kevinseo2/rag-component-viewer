import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import CM_TITLE_WithArrow from './CM_TITLE_WithArrow';

/**
 * CM_LIST_SingleSelect Widget
 *
 * Vertical list with single selection (radio-style) items:
 * - Selection icon (blue checkmark) shown for selected item
 * - Label text
 *
 * @param {Object} props
 * @param {string} props.id - Component ID
 * @param {string} props.title - Title text
 * @param {boolean} props.showBackArrow - Back arrow visibility
 * @param {Array} props.listData - List items array
 * @param {string} props.listData[].label - Item label text
 * @param {boolean} props.listData[].selected - Whether this item is selected (shows icon)
 * @param {boolean} props.listData[].disabled - Whether this item is disabled (gray text, not selectable)
 * @param {number} props.initialFocusIndex - Initial focused index
 * @param {boolean} props.isFocused - Whether this widget is focused
 * @param {function} props.onKey - Key event handler (actionName, payload)
 */
const CM_LIST_SingleSelect = ({
    id = 'CM_LIST_SingleSelect',
    title = 'Title',
    showBackArrow = true,
    listData = [],
    initialFocusIndex = 0,
    isFocused = true,
    onKey = null,
}) => {
    const [focusIndex, setFocusIndex] = useState(initialFocusIndex);
    // Find initial selected item from listData
    const initialSelected = listData.findIndex(item => item.selected);
    const [internalSelectedIndex, setInternalSelectedIndex] = useState(initialSelected !== -1 ? initialSelected : -1);
    const [scrollOffset, setScrollOffset] = useState(0);
    const listRef = useRef(null);

    const ITEM_HEIGHT = 68;
    const VIEWPORT_HEIGHT = 190;
    const VISIBLE_ITEMS = Math.floor(VIEWPORT_HEIGHT / ITEM_HEIGHT);

    // Sync internal select state if listData changes (e.g. from screen)
    useEffect(() => {
        const idx = listData.findIndex(item => item.selected);
        if (idx !== -1) setInternalSelectedIndex(idx);
    }, [listData]);

    // Handle scroll to keep focused item visible
    const updateScroll = useCallback((newFocusIndex) => {
        const maxScrollIndex = Math.max(0, listData.length - VISIBLE_ITEMS);

        if (newFocusIndex < scrollOffset) {
            setScrollOffset(newFocusIndex);
        } else if (newFocusIndex >= scrollOffset + VISIBLE_ITEMS) {
            setScrollOffset(Math.min(newFocusIndex - VISIBLE_ITEMS + 1, maxScrollIndex));
        }
    }, [scrollOffset, listData.length, VISIBLE_ITEMS]);

    // Handle keyboard events
    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    if (focusIndex > 0) {
                        const newIndex = focusIndex - 1;
                        setFocusIndex(newIndex);
                        updateScroll(newIndex);
                        onKey?.('FOCUS_CHANGE', { index: newIndex, item: listData[newIndex] });
                    }
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    if (focusIndex < listData.length - 1) {
                        const newIndex = focusIndex + 1;
                        setFocusIndex(newIndex);
                        updateScroll(newIndex);
                        onKey?.('FOCUS_CHANGE', { index: newIndex, item: listData[newIndex] });
                    }
                    break;
                case 'Enter':
                    e.preventDefault();
                    const currentItem = listData[focusIndex];
                    if (currentItem && !currentItem.disabled) {
                        // Update internal selection state
                        setInternalSelectedIndex(focusIndex);
                        // Notify parent of selection
                        onKey?.('SELECT', { index: focusIndex, item: currentItem });
                    }
                    break;
                case 'Escape':
                case 'Backspace':
                    e.preventDefault();
                    onKey?.('BACK', null);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, focusIndex, listData, onKey, updateScroll]);

    // Calculate transform for scrolling
    const scrollTransform = `translateY(-${scrollOffset * ITEM_HEIGHT}px)`;

    return (
        <div id={id} className="w-[320px] h-[240px] bg-black relative overflow-hidden">
            {/* Title Bar */}
            <CM_TITLE_WithArrow
                title={title}
                showBackArrow={showBackArrow}
                onBack={() => onKey?.('BACK', null)}
            />

            {/* List Area */}
            <div
                id={`${id}-list-wrapper`}
                className="absolute top-[50px] left-0 w-[320px] h-[190px] overflow-hidden"
            >
                <div
                    ref={listRef}
                    id={`${id}-list-container`}
                    className="relative transition-transform duration-200"
                    style={{ transform: scrollTransform }}
                >
                    {listData.map((item, index) => {
                        const isFocusedItem = index === focusIndex && isFocused;
                        const showIcon = index === internalSelectedIndex && !item.disabled;

                        return (
                            <div
                                key={index}
                                id={`${id}-item-${index}`}
                                className={`flex items-center px-[20px] w-[320px] h-[68px] relative ${isFocusedItem ? 'bg-[#1a1a1a]' : 'bg-transparent'}`}
                                data-testid={`list-item-${index}`}
                            >
                                {/* Selection Icon (placeholder keeps spacing when not shown) */}
                                <div className="w-[32px] h-[32px] shrink-0 mr-[12px]">
                                    {showIcon && (
                                        <img
                                            id={`${id}-item-${index}-icon`}
                                            src="/ui/images/ic_vertical_list_single_selection_blue.png"
                                            alt=""
                                            className="w-[32px] h-[32px]"
                                        />
                                    )}
                                </div>

                                {/* Item Label */}
                                <span
                                    id={`${id}-item-${index}-label`}
                                    className={`flex-1 min-w-0 text-[30px] font-semibold truncate leading-[36px] ${item.disabled ? 'text-[#8C8C8C]' : 'text-white'}`}
                                    style={{ fontFamily: 'LG_Smart_UI_HA2023_SemiBold' }}
                                >
                                    {item.label}
                                </span>

                                {/* Separator Line */}
                                <div
                                    id={`${id}-item-${index}-separator`}
                                    className="absolute bottom-0 left-[20px] w-[280px] h-[2px] bg-[#333333]"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

CM_LIST_SingleSelect.propTypes = {
    /** 컴포넌트 ID */
    id: PropTypes.string,

    /** 상단 타이틀 */
    title: PropTypes.string,

    /** 뒤로가기 화살표 표시 */
    showBackArrow: PropTypes.bool,

    /** 
     * 단일 선택 리스트 데이터
     */
    listData: PropTypes.arrayOf(PropTypes.shape({
        /** 항목 라벨 (필수) */
        label: PropTypes.string.isRequired,
        /** 선택 상태 (파란 체크 아이콘 표시) */
        selected: PropTypes.bool,
        /** 비활성화 상태 (회색 텍스트) */
        disabled: PropTypes.bool
    })),

    /** 초기 포커스 인덱스 */
    initialFocusIndex: PropTypes.number,

    /** 키보드 입력 활성화 */
    isFocused: PropTypes.bool,

    /** 
     * 키보드 입력 처리 콜백
     * - 'SELECT': Enter 키
     * - 'BACK': Escape/Backspace
     * - 'FOCUS_CHANGE': 포커스 변경
     */
    onKey: PropTypes.func
};

export default CM_LIST_SingleSelect;


