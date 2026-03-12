import React from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Smart from './CM_LABEL_Smart';
import CM_CTRL_Switch from './CM_CTRL_Switch';

/**
 * CM_LIST_ItemFull Component
 * 
 * The ultimate master item for all vertical list variants.
 * Supports:
 * - Left: selection icons (checkbox/radio), reorder handles.
 * - Center: main label & description.
 * - Right: sub labels (blue value), switches, drag/reorder indicators.
 */
const CM_LIST_ItemFull = ({
    id = 'CM_LIST_ItemFull',
    label_main = '',
    description = '',
    label_sub = '', // Blue value on right
    leftIcon = null, // image src for checkbox/radio/reorder
    rightElement = null, // 'switch' or 'reorder' or null
    switchChecked = false,
    onSwitchToggle = null,
    showDescription = true,
    enabled = true,
    isSelected = false,
}) => {
    const opacity = enabled ? 1 : 0.59;
    const textColor = enabled ? '#FFFFFF' : '#8C8C8C';
    const selectionBg = isSelected ? 'bg-[#333333]' : 'bg-transparent';

    // Layout flags
    const hasLeftIcon = Boolean(leftIcon);
    const hasSubLabel = Boolean(label_sub);
    const hasRightElement = Boolean(rightElement);

    return (
        <div
            id={id}
            className={`relative w-[320px] h-[68px] ${selectionBg} transition-colors duration-200`}
        >
            {/* Left Area: Icon (Radio/Checkbox/Handle) */}
            {hasLeftIcon && (
                <div id={`${id}-left-icon-container`} className="absolute left-[20px] top-[18px] w-[32px] h-[32px] flex items-center justify-center">
                    <img id={`${id}-left-icon`} src={leftIcon} alt="" className="w-full h-full object-contain" style={{ opacity }} />
                </div>
            )}

            {/* Center Area: Text Content */}
            <div
                id={`${id}-content-area`}
                className={`absolute top-0 h-[66px] flex flex-col justify-center items-start`}
                style={{
                    left: hasLeftIcon ? '64px' : '20px',
                    width: (hasSubLabel || hasRightElement) ? '180px' : (hasLeftIcon ? '236px' : '280px')
                }}
            >
                <CM_LABEL_Smart
                    id={`${id}-label-main`}
                    key={label_main}
                    text={label_main}
                    maxArea={{ width: (hasSubLabel || hasRightElement) ? 180 : (hasLeftIcon ? 236 : 280), height: 34 }}
                    className={`w-auto h-auto ${!showDescription ? 'mt-[16px]' : ''}`}
                    style={{
                        fontFamily: 'LG_Smart_UI_HA2023_SemiBold',
                        fontSize: '30px',
                        color: textColor,
                        opacity: (hasSubLabel || hasRightElement) ? opacity : 1,
                        lineHeight: '1.1',
                        backgroundColor: isSelected ? '#333333' : '#000000',
                    }}
                />
                {showDescription && description && (
                    <CM_LABEL_Smart
                        id={`${id}-description`}
                        key={description}
                        text={description}
                        maxArea={{ width: (hasSubLabel || hasRightElement) ? 180 : (hasLeftIcon ? 236 : 280), height: 26 }}
                        className="w-auto h-auto"
                        style={{
                            fontFamily: 'LG_Smart_UI_HA2023_SemiBold',
                            fontSize: '21px',
                            color: textColor,
                            opacity: (hasSubLabel || hasRightElement) ? opacity : 1,
                            lineHeight: '1.1',
                            backgroundColor: isSelected ? '#333333' : '#000000',
                        }}
                    />
                )}
            </div>

            {/* Right Area: Sub Label or Interactive (Switch/Reorder) */}
            {(hasSubLabel || hasRightElement) && (
                <div
                    id={`${id}-right-area`}
                    className="absolute right-[15px] top-0 w-[110px] h-[66px] flex items-center justify-center text-center"
                >
                    {label_sub && !rightElement && (
                        <CM_LABEL_Smart
                            id={`${id}-label-sub`}
                            key={label_sub}
                            text={label_sub}
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
                    )}
                    {rightElement === 'switch' && (
                        <CM_CTRL_Switch
                            id={`${id}-switch`}
                            checked={switchChecked}
                            onToggle={onSwitchToggle}
                            className="pointer-events-none" // Controlled by Enter key in CM_LIST_Vertical
                        />
                    )}
                    {rightElement === 'reorder' && (
                        <img id={`${id}-reorder-handle`} src="/ui/images/btn_vertical_list_reorder.png" alt="" className="w-[32px] h-[32px] object-contain" />
                    )}
                </div>
            )}

            {/* Separator Line */}
            <div
                id={`${id}-separator`}
                className="absolute left-[20px] top-[66px] w-[280px] h-[2px] bg-[#333333]"
            />
        </div>
    );
};

CM_LIST_ItemFull.propTypes = {
    /** 항목 ID */
    id: PropTypes.string,

    /** 
     * 메인 라벨 텍스트
     * - 30px 크기, 왼쪽 정렬
     * - 왼쪽 아이콘이 있으면 64px, 없으면 20px에서 시작
     */
    label_main: PropTypes.string,

    /** 
     * 설명 텍스트 (메인 라벨 아래)
     * - 21px 크기
     * - showDescription=true일 때만 표시
     */
    description: PropTypes.string,

    /** 
     * 오른쪽에 표시될 보조 라벨 (파란색)
     * - 30px 크기의 볼드체, 파란색 (#629DFF)
     * - rightElement가 없을 때만 표시
     * - 예: 선택된 값, 상태 표시 등
     */
    label_sub: PropTypes.string,

    /** 
     * 왼쪽 아이콘 이미지 경로
     * - 체크박스, 라디오 버튼, 재정렬 핸들 등
     * - 32x32px 크기
     * - 예: '/ui/images/ic_checkbox_on.png'
     */
    leftIcon: PropTypes.string,

    /** 
     * 오른쪽 요소 타입
     * - 'switch': 토글 스위치 표시
     * - 'reorder': 재정렬 핸들 표시
     * - null: 보조 라벨(label_sub) 표시
     */
    rightElement: PropTypes.oneOf(['switch', 'reorder']),

    /** 
     * 스위치 체크 상태
     * - rightElement='switch'일 때 사용
     */
    switchChecked: PropTypes.bool,

    /** 
     * 스위치 토글 콜백
     * - rightElement='switch'일 때 사용
     */
    onSwitchToggle: PropTypes.func,

    /** 설명 표시 여부 */
    showDescription: PropTypes.bool,

    /** 
     * 활성화 상태
     * - false면 텍스트가 회색(#8C8C8C)으로 표시되고 opacity 0.59 적용
     */
    enabled: PropTypes.bool,

    /** 
     * 선택 상태
     * - true면 배경이 #333333으로 표시
     */
    isSelected: PropTypes.bool,
};

export default CM_LIST_ItemFull;

