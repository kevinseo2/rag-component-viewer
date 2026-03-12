import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * CM_PICKER_Roller
 * A generic vertical roller component for selecting values.
 * Supports infinite scrolling simulation by duplicating items and pathing to nearest neighbor.
 */
const CM_PICKER_Roller = ({
    id = "CM_PICKER_Roller",
    items = [],
    selectedIndex = 0,
    itemHeight = 72,
    visibleItems = 3,
    style = {},
    textColor = "#ffffff",
    font = "LOCK3B",
    fontSize = 40
}) => {
    const len = items.length;
    // The actual index we are currently displaying in the tripled list
    const [currentIndex, setCurrentIndex] = useState(len + selectedIndex);
    const [isTransitioning, setIsTransitioning] = useState(true);

    // Triple the items for infinite effect
    const extendedItems = [...items, ...items, ...items];

    useEffect(() => {
        if (len === 0) return;

        // Calculate the relative move to keep it jumping to the closest neighbor
        // Current logical index is currentIndex % len
        const currentLogical = ((currentIndex % len) + len) % len;
        const diff = ((selectedIndex - currentLogical + (len / 2 + len)) % len) - (len / 2);

        const targetIndex = currentIndex + diff;

        setCurrentIndex(targetIndex);
        setIsTransitioning(true);

        // After animation ends, jump back to middle set if we drifted too far
        const timer = setTimeout(() => {
            const normalizedIndex = ((targetIndex % len) + len) % len + len;
            setIsTransitioning(false); // Disable animation for the jump
            setCurrentIndex(normalizedIndex);
        }, 300); // 300ms matches duration-300

        return () => clearTimeout(timer);
    }, [selectedIndex, len]);

    const centerOffset = Math.floor(visibleItems / 2) * itemHeight;
    const translateY = centerOffset - (currentIndex * itemHeight);

    return (
        <div
            id={id}
            className="overflow-hidden relative"
            style={{
                ...style,
                height: `${visibleItems * itemHeight}px`
            }}
        >
            <div
                id={`${id}-container`}
                className={`flex flex-col items-center w-full ${isTransitioning ? 'transition-transform duration-300 ease-out' : ''}`}
                style={{ transform: `translateY(${translateY}px)` }}
            >
                {extendedItems.map((option, index) => {
                    const isSelected = (index % len) === selectedIndex;
                    return (
                        <div
                            key={`${id}-item-${index}`}
                            id={`${id}-item-${index}`}
                            className="w-full flex items-center justify-center flex-shrink-0"
                            style={{
                                height: `${itemHeight}px`,
                                color: textColor,
                                fontFamily: font,
                                fontSize: `${fontSize}px`,
                                opacity: isSelected ? 1 : 0.3
                            }}
                        >
                            {option}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

CM_PICKER_Roller.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 표시할 옵션 텍스트 배열 */
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    /** 현재 선택된 인덱스 */
    selectedIndex: PropTypes.number.isRequired,
    /** 아이템 하나당 높이 (px) */
    itemHeight: PropTypes.number,
    /** 한 화면에 보여질 아이템 수 (홀수 권장) */
    visibleItems: PropTypes.number,
    /** 컨테이너 커스텀 스타일 */
    style: PropTypes.object,
    /** 텍스트 색상 */
    textColor: PropTypes.string,
    /** 폰트 패밀리 명칭 */
    font: PropTypes.string,
    /** 폰트 크기 (px) */
    fontSize: PropTypes.number
};

export default CM_PICKER_Roller;

