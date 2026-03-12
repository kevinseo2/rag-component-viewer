import React from 'react';
import PropTypes from 'prop-types';

/**
 * WD_PROGRESS_Bar
 * Image-based progress bar with sliding animation.
 * Matches C code implementation: lv_container_progressbar
 *
 * Logic: x = -320 + (320 * percent) / 100
 *   - 0%   → x = -320 (hidden)
 *   - 50%  → x = -160 (half visible)
 *   - 100% → x = 0 (fully visible)
 */
const WD_PROGRESS_Bar = ({
    id = "WD_PROGRESS_Bar",
    percent = 0,
    style = {}
}) => {
    // Ensure percent is between 0 and 100
    const normalizedPercent = Math.min(100, Math.max(0, percent));

    // Calculate x position: same as C code formula
    const progressX = -320 + (320 * normalizedPercent) / 100;

    return (
        <div
            id={id}
            className="w-[320px] relative overflow-hidden"
            style={style}
        >
            {/* Background track image */}
            <img
                id={`${id}-track`}
                src="/ui/images/ProgressBar/progress_bar_track.png"
                alt="progress track"
                className="w-[320px] h-auto"
                onError={(e) => {
                    // Fallback to CSS if image fails
                    e.target.style.display = 'none';
                    e.target.parentElement.style.height = '4px';
                    e.target.parentElement.style.backgroundColor = '#333333';
                }}
            />
            {/* Progress fill image - slides from left */}
            <img
                id={`${id}-fill`}
                src="/ui/images/ProgressBar/progress_bar_primary_orange.png"
                alt="progress"
                className="absolute top-0 w-[320px] h-auto transition-all duration-300 ease-out"
                style={{ left: `${progressX}px` }}
                onError={(e) => e.target.style.display = 'none'}
            />
        </div>
    );
};

WD_PROGRESS_Bar.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 진행률 퍼센트 (0~100) */
    percent: PropTypes.number,
    /** 커스텀 스타일 객체 */
    style: PropTypes.object
};

export default WD_PROGRESS_Bar;

