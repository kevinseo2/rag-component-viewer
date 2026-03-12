import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import CM_TITLE_Bar from './CM_TITLE_Bar';

/**
 * CM_LIST_HorizontalCarousel Widget
 * - Master horizontal dynamic list with centered item and partial side items.
 * - Handles animation state and complex label mapping.
 * - Integrates CM_TITLE_Bar for header display.
 */
const CM_LIST_HorizontalCarousel = ({
    id = "CM_LIST_HorizontalCarousel",
    title = "",
    items = [],
    initialIndex = 0,
    isFocused = true,
    onKey = () => { }
}) => {
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const [isAnimating, setIsAnimating] = useState(false);

    // Synchronize with initialIndex prop
    useEffect(() => {
        setActiveIndex(initialIndex);
    }, [initialIndex]);

    const goToIndex = useCallback((index) => {
        if (index >= 0 && index < items.length) {
            setIsAnimating(true);
            setActiveIndex(index);
            // Animation duration usually 300ms
            setTimeout(() => setIsAnimating(false), 300);
        }
    }, [items.length]);

    // Handle Keyboard Events
    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            let handled = false;
            if (e.key === 'ArrowLeft') {
                if (activeIndex > 0) {
                    goToIndex(activeIndex - 1);
                    handled = true;
                }
            } else if (e.key === 'ArrowRight') {
                if (activeIndex < items.length - 1) {
                    goToIndex(activeIndex + 1);
                    handled = true;
                }
            } else if (e.key === 'Enter') {
                onKey('OK', { index: activeIndex, item: items[activeIndex] });
                handled = true;
            } else if (e.key === 'Escape' || e.key === 'Backspace') {
                onKey('BACK');
                handled = true;
            }

            if (handled) e.preventDefault();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, activeIndex, items, onKey, goToIndex]);

    // Layout constants
    const ITEM_WIDTH = 118;
    const CENTER_X = 101;
    const Y_POS = 64;
    const GAP = 40;

    // Offset calculation: centered item is at CENTER_X
    const offset = CENTER_X - (activeIndex * (ITEM_WIDTH + GAP));

    return (
        <div id={id} className="relative w-[320px] h-[240px] bg-black overflow-hidden">
            {/* Title Bar */}
            {title && <CM_TITLE_Bar id={`${id}-title`} title={title} />}

            {/* Items Container */}
            <div
                id={`${id}-items-container`}
                className="absolute flex items-start transition-transform duration-300 ease-out"
                style={{
                    top: `${Y_POS}px`,
                    transform: `translateX(${offset}px)`,
                    width: `${items.length * (ITEM_WIDTH + GAP)}px`
                }}
            >
                {items.map((item, index) => {
                    const label = typeof item === 'string'
                        ? item
                        : (item.label || item.value || (item.label_Hor_Dynamic && item.label_Hor_Dynamic.text) || "");

                    return (
                        <div
                            key={index}
                            id={`${id}-item-${index}`}
                            className="relative flex-shrink-0 flex items-center justify-center p-2"
                            style={{
                                width: `${ITEM_WIDTH}px`,
                                height: '112px',
                                marginRight: `${GAP}px`
                            }}
                        >
                            <span
                                id={`${id}-item-text-${index}`}
                                className="text-white text-center font-semibold text-[49px] leading-none"
                                style={{ fontFamily: 'LGSBD, sans-serif' }}
                            >
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Fade Masks */}
            <div
                id={`${id}-mask-left`}
                className="absolute left-0 top-[36px] w-[86px] h-[168px] z-10 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)' }}
            />
            <div
                id={`${id}-mask-right`}
                className="absolute left-[234px] top-[36px] w-[86px] h-[168px] z-10 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)' }}
            />
        </div>
    );
};

CM_LIST_HorizontalCarousel.propTypes = {
    /** 컴포넌트 ID */
    id: PropTypes.string,

    /** 상단 타이틀 (CM_TITLE_Bar 사용) */
    title: PropTypes.string,

    /** 
     * 가로 스크롤 항목 배열
     * - 문자열 또는 객체 배열
     * - 중앙 항목이 강조되고 좌우 항목은 부분적으로 표시
     */
    items: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),

    /** 초기 선택 인덱스 */
    initialIndex: PropTypes.number,

    /** 키보드 입력 활성화 */
    isFocused: PropTypes.bool,

    /** 키보드 입력 처리 콜백 */
    onKey: PropTypes.func
};

export default CM_LIST_HorizontalCarousel;

