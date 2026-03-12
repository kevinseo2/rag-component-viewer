import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Smart from './CM_LABEL_Smart';

/**
 * CM_PICKER_Vertical1stItem Widget Component
 * Source: lv_Vertical_List_1st_Depth_Item.c
 *
 * Position-based offset from C code:
 * - TOP: +12px offset
 * - MID: -19px if has value, 0 otherwise
 * - LOW: -12px offset
 */
const CM_PICKER_Vertical1stItem = ({
    id = "CM_PICKER_Vertical1stItem",
    text = "",
    value = "",
    position = "MID",
    enabled = true
} = {}) => {
    const [offsetY, setOffsetY] = useState(0);

    useEffect(() => {
        let newOffset = 0;
        const hasValue = !!value;

        switch (position) {
            case 'TOP':
                newOffset = 12;
                break;
            case 'MID':
                newOffset = hasValue ? -19 : 0;
                break;
            case 'LOW':
                newOffset = -12;
                break;
            default:
                newOffset = 0;
        }
        setOffsetY(newOffset);
    }, [position, value]);

    return (
        <div
            id={id}
            className="relative w-[300px] h-[94px] flex justify-center items-center transition-transform duration-200"
            style={{
                transform: `translateY(${offsetY}px)`,
                transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)' // ease-out-expo
            }}
        >
            <CM_LABEL_Smart
                key={text}
                id={`${id}-label`}
                text={text}
                align="center"
                maxArea={{ width: 300, height: 41 }}
                style={{
                    color: enabled ? '#FFFFFF' : '#8c8c8c',
                    fontSize: '36px',
                    fontWeight: '600',
                    lineHeight: '1.2'
                }}
            />
        </div>
    );
};

CM_PICKER_Vertical1stItem.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 표시할 메인 텍스트 */
    text: PropTypes.string,
    /** 표시할 보조 값 (MID 포지션인 경우 오프셋 계산에 영향을 줌) */
    value: PropTypes.string,
    /** 현재 표시되는 위치에 따른 스타일 가중치 ('TOP', 'MID', 'LOW') */
    position: PropTypes.oneOf(['TOP', 'MID', 'LOW']),
    /** 활성화 상태 여부 */
    enabled: PropTypes.bool
};

export default CM_PICKER_Vertical1stItem;

