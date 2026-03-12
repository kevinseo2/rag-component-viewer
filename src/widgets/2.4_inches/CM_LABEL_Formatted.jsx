import React, { useState, useRef, useLayoutEffect, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * CM_LABEL_Formatted Component
 *
 * LVGL next_fmtlabel_lite 분석 기반 구현
 * - 포맷 문자열 + 슬롯 데이터 (STRING, IMAGE, NUMBER)
 * - 슬롯별 개별 스타일 지원
 * - 자동 폰트 피팅 (cal_min_font_size 로직)
 * - 피팅 실패 시 스크롤 모드 (가로/세로)
 * - 2초 대기 후 스크롤 시작
 * - wrap scroll (두 개의 라벨 사용)
 * - 마스크 효과
 */

// 슬롯 타입 상수
const SLOT_TYPE = {
    STRING: 'string',
    IMAGE: 'image',
    NUMBER: 'number'
};

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

const CM_LABEL_Formatted = ({
    id,
    format = '',
    slots = [],
    align = 'center',
    multiline = false,
    style = {},
    maxArea,
    isFocused = true,
    animSpeed = 30,
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

    const SCROLL_DELAY_MS = 2000;
    const SPACE_GAP = 50;

    // 슬롯 키 (변경 감지용)
    const slotsKey = useMemo(() => JSON.stringify(slots), [slots]);

    // 슬롯 렌더링 함수
    const renderSlotContent = useCallback((slot, index, fontSize) => {
        if (!slot) return null;

        const slotStyle = slot.style || {};

        switch (slot.type) {
            case SLOT_TYPE.STRING:
                return (
                    <span key={index} style={{ ...slotStyle }}>
                        {slot.value}
                    </span>
                );

            case SLOT_TYPE.IMAGE:
                return (
                    <img
                        key={index}
                        src={slot.value}
                        alt=""
                        style={{
                            height: `${fontSize}px`,
                            verticalAlign: 'middle',
                            display: 'inline-block',
                            ...slotStyle
                        }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                );

            case SLOT_TYPE.NUMBER:
                return (
                    <span key={index} style={{ ...slotStyle }}>
                        {slot.value}
                    </span>
                );

            default:
                // 레거시 지원: 타입 없이 문자열로 전달된 경우
                if (typeof slot === 'string') {
                    if (slot.includes('/') || slot.endsWith('.png') || slot.endsWith('.jpg')) {
                        return (
                            <img
                                key={index}
                                src={slot}
                                alt=""
                                style={{ height: `${fontSize}px`, verticalAlign: 'middle', display: 'inline-block' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        );
                    }
                    return <span key={index}>{slot}</span>;
                }
                return <span key={index}>{String(slot.value ?? slot)}</span>;
        }
    }, []);

    // 포맷 문자열 파싱 및 렌더링
    const renderFormattedContent = useCallback((fontSize) => {
        if (!format) return null;

        // {0}, {1}, {2} ... 패턴을 파싱
        const parts = format.split(/(\{(\d+)\})/);
        const result = [];

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];

            // {숫자} 패턴 매칭
            const match = part.match(/^\{(\d+)\}$/);
            if (match) {
                const slotIndex = parseInt(match[1], 10);
                const slot = slots[slotIndex];
                if (slot !== undefined) {
                    result.push(renderSlotContent(slot, `slot-${slotIndex}`, fontSize));
                }
                // 다음 인덱스는 숫자만 있는 부분이므로 스킵
                i++;
            } else if (part && !part.match(/^\d+$/)) {
                // 일반 텍스트 (숫자만 있는 부분은 스킵)
                // 줄바꿈 처리
                const lines = part.split('\n');
                lines.forEach((line, lineIndex) => {
                    if (lineIndex > 0) {
                        result.push(<br key={`br-${i}-${lineIndex}`} />);
                    }
                    if (line) {
                        result.push(<span key={`text-${i}-${lineIndex}`}>{line}</span>);
                    }
                });
            }
        }

        return result;
    }, [format, slots, renderSlotContent]);

    // 폰트 피팅 및 스크롤 모드 결정 (C 코드 fit_font_size 로직 반영)
    useLayoutEffect(() => {
        if (!maxArea || !format) {
            setIsScrollMode(false);
            return;
        }

        const baseFontSize = parseInt(style.fontSize || '30', 10);
        const minFontSize = forceMinFontSize > 0 ? forceMinFontSize : calculateMinFontSize(baseFontSize);

        // 상향 조정 로직: 21px 미만이라도 21px까지 키워서 시도
        const startFontSize = Math.max(baseFontSize, minFontSize);

        // console.log(`[CM_LABEL_Formatted:${id}] --- Start Measurement ---`);
        // console.log(`[CM_LABEL_Formatted:${id}] Format: "${format}"`);
        // console.log(`[CM_LABEL_Formatted:${id}] MaxArea: ${maxArea.width}x${maxArea.height} | Base: ${baseFontSize}px | Min: ${minFontSize}px | Start: ${startFontSize}px`);

        let bestFitSize = baseFontSize;
        let shouldScroll = false;

        // 정확한 측정을 위해 격리된 임시 컨테이너 생성
        const measureEl = document.createElement('div');
        measureEl.style.visibility = 'hidden';
        measureEl.style.position = 'absolute';
        measureEl.style.top = '-9999px';
        measureEl.style.left = '-9999px';
        measureEl.style.whiteSpace = multiline ? 'pre-wrap' : 'nowrap';
        measureEl.style.fontFamily = style.fontFamily || getComputedStyle(document.body).fontFamily;
        measureEl.style.fontWeight = style.fontWeight || 'normal';
        measureEl.style.letterSpacing = style.letterSpacing || 'normal';

        // FmtLabel은 이미지 등이 포함될 수 있으므로 기존 measureRef의 HTML을 활용하거나 수동 구축
        // 여기서는 루프 성능을 위해 innerHTML을 직접 생성하는 helper 방식을 사용하거나
        // 간단히 텍스트와 이미지 태그를 모방합니다.
        document.body.appendChild(measureEl);

        const getTempHTML = (fontSize) => {
            // slots를 순회하며 이미지 높이 등을 반영한 HTML 문자열 생성
            const parts = format.split(/(\{(\d+)\})/);
            let html = "";
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const match = part.match(/^\{(\d+)\}$/);
                if (match) {
                    const slotIndex = parseInt(match[1], 10);
                    const slot = slots[slotIndex];
                    if (slot) {
                        if (slot.type === 'image') {
                            html += `<img src="${slot.value}" style="height:${fontSize}px; vertical-align:middle; display:inline-block;" />`;
                        } else {
                            html += `<span>${slot.value}</span>`;
                        }
                    }
                    i++;
                } else if (part && !part.match(/^\d+$/)) {
                    html += `<span>${part.replace(/\n/g, '<br/>')}</span>`;
                }
            }
            return html;
        };

        if (multiline) {
            measureEl.style.display = 'block';
            measureEl.style.width = `${maxArea.width}px`;
        } else {
            measureEl.style.display = 'inline-block';
            measureEl.style.width = 'auto';
        }

        let fitFound = false;
        let fontSize = startFontSize;

        while (true) {
            measureEl.style.fontSize = `${fontSize}px`;
            measureEl.style.lineHeight = style.lineHeight || '1.2';
            measureEl.innerHTML = getTempHTML(fontSize);

            const rect = measureEl.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;

            const fits = multiline
                ? height <= maxArea.height
                : width <= maxArea.width;

            // console.log(`[CM_LABEL_Formatted:${id}] Testing Size: ${fontSize}px -> Measured: ${width.toFixed(2)}x${height.toFixed(2)} | Fits: ${fits}`);

            if (fits) {
                bestFitSize = fontSize;
                fitFound = true;
                break;
            }

            const absoluteMin = Math.min(baseFontSize, minFontSize);
            if (fontSize <= absoluteMin) break;
            fontSize--;
        }

        if (!fitFound) {
            bestFitSize = baseFontSize;
            shouldScroll = true;
            console.warn(`[CM_LABEL_Formatted:${id}] Fitting FAILED. Scroll mode will be enabled.`);
        }

        // 최종 크기 확정 및 제거
        measureEl.style.fontSize = `${bestFitSize}px`;
        measureEl.innerHTML = getTempHTML(bestFitSize);
        const finalRect = measureEl.getBoundingClientRect();
        const finalWidth = finalRect.width;
        const finalHeight = finalRect.height;
        document.body.removeChild(measureEl);

        // console.log(`[CM_LABEL_Formatted:${id}] Final Result -> Size: ${bestFitSize}px | Scroll: ${shouldScroll} | Content: ${finalWidth.toFixed(2)}x${finalHeight.toFixed(2)}`);
        //console.log(`[CM_LABEL_Formatted:${id}] -----------------------------`);

        setCurrentFontSize(bestFitSize);
        setIsScrollMode(shouldScroll);
        setContentSize({ width: finalWidth, height: finalHeight });
        setScrollOffset(0);

    }, [id, format, slotsKey, maxArea?.width, maxArea?.height, multiline, style.fontSize, style.fontFamily, style.fontWeight, style.lineHeight, style.letterSpacing, forceMinFontSize]);

    // 스크롤 애니메이션
    const startScrollAnimation = useCallback(() => {
        if (!isScrollMode || !isFocused) return;

        const lineHeight = currentFontSize * 1.2;
        const gap = multiline ? lineHeight : SPACE_GAP;
        const totalDistance = multiline
            ? contentSize.height + gap
            : contentSize.width + gap;

        const duration = (totalDistance / animSpeed) * 1000;

        let startTime = null;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            setScrollOffset(progress * totalDistance);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                setScrollOffset(0);
                setIsAnimating(false);

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
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        if (delayTimerRef.current) {
            clearTimeout(delayTimerRef.current);
            delayTimerRef.current = null;
        }

        if (isScrollMode && isFocused) {
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
        lineHeight: style.lineHeight || '1.2',
        whiteSpace: multiline ? 'pre-wrap' : 'nowrap',
        width: multiline ? maxArea?.width : 'auto',
        textAlign: align.includes('left') ? 'left' : align.includes('right') ? 'right' : 'center',
    };

    const lineHeight = currentFontSize * 1.2;
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
        <div id={`${id || 'CM_LABEL_Formatted'}-container`} ref={containerRef} style={containerStyle}>
            {isScrollMode && <div id={`${id || 'CM_LABEL_Formatted'}-mask`} style={maskStyle} />}

            <div id={`${id || 'CM_LABEL_Formatted'}-content-wrapper`} style={contentWrapperStyle}>
                <div id={`${id || 'CM_LABEL_Formatted'}-measure`} ref={measureRef} style={textStyle}>
                    {renderFormattedContent(currentFontSize)}
                </div>

                {isScrollMode && (
                    <div id={`${id || 'CM_LABEL_Formatted'}-scroll-copy`} style={{ ...textStyle, [multiline ? 'marginTop' : 'marginLeft']: `${gap}px` }}>
                        {renderFormattedContent(currentFontSize)}
                    </div>
                )}
            </div>
        </div>
    );
};

CM_LABEL_Formatted.propTypes = {
    /** 컴포넌트 ID */
    id: PropTypes.string,

    /** 
     * 포맷 문자열
     * - {0}, {1}, {2} 형태의 플레이스홀더 포함
     * - 예: "Time: {0}:{1} {2}"
     */
    format: PropTypes.string,

    /** 
     * 슬롯 데이터 배열
     * - 포맷 문자열의 {숫자}에 매핑되는 값들
     */
    slots: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            /** 
             * 슬롯 타입
             * - 'string': 텍스트
             * - 'image': 이미지 URL
             * - 'number': 숫자
             */
            type: PropTypes.oneOf(['string', 'image', 'number']),
            /** 슬롯 값 */
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            /** 슬롯별 개별 스타일 */
            style: PropTypes.object
        })
    ])),

    /** 
     * 텍스트 정렬
     * - 9가지 정렬 옵션 지원
     */
    align: PropTypes.oneOf(['left', 'center', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'bottom-mid']),

    /** 
     * 멀티라인 모드
     * - true: 줄바꿈 허용
     * - false: 한 줄로 표시
     */
    multiline: PropTypes.bool,

    /** 
     * 텍스트 스타일
     * - fontSize, fontFamily, color, lineHeight 등
     */
    style: PropTypes.object,

    /** 
     * 최대 표시 영역
     * - 자동 폰트 피팅의 기준
     * - 피팅 실패 시 스크롤 모드 전환
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
     */
    forceMinFontSize: PropTypes.number
};

export default CM_LABEL_Formatted;

