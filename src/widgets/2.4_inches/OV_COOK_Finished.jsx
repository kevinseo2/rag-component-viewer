import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import OV_TITLE_2Line from './OV_TITLE_2Line';
import CM_LABEL_Smart from './CM_LABEL_Smart';
import CM_ANIM_SequencePlayer from './CM_ANIM_SequencePlayer';

/**
 * OV_COOK_Finished
 * Displays completion animation and message.
 */
const OV_COOK_Finished = ({
    id = "OV_COOK_Finished",
    title = "요리 완료",
    message = "요리를 완료했어요",
    isFocused = true,
    onKey,
    style = {}
}) => {
    // Animation State
    const [animStarted, setAnimStarted] = useState(false);

    useEffect(() => {
        // Start animation shortly after mount
        const timer = setTimeout(() => {
            setAnimStarted(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                onKey?.('OK');
            } else if (e.key === 'Escape') {
                onKey?.('BACK');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, onKey]);

    // Image Sequence Configuration
    const sequenceConfig = [{
        CM_ANIM_Sequence: {
            path: "/ui/image_sequences/img_complete_check_orange/.orig_images",
            frames: Array.from({ length: 25 }, (_, i) => `img_complete_check_orange_${(i + 1).toString().padStart(3, '0')}.png`)
        },
        duration: 833,
        repeatCount: 1 // Play once
    }];

    const animY = animStarted ? 163 : 169;
    const animOpacity = animStarted ? 1 : 0;

    return (
        <div id={id} className="w-[320px] h-[240px] bg-black relative" style={style}>
            <OV_TITLE_2Line title={title} />

            {/* Image Sequence */}
            <div className="absolute top-[47px] left-[106px] w-[108px] h-[108px]">
                <CM_ANIM_SequencePlayer
                    id={`${id}-check-anim`}
                    playlist={sequenceConfig}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>

            {/* Message Label with Animation */}
            <div
                className="absolute left-[5px] w-[310px] flex justify-center transition-all duration-500 ease-out"
                style={{
                    top: `${animY}px`,
                    opacity: animOpacity
                }}
            >
                <CM_LABEL_Smart
                    id={`${id}-msg`}
                    key={message}
                    text={message}
                    style={{
                        fontSize: 28,
                        fontFamily: "LGSBD",
                        color: "#FFFFFF",
                        textAlign: "center"
                    }}
                    maxArea={{ width: 310, height: 31 }}
                    align="center"
                />
            </div>
        </div>
    );
};

OV_COOK_Finished.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 상단 타이틀 텍스트 */
    title: PropTypes.string,
    /** 완료 메시지 텍스트 */
    message: PropTypes.string,
    /** 현재 포커스 상태 여부 */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 */
    onKey: PropTypes.func,
    /** 커스텀 스타일 객체 */
    style: PropTypes.object
};

export default OV_COOK_Finished;

