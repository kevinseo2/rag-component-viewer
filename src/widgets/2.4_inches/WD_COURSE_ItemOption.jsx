import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Formatted from './CM_LABEL_Formatted';

/**
 * WD_COURSE_ItemOption - 코스 옵션 표시 컴포넌트
 *
 * WD_COURSE_Item의 회전 영역에서 개별 옵션(예: "온도 40℃")을 표시합니다.
 * title, value, unit을 조합하여 "{title} {value}{unit}" 형태의 텍스트를 생성합니다.
 * 텍스트가 300px를 초과하면 CM_LABEL_Formatted의 자동 스크롤이 동작합니다.
 *
 * - 영역: 300 x 34px, 중앙 정렬, overflow hidden
 * - 폰트: 28px, 600 weight, 흰색
 * - value가 없으면 "-"로 표시
 */
const WD_COURSE_ItemOption = ({
    id,
    title = "",
    value = "",
    unit = "",
    style = {},
    className = "",
    isAnimating = false,
}) => {
    // Build the formatted string: {title} {value}{unit}
    const formattedText = useMemo(() => {
        const valStr = value || "-";
        const unitStr = unit || "";
        return `${title} ${valStr}${unitStr}`;
    }, [title, value, unit]);

    // Style mapping from LGSBD23 font logic
    const defaultStyle = {
        fontSize: 28,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
        ...style,
    };

    return (
        <div
            id={id}
            className={`w-[300px] h-[34px] flex items-center justify-center overflow-hidden ${className}`}
        >
            <CM_LABEL_Formatted
                key={formattedText}
                id={`${id}_label`}
                format={formattedText}
                animSpeed={30}
                multiline={false} // Options are always single line with scroll
                maxArea={{ width: 300, height: 34 }}
                style={defaultStyle}
            />
        </div>
    );
};

WD_COURSE_ItemOption.propTypes = {
    /**
     * 컴포넌트의 고유 식별자 (HTML id 속성)
     * 내부적으로 `${id}_label` 형태로 CM_LABEL_Formatted에 전달됩니다.
     */
    id: PropTypes.string,

    /**
     * 옵션 제목 (왼쪽 텍스트)
     * @example "온도", "Temp.", "헹굼", "탈수"
     */
    title: PropTypes.string,

    /**
     * 옵션 값 (오른쪽 숫자/텍스트)
     * 빈 문자열이면 "-"로 대체됩니다.
     * @example "40", "800", "3"
     */
    value: PropTypes.string,

    /**
     * 값 뒤에 붙는 단위 문자열
     * @example "℃", "rpm", "회"
     */
    unit: PropTypes.string,

    /** 텍스트에 적용할 추가 인라인 스타일 (기본 스타일과 병합) */
    style: PropTypes.object,

    /** 외부 컨테이너에 추가할 CSS 클래스명 */
    className: PropTypes.string,

    /** 애니메이션 활성 여부 (현재 미사용, 향후 확장용) */
    isAnimating: PropTypes.bool,
};

export default WD_COURSE_ItemOption;

