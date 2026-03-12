import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import CM_LIST_Item from './CM_LIST_Item';

/**
 * CM_LIST_ScrollView Widget
 * 
 * Handles vertical list rendering, scrolling, and keyboard navigation.
 * 
 * @param {Object} props
 * @param {Array} props.items - List of items to display
 * @param {number} props.initialSelectedIndex - Starting index
 * @param {function} props.onKey - Unified key event handler
 */
const CM_LIST_ScrollView = ({
    id = 'CM_LIST_ScrollView',
    items = [],
    initialSelectedIndex = 0,
    focusedIndex = 0,
    onKey = null,
    onFocusChange = null,
    onSelect = null,
    hasCheckboxes = false,
    reorderable = false,
    onToggle = null,
    hasSwitch = false,
}) => {
    const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex || focusedIndex);
    const containerRef = useRef(null);
    const itemHeight = 68;

    useEffect(() => {
        // Update selected index if initialSelectedIndex changes
        setSelectedIndex(initialSelectedIndex);
    }, [initialSelectedIndex]);

    useEffect(() => {
        if (focusedIndex !== undefined) {
            setSelectedIndex(focusedIndex);
        }
    }, [focusedIndex]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            let newIndex = selectedIndex;
            let handled = false;

            if ((e.key === 'ArrowUp') || (e.key === 'ArrowLeft')) {
                newIndex = Math.max(0, selectedIndex - 1);
                handled = true;
            } else if ((e.key === 'ArrowDown') || (e.key === 'ArrowRight')) {
                newIndex = Math.min(items.length - 1, selectedIndex + 1);
                handled = true;
            } else if (e.key === 'Enter') {
                onKey?.('OK', { index: selectedIndex, item: items[selectedIndex] });
                onSelect?.(selectedIndex, items[selectedIndex]);
                handled = true;
            } else if (e.key === 'Escape') {
                onKey?.('BACK');
                handled = true;
            }

            if (handled) {
                if (newIndex !== selectedIndex) {
                    setSelectedIndex(newIndex);
                    onFocusChange?.(newIndex);
                    // Scroll into view logic
                    if (containerRef.current) {
                        const container = containerRef.current;
                        const scrollPos = newIndex * itemHeight;
                        const containerHeight = container.clientHeight;

                        if (scrollPos < container.scrollTop) {
                            container.scrollTop = scrollPos;
                        } else if (scrollPos + itemHeight > container.scrollTop + containerHeight) {
                            container.scrollTop = scrollPos + itemHeight - containerHeight;
                        }
                    }
                }
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, items, onKey]);

    return (
        <div
            id={id}
            ref={containerRef}
            className="w-[320px] h-[190px] overflow-hidden relative"
            style={{ scrollBehavior: 'smooth' }}
        >
            <div
                id={`${id}-list-container`}
                className="flex flex-col"
                style={{
                    transform: `translateY(-${Math.max(0, Math.min(selectedIndex * itemHeight - (190 - itemHeight) / 2, Math.max(0, items.length * itemHeight - 190)))}px)`,
                    transition: 'transform 0.2s ease-out'
                }}
            >
                {items.map((item, index) => (
                    <CM_LIST_Item
                        key={index}
                        id={`${id}-item-${index}`}
                        {...item}
                        isSelected={index === selectedIndex}
                    />
                ))}
            </div>
        </div>
    );
};

CM_LIST_ScrollView.propTypes = {
    /** 컴포넌트 ID */
    id: PropTypes.string,

    /** 
     * 표시할 항목들의 배열
     * - 각 항목은 CM_LIST_Item에 전달될 props 객체
     */
    items: PropTypes.arrayOf(PropTypes.object),

    /** 초기 선택 인덱스 */
    initialSelectedIndex: PropTypes.number,

    /** 외부에서 제어하는 포커스 인덱스 */
    focusedIndex: PropTypes.number,

    /** 
     * 키보드 입력 처리 콜백
     * - 'OK': 항목 선택
     * - 'BACK': 뒤로가기
     */
    onKey: PropTypes.func,

    /** 포커스 변경 시 호출되는 콜백 */
    onFocusChange: PropTypes.func,

    /** 항목 선택 시 호출되는 콜백 */
    onSelect: PropTypes.func,

    /** 체크박스 표시 여부 (향후 사용) */
    hasCheckboxes: PropTypes.bool,

    /** 재정렬 가능 여부 (향후 사용) */
    reorderable: PropTypes.bool,

    /** 스위치 토글 콜백 (향후 사용) */
    onToggle: PropTypes.func,

    /** 스위치 표시 여부 (향후 사용) */
    hasSwitch: PropTypes.bool,
};

export default CM_LIST_ScrollView;

