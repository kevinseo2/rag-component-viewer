import React from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Smart from './CM_LABEL_Smart';

/**
 * WD_CLOCK_Idle
 * Clock display widget with AM/PM indicator.
 */
const WD_CLOCK_Idle = ({
    id = "WD_CLOCK_Idle",
    hour = 12,
    minute = 0,
    ampm = 1,
    isFocused = true,
    onKey,
    style = {}
}) => {
    const isDoubleDigit = hour >= 10;

    // Dynamic position for AM/PM indicator
    const ampmPosX = isDoubleDigit ? 250 : 220;
    const ampmPosY = 36;
    const ampmImagePath = ampm === 1
        ? '/ui/images/Clock/img_clock_am.png'
        : '/ui/images/Clock/img_clock_pm.png';

    return (
        <div
            id={id}
            className="w-[320px] h-[240px] bg-black relative"
            style={style}
        >
            {/* AM/PM Indicator */}
            <img
                id={`${id}-ampm`}
                src={ampmImagePath}
                alt="ampm"
                className="absolute w-auto h-auto transition-all duration-300"
                style={{ left: `${ampmPosX}px`, top: `${ampmPosY}px` }}
            />

            {/* Time Display Container */}
            <div
                id={`${id}-time-container`}
                className="absolute left-1/2 top-1/2 -translate-x-[calc(50%+5px)] -translate-y-[calc(50%+3px)] flex flex-row items-baseline justify-center"
            >
                {isDoubleDigit && (
                    <CM_LABEL_Smart
                        id={`${id}-hour10`}
                        key={`h10-${hour}`}
                        text={Math.floor(hour / 10).toString()}
                        maxArea={{ width: 66, height: 110 }}
                        style={{ fontSize: 108, fontFamily: "LOCK3M", color: "#ffffff" }}
                        align="left"
                    />
                )}
                <CM_LABEL_Smart
                    id={`${id}-hour01`}
                    key={`h01-${hour}`}
                    text={(hour % 10).toString()}
                    maxArea={{ width: 66, height: 110 }}
                    style={{ fontSize: 108, fontFamily: "LOCK3M", color: "#ffffff" }}
                    align="left"
                />
                <CM_LABEL_Smart
                    id={`${id}-colon`}
                    key="colon"
                    text=":"
                    maxArea={{ width: 30, height: 110 }}
                    style={{ fontSize: 108, fontFamily: "LOCK3M", color: "#ffffff" }}
                    align="center"
                />
                <CM_LABEL_Smart
                    id={`${id}-min10`}
                    key={`m10-${minute}`}
                    text={Math.floor(minute / 10).toString()}
                    maxArea={{ width: 66, height: 110 }}
                    style={{ fontSize: 108, fontFamily: "LOCK3M", color: "#ffffff" }}
                    align="left"
                />
                <CM_LABEL_Smart
                    id={`${id}-min01`}
                    key={`m01-${minute}`}
                    text={(minute % 10).toString()}
                    maxArea={{ width: 66, height: 110 }}
                    style={{ fontSize: 108, fontFamily: "LOCK3M", color: "#ffffff" }}
                    align="left"
                />
            </div>
        </div>
    );
};

WD_CLOCK_Idle.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 표시할 '시' (1~12) */
    hour: PropTypes.number,
    /** 표시할 '분' (0~59) */
    minute: PropTypes.number,
    /** 오전/오후 구분 (1: AM, 2: PM) */
    ampm: PropTypes.oneOf([1, 2]),
    /** 현재 포커스 상태 여부 */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 */
    onKey: PropTypes.func,
    /** 커스텀 스타일 객체 */
    style: PropTypes.object
};

export default WD_CLOCK_Idle;

