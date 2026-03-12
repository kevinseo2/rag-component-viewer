import React from 'react';
import PropTypes from 'prop-types';

/**
 * CM_PICKER_Vertical2ndItem - 2차 리스트 아이템 컴포넌트
 *
 * 세로 리스트의 각 아이템을 표시합니다.
 * 선택 상태에 따라 텍스트 색상이 전환됩니다 (300ms transition).
 *
 * - 아이템: 부모 너비/높이 100%, 중앙 정렬
 * - 폰트: LGSBD23, 40px, bold
 * - 선택 상태: 흰색(#FFFFFF)
 * - 비선택 상태: 회색(#cdcdcd)
 */
const CM_PICKER_Vertical2ndItem = ({ text, selected }) => {
    return (
        <div className="flex items-center justify-center w-full h-full" id="CM_PICKER_Vertical2ndItem">
            <span
                className={`text-center transition-colors duration-300 ${selected ? 'text-white' : 'text-[#cdcdcd]'
                    }`}
                style={{
                    fontFamily: 'LGSBD23', // Assuming font is available or fallback
                    fontSize: '40px',
                    lineHeight: '40px',
                    fontWeight: 'bold', // LGSBD usually implies bold
                }}
            >
                {text}
            </span>
        </div>
    );
};

CM_PICKER_Vertical2ndItem.propTypes = {
    /**
     * 아이템에 표시할 텍스트
     * @example "표준", "강력", "섬세"
     */
    text: PropTypes.string,

    /**
     * 현재 선택 상태 여부
     * - true: 흰색 텍스트 (#FFFFFF)
     * - false: 회색 텍스트 (#cdcdcd)
     */
    selected: PropTypes.bool,
};

export default CM_PICKER_Vertical2ndItem;

