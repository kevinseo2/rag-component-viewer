import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * CM_PICKER_NumericCarousel - Horizontal numeric picker widget
 * Features smooth sliding animations and unit label fade effects.
 * Includes integrated title display.
 */
const CM_PICKER_NumericCarousel = ({
    id = "CM_PICKER_NumericCarousel",
    title = "Title",
    start = 10,
    stride = 5,
    end = 200,
    currentIndex = 0,
    unit = "ml",
    isFocused = true,
    onKey = null
}) => {
    const [index, setIndex] = useState(currentIndex);
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState(null); // 'UP' or 'DOWN'
    const [unitOpacity, setUnitOpacity] = useState(1);
    const [transitionEnabled, setTransitionEnabled] = useState(true);

    // Update internal index when prop changes
    useEffect(() => {
        setIndex(currentIndex);
    }, [currentIndex]);

    const currentValue = start + (index * stride);
    const prevValue = index > 0 ? currentValue - stride : null;
    const nextValue = (currentValue + stride <= end) ? currentValue + stride : null;

    // Future values for animations
    const futurePrev = direction === 'UP' ? currentValue : (index > 1 ? currentValue - 2 * stride : null);
    const futureCenter = direction === 'UP' ? currentValue + stride : (index > 0 ? currentValue - stride : start);
    const futureNext = direction === 'UP' ? currentValue + 2 * stride : currentValue;

    const handleAction = useCallback((action) => {
        if (isAnimating) return;

        if (action === 'LEFT') { // move_DOWN - values shift RIGHT visually
            if (index > 0) {
                setDirection('DOWN');
                setIsAnimating(true);
                setUnitOpacity(0);

                // Animation duration: 500ms, then update state
                setTimeout(() => {
                    // Disable transition before updating values
                    setTransitionEnabled(false);
                    setIsAnimating(false);
                    setDirection(null);
                    setIndex(prev => prev - 1);
                    setUnitOpacity(1);

                    // Re-enable transition after a frame
                    requestAnimationFrame(() => {
                        setTransitionEnabled(true);
                    });

                    onKey?.('DOWN', { index: index - 1, value: currentValue - stride });
                }, 500);
            }
        } else if (action === 'RIGHT') { // move_UP - values shift LEFT visually
            if (currentValue + stride <= end) {
                setDirection('UP');
                setIsAnimating(true);
                setUnitOpacity(0);

                // Animation duration: 500ms, then update state
                setTimeout(() => {
                    // Disable transition before updating values
                    setTransitionEnabled(false);
                    setIsAnimating(false);
                    setDirection(null);
                    setIndex(prev => prev + 1);
                    setUnitOpacity(1);

                    // Re-enable transition after a frame
                    requestAnimationFrame(() => {
                        setTransitionEnabled(true);
                    });

                    onKey?.('UP', { index: index + 1, value: currentValue + stride });
                }, 500);
            }
        } else if (action === 'OK') {
            onKey?.('OK', { index, value: currentValue });
        } else if (action === 'BACK') {
            onKey?.('BACK');
        }
    }, [index, isAnimating, currentValue, stride, end, onKey]);

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

    // Animation Offsets (from MD)
    // move_DOWN (decrease): translateX 93 for hidden/left/right, 145 for center
    // move_UP (increase): translateX -93 for hidden/left/center, -145 for right

    const getTransform = (id) => {
        if (!isAnimating) return 'translateX(0px)';

        if (direction === 'DOWN') {
            if (id === 'label_center') return 'translateX(145px)';
            return 'translateX(93px)';
        } else if (direction === 'UP') {
            if (id === 'label_right') return 'translateX(-145px)';
            return 'translateX(-93px)';
        }
        return 'translateX(0px)';
    };

    const labelBaseStyle = "absolute top-[56px] text-[49px] font-semibold text-white";
    const labelStyle = transitionEnabled
        ? `${labelBaseStyle} transition-transform duration-500 ease-linear`
        : labelBaseStyle;

    return (
        <div id={id} className="relative w-[320px] h-[240px] bg-transparent">
            {/* Title */}
            <div
                id={`${id}-title`}
                className="absolute top-0 left-0 w-[320px] h-[36px] flex items-center justify-center bg-transparent"
            >
                <span
                    id={`${id}-title-label`}
                    className="text-[30px] font-semibold text-white text-center leading-[1.1]"
                    style={{ fontFamily: 'LG Smart UI HA2023 SemiBold, sans-serif' }}
                >
                    {title}
                </span>
            </div>

            {/* Picker Container */}
            <div className="absolute top-[36px] left-0 w-[320px] h-[204px] overflow-hidden bg-transparent">
                {/* Hidden label for animation entry */}
                <div
                    id={`${id}-label-hidden`}
                    className={labelStyle}
                    style={{
                        left: direction === 'DOWN' ? '-79px' : (direction === 'UP' ? '342px' : '-79px'),
                        transform: getTransform('label_hidden'),
                        opacity: isAnimating ? 1 : 0
                    }}
                >
                    {direction === 'DOWN' ? (index > 1 ? currentValue - 2 * stride : "") : (nextValue + stride <= end ? currentValue + 2 * stride : "")}
                </div>

                {/* Left Value */}
                <div
                    id={`${id}-label-left`}
                    className={labelStyle}
                    style={{
                        left: '14px',
                        transform: getTransform('label_left')
                    }}
                >
                    {prevValue !== null ? prevValue : ""}
                </div>

                {/* Center Value + Unit (grouped to prevent overlap) */}
                <div
                    id={`${id}-label-center`}
                    className={`${labelStyle} flex items-baseline gap-[4px]`}
                    style={{
                        left: '107px',
                        transform: getTransform('label_center')
                    }}
                >
                    <span>{currentValue}</span>
                    <span
                        id={`${id}-label-unit`}
                        className="transition-opacity"
                        style={{
                            opacity: unitOpacity,
                            transitionDuration: unitOpacity === 0 ? '100ms' : '500ms'
                        }}
                    >
                        {unit}
                    </span>
                </div>

                {/* Right Value */}
                <div
                    id={`${id}-label-right`}
                    className={labelStyle}
                    style={{
                        left: '252px',
                        transform: getTransform('label_right')
                    }}
                >
                    {nextValue !== null ? nextValue : ""}
                </div>

                {/* Gradient Masks */}
                <img
                    id={`${id}-mask-left`}
                    src="/ui/images/mask_horizontal_list_common_left.png"
                    className="absolute left-0 top-0 w-[86px] h-[164px] pointer-events-none"
                    alt=""
                />
                <img
                    id={`${id}-mask-right`}
                    src="/ui/images/mask_horizontal_list_common_right.png"
                    className="absolute left-[234px] top-0 w-[86px] h-[164px] pointer-events-none"
                    alt=""
                />
            </div>
        </div>
    );
};

