import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CM_PICKER_VerticalCore from './CM_PICKER_VerticalCore';
import CM_PICKER_Mask2nd from './CM_PICKER_Mask2nd';

/**
 * CM_PICKER_Vertical2nd (Internal UI Widget)
 * - Handles internal list navigation (Up/Down) internally.
 * - Delegate key actions (Enter, Left, Right, Back) to `onKey` prop.
 */
const CM_PICKER_Vertical2nd = ({
    title = "Title",
    unit = null,
    items = [],
    mask = { mode: 'hidden' },
    initialSelectedIndex = 0,
    isFocused = true,
    onKey // Unified key action handler: (keyName, payload) => void
}) => {
    const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);

    // Sync selectedIndex if initialSelectedIndex changes externally
    useEffect(() => {
        setSelectedIndex(initialSelectedIndex);
    }, [initialSelectedIndex]);

    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            // 1. Internal Logic (Must handle)
            if ((e.key === 'ArrowUp') || (e.key === 'ArrowLeft')) {
                e.preventDefault();
                setSelectedIndex(prev => Math.max(0, prev - 1));
                return;
            } else if ((e.key === 'ArrowDown') || (e.key === 'ArrowRight')) {
                e.preventDefault();
                setSelectedIndex(prev => Math.min(items.length - 1, prev + 1));
                return;
            }

            // 2. External Actions ( Delegate to onKey )
            const keyMap = {
                'Enter': 'OK',
                'ArrowLeft': 'LEFT',
                'ArrowRight': 'RIGHT',
                'Escape': 'BACK'
            };

            const action = keyMap[e.key];
            if (action) {
                e.preventDefault();
                // Pass current state (selectedIndex, item) as payload
                onKey?.(action, {
                    index: selectedIndex,
                    item: items[selectedIndex]
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, items, selectedIndex, onKey]);

    const isUnitHiddenByItem = items[selectedIndex]?.unit_hide === true;
    const showUnit = unit && !isUnitHiddenByItem;

    return (
        <div
            className="relative bg-black overflow-hidden"
            style={{ width: '310px', height: '240px' }}
        >
            {/* Image Mask (Background) */}
            <img
                src="/ui/images/washer_dryer/Mask/mask_picker_02.png"
                alt="Mask"
                className="absolute top-0 left-0 pointer-events-none z-10"
                style={{ width: '310px', height: '240px' }}
            />

            {/* Title */}
            <div
                className="absolute top-0 left-0 w-full flex items-center justify-center"
                style={{ height: '36px' }}
            >
                <div id="CM_PICKER_Vertical2nd-title-bg" className="bg-black w-full h-full absolute opacity-100" />
                <span className="relative text-white z-10" style={{ fontFamily: 'LGSBD23', fontSize: '30px' }}>
                    {title}
                </span>
            </div>

            {/* Dividers */}
            <div
                className="absolute bg-[#333333]"
                style={{
                    width: '270px', height: '2px',
                    top: '104px', left: '50%', transform: 'translateX(-50%)'
                }}
            />
            <div
                className="absolute bg-[#333333]"
                style={{
                    width: '270px', height: '2px',
                    top: '171px', left: '50%', transform: 'translateX(-50%)'
                }}
            />

            {/* Picker Container */}
            <div id="CM_PICKER_Vertical2nd-picker-container" className="absolute top-[38px] left-0 w-full">
                <CM_PICKER_VerticalCore
                    items={items}
                    onChange={setSelectedIndex}
                    selectedIndex={selectedIndex}
                />
            </div>

            {/* Unit Label */}
            <div
                className={`absolute transition-opacity duration-300 ${showUnit ? 'opacity-100' : 'opacity-0'}`}
                style={{ left: '195px', top: '129px', maxWidth: '95px' }}
            >
                <span className="text-white text-[25px]" style={{ fontFamily: 'LGSBD23' }}>
                    {unit}
                </span>
            </div>

            {/* Option Mask (Overlay) */}
            <CM_PICKER_Mask2nd mode={mask?.mode || 'hidden'} text={mask?.text} />
        </div>
    );
};

CM_PICKER_Vertical2nd.propTypes = {
    /** 상단 타이틀 텍스트 */
    title: PropTypes.string,
    /** 표시될 단위 (예: 'min', '°C') */
    unit: PropTypes.string,
    /** 리스트 아이템 배열 */
    items: PropTypes.arrayOf(PropTypes.shape({
        /** 표시될 값 텍스트 */
        value_text: PropTypes.string,
        /** 특정 항목만 단위 표시를 숨길지 여부 */
        unit_hide: PropTypes.bool
    })),
    /** 화면 마스크 설정 */
    mask: PropTypes.shape({
        /** 모드 ('hidden': 없음, 'blank': 빈 화면, 'description': 안내 문구 표시) */
        mode: PropTypes.oneOf(['hidden', 'blank', 'description']),
        /** 'description' 모드 시 표시할 안내 텍스트 */
        text: PropTypes.string
    }),
    /** 초기 선택 인덱스 */
    initialSelectedIndex: PropTypes.number,
    /** 현재 포커스 상태 여부 */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 (Action, Payload) */
    onKey: PropTypes.func
};

export default CM_PICKER_Vertical2nd;

