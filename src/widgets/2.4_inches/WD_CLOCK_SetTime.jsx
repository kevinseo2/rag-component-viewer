import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CM_PICKER_Roller from './CM_PICKER_Roller';
import OV_TITLE_2Line from './OV_TITLE_2Line';

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

const WD_CLOCK_SetTime = ({
    id = "WD_CLOCK_SetTime",
    initialHour = 12,
    initialMinute = 0,
    initialAmPm = 1, // 1=AM, 2=PM
    initialFocusState = 1,
    isFocused = true,
    onKey,
    style = {}
}) => {
    // Layout Constants
    const ITEM_HEIGHT = 68;
    const PICKER_HEIGHT = ITEM_HEIGHT * 3;
    const PICKER_TOP = 240 - PICKER_HEIGHT;

    // State
    const [hour, setHour] = useState(initialHour);
    const [minute, setMinute] = useState(initialMinute);
    const [ampm, setAmPm] = useState(initialAmPm);
    const [focusState, setFocusState] = useState(initialFocusState); // 1=Hour, 2=Minute

    // Sync state with props when they change
    useEffect(() => {
        setHour(initialHour);
        setMinute(initialMinute);
        setAmPm(initialAmPm);
        setFocusState(initialFocusState);
    }, [initialHour, initialMinute, initialAmPm, initialFocusState]);

    // Key Handler
    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            let handled = false;

            switch (e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    if (focusState === 1) { // Hour
                        const nextHour = hour === 1 ? 12 : hour - 1;
                        if (hour === 12 && nextHour === 11) {
                            setAmPm(a => a === 1 ? 2 : 1);
                        }
                        setHour(nextHour);
                    } else { // Minute
                        setMinute(prev => prev === 0 ? 59 : prev - 1);
                    }
                    handled = true;
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    if (focusState === 1) { // Hour
                        const nextHour = hour === 12 ? 1 : hour + 1;
                        if (hour === 11 && nextHour === 12) {
                            setAmPm(a => a === 1 ? 2 : 1);
                        }
                        setHour(nextHour);
                    } else { // Minute
                        setMinute(prev => prev === 59 ? 0 : prev + 1);
                    }
                    handled = true;
                    break;
                case 'Enter':
                    if (focusState === 1) {
                        setFocusState(2); // Hour -> Minute
                    } else {
                        // Minute -> Complete
                        if (onKey) onKey('OK', { hour, minute, ampm });
                    }
                    handled = true;
                    break;
                case 'Escape':
                case 'Backspace':
                    if (focusState === 2) {
                        setFocusState(1); // Minute -> Hour
                    } else {
                        if (onKey) onKey('BACK');
                    }
                    handled = true;
                    break;
                default:
                    break;
            }

            if (handled) {
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hour, minute, ampm, focusState, onKey, isFocused]);


    return (
        <div id={id} className="relative w-[320px] h-[240px] bg-black overflow-hidden" style={style}>
            {/* Title */}
            <OV_TITLE_2Line title="시계" />

            {/* Background Mask Image */}
            <img
                src="/ui/images/Background/mask_picker_02.png"
                alt="mask"
                className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
            />

            {/* Main Picker Group */}
            <div
                id="main-picker-group"
                className="absolute w-full flex flex-row items-center justify-center"
                style={{ top: PICKER_TOP, height: PICKER_HEIGHT }}
            >

                {/* Hour Vertical Group */}
                <div
                    id="hour-vertical-group"
                    className="relative w-[104px] h-full flex flex-col items-center justify-center"
                >
                    {/* Focus Lines for Hour */}
                    {focusState === 1 && (
                        <div
                            id="hour-focus-lines"
                            className="absolute w-full z-30 pointer-events-none"
                            style={{ top: ITEM_HEIGHT }}
                        >
                            <div
                                id="divider-top-hour"
                                className="w-full h-[2px] bg-white opacity-50"
                                style={{ marginBottom: ITEM_HEIGHT }}
                            ></div>
                            <div id="divider-bottom-hour" className="w-full h-[2px] bg-white opacity-50"></div>
                        </div>
                    )}

                    {/* Unfocused Mask for Hour */}
                    {focusState !== 1 && (
                        <div className="absolute top-0 w-full h-full flex flex-col justify-between pointer-events-none z-20">
                            <div
                                id="unfocused-mask-top-hour"
                                className="w-full bg-black"
                                style={{ height: ITEM_HEIGHT }}
                            ></div>
                            <div
                                id="unfocused-mask-bottom-hour"
                                className="w-full bg-black"
                                style={{ height: ITEM_HEIGHT }}
                            ></div>
                        </div>
                    )}

                    <CM_PICKER_Roller
                        id={`${id}-roller-hour`}
                        items={HOURS}
                        selectedIndex={HOURS.indexOf(String(hour))}
                        visibleItems={3}
                        itemHeight={ITEM_HEIGHT}
                        fontSize={40}
                        font="LOCK3B"
                        textColor="#ffffff"
                    />
                </div>

                {/* Colon */}
                <div className="w-[30px] flex items-center justify-center text-[40px] font-['LOCK3B'] text-white z-20">
                    :
                </div>

                {/* Minute Vertical Group */}
                <div className="relative w-[104px] h-full flex flex-col items-center justify-center">
                    {/* Focus Lines for Minute */}
                    {focusState === 2 && (
                        <div
                            id="minute-focus-lines"
                            className="absolute w-full z-30 pointer-events-none"
                            style={{ top: ITEM_HEIGHT }}
                        >
                            <div
                                id="divider-top-minute"
                                className="w-full h-[2px] bg-white opacity-50"
                                style={{ marginBottom: ITEM_HEIGHT }}
                            ></div>
                            <div id="divider-bottom-minute" className="w-full h-[2px] bg-white opacity-50"></div>
                        </div>
                    )}

                    {/* Unfocused Mask for Minute */}
                    {focusState !== 2 && (
                        <div className="absolute top-0 w-full h-full flex flex-col justify-between pointer-events-none z-20">
                            <div
                                id="unfocused-mask-top-minute"
                                className="w-full bg-black"
                                style={{ height: ITEM_HEIGHT }}
                            ></div>
                            <div
                                id="unfocused-mask-bottom-minute"
                                className="w-full bg-black"
                                style={{ height: ITEM_HEIGHT }}
                            ></div>
                        </div>
                    )}

                    <CM_PICKER_Roller
                        id={`${id}-roller-minute`}
                        items={MINUTES}
                        selectedIndex={MINUTES.indexOf(String(minute).padStart(2, '0'))}
                        visibleItems={3}
                        itemHeight={ITEM_HEIGHT}
                        fontSize={40}
                        font="LOCK3B"
                        textColor="#ffffff"
                    />
                </div>

                {/* AM/PM Label */}
                <div
                    className="w-[41px] ml-[9px] flex items-center justify-center text-[26px] font-['LGSBD'] text-white z-20"
                >
                    {ampm === 2 ? 'PM' : 'AM'}
                </div>
            </div>

        </div>
    );
};

WD_CLOCK_SetTime.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 초기 설정 '시' (1~12) */
    initialHour: PropTypes.number,
    /** 초기 설정 '분' (0~59) */
    initialMinute: PropTypes.number,
    /** 초기 설정 오전/오후 (1: AM, 2: PM) */
    initialAmPm: PropTypes.oneOf([1, 2]),
    /** 초기 포커스 위치 (1: Hour, 2: Minute) */
    initialFocusState: PropTypes.oneOf([1, 2]),
    /** 현재 포커스 상태 여부 */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 (완료 시 {hour, minute, ampm} 전달) */
    onKey: PropTypes.func,
    /** 커스텀 스타일 객체 */
    style: PropTypes.object
};

export default WD_CLOCK_SetTime;


