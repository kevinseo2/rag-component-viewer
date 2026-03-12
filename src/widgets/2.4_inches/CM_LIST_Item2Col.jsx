import React from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Smart from './CM_LABEL_Smart';

/**
 * CM_LIST_Item2Col Component
 * 
 * A two-column list item showing labels on the left and a value on the right.
 * 
 * @param {Object} props
 * @param {string} props.label_main - Main title text on the left
 * @param {string} props.label_desc - Description text on the left
 * @param {string} props.label - Value text on the right
 * @param {boolean} props.showDescription - Controls description visibility and main label position (USER0)
 * @param {boolean} props.enabled - Controls opacity-based enabled state (USER1)
 * @param {boolean} props.isSelected - Selection state
 */
const CM_LIST_Item2Col = ({
    id = 'CM_LIST_Item2Col',
    label_main = '',
    label_desc = '',
    label = '',
    showDescription = true,
    enabled = true,
    isSelected = false,
}) => {
    const opacity = enabled ? 1 : 0.59;
    const selectionBg = isSelected ? 'bg-[#333333]' : 'bg-transparent';

    return (
        <div
            id={id}
            className={`relative w-[320px] h-[68px] ${selectionBg} transition-colors duration-200`}
        >
            {/* Left Column: Main Label & Description */}
            <div
                id={`${id}-left-column`}
                className={`absolute left-[20px] top-0 w-[160px] h-[66px] flex flex-col justify-center items-start`}
            >
                <CM_LABEL_Smart
                    id={`${id}-label-main`}
                    key={label_main}
                    text={label_main}
                    maxArea={{ width: 160, height: 34 }}
                    className={`w-auto h-auto ${!showDescription ? 'mt-[16px]' : ''}`}
                    style={{
                        fontFamily: 'LG_Smart_UI_HA2023_SemiBold',
                        fontSize: '30px',
                        color: '#FFFFFF',
                        opacity: opacity,
                        lineHeight: '1.1',
                        backgroundColor: isSelected ? '#333333' : '#000000',
                    }}
                />
                {showDescription && (
                    <CM_LABEL_Smart
                        id={`${id}-label-desc`}
                        key={label_desc}
                        text={label_desc}
                        maxArea={{ width: 160, height: 26 }}
                        className="w-auto h-auto"
                        style={{
                            fontFamily: 'LG_Smart_UI_HA2023_SemiBold',
                            fontSize: '21px',
                            color: '#FFFFFF',
                            opacity: opacity,
                            lineHeight: '1.1',
                            backgroundColor: isSelected ? '#333333' : '#000000',
                        }}
                    />
                )}
            </div>

            {/* Right Column: Value Display */}
            <div
                id={`${id}-right-column`}
                className="absolute left-[180px] top-0 w-[140px] h-[66px] flex items-center justify-center text-center"
            >
                <CM_LABEL_Smart
                    id={`${id}-label-value`}
                    key={label}
                    text={label}
                    maxArea={{ width: 106, height: 34 }}
                    className="w-[106px] h-auto overflow-hidden whitespace-nowrap text-ellipsis"
                    style={{
                        fontFamily: 'LG_Smart_UI_HA2023_Bold',
                        fontSize: '30px',
                        color: '#629DFF',
                        opacity: opacity,
                        textAlign: 'center',
                        lineHeight: '1.1',
                        backgroundColor: isSelected ? '#333333' : '#000000',
                    }}
                />
            </div>

            {/* Separator Line */}
            <div
                id={`${id}-separator`}
                className="absolute left-[20px] top-[66px] w-[280px] h-[2px] bg-[#333333]"
            />
        </div>
    );
};

CM_LIST_Item2Col.propTypes = {
    /** 컴포넌트 ID */
    id: PropTypes.string,

    /** 
     * 메인 라벨 (왼쪽 열 상단)
     * - 30px 크기, 흰색
     */
    label_main: PropTypes.string,

    /** 
     * 설명 라벨 (왼쪽 열 하단)
     * - 21px 크기, 흰색
     * - showDescription=false면 숨김
     */
    label_desc: PropTypes.string,

    /** 
     * 값 라벨 (오른쪽 열)
     * - 30px 크기, 파란색 (#629DFF)
     * - 중앙 정렬
     */
    label: PropTypes.string,

    /** 설명 표시 여부 (USER0 플래그) */
    showDescription: PropTypes.bool,

    /** 
     * 활성화 상태 (USER1 플래그)
     * - false면 opacity 0.59 적용
     */
    enabled: PropTypes.bool,

    /** 선택 상태 (배경 #333333) */
    isSelected: PropTypes.bool,
};

export default CM_LIST_Item2Col;

