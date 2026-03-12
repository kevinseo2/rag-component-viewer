import React from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Smart from './CM_LABEL_Smart';
import CM_ANIM_SequencePlayer from './CM_ANIM_SequencePlayer';

/**
 * WD_ANIM_BootScreen
 * Booting screen widget with intro animation.
 */
const WD_ANIM_BootScreen = ({
    id = "WD_ANIM_BootScreen",
    text = "안녕하세요",
    isFocused = true,
    onKey,
    style = {}
}) => {
    const playlist = [{
        CM_ANIM_Sequence: {
            path: "/ui/image_sequences/img_intro/.orig_images",
            frames: Array.from({ length: 25 }, (_, i) => `img_intro_${(i + 1).toString().padStart(3, '0')}.png`)
        },
        duration: 1600,
        repeatCount: 1
    }];

    return (
        <div
            id={id}
            className="w-[320px] h-[240px] bg-black relative"
            style={style}
        >
            {/* Intro Animation */}
            <div id={`${id}-animation-wrapper`} className="absolute inset-0">
                <CM_ANIM_SequencePlayer
                    id={`${id}-animation`}
                    playlist={playlist}
                    onComplete={() => onKey?.('ANIM_COMPLETE')}
                />
            </div>

            {/* Greeting Text */}
            <div
                id={`${id}-text-wrapper`}
                className="absolute left-[5px] top-[84px] w-[310px] h-[59px] flex items-center justify-center bg-transparent"
            >
                <CM_LABEL_Smart
                    id={`${id}-label`}
                    key={text}
                    text={text}
                    maxArea={{ width: 310, height: 59 }}
                    style={{ fontSize: 52, fontFamily: "LGSBD", color: "#ffffff", lineHeight: "1.1" }}
                    align="center"
                />
            </div>
        </div>
    );
};

WD_ANIM_BootScreen.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 부팅 화면에 표시될 환영 문구 */
    text: PropTypes.string,
    /** 현재 포커스 상태 여부 */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 ('ANIM_COMPLETE' 액션 전달) */
    onKey: PropTypes.func,
    /** 커스텀 스타일 객체 */
    style: PropTypes.object
};

export default WD_ANIM_BootScreen;

