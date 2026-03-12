import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import CM_CTRL_Slider from './CM_CTRL_Slider';
import CM_TITLE_WithArrow from './CM_TITLE_WithArrow';

/**
 * CM_CTRL_SliderContinuous Widget
 * - Displays a header title.
 * - Displays the current numeric value.
 * - Displays a continuous CM_CTRL_Slider and handles its value internally.
 */
const CM_CTRL_SliderContinuous = ({
    id = "CM_CTRL_SliderContinuous",
    title = "Title",
    showBackArrow = false,
    initialValue = 50,
    min = 0,
    max = 100,
    step = 1,
    isFocused = true,
    onKey = null
}) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleValueChange = useCallback((newValue) => {
        setValue(newValue);
        onKey?.('CHANGE', { value: newValue });
    }, [onKey]);

    // Handle Keyboard Events
    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            let handled = false;
            if (e.key === 'ArrowLeft') {
                const nextVal = Math.max(min, value - step);
                handleValueChange(nextVal);
                handled = true;
            } else if (e.key === 'ArrowRight') {
                const nextVal = Math.min(max, value + step);
                handleValueChange(nextVal);
                handled = true;
            } else if (e.key === 'Enter') {
                onKey?.('OK', { value });
                handled = true;
            } else if (e.key === 'Escape' || e.key === 'Backspace') {
                onKey?.('BACK', null);
                handled = true;
            }

            if (handled) {
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, value, min, max, step, onKey, handleValueChange]);

    return (
        <div
            id={id}
            className="relative bg-black w-[320px] h-[240px] overflow-hidden"
            style={{ fontFamily: 'LGSBD, sans-serif' }}
        >
            <CM_TITLE_WithArrow
                id={`${id}-header`}
                title={title}
                showBackArrow={showBackArrow}
                onBack={() => onKey?.('BACK', null)}
            />

            <div
                id={`${id}-value`}
                className="absolute text-white text-center flex items-center justify-center font-semibold"
                style={{
                    left: '19px',
                    top: '74px',
                    width: '282px',
                    height: '48px',
                    fontSize: '42px'
                }}
            >
                {value}
            </div>

            <div
                id={`${id}-CM_CTRL_Slider-container`}
                className="absolute"
                style={{
                    left: '38px',
                    top: '146px',
                    width: '244px',
                    height: '40px'
                }}
            >
                <CM_CTRL_Slider
                    min={min}
                    max={max}
                    value={value}
                    onChange={handleValueChange}
                    width={244}
                />
            </div>
        </div>
    );
};

CM_CTRL_SliderContinuous.propTypes = {
    /** 컴포넌트 ID */
    id: PropTypes.string,

    /** 상단 타이틀 텍스트 (CM_TITLE_WithArrow로 표시) */
    title: PropTypes.string,

    /** 뒤로가기 화살표 표시 여부 */
    showBackArrow: PropTypes.bool,

    /** 
     * 슬라이더 초기값
     * - min과 max 사이의 값이어야 함
     */
    initialValue: PropTypes.number,

    /** 슬라이더 최소값 */
    min: PropTypes.number,

    /** 슬라이더 최대값 */
    max: PropTypes.number,

    /** 
     * 좌우 화살표 키로 값을 조절할 때의 증감 단위
     * - 기본값: 1
     */
    step: PropTypes.number,

    /** 키보드 입력 활성화 여부 */
    isFocused: PropTypes.bool,

    /** 
     * 키보드 입력 처리 콜백
     * - 'CHANGE': 값이 변경될 때마다 호출 (payload: { value })
     * - 'OK': Enter 키 (payload: { value })
     * - 'BACK': Escape/Backspace 키
     */
    onKey: PropTypes.func
};

export default CM_CTRL_SliderContinuous;


