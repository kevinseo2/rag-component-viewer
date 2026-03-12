import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Smart from './CM_LABEL_Smart';
import CM_ANIM_SequencePlayer from './CM_ANIM_SequencePlayer';

/**
 * WD_DIALOG_AnimIcon
 * A dialogue widget with an icon (static or animated) and text.
 */
const WD_DIALOG_AnimIcon = ({
    id = "WD_DIALOG_AnimIcon",
    text = "",
    imagePath = "",
    sequenceId = "",
    showStaticImage = false,
    showLoadingAnimation = false,
    gap = 16,
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

    const FRAME_COUNTS = {
        'img_loading_large_orange': 50,
        'img_loading_large_blue': 40,
    };

    const playlist = sequenceId ? [{
        CM_ANIM_Sequence: {
            path: `/ui/image_sequences/${sequenceId}/.orig_images`,
            frames: Array.from({ length: FRAME_COUNTS[sequenceId] || 30 }, (_, i) =>
                `${sequenceId}_${(i + 1).toString().padStart(3, '0')}.png`
            )
        },
        duration: 1000,
        repeatCount: -1
    }] : [];

    return (
        <div
            id={id}
            className="w-[320px] h-[240px] bg-black relative"
            style={style}
        >
            <div
                id={`${id}-content`}
                className="absolute left-0 top-0 w-full h-full flex flex-col items-center justify-center"
                style={{ gap: `${gap}px` }}
            >
                {showStaticImage && imagePath && (
                    <img
                        id={`${id}-icon`}
                        src={imagePath}
                        alt="icon"
                        className="w-auto h-auto"
                    />
                )}

                {showLoadingAnimation && sequenceId && (
                    <div id={`${id}-animation-wrapper`} className="w-[62px] h-[62px]">
                        <CM_ANIM_SequencePlayer
                            id={`${id}-animation`}
                            playlist={playlist}
                            style={{ background: 'transparent' }}
                        />
                    </div>
                )}

                <div id={`${id}-text-container`} className="px-[5px]">
                    <CM_LABEL_Smart
                        id={`${id}-label`}
                        key={text}
                        text={text}
                        maxArea={{ width: 310, height: 100 }}
                        style={{ fontSize: 25, fontFamily: "LGSBD", color: "#ffffff", lineHeight: "1.1" }}
                        align="center"
                        multiline={true}
                    />
                </div>
            </div>
        </div>
    );
};

WD_DIALOG_AnimIcon.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 다이얼로그에 표시될 안내 텍스트 */
    text: PropTypes.string,
    /** 정적 이미지로 표시할 아이콘 경로 (showStaticImage가 true일 때 사용) */
    imagePath: PropTypes.string,
    /** 시퀀스 애니메이션 ID (showLoadingAnimation이 true일 때 사용, 예: 'img_loading_large_orange') */
    sequenceId: PropTypes.oneOf(['img_loading_large_orange', 'img_loading_large_blue', '']),
    /** 정적 아이콘 이미지 표시 여부 */
    showStaticImage: PropTypes.bool,
    /** 로딩 애니메이션 표시 여부 */
    showLoadingAnimation: PropTypes.bool,
    /** 현재 포커스 상태 여부 */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 */
    onKey: PropTypes.func,
    /** 커스텀 스타일 객체 */
    style: PropTypes.object
};

export default WD_DIALOG_AnimIcon;

