import React, { useState, useRef, useLayoutEffect, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * CM_LABEL_Smart Component
 *
 * LVGL next_label_lite 분석 기반 구현
 * - 자동 폰트 피팅 (cal_min_font_size 로직)
 * - 피팅 실패 시 스크롤 모드 (가로/세로)
 * - 2초 대기 후 스크롤 시작
 * - wrap scroll (두 개의 라벨 사용)
 * - 마스크 효과
 */

// 최소 폰트 크기 계산 (global_general_ui_init.c:102-127 기반)
const calculateMinFontSize = (baseFontSize) => {
    let reduction = 0;
    if (baseFontSize >= 61) reduction = 21;
    else if (baseFontSize >= 57) reduction = 16;
    else if (baseFontSize >= 52) reduction = 12;
    else if (baseFontSize >= 46) reduction = 10;
    else if (baseFontSize >= 40) reduction = 8;
    else if (baseFontSize >= 35) reduction = 6;
    else if (baseFontSize >= 30) reduction = 5;
    else if (baseFontSize >= 27) reduction = 4;
    else if (baseFontSize >= 24) reduction = 3;
    else reduction = 2; // C 코드의 else ret = 2 반영
    return Math.max(1, baseFontSize - reduction);
};

// 정렬 매핑
const getAlignmentStyle = (align, isMultiline, isScrollMode) => {
    // 스크롤 모드에서의 정렬 조정 (update_align_for_scroll 로직)
    if (isScrollMode) {
        if (isMultiline) {
            // 세로 스크롤: 모든 정렬을 TOP으로 변경 (C 코드 update_align_for_scroll 대응)
            switch (align) {
                case 'center': return { justifyContent: 'center', alignItems: 'flex-start' };
                case 'bottom-mid': return { justifyContent: 'center', alignItems: 'flex-start' };
                case 'bottom-right': return { justifyContent: 'flex-end', alignItems: 'flex-start' };
                case 'bottom-left': return { justifyContent: 'flex-start', alignItems: 'flex-start' };
                case 'top-left': return { justifyContent: 'flex-start', alignItems: 'flex-start' };
                case 'top-right': return { justifyContent: 'flex-end', alignItems: 'flex-start' };
                default: return { justifyContent: 'center', alignItems: 'flex-start' };
            }
        } else {
            // 가로 스크롤: LEFT 또는 RIGHT로 변경 (RTL 미고려 시 LEFT)
            return { justifyContent: 'flex-start', alignItems: 'center' };
        }
    }

    // 일반 모드 정렬
    switch (align) {
        case 'left': return { justifyContent: 'flex-start', alignItems: 'center' };
        case 'right': return { justifyContent: 'flex-end', alignItems: 'center' };
        case 'center': return { justifyContent: 'center', alignItems: 'center' };
        case 'top-left': return { justifyContent: 'flex-start', alignItems: 'flex-start' };
        case 'top-right': return { justifyContent: 'flex-end', alignItems: 'flex-start' };
        case 'bottom-left': return { justifyContent: 'flex-start', alignItems: 'flex-end' };
        case 'bottom-right': return { justifyContent: 'flex-end', alignItems: 'flex-end' };
        default: return { justifyContent: 'center', alignItems: 'center' };
    }
};

const CM_LABEL_Smart = ({
    id,
    text = '',
    align = 'center',
    multiline = false,
    style = {},
    maxArea,
    isFocused = true,
    animSpeed = 30, // 기본 30px/초
    forceMinFontSize = 21
}) => {
    const [currentFontSize, setCurrentFontSize] = useState(() => parseInt(style.fontSize || '30', 10));
    const [isScrollMode, setIsScrollMode] = useState(false);
    const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
    const [scrollOffset, setScrollOffset] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const containerRef = useRef(null);
    const measureRef = useRef(null);
    const animationRef = useRef(null);
    const delayTimerRef = useRef(null);

    const SCROLL_DELAY_MS = 2000; // 2초 대기
    const SPACE_GAP = 50; // 가로 스크롤 시 3스페이스 대신 50px 갭

    // 폰트 피팅 및 스크롤 모드 결정 (C 코드 fit_font_size 로직 반영)
    useLayoutEffect(() => {
        if (!maxArea || !text) {
            setIsScrollMode(false);
            return;
        }

        const baseFontSize = parseInt(style.fontSize || '30', 10);
        const minFontSize = forceMinFontSize > 0 ? forceMinFontSize : calculateMinFontSize(baseFontSize);

        // 사용자 요청: 원래 스타일이 minFontSize(21px)보다 작아도 21px까지 키워서 시도
        const startFontSize = Math.max(baseFontSize, minFontSize);

        // console.log(`[CM_LABEL_Smart:${id}] --- Start Measurement ---`);
        // console.log(`[CM_LABEL_Smart:${id}] Text: "${text}"`);
        // console.log(`[CM_LABEL_Smart:${id}] MaxArea: ${maxArea.width}x${maxArea.height} | Base: ${baseFontSize}px | Min: ${minFontSize}px | Start: ${startFontSize}px`);

        let bestFitSize = baseFontSize;
        let shouldScroll = false;

        // 정확한 측정을 위해 현재 환경과 격리된 임시 span 생성
        const measureEl = document.createElement('span');
        measureEl.style.visibility = 'hidden';
        measureEl.style.position = 'absolute';
        measureEl.style.top = '-9999px';
        measureEl.style.left = '-9999px';
        measureEl.style.whiteSpace = multiline ? 'pre-wrap' : 'nowrap';
        measureEl.style.fontFamily = style.fontFamily || getComputedStyle(document.body).fontFamily;
        measureEl.style.fontWeight = style.fontWeight || 'normal';
        measureEl.style.letterSpacing = style.letterSpacing || 'normal';
        measureEl.innerText = text;
        document.body.appendChild(measureEl);

        if (multiline) {
            measureEl.style.display = 'block';
            measureEl.style.width = `${maxArea.width}px`;
        } else {
            measureEl.style.display = 'inline-block';
            measureEl.style.width = 'auto';
        }

        let fitFound = false;

        // 시작 폰트 크기(base와 min 중 큰 값)부터 줄여가며 피팅 시도
        let fontSize = startFontSize;
        while (true) {
            measureEl.style.fontSize = `${fontSize}px`;
            measureEl.style.lineHeight = style.lineHeight || '1';

            const rect = measureEl.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;

            // 싱글라인은 너비만, 멀티라인은 높이만 비교
            const fits = multiline
                ? height <= maxArea.height
                : width <= maxArea.width;

            // console.log(`[CM_LABEL_Smart:${id}] Testing Size: ${fontSize}px -> Measured: ${width.toFixed(2)}x${height.toFixed(2)} | Fits: ${fits}`);

            if (fits) {
                bestFitSize = fontSize;
                fitFound = true;
                break;
            }

            // 더 이상 줄일 수 없으면 중단 (최하한선은 minFontSize와 baseFontSize 중 작은 값까지)
            const absoluteMin = Math.min(baseFontSize, minFontSize);
            if (fontSize <= absoluteMin) break;
            fontSize--;
        }

        if (!fitFound) {
            bestFitSize = baseFontSize;
            shouldScroll = true;
            console.warn(`[CM_LABEL_Smart:${id}] Fitting FAILED. Scroll mode will be enabled.`);
        }

        // 최종 크기 확정 및 엘리먼트 제거
        measureEl.style.fontSize = `${bestFitSize}px`;
        const finalRect = measureEl.getBoundingClientRect();
        const finalWidth = finalRect.width;
        const finalHeight = finalRect.height;
        document.body.removeChild(measureEl);

        // console.log(`[CM_LABEL_Smart:${id}] Final Result -> Size: ${bestFitSize}px | Scroll: ${shouldScroll} | Content: ${finalWidth.toFixed(2)}x${finalHeight.toFixed(2)}`);
        //console.log(`[CM_LABEL_Smart:${id}] -----------------------------`);

        setCurrentFontSize(bestFitSize);
        setIsScrollMode(shouldScroll);
        setContentSize({ width: finalWidth, height: finalHeight });
        setScrollOffset(0);

    }, [id, text, maxArea?.width, maxArea?.height, multiline, style.fontSize, style.fontFamily, style.fontWeight, style.lineHeight, style.letterSpacing, forceMinFontSize]);

    // 스크롤 애니메이션
    const startScrollAnimation = useCallback(() => {
        if (!isScrollMode || !isFocused) return;

        const lineHeight = currentFontSize * 1;
        const gap = multiline ? lineHeight : SPACE_GAP;
        const totalDistance = multiline
            ? contentSize.height + gap
            : contentSize.width + gap;

        const duration = (totalDistance / animSpeed) * 1000; // ms

        let startTime = null;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            setScrollOffset(progress * totalDistance);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                // 스크롤 완료 -> 리셋 후 다시 대기
                setScrollOffset(0);
                setIsAnimating(false);

                // 다시 2초 대기 후 스크롤
                delayTimerRef.current = setTimeout(() => {
                    setIsAnimating(true);
                }, SCROLL_DELAY_MS);
            }
        };

        setIsAnimating(true);
        animationRef.current = requestAnimationFrame(animate);
    }, [isScrollMode, isFocused, contentSize, animSpeed, multiline, currentFontSize]);

    // 스크롤 시작/정지 제어
    useEffect(() => {
        // 클린업
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        if (delayTimerRef.current) {
            clearTimeout(delayTimerRef.current);
            delayTimerRef.current = null;
        }

        if (isScrollMode && isFocused) {
            // 2초 대기 후 스크롤 시작
            delayTimerRef.current = setTimeout(() => {
                startScrollAnimation();
            }, SCROLL_DELAY_MS);
        } else {
            setScrollOffset(0);
            setIsAnimating(false);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (delayTimerRef.current) {
                clearTimeout(delayTimerRef.current);
            }
        };
    }, [isScrollMode, isFocused, startScrollAnimation]);

    // isAnimating 변경 시 애니메이션 시작
    useEffect(() => {
        if (isAnimating && isScrollMode && isFocused) {
            startScrollAnimation();
        }
    }, [isAnimating, isScrollMode, isFocused, startScrollAnimation]);

    // 스타일 계산
    const alignmentStyle = getAlignmentStyle(align, multiline, isScrollMode);

    const containerStyle = {
        width: 'auto',
        maxWidth: maxArea?.width || 'none',
        height: maxArea?.height || 'auto',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        ...alignmentStyle,
        backgroundColor: style.backgroundColor || 'transparent',
    };

    const contentWrapperStyle = {
        display: 'flex',
        flexDirection: multiline ? 'column' : 'row',
        transform: multiline
            ? `translateY(-${scrollOffset}px)`
            : `translateX(-${scrollOffset}px)`,
    };

    const textStyle = {
        fontSize: `${currentFontSize}px`,
        fontFamily: style.fontFamily || 'inherit',
        color: style.color || '#FFFFFF',
        lineHeight: style.lineHeight || '1',
        whiteSpace: multiline ? 'pre-wrap' : 'nowrap',
        width: multiline ? maxArea?.width : 'auto',
        textAlign: align.includes('left') ? 'left' : align.includes('right') ? 'right' : 'center',
    };

    const lineHeight = currentFontSize * 1;
    const gap = multiline ? lineHeight : SPACE_GAP;

    // 마스크 스타일: 스크롤 대기 시 한쪽만, 스크롤 중 양쪽
    const getMaskBackground = () => {
        const bgColor = style.backgroundColor || 'rgba(0,0,0,1)';
        if (multiline) {
            // 멀티라인: 대기 시 하단만, 스크롤 중 상하
            return isAnimating
                ? `linear-gradient(to bottom, ${bgColor} 0%, transparent 15%, transparent 85%, ${bgColor} 100%)`
                : `linear-gradient(to bottom, transparent 0%, transparent 85%, ${bgColor} 100%)`;
        } else {
            // 싱글라인: 대기 시 오른쪽만, 스크롤 중 좌우
            return isAnimating
                ? `linear-gradient(to right, ${bgColor} 0%, transparent 10%, transparent 90%, ${bgColor} 100%)`
                : `linear-gradient(to right, transparent 0%, transparent 90%, ${bgColor} 100%)`;
        }
    };

    const maskStyle = isScrollMode ? {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 1,
        background: getMaskBackground(),
    } : null;

    return (
        <div id={`${id || 'CM_LABEL_Smart'}-container`} ref={containerRef} style={containerStyle}>
            {/* 마스크 오버레이 */}
            {isScrollMode && <div id={`${id || 'CM_LABEL_Smart'}-mask`} style={maskStyle} />}

            {/* 콘텐츠 래퍼 */}
            <div id={`${id || 'CM_LABEL_Smart'}-content-wrapper`} style={contentWrapperStyle}>
                {/* 메인 텍스트 */}
                <div id={`${id || 'CM_LABEL_Smart'}-measure`} ref={measureRef} style={textStyle}>
                    {text}
                </div>

                {/* 스크롤용 복제 텍스트 */}
                {isScrollMode && (
                    <div id={`${id || 'CM_LABEL_Smart'}-scroll-copy`} style={{ ...textStyle, [multiline ? 'marginTop' : 'marginLeft']: `${gap}px`, display: 'flex', alignItems: 'center' }}>
                        {text}
                    </div>
                )}
            </div>
        </div>
    );
};

