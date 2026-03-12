import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CM_ANIM_Sequence from './CM_ANIM_Sequence';

/**
 * CM_ANIM_IntroLoop - 인트로 → 루프 이미지 시퀀스 전환 컴포넌트
 *
 * 인트로 이미지 시퀀스를 1회 재생한 뒤, 루프 이미지 시퀀스를 무한 반복합니다.
 * CM_ANIM_Sequence 컴포넌트를 내부적으로 사용합니다.
 *
 * 재생 흐름:
 * 1. introImages가 있으면 → introDuration 동안 1회 재생 → 완료 후 루프로 전환
 * 2. introImages가 비어있으면 → 즉시 루프 재생 시작
 * 3. loopImages가 비어있으면 → 인트로 완료 후 아무것도 표시하지 않음
 *
 * - 컨테이너: 부모 크기 100% (relative)
 */
const CM_ANIM_IntroLoop = ({
    introImages = [],
    introDuration = 1000,
    loopImages = [],
    loopDuration = 2000,
}) => {
    /** 현재 루프 재생 중인지 여부 (introImages가 비어있으면 초기값 true) */
    const [isPlayingLoop, setIsPlayingLoop] = useState(introImages.length === 0);

    /** 인트로 재생 완료 콜백: loopImages가 있으면 루프 재생으로 전환 */
    const handleIntroComplete = () => {
        if (loopImages.length > 0) {
            setIsPlayingLoop(true);
        }
    };

    return (
        <div id="CM_ANIM_IntroLoop-container" className="relative w-full h-full">
            {!isPlayingLoop && introImages.length > 0 ? (
                <CM_ANIM_Sequence
                    id="CM_ANIM_IntroLoop-intro"
                    images={introImages}
                    duration={introDuration}
                    repeat={false}
                    onComplete={handleIntroComplete}
                />
            ) : (
                loopImages.length > 0 && (
                    <CM_ANIM_Sequence
                        id="CM_ANIM_IntroLoop-loop"
                        images={loopImages}
                        duration={loopDuration}
                        repeat={true}
                    />
                )
            )}
        </div>
    );
};

CM_ANIM_IntroLoop.propTypes = {
    /**
     * 인트로 이미지 경로 배열
     * 1회만 재생되며, 완료 후 루프 시퀀스로 전환됩니다.
     * 빈 배열([])이면 인트로를 건너뛰고 즉시 루프를 시작합니다.
     * @example ["/images/intro/frame_001.png", "/images/intro/frame_002.png"]
     */
    introImages: PropTypes.arrayOf(PropTypes.string),

    /**
     * 인트로 시퀀스 전체 재생 시간 (밀리초)
     * introImages의 모든 프레임이 이 시간 안에 재생됩니다.
     * @example 1000, 2000
     */
    introDuration: PropTypes.number,

    /**
     * 루프 이미지 경로 배열
     * 인트로 완료 후 무한 반복 재생됩니다.
     * 빈 배열([])이면 인트로 완료 후 아무것도 표시하지 않습니다.
     * @example ["/images/loop/frame_001.png", "/images/loop/frame_002.png"]
     */
    loopImages: PropTypes.arrayOf(PropTypes.string),

    /**
     * 루프 시퀀스 1회 재생 시간 (밀리초)
     * loopImages의 모든 프레임이 이 시간 안에 재생된 뒤 처음부터 반복됩니다.
     * @example 2000, 3000
     */
    loopDuration: PropTypes.number,
};

export default CM_ANIM_IntroLoop;

