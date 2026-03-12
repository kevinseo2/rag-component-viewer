import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
/**
 * CM_ANIM_Sequence Component
 * Plays an array of image URLs over a specified duration.
 * Calls onComplete when the sequence finishes (if not repeating).
 */
const CM_ANIM_Sequence = ({
    images = [],
    duration = 1000,
    width = '100%',
    height = '100%',
    repeat = true,
    onComplete = null
}) => {
    const [index, setIndex] = useState(0);
    const onCompleteRef = useRef(onComplete);

    // Keep onComplete ref updated to avoid stale closures in setInterval
    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        if (!images || images.length === 0) return;

        const intervalTime = duration / images.length;
        let currentIdx = 0;

        const interval = setInterval(() => {
            currentIdx++;

            if (currentIdx >= images.length) {
                if (repeat) {
                    currentIdx = 0;
                    setIndex(0);
                } else {
                    clearInterval(interval);
                    // Trigger completion after the last frame's duration
                    if (onCompleteRef.current) {
                        onCompleteRef.current();
                    }
                }
            } else {
                setIndex(currentIdx);
            }
        }, intervalTime);

        return () => {
            clearInterval(interval);
        };
    }, [images, duration, repeat]);

    if (!images || images.length === 0) return null;

    return (
        <div
            id="CM_ANIM_Sequence-container"
            className="relative overflow-hidden flex items-center justify-center"
            style={{ width, height }}
        >
            <img
                src={images[index]}
                alt={`Sequence frame ${index}`}
                className="w-full h-full object-contain"
            />
        </div>
    );
};

CM_ANIM_Sequence.propTypes = {
    /** 
     * 이미지 파일 경로 배열
     * - 각 요소는 이미지 URL 문자열
     * - 모든 이미지가 순차적으로 재생됨
     */
    images: PropTypes.array,

    /** 
     * 전체 시퀀스 재생 시간 (밀리초)
     * - 기본값: 1000ms (1초)
     * - 각 프레임의 재생 시간 = duration / images.length
     */
    duration: PropTypes.number,

    /** 컴포넌트 너비 (문자열 또는 숫자, 기본값: '100%') */
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /** 컴포넌트 높이 (문자열 또는 숫자, 기본값: '100%') */
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /** 
     * 반복 재생 여부
     * - true: 무한 반복
     * - false: 1회만 재생하고 종료
     */
    repeat: PropTypes.bool,

    /** 
     * 시퀀스 재생 완료 시 호출되는 콜백 함수
     * - repeat=false일 때만 호출됨
     */
    onComplete: PropTypes.func,
};

export default CM_ANIM_Sequence;

