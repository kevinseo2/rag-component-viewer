import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Smart from './CM_LABEL_Smart';
import CM_ANIM_SequencePlayer from './CM_ANIM_SequencePlayer';

/**
 * WD_DIALOG_ChildLock
 * Child lock screen widget.
 */
const WD_DIALOG_ChildLock = ({
    id = "WD_DIALOG_ChildLock",
    text = "",
    isFocused = true,
    onKey,
    style = {}
}) => {
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

    const playlist = [{
        CM_ANIM_Sequence: {
            path: "/ui/image_sequences/btn_unlock_progress/.orig_images",
            frames: Array.from({ length: 90 }, (_, i) => `btn_unlock_progress_${(i + 1).toString().padStart(3, '0')}.png`)
        },
        duration: 1000,
        repeatCount: 1
    }];

    return (
        <div
            id={id}
            className="w-[320px] h-[240px] bg-black relative"
            style={style}
        >
            {/* Unlock Progress Animation */}
            <div id={`${id}-animation-wrapper`} className="absolute top-[42px] left-[129px] w-[62px] h-[62px]">
                <CM_ANIM_SequencePlayer
                    id={`${id}-animation`}
                    playlist={playlist}
                    style={{ background: 'transparent' }}
                />
            </div>

            {/* Instruction Text */}
            <div
                id={`${id}-text-wrapper`}
                className="absolute left-[5px] top-[110px] w-[310px] h-[87px] flex items-center justify-center text-center"
            >
                <CM_LABEL_Smart
                    id={`${id}-label`}
                    key={text}
                    text={text}
                    maxArea={{ width: 310, height: 87 }}
                    style={{ fontSize: 25, fontFamily: "LGSBD", color: "#ffffff", lineHeight: "1.1" }}
                    align="center"
                    multiline={true}
                />
            </div>
        </div>
    );
};

WD_DIALOG_ChildLock.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 잠금 해제 안내 텍스트 */
    text: PropTypes.string,
    /** 현재 포커스 상태 여부 */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 */
    onKey: PropTypes.func,
    /** 커스텀 스타일 객체 */
    style: PropTypes.object
};

export default WD_DIALOG_ChildLock;

