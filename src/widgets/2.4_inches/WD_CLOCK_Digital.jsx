import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Smart from './CM_LABEL_Smart';
import CM_LABEL_Formatted from './CM_LABEL_Formatted';

const WD_CLOCK_Digital = ({
    clock_type,
    clock_style,
    clock_info,
    theme_id,
    isFocused = true,
    onKey,
}) => {
    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            const keyMap = {
                'Enter': 'OK',
                'Escape': 'BACK',
                'ArrowLeft': 'LEFT',
                'ArrowRight': 'RIGHT',
                'ArrowUp': 'UP',
                'ArrowDown': 'DOWN'
            };

            const action = keyMap[e.key];
            if (action) {
                e.preventDefault();
                onKey?.(action, action === 'OK' ? { clock_info, theme_id, clock_type } : undefined);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, onKey, clock_info, theme_id, clock_type]);

    const { hour, min, date, am_str, pm_str } = clock_info;

    // Time display logic
    const isAM = hour < 12;
    const ampmText = isAM ? am_str : pm_str;
    const ampmColor = isAM ? '#FF6205' : '#629DFF';

    // Format time string
    const pad = (num) => num.toString().padStart(2, '0');
    const timeStr = `${hour}:${pad(min)}`;

    // Simple centered layout for 320x240 (No backgrounds)
    const ampmY = 48;
    const ampmFontSize = 24;
    const timeY = 75;
    const timeFontSize = 86;
    const dateY = 175;
    const dateFontSize = 24;

    return (
        <div
            id={`WD_CLOCK_Digital-main-${clock_type}`}
            className="relative w-[320px] h-[240px] bg-black"
        >
            {/* AM/PM Label */}
            <div
                id="WD_CLOCK_Digital-ampm-container"
                className="absolute w-full flex justify-center"
                style={{ top: `${ampmY}px` }}
            >
                <CM_LABEL_Smart
                    key={ampmText}
                    id="WD_CLOCK_Digital-ampm-label"
                    text={ampmText}
                    align="center"
                    style={{
                        fontSize: ampmFontSize,
                        color: ampmColor
                    }}
                    maxArea={{ width: 320, height: 35 }}
                />
            </div>

            {/* Time Label */}
            <div
                id="WD_CLOCK_Digital-time-container"
                className="absolute w-full flex justify-center"
                style={{ top: `${timeY}px` }}
            >
                <CM_LABEL_Formatted
                    key={timeStr}
                    id="WD_CLOCK_Digital-time-label"
                    format={timeStr}
                    style={{
                        fontSize: timeFontSize,
                        color: "#FFFFFF",
                        fontFamily: "LOCK3B23"
                    }}
                    maxArea={{ width: 320, height: 110 }}
                />
            </div>

            {/* Date Label */}
            <div
                id="WD_CLOCK_Digital-date-container"
                className="absolute w-full flex justify-center"
                style={{ top: `${dateY}px` }}
            >
                <CM_LABEL_Smart
                    key={date}
                    id="WD_CLOCK_Digital-date-label"
                    text={date}
                    align="center"
                    style={{
                        fontSize: dateFontSize,
                        color: '#898989'
                    }}
                    maxArea={{ width: 320, height: 35 }}
                />
            </div>
        </div>
    );
};

WD_CLOCK_Digital.propTypes = {
    /** 시계 타입 구분용 */
    clock_type: PropTypes.number,
    /** 시계 스타일 구분용 */
    clock_style: PropTypes.number,
    /** 현재 시간 정보 객체 */
    clock_info: PropTypes.shape({
        /** 시 (0-23) */
        hour: PropTypes.number,
        /** 분 (0-59) */
        min: PropTypes.number,
        /** 초 (0-59) */
        sec: PropTypes.number,
        /** 날짜 표시 텍스트 */
        date: PropTypes.string,
        /** '오전' 표시 텍스트 */
        am_str: PropTypes.string,
        /** '오후' 표시 텍스트 */
        pm_str: PropTypes.string,
    }),
    /** 테마 ID (1: Blue, 2: Orange 등) */
    theme_id: PropTypes.number,
    /** 현재 포커스 상태 여부 */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 */
    onKey: PropTypes.func
};

export default WD_CLOCK_Digital;

