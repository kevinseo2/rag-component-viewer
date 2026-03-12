import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import CM_LIST_Item2Col from './CM_LIST_Item2Col';

/**
 * CM_LIST_ScrollView2Col Widget
 * 
 * Handles vertical list rendering for 2nd depth items (labels + values).
 */
const CM_LIST_ScrollView2Col = ({
    id = 'CM_LIST_ScrollView2Col',
    items = [],
    initialSelectedIndex = 0,
    onKey = null,
}) => {
    const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
    const containerRef = useRef(null);
    const itemHeight = 68;

    useEffect(() => {
        setSelectedIndex(initialSelectedIndex);
    }, [initialSelectedIndex]);

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
                handled = true;
            } else if (e.key === 'Escape') {
                onKey?.('BACK');
                handled = true;
            }

            if (handled) {
                if (newIndex !== selectedIndex) {
                    setSelectedIndex(newIndex);
                }
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, items, onKey]);

    // Smooth scroll translation
    const scrollOffset = Math.max(0, Math.min(selectedIndex * itemHeight - (190 - itemHeight) / 2, Math.max(0, items.length * itemHeight - 190)));

    return (
        <div
            id={id}
            ref={containerRef}
            className="w-[320px] h-[190px] overflow-hidden relative"
        >
            <div
                id={`${id}-list-container`}
                className="flex flex-col"
                style={{
                    transform: `translateY(-${scrollOffset}px)`,
                    transition: 'transform 0.2s ease-out'
                }}
            >
                {items.map((item, index) => (
                    <CM_LIST_Item2Col
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

CM_LIST_ScrollView2Col.propTypes = {
    /** 컴포넌트 ID */
    id: PropTypes.string,

    /** 
     * 2열 레이아웃 항목 배열
     * - 각 항목은 CM_LIST_Item2Col에 전달됨
     */
    items: PropTypes.arrayOf(PropTypes.object),

    /** 초기 선택 인덱스 */
    initialSelectedIndex: PropTypes.number,

    /** 
     * 키보드 입력 처리 콜백
     * - 'OK', 'BACK' 액션 처리
     */
    onKey: PropTypes.func,
};

export default CM_LIST_ScrollView2Col;