CM_LABEL_Smart.propTypes = {
    /** 컴포넌트 ID */
    id: PropTypes.string,

    /** 표시할 텍스트 */
    text: PropTypes.string,

    /** 
     * 텍스트 정렬 방식
     * - 9가지 정렬 옵션 지원
     */
    align: PropTypes.oneOf(['left', 'center', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'bottom-mid']),

    /** 
     * 멀티라인 모드
     * - true: 줄바꿈 허용
     * - false: 한 줄로 표시
     * - 'auto': 자동 결정
     */
    multiline: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['auto'])]),

    /** 
     * 텍스트 스타일 객체
     * - fontSize, fontFamily, color, lineHeight 등
     */
    style: PropTypes.object,

    /** 
     * 최대 표시 영역 크기
     * - 자동 폰트 피팅의 기준이 됨
     * - 피팅 실패 시 스크롤 모드로 전환
     */
    maxArea: PropTypes.shape({
        /** 최대 너비 (픽셀) */
        width: PropTypes.number,
        /** 최대 높이 (픽셀) */
        height: PropTypes.number
    }),

    /** 
     * 포커스 상태
     * - true일 때만 스크롤 애니메이션 동작
     */
    isFocused: PropTypes.bool,

    /** 
     * 스크롤 속도 (픽셀/초)
     * - 기본값: 30px/s
     */
    animSpeed: PropTypes.number,

    /** 
     * 최소 폰트 크기 강제 지정
     * - 기본값: 21px
     * - 자동 계산을 무시하고 이 값을 최소 크기로 사용
     */
    forceMinFontSize: PropTypes.number
};

export default CM_LABEL_Smart;

