import React from 'react';
import PropTypes from 'prop-types';

/**
 * CM_TITLE_WithArrow Widget
 * - Displays a title with a back arrow on the left.
 * - Used in many screens as a standard header.
 */
const CM_TITLE_WithArrow = ({
    title = "Title",
    onBack = () => { },
    showBackArrow = true,
    style = {}
}) => {
    return (
        <div
            id="CM_TITLE_WithArrow-root"
            className="absolute top-0 left-0 w-full h-[50px] flex items-center bg-black"
            style={style}
        >
            {/* Back Arrow Area (Corrected size to 100x50 as per JSON) */}
            {showBackArrow && (
                <img
                    src="/ui/images/ic_back.png"
                    alt="Back"
                    className="absolute left-0 top-0 w-[100px] h-[50px] cursor-pointer"
                    onClick={onBack}
                />
            )}

            {/* Title Text */}
            <span
                id="title_label"
                className="absolute left-0 w-full text-center text-white font-semibold text-[30px]"
                style={{ fontFamily: 'LG_Smart_UI_HA2023_SemiBold' }}
            >
                {title}
            </span>
        </div>
    );
};


CM_TITLE_WithArrow.propTypes = {
    /** 
     * 화면 상단에 표시될 타이틀 텍스트
     * - 30px 크기의 흰색 볼드체로 중앙 정렬
     * - 50px 높이의 헤더 영역 전체에 표시
     */
    title: PropTypes.string,

    /** 
     * 뒤로가기 화살표 클릭 시 호출되는 콜백 함수
     * - 화살표 영역 (100x50px) 클릭 시 발동
     */
    onBack: PropTypes.func,

    /** 
     * 뒤로가기 화살표 표시 여부
     * - true: 화살표 표시 (100x50px 크기, 왼쪽 상단)
     * - false: 화살표 숨김
     */
    showBackArrow: PropTypes.bool,

    /** 타이틀 바 컴포넌트에 적용될 추가 스타일 */
    style: PropTypes.object
};

export default CM_TITLE_WithArrow;


