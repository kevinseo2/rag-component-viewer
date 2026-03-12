import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * CM_ANIM_Digit - 세로 스크롤 숫자 애니메이션 컴포넌트
 *
 * C 코드(lv_digit_anim.c)의 로직을 재현합니다.
 * 숫자가 변경되면 direction에 따라 위/아래로 슬라이드하여 새 숫자를 표시합니다.
 *
 * 애니메이션 구조 (3칸 세로 슬롯):
 * - label_next_up (상단): direction > 0일 때 새 값이 위에서 내려옴
 * - label_current (중앙): 현재 표시 중인 값
 * - label_next_down (하단): direction < 0일 때 새 값이 아래에서 올라옴
 *
 * 애니메이션 흐름:
 * 1. value 변경 감지
 * 2. delay만큼 대기
 * 3. translateY 이동 (667ms ease-in-out)
 * 4. 완료 후 displayValue 갱신, translateY 초기화
 *
 * - 셀 높이: 85px (ITEM_HEIGHT)
 * - 애니메이션 시간: 667ms (C 코드 lv_anim_set_time 기준)
 * - 폰트: 87px, bold, 흰색
 * - value가 음수이면 '-' (하이픈)을 표시
 */
const CM_ANIM_Digit = ({
    id = "digit_anim",
    value = 0,
    direction = 0,
    delay = 0,
    className = "",
    style = {}
}) => {
    /** 현재 화면에 표시 중인 숫자 값 */
    const [displayValue, setDisplayValue] = useState(value);
    /** 애니메이션 도착점에 표시될 새 숫자 값 */
    const [nextValue, setNextValue] = useState(value);
    /** 애니메이션 상태 ('idle': 정지, 'animating': 이동 중) */
    const [animState, setAnimState] = useState('idle');
    /** 현재 Y축 이동량 (px) */
    const [translateY, setTranslateY] = useState(0);

    /** 각 숫자 셀의 높이 (px) */
    const ITEM_HEIGHT = 85;
    /** 애니메이션 지속 시간 (C 코드: lv_anim_set_time(&_d->anim0, 667)) */
    const ANIMATION_TIME = 667;

    useEffect(() => {
        if (value === displayValue) return;

        // Start Animation logic
        setNextValue(value);

        if (direction === 0) {
            setDisplayValue(value);
            return;
        }

        setAnimState('animating');

        // Direction > 0: Moves DOWN (0 -> +85). New value comes from TOP.
        // Direction < 0: Moves UP (0 -> -85). New value comes from BOTTOM.
        const targetY = direction > 0 ? ITEM_HEIGHT : -ITEM_HEIGHT;

        const startTimeout = setTimeout(() => {
            setTranslateY(targetY);
        }, delay || 0);

        const endTimeout = setTimeout(() => {
            // Animation Finished: lv_digit_anim.c -> anim_ready_cb_anim0
            setAnimState('idle');
            setDisplayValue(value);
            setTranslateY(0);
        }, (delay || 0) + ANIMATION_TIME);

        return () => {
            clearTimeout(startTimeout);
            clearTimeout(endTimeout);
        };
    }, [value, direction, delay, displayValue]);

    const isHyphen = value < 0;

    // Style mapping from font/color
    const textColor = style.text_color || "#FFFFFF";
    // LOCK3B23_87 -> roughly 87px
    const fontSize = "87px";

    return (
        <div
            id={id}
            className={`relative overflow-hidden flex flex-col items-center justify-center ${className}`}
            style={{
                height: `${ITEM_HEIGHT}px`,
                width: 'content-fit',
                minWidth: '40px',
                ...style
            }}
        >
            <div
                id={`${id}-scroll-container`}
                className={`flex flex-col items-center transition-transform ${animState === 'animating' ? 'duration-[667ms] ease-in-out' : 'duration-0'
                    }`}
                style={{
                    transform: `translateY(${translateY}px)`,
                    color: textColor,
                    fontSize: fontSize,
                    fontWeight: 'bold',
                    fontFamily: 'Roboto, sans-serif' // Fallback
                }}
            >
                {/* Next Up (Top) - Visible when moving DOWN */}
                <div
                    id={`${id}-label_next_up`}
                    className="flex items-center justify-center"
                    style={{ height: `${ITEM_HEIGHT}px` }}
                >
                    {isHyphen ? '-' : (direction > 0 ? nextValue : displayValue)}
                </div>

                {/* Current (Center) */}
                <div
                    id={`${id}-label_current`}
                    className="flex items-center justify-center"
                    style={{ height: `${ITEM_HEIGHT}px` }}
                >
                    {isHyphen ? '-' : displayValue}
                </div>

                {/* Next Down (Bottom) - Visible when moving UP */}
                <div
                    id={`${id}-label_next_down`}
                    className="flex items-center justify-center"
                    style={{ height: `${ITEM_HEIGHT}px` }}
                >
                    {isHyphen ? '-' : (direction < 0 ? nextValue : displayValue)}
                </div>
            </div>
        </div>
    );
};

CM_ANIM_Digit.propTypes = {
    /**
     * 컴포넌트의 고유 식별자 (HTML id 속성)
     * 내부적으로 `${id}-scroll-container`, `${id}-label_current` 등의 하위 요소 id에 사용됩니다.
     */
    id: PropTypes.string,

    /**
     * 표시할 숫자 값
     * 이 값이 변경되면 direction에 따라 슬라이드 애니메이션이 실행됩니다.
     * 음수(-1 등)를 전달하면 숫자 대신 '-' (하이픈)을 표시합니다.
     * @example 0, 5, 9, -1
     */
    value: PropTypes.number,

    /**
     * 애니메이션 방향
     * - 0: 애니메이션 없음 (즉시 값 변경)
     * - 1: 아래로 이동 (새 값이 위에서 내려옴, translateY: 0 → +85)
     * - -1: 위로 이동 (새 값이 아래에서 올라옴, translateY: 0 → -85)
     */
    direction: PropTypes.oneOf([-1, 0, 1]),

    /**
     * 애니메이션 시작 전 지연 시간 (밀리초)
     * 여러 CM_ANIM_Digit을 순차적으로 애니메이션할 때 자릿수별 딜레이를 줄 수 있습니다.
     * @example 0, 100, 200
     */
    delay: PropTypes.number,

    /**
     * 외부 컨테이너에 추가할 CSS 클래스명
     */
    className: PropTypes.string,

    /**
     * 외부 컨테이너에 적용할 추가 인라인 스타일
     * text_color 속성으로 숫자 색상을 변경할 수 있습니다.
     * @example { text_color: "#FF0000" }
     */
    style: PropTypes.object
};

export default CM_ANIM_Digit;

