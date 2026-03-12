import React from 'react';
import PropTypes from 'prop-types';

/**
 * Common Button Widget
 * - Handles focus state styling (White bg/Black text vs Dark bg/White text)
 * - Supports dynamic size and border radius
 */
const CM_CTRL_Button = ({
    id,
    text,
    width = 'auto',
    height = 52,
    borderRadius = 26,
    bgDefault = '#333333',
    bgFocused = '#ffffff',
    textDefault = '#ffffff',
    textFocused = '#000000',
    focused = false,
    style = {},
    textStyle = {}
}) => {
    return (
        <div
            id={id}
            className={`relative flex items-center justify-center transition-colors duration-200`}
            style={{
                width: width === 'content' ? 'auto' : width,
                height: height,
                borderRadius: borderRadius,
                backgroundColor: focused ? bgFocused : bgDefault,
                ...style // Allow absolute positioning overrides etc.
            }}
        >
            <span
                className={`text-center font-LGSBD whitespace-pre-wrap leading-tight`}
                style={{
                    fontFamily: 'LGSBD', // Ensure font is applied
                    color: focused ? textFocused : textDefault,
                    ...textStyle
                }}
            >
                {text}
            </span>
        </div>
    );
};

/**
 * 버튼의 고유 식별자 (HTML id 속성으로 사용됨)
 */
CM_CTRL_Button.propTypes = {
    /** 버튼의 고유 식별자 (HTML id 속성) */
    id: PropTypes.string,

    /** 버튼에 표시될 텍스트 내용 (필수) */
    text: PropTypes.string.isRequired,

    /**
     * 버튼의 너비
     * - 숫자: 픽셀 단위의 고정 너비
     * - 'auto': 콘텐츠에 맞게 자동 조절
     * - 'content': 텍스트 길이에 맞춰 자동 크기 조절
     */
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /** 버튼의 높이 (픽셀 단위, 기본값: 52px) */
    height: PropTypes.number,

    /** 버튼 모서리의 둥근 정도 (픽셀 단위, 기본값: 26px로 캡슐 모양) */
    borderRadius: PropTypes.number,

    /** 포커스되지 않은 상태(기본 상태)의 배경 색상 (기본값: '#333333') */
    bgDefault: PropTypes.string,

    /** 포커스된 상태의 배경 색상 (기본값: '#ffffff') */
    bgFocused: PropTypes.string,

    /** 포커스되지 않은 상태(기본 상태)의 텍스트 색상 (기본값: '#ffffff') */
    textDefault: PropTypes.string,

    /** 포커스된 상태의 텍스트 색상 (기본값: '#000000') */
    textFocused: PropTypes.string,

    /**
     * 버튼의 포커스 상태
     * - true: 포커스됨 (흰색 배경 + 검정 텍스트)
     * - false: 포커스 안됨 (어두운 배경 + 흰색 텍스트)
     */
    focused: PropTypes.bool,

    /** 버튼 컨테이너에 적용될 추가 inline 스타일 객체 (위치 조정 등) */
    style: PropTypes.object,

    /** 텍스트 span 요소에 적용될 추가 inline 스타일 객체 (폰트 크기 조정 등) */
    textStyle: PropTypes.object
};

export default CM_CTRL_Button;

