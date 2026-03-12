import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import CM_ANIM_SequencePlayer from './CM_ANIM_SequencePlayer';

/**
 * WD_ANIM_Boot - 부팅 애니메이션 위젯 컴포넌트
 *
 * CM_ANIM_SequencePlayer를 래핑하여 부팅 시퀀스 애니메이션을 재생합니다.
 * 단일 애니메이션(animation) 또는 다중 애니메이션(animations 배열)을 지원합니다.
 *
 * 데이터 우선순위:
 * 1. animations 배열이 있으면 → 플레이리스트로 사용
 * 2. animation 단일 객체가 있으면 → 1개짜리 배열로 변환
 * 3. 둘 다 없으면 → null 렌더링 (아무것도 표시하지 않음)
 *
 * - 컨테이너: 310 x 240px, 배경 검정, overflow hidden
 * - 모든 시퀀스 완료 시 onReady 콜백 호출
 */
const WD_ANIM_Boot = ({
    id,
    animation,
    animations,
    onReady,
    isFocused = true,
    onKey,
    style = {},
    className = "",
}) => {
    /** 플레이리스트 구성: animations 우선, 없으면 animation을 1개짜리 배열로 변환 */
    const playlist = useMemo(() => {
        const source = animations || (animation ? [animation] : []);
        return source.map(anim => ({
            ...anim,
            repeatCount: anim.repeatCount || 1,
        }));
    }, [animation, animations]);

    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                onKey?.('OK', { playlist });
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onKey?.('BACK');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, onKey, playlist]);

    if (playlist.length === 0) return null;

    return (
        <div
            id={id}
            className={`relative w-[310px] h-[240px] bg-black overflow-hidden ${className}`}
            style={style}
        >
            <CM_ANIM_SequencePlayer
                id={`${id}_player`}
                playlist={playlist}
                onComplete={onReady}
            />
        </div>
    );
};

WD_ANIM_Boot.propTypes = {
    /**
     * 컴포넌트의 고유 식별자 (HTML id 속성)
     * 내부적으로 `${id}_player` 형태로 CM_ANIM_SequencePlayer에 전달됩니다.
     */
    id: PropTypes.string,

    /**
     * 단일 애니메이션 설정 객체
     * animations가 없을 때 이 객체 하나로 플레이리스트를 구성합니다.
     */
    animation: PropTypes.shape({
        /** 애니메이션 이름 (디버깅/식별용) */
        name: PropTypes.string,
        /** 프레임 이미지 경로 배열 (재생 순서) */
        images: PropTypes.arrayOf(PropTypes.string).isRequired,
        /** 시퀀스 전체 재생 시간 (밀리초) */
        duration: PropTypes.number,
        /** 무한 루프 여부 */
        loop: PropTypes.bool,
        /** 반복 횟수 (미지정 시 기본값 1) */
        repeatCount: PropTypes.number
    }),

    /**
     * 다중 애니메이션 재생 목록
     * 이 배열이 있으면 animation 단일 객체보다 우선 적용됩니다.
     * 배열의 각 항목이 순서대로 재생됩니다.
     */
    animations: PropTypes.arrayOf(PropTypes.shape({
        /** 애니메이션 이름 (디버깅/식별용) */
        name: PropTypes.string,
        /** 프레임 이미지 경로 배열 (재생 순서) */
        images: PropTypes.arrayOf(PropTypes.string).isRequired,
        /** 시퀀스 전체 재생 시간 (밀리초) */
        duration: PropTypes.number,
        /** 무한 루프 여부 */
        loop: PropTypes.bool,
        /** 반복 횟수 (미지정 시 기본값 1) */
        repeatCount: PropTypes.number
    })),

    /**
     * 모든 애니메이션 시퀀스 완료 시 호출되는 콜백
     * 마지막 항목이 루프이면 호출되지 않습니다.
     */
    onReady: PropTypes.func,

    /**
     * 현재 포커스 상태 여부
     * true일 때만 키보드 이벤트(Enter, Escape)를 수신합니다.
     */
    isFocused: PropTypes.bool,

    /**
     * 키 이벤트 콜백 함수
     * @param {string} action - 'OK' | 'BACK'
     * @param {object} [payload] - OK 시 { playlist } 객체가 전달됩니다.
     */
    onKey: PropTypes.func,

    /** 외부 컨테이너에 적용할 추가 인라인 스타일 */
    style: PropTypes.object,

    /** 외부 컨테이너에 추가할 CSS 클래스명 */
    className: PropTypes.string
};

export default WD_ANIM_Boot;

