import React from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Smart from './CM_LABEL_Smart';

/**
 * OV_COOK_ModeItem
 * Single page item for Cook Mode Pager.
 */
const OV_COOK_ModeItem = ({
    id,
    image,
    title,
    description,
    showIcon = false,
    style = {}
}) => {
    return (
        <div
            id={id}
            className="w-[320px] h-[240px] flex flex-col items-center justify-center bg-black"
            style={style}
        >
            {/* Container for Icon + Title (Horizontal Row) */}
            <div className="flex flex-row items-center justify-center gap-[8px]" style={{ paddingTop: showIcon ? '40px' : '0px' }}>
                {/* Image (Icon) - Visible only if showIcon is true */}
                {showIcon && image && (
                    <img
                        id={`${id}-img`}
                        src={image}
                        alt={title}
                        className="w-[50px] h-[50px]"
                    />
                )}

                {/* Title */}
                <CM_LABEL_Smart
                    id={`${id}-title`}
                    key={title}
                    text={title}
                    style={{
                        fontSize: showIcon ? 40 : 49,
                        fontFamily: "LGSBD",
                        color: "#FFFFFF",
                        textAlign: "center"
                    }}
                    maxArea={{ width: showIcon ? 250 : 310, height: 60 }}
                    align="center"
                />
            </div>

            {/* Description */}
            <div className="w-full flex justify-center items-center mt-2">
                <CM_LABEL_Smart
                    id={`${id}-desc`}
                    key={description}
                    text={description}
                    style={{
                        fontSize: 26,
                        fontFamily: "LGSBD",
                        color: "#FFFFFF",
                        textAlign: "center",
                        paddingBottom: showIcon ? '17px' : '0px'
                    }}
                    maxArea={{ width: 310, height: 80 }}
                    align="center"
                    multiline={true}
                />
            </div>
        </div>
    );
};

OV_COOK_ModeItem.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 표시할 아이콘 이미지 경로 (showIcon이 true일 때 사용) */
    image: PropTypes.string,
    /** 조리 모드 명칭 */
    title: PropTypes.string,
    /** 조리 모드 상세 설명 */
    description: PropTypes.string,
    /** 아이콘 표시 여부 */
    showIcon: PropTypes.bool,
    /** 커스텀 스타일 객체 */
    style: PropTypes.object
};

export default OV_COOK_ModeItem;

