import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CM_ANIM_Digit from './CM_ANIM_Digit';

/**
 * WD_PROGRESS_RemainTime component
 * Replicates lv_WD_PROGRESS_RemainTime.c logic
 * Handles time display with CM_ANIM_Digit and fade transitions on type change
 */
const WD_PROGRESS_RemainTime = ({
    id = "WD_PROGRESS_RemainTime",
    remain_hour = 0,
    remain_min = 0,
    style = {}
}) => {
    const [visibleHour, setVisibleHour] = useState(remain_hour);
    const [visibleMin, setVisibleMin] = useState(remain_min);
    const [opacity, setOpacity] = useState(1);
    const [animDir, setAnimDir] = useState(0); // 0: Snap, 1: Anim
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Determine time type based on hour and minute values (lv_WD_PROGRESS_RemainTime.c: set_time)
    const getTimeType = (h, m) => {
        if (h < 0 || m < 0) return 4;   // Type 4: --hr --min
        if (h > 0 && m > 0) return 1;   // Type 1: XXhr XXmin
        if (h > 0 && m === 0) return 2; // Type 2: XXhr
        if (h === 0 && m >= 0) return 3; // Type 3: XXmin
        return 4;
    };

    const getDigitLength = (val) => (val >= 10 ? 2 : 1);

    useEffect(() => {
        const newType = getTimeType(remain_hour, remain_min);
        const oldType = getTimeType(visibleHour, visibleMin);

        // force_change_anim logic from C code (digit length change)
        const forceChange = getDigitLength(remain_hour) !== getDigitLength(visibleHour) ||
            getDigitLength(remain_min) !== getDigitLength(visibleMin);

        if (newType !== oldType || forceChange) {
            // Type change or digit length change: Trigger Fade Out (200ms)
            setOpacity(0);
            setIsTransitioning(true);

            const timer = setTimeout(() => {
                setVisibleHour(remain_hour);
                setVisibleMin(remain_min);
                setAnimDir(0); // anim_digits(obj, 0)
                setOpacity(1);
                setIsTransitioning(false);
            }, 200);
            return () => clearTimeout(timer);
        } else {
            // Same type: Update values with animation
            setVisibleHour(remain_hour);
            setVisibleMin(remain_min);
            setAnimDir(1); // anim_digits(obj, 1)
        }
    }, [remain_hour, remain_min, visibleHour, visibleMin]);

    const currentType = getTimeType(visibleHour, visibleMin);

    // Visibility logic (lv_WD_PROGRESS_RemainTime.c: set_digits_visibility)
    const showH = currentType === 1 || currentType === 2 || currentType === 4;
    const showM = currentType === 1 || currentType === 3 || currentType === 4;

    // Digit calculations
    const h10 = visibleHour >= 10 ? Math.floor(visibleHour / 10) : (visibleHour < 0 ? -1 : -2); // -2: Hidden
    const h1 = visibleHour >= 0 ? visibleHour % 10 : -1;
    const m10 = visibleMin >= 10 ? Math.floor(visibleMin / 10) : (visibleMin < 0 ? -1 : -2); // -2: Hidden
    const m1 = visibleMin >= 0 ? visibleMin % 10 : -1;

    // minute_anim_delay logic
    // We need to know previous m10 to detect change. 
    // In React, we can approximate this by comparing current prop vs state.
    const m10Changed = Math.floor(remain_min / 10) !== Math.floor(visibleMin / 10);
    const m1Delay = (!isTransitioning && m10Changed) ? 100 : 0;

    return (
        <div
            id={id}
            className="flex items-end justify-center transition-opacity duration-200 ease-linear overflow-hidden"
            style={{
                width: '300px',
                height: '85px',
                opacity,
                ...style
            }}
        >
            <div id={`${id}-flex-container`} className="flex flex-row items-end justify-center h-full">
                {/* Hour Section */}
                {showH && (
                    <div id={`${id}-hour-group`} className="flex flex-row items-end">
                        {h10 !== -2 && (
                            <CM_ANIM_Digit id={`${id}-h10`} value={h10} direction={animDir} />
                        )}
                        <CM_ANIM_Digit id={`${id}-h1`} value={h1} direction={animDir} />
                        <span
                            id={`${id}-label_hour_unit`}
                            className="text-white text-[28px] font-bold mb-[11px] ml-[5px] mr-[8px]"
                            style={{ fontFamily: 'Roboto, sans-serif' }}
                        >
                            hr
                        </span>
                    </div>
                )}

                {/* Minute Section */}
                {showM && (
                    <div id={`${id}-min-group`} className="flex flex-row items-end">
                        {m10 !== -2 && (
                            <CM_ANIM_Digit id={`${id}-m10`} value={m10} direction={animDir} />
                        )}
                        <CM_ANIM_Digit id={`${id}-m1`} value={m1} direction={animDir} delay={m1Delay} />
                        <span
                            id={`${id}-label_minute_unit`}
                            className="text-white text-[28px] font-bold mb-[11px] ml-[5px]"
                            style={{ fontFamily: 'Roboto, sans-serif' }}
                        >
                            min
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

WD_PROGRESS_RemainTime.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 남은 시간 - 시 (단위 제외 순수 숫자, 음수일 경우 --로 표시) */
    remain_hour: PropTypes.number,
    /** 남은 시간 - 분 (단위 제외 순수 숫자, 음수일 경우 --로 표시) */
    remain_min: PropTypes.number,
    /** 스타일 객체 */
    style: PropTypes.object
};

export default WD_PROGRESS_RemainTime;

