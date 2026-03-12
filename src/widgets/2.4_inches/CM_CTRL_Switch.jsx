import React from 'react';
import PropTypes from 'prop-types';

/**
 * CM_CTRL_Switch Atom
 * - A toggle switch component with ON/OFF states.
 * - Based on lv_switch behavior in LVGL.
 */
const CM_CTRL_Switch = ({
    id = "CM_CTRL_Switch",
    checked = false,
    visible = true,
    className = "",
    onToggle = () => { }
}) => {
    if (!visible) return null;

    return (
        <div
            id={id}
            className={`cursor-pointer transition-colors duration-200 rounded-full relative ${className} bg-[#629DFF]`}
            style={{
                width: '55px',
                height: '30px'
            }}
            onClick={(e) => {
                e.stopPropagation();
                onToggle(!checked);
            }}
        >
            {/* Knob (circle) - Now contained within the track (inside) */}
            <div
                id={`${id}-knob`}
                className={`absolute top-[3px] w-[24px] h-[24px] bg-white rounded-full transition-transform duration-200 ${checked ? 'translate-x-[28px]' : 'translate-x-[3px]'
                    }`}
            />
        </div>
    );
};

CM_CTRL_Switch.propTypes = {
    /** 스위치의 고유 식별자 (HTML id 속성) */
    id: PropTypes.string,

    /** 
     * 스위치의 ON/OFF 상태
     * - true: ON 상태 (토글이 오른쪽으로 이동)
     * - false: OFF 상태 (토글이 왼쪽에 위치)
     */
    checked: PropTypes.bool,

    /** 
     * 스위치 표시 여부
     * - true: 컴포넌트를 화면에 표시
     * - false: 컴포넌트를 숨김 (null 반환)
     */
    visible: PropTypes.bool,

    /** 추가 CSS 클래스명 (스타일 커스터마이징 용도) */
    className: PropTypes.string,

    /** 
     * 스위치 클릭 시 호출되는 콜백 함수
     * @param {boolean} newCheckedState - 새로운 체크 상태 (토글된 값)
     */
    onToggle: PropTypes.func
};

export default CM_CTRL_Switch;

