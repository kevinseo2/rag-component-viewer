import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * CM_CTRL_Slider - Continuous CM_CTRL_Slider Widget
 * 
 * MD Analysis:
 * - Standard CM_CTRL_Slider control.
 * - Custom styling for track and thumb.
 */
const CM_CTRL_Slider = ({
    min = 0,
    max = 100,
    value,
    onChange,
    width = 244
}) => {
    return (
        <div
            className="flex items-center justify-center"
            style={{ width: `${width}px`, height: '40px' }} // Touch area height
        >
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                style={{
                    outline: 'none',
                    accentColor: '#ffffff' // basic styling, custom css usually needed for advanced thumb
                }}
            />
            {/* 
               Note: Full custom styling for thumb usually requires CSS classes 
               (e.g., ::-webkit-CM_CTRL_Slider-thumb). 
               Since we are using Tailwind/Inline, we rely on accentColor or provided globals.
               For this demo, accentColor works for WebP video capture visualization.
            */}
        </div>
    );
};

CM_CTRL_Slider.propTypes = {
    /** 슬라이더 최소값 */
    min: PropTypes.number,

    /** 슬라이더 최대값 */
    max: PropTypes.number,

    /** 현재 슬라이더 값 (필수) */
    value: PropTypes.number.isRequired,

    /** 
     * 값 변경 시 호출되는 콜백 함수 (필수)
     * @param {number} newValue - 변경된 슬라이더 값
     */
    onChange: PropTypes.func.isRequired,

    /** 슬라이더 너비 (픽셀, 기본값: 244px) */
    width: PropTypes.number
};

export default CM_CTRL_Slider;

