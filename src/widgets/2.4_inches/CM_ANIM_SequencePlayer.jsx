import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CM_ANIM_Sequence from './CM_ANIM_Sequence';

/**
 * CM_ANIM_SequencePlayer - 이미지 시퀀스 플레이리스트 재생 컴포넌트
 *
 * playlist 배열에 정의된 이미지 시퀀스들을 순차적으로 재생합니다.
 * 각 항목이 완료되면 다음 항목으로 자동 전환되며,
 * 마지막 항목까지 완료되면 onComplete 콜백을 호출합니다.
 *
 * 재생 흐름:
 * 1. playlist[0]의 이미지 시퀀스 재생
 * 2. 재생 완료 시 playlist[1]로 전환 (repeatCount === -1이면 무한 루프)
 * 3. 마지막 항목 완료 시 onComplete 호출
 * 4. playlist prop이 변경되면 처음(index 0)부터 다시 시작
 *
 * - 컨테이너: 100% 너비/높이, 배경 검정, 중앙 정렬
 * - 각 항목별 개별 width/height 지원
 */
const CM_ANIM_SequencePlayer = ({
    id,
    playlist = [],
    style = {},
    className = "",
    onComplete = null,
}) => {
    /** 현재 재생 중인 playlist 항목의 인덱스 */
    const [currentIndex, setCurrentIndex] = useState(0);

    /** playlist가 변경되면 처음부터 재생 (variant 전환 대응) */
    useEffect(() => {
        setCurrentIndex(0);
    }, [playlist]);

    const currentItem = playlist[currentIndex];

    if (!currentItem || !currentItem.CM_ANIM_Sequence || !currentItem.CM_ANIM_Sequence.frames) {
        return null;
    }

    const { path, frames } = currentItem.CM_ANIM_Sequence;
    const duration = currentItem.duration || 1000;
    const isLoop = currentItem.repeatCount === -1;

    // Use item-specific dimensions if provided, otherwise fallback to player style
    // Check both item level and nested CM_ANIM_Sequence level
    const w = currentItem.width || currentItem.CM_ANIM_Sequence.width || style.width;
    const h = currentItem.height || currentItem.CM_ANIM_Sequence.height || style.height;

    const targetWidth = w ? (typeof w === 'number' ? `${w}px` : w) : 'auto';
    const targetHeight = h ? (typeof h === 'number' ? `${h}px` : h) : 'auto';

    const resolvedImages = frames.map(frame => {
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        const basePath = cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
        return `${basePath}${frame}`;
    });

    const handleSequenceComplete = () => {
        if (currentIndex < playlist.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            if (onComplete) onComplete();
        }
    };

    return (
        <div
            id={id}
            className={`flex items-center justify-center overflow-hidden bg-black ${className}`}
            style={{ width: '100%', height: '100%', ...style }}
        >
            <CM_ANIM_Sequence
                key={`${id}_seq_${currentIndex}`}
                images={resolvedImages}
                duration={duration}
                width={targetWidth}
                height={targetHeight}
                repeat={isLoop}
                onComplete={handleSequenceComplete}
            />
        </div>
    );
};

CM_ANIM_SequencePlayer.propTypes = {
    /**
     * 컴포넌트의 고유 식별자 (HTML id 속성)
     * 내부적으로 CM_ANIM_Sequence의 key 생성에도 사용됩니다.
     */
    id: PropTypes.string,

    /**
     * 재생할 이미지 시퀀스 목록
     * 배열의 각 항목이 순서대로 재생되며, 각 항목은 다음 구조를 가집니다:
     *
     * - CM_ANIM_Sequence.path: 이미지 파일들이 위치한 디렉토리 경로
     * - CM_ANIM_Sequence.frames: 프레임 파일명 배열 (재생 순서대로)
     * - CM_ANIM_Sequence.width/height: 이미지 크기 (항목 레벨에서도 지정 가능)
     * - duration: 시퀀스 전체 재생 시간 (밀리초, 기본값: 1000)
     * - repeatCount: 반복 횟수 (-1: 무한 루프, 해당 항목에서 멈춤)
     * - width/height: 항목별 개별 크기 (CM_ANIM_Sequence 레벨보다 우선)
     */
    playlist: PropTypes.arrayOf(PropTypes.shape({
        /** 이미지 시퀀스 데이터 (경로, 프레임 목록, 크기) */
        CM_ANIM_Sequence: PropTypes.shape({
            /** 이미지 파일 디렉토리 경로 */
            path: PropTypes.string.isRequired,
            /** 프레임 파일명 배열 (재생 순서) */
            frames: PropTypes.arrayOf(PropTypes.string).isRequired,
            /** 이미지 너비 */
            width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            /** 이미지 높이 */
            height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        }).isRequired,
        /** 시퀀스 전체 재생 시간 (밀리초) */
        duration: PropTypes.number,
        /** 반복 횟수 (-1: 무한 루프) */
        repeatCount: PropTypes.number,
        /** 항목별 개별 너비 (CM_ANIM_Sequence.width보다 우선) */
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        /** 항목별 개별 높이 (CM_ANIM_Sequence.height보다 우선) */
        height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })),

    /**
     * 외부 컨테이너에 적용할 추가 인라인 스타일
     * width/height를 지정하면 항목별 크기가 없을 때 폴백으로 사용됩니다.
     */
    style: PropTypes.object,

    /**
     * 외부 컨테이너에 추가할 CSS 클래스명
     */
    className: PropTypes.string,

    /**
     * 모든 플레이리스트 항목 재생 완료 시 호출되는 콜백
     * 마지막 항목이 무한 루프(repeatCount: -1)이면 호출되지 않습니다.
     */
    onComplete: PropTypes.func,
};

export default CM_ANIM_SequencePlayer;

