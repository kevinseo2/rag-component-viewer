import React from 'react';
import PropTypes from 'prop-types';
import CM_ANIM_SequencePlayer from './CM_ANIM_SequencePlayer';
import CM_LABEL_Smart from './CM_LABEL_Smart';

/**
 * WD_PROGRESS_Circle Widget Component
 * Displays a circular progress ring and status information at the center.
 * Reproduces lv_WD_PROGRESS_Circle.c logic.
 */
const WD_PROGRESS_Circle = ({
    id,
    progressPct = 0,
    descriptionText = "",
    showStillImage = true,
    infoImg = null,
    infoImgAnim = null, // { CM_ANIM_Sequence, duration }
    progressRingAnim = {
        CM_ANIM_Sequence: {
            path: "/ui/image_sequences/washer_dryer/progress_circle_bar_combo/.orig_images",
            totalFrames: 10
        },
        duration: 1000
    },
    className = "",
    style = {},
    isFocused = true,
    onKey,
}) => {
    React.useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                onKey?.('OK', { progressPct, descriptionText });
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onKey?.('BACK');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, onKey, progressPct, descriptionText]);

    // Map 0-100% to frame index (0-9)
    const { path, totalFrames } = progressRingAnim.CM_ANIM_Sequence;
    const frameCount = totalFrames || 10;
    const frameIndex = Math.min(Math.floor(progressPct / 10), frameCount - 1);
    const parts = path.split('/');
    const frameName = parts[parts.length - 2]; // e.g. 'progress_circle_bar_combo'
    const ringFrameSrc = `${path}/${frameName}_${String(frameIndex).padStart(2, '0')}.png`;

    return (
        <div
            id={id}
            className={`relative w-[310px] h-[240px] bg-black overflow-hidden flex items-center justify-center ${className}`}
            style={style}
        >
            {/* Outer Progress Ring - static frame image based on progressPct */}
            <img
                id={`${id}_ring`}
                src={ringFrameSrc}
                alt="progress ring"
                style={{ position: 'absolute', top: 0, left: 0, width: 310, height: 240, objectFit: 'contain' }}
            />

            {/* Center Content Container (lines 120-127) */}
            <div id="WD_PROGRESS_Circle-center-content" className="flex flex-col items-center justify-center z-10 gap-1">
                {/* Info Image/Animation (lines 60-71) */}
                {showStillImage ? (
                    infoImg && <img src={infoImg} alt="info" className="h-[40px] object-contain" />
                ) : (
                    infoImgAnim && <CM_ANIM_SequencePlayer playlist={[infoImgAnim]} style={{ height: 40 }} />
                )}

                {/* Description (lines 141-147) - C code: max_width 204 */}
                <CM_LABEL_Smart
                    key={descriptionText}
                    text={descriptionText}
                    maxArea={{ width: 204, height: 72 }}
                    multiline={true}
                    style={{
                        fontSize: 30,
                        fontWeight: '600',
                        color: '#FFFFFF',
                        textAlign: 'center'
                    }}
                />

                {/* Percentage (lines 149-157) */}
                <span className="text-[28px] font-semibold text-white">
                    {progressPct}%
                </span>
            </div>
        </div>
    );
};

WD_PROGRESS_Circle.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 진행률 퍼센트 (0-100) */
    progressPct: PropTypes.number,
    /** 중앙에 표시될 상태 설명 텍스트 */
    descriptionText: PropTypes.string,
    /** 정지 이미지 표시 여부 (false 시 애니메이션 표시) */
    showStillImage: PropTypes.bool,
    /** 중앙에 표시될 정지 이미지 경로 */
    infoImg: PropTypes.string,
    /** 중앙에 표시될 애니메이션 설정 */
    infoImgAnim: PropTypes.shape({
        CM_ANIM_Sequence: PropTypes.object.isRequired,
        duration: PropTypes.number
    }),
    /** 바깥쪽 진행 링 애니메이션 설정 */
    progressRingAnim: PropTypes.shape({
        CM_ANIM_Sequence: PropTypes.object.isRequired,
        duration: PropTypes.number
    }),
    /** 현재 포커스 상태 여부 */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 */
    onKey: PropTypes.func,
    /** 추가 CSS 클래스명 */
    className: PropTypes.string,
    /** 스타일 객체 */
    style: PropTypes.object
};

export default WD_PROGRESS_Circle;

