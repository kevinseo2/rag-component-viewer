import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Smart from './CM_LABEL_Smart';

const WD_CLOCK_Analog = ({
    clock_style, // kept for prop compatibility
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
                onKey?.(action, action === 'OK' ? { clock_info, theme_id } : undefined);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, onKey, clock_info, theme_id]);

    const { hour, min, sec, date } = clock_info;


    // Scaled center for 320x240
    const centerX = 160;
    const centerY = 120;

    // Hour digit positions (Index 0 is 12 o'clock)
    // Scaled by 0.25 (X) or 0.5 (Y)? 
    // Actually, to keep it circular, we should scale both by 0.5 relative to the 1280x480's center (640, 240).
    // Original offsets from (640, 240):
    // X: [-23, 46, 96, 112, 96, 46, -23, -92, -142, -156, -142, -92]
    // Y: [-158, -142, -92, -23, 46, 96, 112, 96, 46, -23, -92, -142]
    // Scaled by 0.5:
    // X_off: [-11.5, 23, 48, 56, 48, 23, -11.5, -46, -71, -78, -71, -46]
    // Y_off: [-79, -71, -46, -11.5, 23, 48, 56, 48, 23, -11.5, -46, -71]

    const hourPosX = [148.5, 183, 208, 216, 208, 183, 148.5, 114, 89, 82, 89, 114];
    const hourPosY = [41, 49, 74, 108.5, 143, 168, 176, 168, 143, 108.5, 74, 49];

    const currentHr = hour % 12;
    const displayHr = currentHr || 12;
    const hrX = hourPosX[currentHr];
    const hrY = hourPosY[currentHr];

    // Colors
    const primaryColor = theme_id === 1 ? '#629DFF' : '#FF6205';
    const hourHandSrc = theme_id === 1
        ? '/ui/images/Common assets/clock/clock_analog_hr_blue.png'
        : '/ui/images/Common assets/clock/clock_analog_hr_orange.png';

    // Rotation calculation
    const secAngle = sec * 6;
    const minAngle = min * 6 + sec * 0.1;
    const hourAngle = (hour % 12) * 30 + min * 0.5;

    // Hand styling (scaled by 0.5)
    const handStyle = {
        position: 'absolute',
        left: '157.5px', // 160 - (5 * 0.5)
        top: '35px',     // 120 - (170 * 0.5)
        height: '170px', // Original was 170 to pivot? No, original top was 70, pivot was 170 down. Total height of img?
        // Let's just use original images and scale them with css.
        transformOrigin: '2.5px 85px',
        width: '5px', // scaled 10 -> 5
        objectFit: 'contain'
    };

    return (
        <div
            id="WD_CLOCK_Analog-main"
            className="relative w-[320px] h-[240px] bg-black"
        >
            {/* Hour Digit Label */}
            <div
                id="WD_CLOCK_Analog-digit-container"
                className="absolute w-[23px] h-[23px] flex items-center justify-center"
                style={{ left: `${hrX}px`, top: `${hrY}px` }}
            >
                <CM_LABEL_Smart
                    key={`${displayHr}`}
                    id="WD_CLOCK_Analog-digit-label"
                    text={`${displayHr}`}
                    align="center"
                    style={{
                        fontSize: 24, // Increased for visibility
                        color: primaryColor
                    }}
                    maxArea={{ width: 30, height: 30 }}
                />
            </div>

            {/* Second Hand */}
            <img
                id="WD_CLOCK_Analog-hand-sec"
                src="/ui/images/Common assets/clock/clock_analog_sec.png"
                style={{
                    ...handStyle,
                    transformOrigin: '2.5px 85px',
                    transform: `rotate(${secAngle}deg) scale(0.5)`
                }}
                alt=""
            />

            {/* Minute Hand */}
            <img
                id="WD_CLOCK_Analog-hand-min"
                src="/ui/images/Common assets/clock/clock_analog_min.png"
                style={{
                    ...handStyle,
                    transformOrigin: '2.5px 85px',
                    transform: `rotate(${minAngle}deg) scale(0.5)`
                }}
                alt=""
            />

            {/* Hour Hand */}
            <img
                id="WD_CLOCK_Analog-hand-hour"
                src={hourHandSrc}
                style={{
                    ...handStyle,
                    transformOrigin: '2.5px 85px',
                    transform: `rotate(${hourAngle}deg) scale(0.5)`
                }}
                alt=""
            />

            {/* Date Label */}
            <div
                id="WD_CLOCK_Analog-date-container"
                className="absolute bottom-[9px] left-0 w-full flex justify-center"
            >
                <CM_LABEL_Smart
                    key={date}
                    id="WD_CLOCK_Analog-date-label"
                    text={date}
                    align="center"
                    style={{
                        fontSize: 22, // Increased for visibility
                        color: "#898989"
                    }}
                    maxArea={{ width: 320, height: 26 }}
                />
            </div>
        </div>
    );
};

WD_CLOCK_Analog.propTypes = {
    /** 시계 스타일 (디지털/아날로그 등 구분용) */
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
    }),
    /** 테마 ID (1: Blue, 2: Orange 등) */
    theme_id: PropTypes.number,
    /** 현재 포커스 상태 여부 */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 */
    onKey: PropTypes.func
};

export default WD_CLOCK_Analog;

