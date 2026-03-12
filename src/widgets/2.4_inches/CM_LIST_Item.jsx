import React from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Smart from './CM_LABEL_Smart';

/**
 * CM_LIST_Item Component
 * 
 * A single item in a vertical list displaying a main label and an optional description.
 * 
 * @param {Object} props
 * @param {string} props.label - Main title text of the item
 * @param {string} props.description - Secondary description text
 * @param {boolean} props.showDescription - Controls description visibility (USER0)
 * @param {boolean} props.enabled - Controls enabled/disabled styling (USER1)
 * @param {boolean} props.isSelected - Whether the item is currently selected
 */
const CM_LIST_Item = ({
    id = 'CM_LIST_Item',
    label = '',
    description = '',
    showDescription = true,
    enabled = true,
    isSelected = false,
}) => {
    const textColor = enabled ? '#FFFFFF' : '#8C8C8C';

    return (
        <div
            id={id}
            className={`relative w-[320px] h-[68px] ${isSelected ? 'bg-[#333333]' : 'bg-transparent'}`}
        >
            {/* Item Content Container */}
            <div
                id={`${id}-content-container`}
                className="absolute left-[20px] top-0 w-[280px] h-[66px] flex flex-col justify-center items-start"
            >
                <CM_LABEL_Smart
                    id={`${id}-label`}
                    key={label}
                    text={label}
                    maxArea={{ width: 280, height: 34 }}
                    className="w-auto h-auto"
                    style={{
                        fontFamily: 'LG_Smart_UI_HA2023_SemiBold',
                        fontSize: '30px',
                        color: textColor,
                        lineHeight: '1.1',
                        backgroundColor: isSelected ? '#333333' : '#000000',
                    }}
                />
                {showDescription && (
                    <CM_LABEL_Smart
                        id={`${id}-description`}
                        key={description}
                        text={description}
                        maxArea={{ width: 280, height: 26 }}
                        className="w-auto h-auto"
                        style={{
                            fontFamily: 'LG_Smart_UI_HA2023_SemiBold',
                            fontSize: '21px',
                            color: textColor,
                            lineHeight: '1.1',
                            backgroundColor: isSelected ? '#333333' : '#000000',
                        }}
                    />
                )}
            </div>

            {/* Separator Line */}
            <div
                id={`${id}-separator`}
                className="absolute left-[20px] top-[66px] w-[280px] h-[2px] bg-[#333333]"
            />
        </div>
    );
};

CM_LIST_Item.propTypes = {
    /** 항목의 고유 식별자 */
    id: PropTypes.string,

    /** 
     * 메인 라벨 텍스트
     * - 30px 크기의 볼드체로 표시
     * - enabled 상태에 따라 흰색 또는 회색으로 표시
     */
    label: PropTypes.string,

    /** 
     * 부가 설명 텍스트
     * - 21px 크기의 볼드체로 라벨 아래에 표시
     * - showDescription이 false면 렌더링되지 않음
     */
    description: PropTypes.string,

    /** 
     * 설명 표시 여부
     * - 원본 C 코드의 USER0 플래그에 해당
     */
    showDescription: PropTypes.bool,

    /** 
     * 활성화 상태
     * - true: 활성 (흰색 텍스트)
     * - false: 비활성 (회색 텍스트, #8C8C8C)
     * - 원본 C 코드의 USER1 플래그에 해당
     */
    enabled: PropTypes.bool,

    /** 
     * 선택 상태
     * - true: 선택됨 (어두운 배경, #333333)
     * - false: 선택 안됨 (투명 배경)
     */
    isSelected: PropTypes.bool,
};

export default CM_LIST_Item;