CM_PICKER_NumericCarousel.propTypes = {
    /** 컴포넌트 ID */
    id: PropTypes.string,

    /** 상단 타이틀 텍스트 */
    title: PropTypes.string,

    /** 
     * 시작 값
     * - 선택 가능한 첫 번째 숫자
     * - 예: 10
     */
    start: PropTypes.number,

    /** 
     * 증가 단위 (간격)
     * - 각 선택 항목 간의 숫자 차이
     * - 예: stride=5이면 10, 15, 20, 25... 형태로 증가
     */
    stride: PropTypes.number,

    /** 
     * 종료 값
     * - 선택 가능한 마지막 숫자
     * - 예: 200
     */
    end: PropTypes.number,

    /** 
     * 현재 선택된 인덱스
     * - 0부터 시작하는 배열 인덱스
     * - 실제 값 = start + (currentIndex * stride)
     */
    currentIndex: PropTypes.number,

    /** 
     * 단위 텍스트 (예: 'ml', 'g', '℃')
     * - 숫자 오른쪽에 표시되는 단위
     * - 중앙 값 선택 시 페이드 아웃됨
     */
    unit: PropTypes.string,

    /** 키보드 입력 활성화 여부 */
    isFocused: PropTypes.bool,

    /** 
     * 키보드 입력 처리 콜백
     * - 'LEFT': 이전 값으로 이동
     * - 'RIGHT': 다음 값으로 이동
     * - 'OK': 현재 값 선택
     * - 'BACK': 취소
     */
    onKey: PropTypes.func
};

export default CM_PICKER_NumericCarousel;

