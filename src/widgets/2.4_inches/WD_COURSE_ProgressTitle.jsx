import React from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Formatted from './CM_LABEL_Formatted';

/**
 * WD_COURSE_ProgressTitle - 코스 진행 타이틀 위젯
 *
 * 코스명과 아이콘(AI/오각형)을 조합하여 CM_LABEL_Formatted로 렌더링합니다.
 * WD_COURSE_ProgressBase, WD_COURSE_ProgressFinish 등에서 공통으로 사용됩니다.
 *
 * 슬롯 구성 (동적):
 * 1. show_ai = true → AI 아이콘 슬롯(38x21px) + 공백 슬롯 추가
 * 2. 타이틀 텍스트 슬롯 (항상 포함)
 * 3. show_pentagon = true → 오각형 아이콘 슬롯(30x30px, 왼쪽 3px 패딩) 추가
 *
 * 레이아웃:
 * - 컨테이너: max_width × (max_height + 2)px, overflow hidden
 * - 폰트: LGSBD23, 30px, bold, 흰색
 * - 포커스 시 배경: rgba(61, 61, 61, 1)
 */
const WD_COURSE_ProgressTitle = ({
    id = "WD_COURSE_ProgressTitle",
    title = "",
    show_ai = false,
    show_pentagon = false,
    isFocused = false,
    align = "center", // "left" or "center"
    style = {},
    max_width = 300,
    max_height = 34
}) => {
    /** CM_LABEL_Formatted용 슬롯과 포맷 문자열을 동적으로 구성 */
    const slots = [];
    let format = "";
    let slotIndex = 0;

    // 1. AI 아이콘 슬롯
    if (show_ai) {
        slots.push({
            type: 'image',
            value: "/ui/images/washer_dryer/ic_ai_2.png",
            width: 38,
            height: 21
        });
        format += `{${slotIndex}}`;
        slotIndex++;

        // Add space between AI and title
        slots.push({
            type: 'string',
            value: " "
        });
        format += `{${slotIndex}}`;
        slotIndex++;
    }

    // 2. 타이틀 텍스트 슬롯
    slots.push({
        type: 'string',
        value: title
    });
    format += `{${slotIndex}}`;
    slotIndex++;

    // 3. 오각형 아이콘 슬롯
    if (show_pentagon) {
        slots.push({
            type: 'image',
            value: "/ui/images/washer_dryer/ic_pentagon.png",
            width: 30,
            height: 30,
            style: { paddingLeft: '3px' }
        });
        format += `{${slotIndex}}`;
        slotIndex++;
    }

    const containerStyle = {
        paddingTop: '1px',
        ...style
    };

    return (
        <div
            id={id}
            className={`flex flex-col justify-center overflow-hidden`}
            style={{
                width: `${max_width}px`,
                height: `${max_height + 2}px`, // Slight buffer for container
                ...containerStyle
            }}
        >
            <CM_LABEL_Formatted
                key={format + title}
                id={`${id}-fmt`}
                format={format}
                slots={slots}
                isFocused={isFocused}
                align={align}
                style={{
                    color: '#FFFFFF',
                    fontSize: '30px',
                    fontFamily: 'LGSBD23',
                    fontWeight: 'bold',
                    lineHeight: '34px',
                    backgroundColor: isFocused ? "rgba(61, 61, 61, 1)" : "transparent"
                }}
                maxArea={{
                    width: max_width,
                    height: max_height
                }}
            />
        </div>
    );
};

WD_COURSE_ProgressTitle.propTypes = {
    /** 컴포넌트의 고유 식별자 (HTML id 속성) */
    id: PropTypes.string,

    /**
     * 코스 이름 (타이틀 텍스트)
     * CM_LABEL_Formatted의 슬롯으로 전달됩니다.
     * @example "표준세탁", "찬물세탁", "울/섬세"
     */
    title: PropTypes.string,

    /**
     * AI 아이콘 표시 여부
     * true이면 타이틀 앞에 ic_ai_2.png(38x21px) 아이콘이 추가됩니다.
     */
    show_ai: PropTypes.bool,

    /**
     * 오각형 아이콘 표시 여부
     * true이면 타이틀 뒤에 ic_pentagon.png(30x30px) 아이콘이 추가됩니다.
     */
    show_pentagon: PropTypes.bool,

    /**
     * 포커스 상태 여부
     * true이면 배경색이 rgba(61, 61, 61, 1)로 변경됩니다.
     */
    isFocused: PropTypes.bool,

    /**
     * 텍스트 정렬 방향
     * - 'center': 중앙 정렬 (기본값)
     * - 'left': 왼쪽 정렬
     */
    align: PropTypes.oneOf(['left', 'center']),

    /** 외부 컨테이너에 적용할 추가 인라인 스타일 */
    style: PropTypes.object,

    /**
     * 컨테이너 최대 너비 (px)
     * CM_LABEL_Formatted의 maxArea.width로 전달됩니다.
     * @example 300, 310
     */
    max_width: PropTypes.number,

    /**
     * 컨테이너 최대 높이 (px)
     * CM_LABEL_Formatted의 maxArea.height로 전달됩니다.
     * 실제 컨테이너는 max_height + 2px로 렌더링됩니다.
     * @example 34, 36
     */
    max_height: PropTypes.number
};

export default WD_COURSE_ProgressTitle;

