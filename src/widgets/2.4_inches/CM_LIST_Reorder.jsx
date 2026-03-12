import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import CM_TITLE_WithArrow from './CM_TITLE_WithArrow';

/**
 * CM_LIST_Reorder Widget
 *
 * Vertical list with reorder functionality:
 * - Label text on the left
 * - Drag handle icon on the right
 * - Supports reorder mode for moving items
 *
 * @param {Object} props
 * @param {string} props.id - Component ID
 * @param {string} props.title - Title text
 * @param {boolean} props.showBackArrow - Back arrow visibility
 * @param {Array} props.listData - List items with label and image
 * @param {number} props.initialFocusIndex - Initial focused index
 * @param {boolean} props.isFocused - Whether this widget is focused
 * @param {function} props.onKey - Key event handler (actionName, payload)
 */
const CM_LIST_Reorder = ({
    id = 'CM_LIST_Reorder',
    title = 'Title',
    showBackArrow = true,
    listData = [],
    initialFocusIndex = 0,
    isFocused = true,
    onKey = null,
}) => {
    const [internalItems, setInternalItems] = useState(listData);
    const [focusIndex, setFocusIndex] = useState(initialFocusIndex);
    const [scrollOffset, setScrollOffset] = useState(0);
    const [reorderMode, setReorderMode] = useState(false);
    const [reorderingIndex, setReorderingIndex] = useState(-1);
    const listRef = useRef(null);

    const ITEM_HEIGHT = 68;
    const VIEWPORT_HEIGHT = 190;
    const VISIBLE_ITEMS = Math.floor(VIEWPORT_HEIGHT / ITEM_HEIGHT);

    // Sync internal items if listData changes from outside (e.g. screen props)
    useEffect(() => {
        setInternalItems(listData);
    }, [listData]);

    const handleMoveItemInternal = useCallback((fromIndex, toIndex) => {
        if (toIndex < 0 || toIndex >= internalItems.length) return;

        const newData = [...internalItems];
        const [movedItem] = newData.splice(fromIndex, 1);
        newData.splice(toIndex, 0, movedItem);
        setInternalItems(newData);
        setReorderingIndex(toIndex); // Keep tracking the "grabbed" item
    }, [internalItems]);

    // Handle scroll to keep focused item visible
    const updateScroll = useCallback((newFocusIndex) => {
        const maxScrollIndex = Math.max(0, internalItems.length - VISIBLE_ITEMS);

        if (newFocusIndex < scrollOffset) {
            setScrollOffset(newFocusIndex);
        } else if (newFocusIndex >= scrollOffset + VISIBLE_ITEMS) {
            setScrollOffset(Math.min(newFocusIndex - VISIBLE_ITEMS + 1, maxScrollIndex));
        }
    }, [scrollOffset, internalItems.length, VISIBLE_ITEMS]);

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
                        if (reorderMode) {
                            handleMoveItemInternal(focusIndex, newIndex);
                        }
                        setFocusIndex(newIndex);
                        updateScroll(newIndex);
                        onKey?.('FOCUS_CHANGE', { index: newIndex, item: internalItems[newIndex] });
                    }
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    if (focusIndex < internalItems.length - 1) {
                        const newIndex = focusIndex + 1;
                        if (reorderMode) {
                            handleMoveItemInternal(focusIndex, newIndex);
                        }
                        setFocusIndex(newIndex);
                        updateScroll(newIndex);
                        onKey?.('FOCUS_CHANGE', { index: newIndex, item: internalItems[newIndex] });
                    }
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (reorderMode) {
                        setReorderMode(false);
                        setReorderingIndex(-1);
                        onKey?.('REORDER_CONFIRM', { index: focusIndex, items: internalItems });
                    } else {
                        setReorderMode(true);
                        setReorderingIndex(focusIndex);
                        onKey?.('REORDER_START', { index: focusIndex, item: internalItems[focusIndex] });
                    }
                    break;
                case 'Escape':
                case 'Backspace':
                    e.preventDefault();
                    if (reorderMode) {
                        // Cancel reorder - reset to props data
                        setInternalItems(listData);
                        setReorderMode(false);
                        setReorderingIndex(-1);
                        onKey?.('REORDER_CANCEL', { index: focusIndex });
                    } else {
                        onKey?.('BACK', null);
                    }
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, focusIndex, internalItems, listData, onKey, updateScroll, reorderMode, handleMoveItemInternal]);

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
                    {internalItems.map((item, index) => {
                        const isFocusedItem = index === focusIndex && isFocused;
                        const isReordering = reorderMode && index === reorderingIndex;

                        return (
                            <div
                                key={index}
                                id={`${id}-item-${index}`}
                                className={`flex items-center px-[20px] w-[320px] h-[68px] relative ${isReordering
                                    ? 'bg-[#0066cc]'
                                    : isFocusedItem
                                        ? 'bg-[#1a1a1a]'
                                        : 'bg-transparent'
                                    }`}
                                data-testid={`list-item-${index}`}
                            >
                                {/* Item Label */}
                                <span
                                    id={`${id}-item-${index}-label`}
                                    className="flex-1 text-[30px] font-semibold text-white truncate leading-[36px]"
                                    style={{
                                        fontFamily: 'LG_Smart_UI_HA2023_SemiBold'
                                    }}
                                >
                                    {item.label}
                                </span>

                                {/* Reorder Handle Icon */}
                                <img
                                    id={`${id}-item-${index}-handle`}
                                    src="/ui/images/btn_vertical_list_reorder.png"
                                    alt=""
                                    className="w-[32px] h-[32px] shrink-0 ml-[12px]"
                                />

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

            {/* Reorder Mode Indicator */}
            {reorderMode && (
                <div
                    id={`${id}-reorder-indicator`}
                    className="absolute top-[50px] right-0 px-2 py-1 bg-[#0066cc] text-white text-xs z-20"
                >
                    Reorder Mode
                </div>
            )}
        </div>
    );
};

CM_LIST_Reorder.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    showBackArrow: PropTypes.bool,
    listData: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired
    })),
    initialFocusIndex: PropTypes.number,
    isFocused: PropTypes.bool,
    onKey: PropTypes.func
};

export default CM_LIST_Reorder;


