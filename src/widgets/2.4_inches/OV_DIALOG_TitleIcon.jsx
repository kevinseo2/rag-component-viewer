import React from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Smart from './CM_LABEL_Smart';

/**
 * OV_DIALOG_TitleIcon
 * Dialogue widget with Icon, Title, and Message.
 * Layout: Vertical Stack.
 */
const OV_DIALOG_TitleIcon = ({
    id = "OV_DIALOG_TitleIcon",
    title = "",
    message = "",
    icon = "",
    style = {},
    titleStyle = {},
    messageStyle = {}
}) => {
    return (
        <div
            id={id}
            className="w-[320px] h-[240px] bg-black flex flex-col items-center justify-center p-4 gap-[6px]"
            style={style}
        >
            {/* Title Container (Icon + Title) */}
            <div id={`${id}-title-container`} className="flex flex-col items-center justify-center gap-0">
                {icon && (
                    <img
                        id={`${id}-icon`}
                        src={icon}
                        alt="icon"
                        className="w-[50px] h-[50px] mb-0"
                    />
                )}

                <CM_LABEL_Smart
                    id={`${id}-title`}
                    key={title}
                    text={title}
                    style={{
                        fontSize: 30,
                        fontFamily: "LGSBD",
                        color: "#FFFFFF",
                        textAlign: "center",
                        lineHeight: 1.1,
                        ...titleStyle
                    }}
                    maxArea={{ width: 310, height: 40 }}
                    align="center"
                    multiline={false}
                />
            </div>

            {/* Message */}
            <div id={`${id}-message-container`} className="w-[310px] flex justify-center">
                <CM_LABEL_Smart
                    id={`${id}-message`}
                    key={message}
                    text={message}
                    style={{
                        fontSize: 25,
                        fontFamily: "LGSBD",
                        color: "#FFFFFF",
                        textAlign: "center",
                        lineHeight: 1.2,
                        ...messageStyle
                    }}
                    maxArea={{ width: 310, height: 100 }}
                    align="center"
                    multiline={true}
                />
            </div>
        </div>
    );
};

OV_DIALOG_TitleIcon.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 상단 타이틀 텍스트 */
    title: PropTypes.string,
    /** 본문 메시지 텍스트 */
    message: PropTypes.string,
    /** 표시할 아이콘 이미지 경로 */
    icon: PropTypes.string,
    /** 컨테이너 커스텀 스타일 */
    style: PropTypes.object,
    /** 타이틀 커스텀 스타일 */
    titleStyle: PropTypes.object,
    /** 메시지 커스텀 스타일 */
    messageStyle: PropTypes.object
};

export default OV_DIALOG_TitleIcon;

