import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import CM_TITLE_WithArrow from './CM_TITLE_WithArrow';

/**
 * CM_LIST_MultiSelect Widget
 *
 * Vertical list with checkbox items containing up to 3 elements per row:
 * - Checkbox indicator (unchecked, checked, or disabled)
 * - Label (primary text)
 * - Description (optional secondary text)
 *
 * @param {Object} props
 * @param {string} props.id - Component ID
 * @param {string} props.title - Title text
 * @param {boolean} props.showBackArrow - Back arrow visibility
 * @param {Array} props.listData - List items array
 * @param {string} props.listData[].label - Primary text
 * @param {string} props.listData[].description - Secondary description text
 * @param {boolean} props.listData[].checked - Checkbox checked state
 * @param {boolean} props.listData[].disabled - Item disabled state
 * @param {boolean} props.listData[].showDescription - Whether to show description
 * @param {number} props.initialFocusIndex - Initial focused index
 * @param {boolean} props.isFocused - Whether this widget is focused
 * @param {function} props.onKey - Key event handler (actionName, payload)
 */
const CM_LIST_MultiSelect = ({
    id = 'CM_LIST_MultiSelect',
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
    const listRef = useRef(null);

    const ITEM_HEIGHT = 68;
    const VIEWPORT_HEIGHT = 190;
    const VISIBLE_ITEMS = Math.floor(VIEWPORT_HEIGHT / ITEM_HEIGHT);

    // Sync internal items if listData changes from outside
    useEffect(() => {
        setInternalItems(listData);
    }, [listData]);

    // Handle internal toggle
    const handleToggleInternal = useCallback((index) => {
        setInternalItems(prevItems => {
            const newItems = [...prevItems];
            const item = newItems[index];
            if (item && !item.disabled) {
                newItems[index] = {
                    ...item,
                    checked: !item.checked
                };
            }
            return newItems;
        });
    }, []);

    // Checkbox images based on state
    const getCheckboxImage = (checked, disabled) => {
        if (disabled) {
            return '/ui/images/btn_multiple_seletion_on_blue_d.png';
        } else if (checked) {
            return '/ui/images/btn_multiple_seletion_on_blue_n.png';
        } else {
            return '/ui/images/btn_multiple_seletion_off_n.png';
        }
    };

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
                        setFocusIndex(newIndex);
                        updateScroll(newIndex);
                        onKey?.('FOCUS_CHANGE', { index: newIndex, item: internalItems[newIndex] });
                    }
                    break;
                case 'Enter':
                    e.preventDefault();
                    const currentItem = internalItems[focusIndex];
                    if (currentItem && !currentItem.disabled) {
                        handleToggleInternal(focusIndex);
                        onKey?.('TOGGLE', { index: focusIndex, item: { ...currentItem, checked: !currentItem.checked } });
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
    }, [isFocused, focusIndex, internalItems, onKey, updateScroll, handleToggleInternal]);

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
                        const showDesc = item.showDescription !== false && item.description;
                        const labelY = showDesc ? 3 : 16;

                        return (
                            <div
                                key={index}
                                id={`${id}-item-${index}`}
                                className={`flex items-center px-[20px] w-[320px] h-[68px] relative ${isFocusedItem ? 'bg-[#1a1a1a]' : 'bg-transparent'}`}
                                data-testid={`list-item-${index}`}
                            >
                                {/* Checkbox Indicator */}
                                <img
                                    id={`${id}-item-${index}-checkbox`}
                                    src={getCheckboxImage(item.checked, item.disabled)}
                                    alt=""
                                    className="w-[30px] h-[30px] shrink-0 mr-[14px]"
                                />

                                {/* Text Group (Label + Description) */}
                                <div id={`${id}-item-${index}-text-group`} className="flex flex-col flex-1 min-w-0">
                                    {/* Label */}
                                    <span
                                        id={`${id}-item-${index}-label`}
                                        className="text-[30px] font-semibold text-white truncate leading-[36px]"
                                        style={{
                                            fontFamily: 'LG_Smart_UI_HA2023_SemiBold'
                                        }}
                                    >
                                        {item.label}
                                    </span>

                                    {/* Description (conditional) */}
                                    {showDesc && (
                                        <span
                                            id={`${id}-item-${index}-desc`}
                                            className="text-[21px] font-semibold text-white truncate leading-[25px]"
                                            style={{
                                                fontFamily: 'LG_Smart_UI_HA2023_SemiBold'
                                            }}
                                        >
                                            {item.description}
                                        </span>
                                    )}
                                </div>

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

CM_LIST_MultiSelect.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    showBackArrow: PropTypes.bool,
    listData: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        description: PropTypes.string,
        checked: PropTypes.bool,
        disabled: PropTypes.bool,
        showDescription: PropTypes.bool
    })),
    initialFocusIndex: PropTypes.number,
    isFocused: PropTypes.bool,
    onKey: PropTypes.func
};

export default CM_LIST_MultiSelect;


