import React from 'react';
import PropTypes from 'prop-types';

/**
 * CM_TITLE_Bar - Title bar widget (Common component)
 * Displays a centered title text at the top of the screen.
 */
const CM_TITLE_Bar = ({
    id = "CM_TITLE_Bar",
    title = "Title",
    style = {}
}) => {
    return (
        <div
            id={id}
            className="absolute top-0 left-0 w-[320px] h-[36px] flex items-center justify-center bg-transparent"
            style={style}
        >
            <span
                id={`${id}-label`}
                className="text-[30px] font-semibold text-white text-center leading-[1.1]"
                style={{ fontFamily: 'LG Smart UI HA2023 SemiBold, sans-serif' }}
            >
                {title}
            </span>
        </div>
    );
};

CM_TITLE_Bar.propTypes = {
    /** 타이틀 바의 고유 식별자 (HTML id 속성) */
    id: PropTypes.string,

    /** 
     * 화면 상단에 표시될 타이틀 텍스트
     * - 화면의 제목이나 현재 상태를 나타내는 텍스트
     * - 화면 상단 중앙에 30px 크기의 흰색 볼드체로 표시됨
     */
    title: PropTypes.string,

    /** 타이틀 바 컨테이너에 적용될 추가 inline 스타일 객체 (위치나 배경 조정 등) */
    style: PropTypes.object
};

export default CM_TITLE_Bar;

