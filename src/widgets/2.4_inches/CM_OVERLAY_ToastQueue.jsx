// ...existing imports
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import CM_OVERLAY_Toast from './CM_OVERLAY_Toast';

/**
 * CM_OVERLAY_ToastQueue - 토스트 알림 큐 관리 및 애니메이션 컴포넌트
 *
 * 화면 하단에서 위로 슬라이드되는 토스트 메시지를 관리합니다.
 * 여러 토스트가 연속으로 요청될 경우 내부 큐에 쌓아두고 순차적으로 표시합니다.
 *
 * 애니메이션 흐름:
 * 1. 토스트 등장: translateY로 위로 슬라이드 (500ms)
 * 2. 유지: duration만큼 대기 (기본값: 줄 수 < 3이면 2000ms, 아니면 3500ms)
 * 3. 퇴장: translateY(0)으로 아래로 슬라이드 (500ms)
 * 4. 큐에 다음 토스트가 있으면 1번부터 반복
 *
 * - 컨테이너 크기: 310 x 240px
 * - 토스트 높이: 줄 수에 따라 92px / 120px / 150px 자동 결정
 *
 * @example
 * <CM_OVERLAY_ToastQueue
 *     text="세탁이 완료되었습니다"
 *     duration={2000}
 *     slots={[]}
 *     onKey={(action) => console.log(action)}
 * />
 */
const CM_OVERLAY_ToastQueue = ({ text, duration, slots, isFocused = true, onKey }) => {
    /** 현재 화면에 표시 중인 토스트 데이터 ({ text, duration, slots }) */
    const [currentToast, setCurrentToast] = useState(null);
    /** 토스트의 Y축 오프셋 (0: 숨김, 음수: 위로 슬라이드되어 보임) */
    const [offsetY, setOffsetY] = useState(0);
    /** 대기 중인 토스트 큐 */
    const queueRef = useRef([]);
    /** 현재 큐 처리 중 여부 */
    const isProcessingRef = useRef(false);

    /** 중복 트리거 방지를 위한 마지막 업데이트 키 */
    const lastUpdateRef = useRef("");

    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            const keyMap = {
                'Enter': 'OK',
                'Escape': 'BACK',
                'ArrowLeft': 'LEFT',
                'ArrowRight': 'RIGHT',
                'ArrowUp': 'UP',
                'ArrowDown': 'DOWN'
            };

            const action = keyMap[e.key];
            if (action) {
                e.preventDefault();
                onKey?.(action, action === 'OK' ? currentToast : undefined);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, onKey]);

    useEffect(() => {
        // Generate a unique key for the update if possible, or just watch changes
        const updateKey = JSON.stringify({ text, duration, slots });
        if (text && updateKey !== lastUpdateRef.current) {
            lastUpdateRef.current = updateKey;
            queueRef.current.push({ text, duration, slots: slots || [] });
            if (!isProcessingRef.current) {
                processQueue();
            }
        }
    }, [text, duration, slots]);

    /**
     * 큐에서 다음 토스트를 꺼내어 슬라이드 애니메이션을 실행하는 재귀 함수
     * 큐가 비면 처리를 종료하고 토스트를 숨깁니다.
     */
    const processQueue = () => {
        if (queueRef.current.length === 0) {
            isProcessingRef.current = false;
            setCurrentToast(null);
            return;
        }

        isProcessingRef.current = true;
        const toast = queueRef.current.shift();
        setCurrentToast(toast);

        /* 줄 수에 따른 토스트 높이 결정 (C 코드 lv_CM_OVERLAY_Toast.c 기준) */
        const lineCount = toast.text.split('\n').length;
        let height = 92;
        if (lineCount < 3) height = 92;
        else if (lineCount < 5) height = 120;
        else height = 150;

        /* duration이 0이면 줄 수에 따라 자동 결정 */
        let toastDuration = toast.duration;
        if (toastDuration === 0) {
            toastDuration = lineCount < 3 ? 2000 : 3500;
        }

        setOffsetY(0);

        setTimeout(() => {
            /* 1단계: 위로 슬라이드 (등장) */
            setOffsetY(-height);

            setTimeout(() => {
                /* 2단계: 아래로 슬라이드 (퇴장) */
                setOffsetY(0);

                setTimeout(() => {
                    /* 3단계: 퇴장 애니메이션 완료 후 다음 큐 처리 */
                    processQueue();
                }, 500);
            }, toastDuration + 500);
        }, 50);
    };

    return (
        <div
            id="CM_OVERLAY_ToastQueue-container"
            className="absolute overflow-hidden"
            style={{ width: '310px', height: '240px', left: '0px', top: '0px' }}
        >
            {currentToast && (
                <div
                    id="CM_OVERLAY_ToastQueue-animation-wrapper"
                    className="absolute w-full transition-transform duration-500"
                    style={{
                        top: '240px',
                        transform: `translateY(${offsetY}px)`,
                    }}
                >
                    <CM_OVERLAY_Toast
                        text={currentToast.text}
                        duration={currentToast.duration}
                        slots={currentToast.slots}
                    />
                </div>
            )}
        </div>
    );
};

CM_OVERLAY_ToastQueue.propTypes = {
    /**
     * 토스트에 표시할 메시지 텍스트
     * 줄바꿈(\n)으로 멀티라인 지원. 줄 수에 따라 토스트 높이가 자동 결정됩니다.
     * - 1~2줄: 92px
     * - 3~4줄: 120px
     * - 5줄 이상: 150px
     *
     * 포맷 슬롯을 사용할 경우 "{0}", "{1}" 등의 플레이스홀더를 포함할 수 있습니다.
     * @example "세탁이 완료되었습니다", "건조 시간\n약 2시간 소요됩니다"
     */
    text: PropTypes.string,

    /**
     * 토스트 유지 시간 (밀리초)
     * 슬라이드 등장 후 이 시간만큼 화면에 머문 뒤 퇴장 애니메이션이 시작됩니다.
     * - 0: 자동 결정 (줄 수 < 3이면 2000ms, 그 외 3500ms)
     * - 양수: 지정된 시간만큼 유지
     * @example 2000, 3500
     */
    duration: PropTypes.number,

    /**
     * 포맷 슬롯 데이터 배열
     * text 내의 "{0}", "{1}" 등의 플레이스홀더에 매핑되는 값들입니다.
     * CM_LABEL_Formatted를 통해 렌더링됩니다.
     * @example ["값1", { type: "image", value: "icon.png" }]
     */
    slots: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            /** 슬롯 타입 — 'string': 텍스트, 'image': 이미지, 'number': 숫자 */
            type: PropTypes.oneOf(['string', 'image', 'number']),
            /** 슬롯 값 (텍스트 문자열 또는 이미지 경로 또는 숫자) */
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            /** 슬롯별 개별 스타일 */
            style: PropTypes.object
        })
    ])),

    /**
     * 현재 포커스 상태 여부
     * true일 때만 키보드 이벤트(Enter, Escape, 방향키)를 수신합니다.
     */
    isFocused: PropTypes.bool,

    /**
     * 키 이벤트 콜백 함수
     * @param {string} action - 키 액션 ('OK' | 'BACK' | 'LEFT' | 'RIGHT' | 'UP' | 'DOWN')
     * @param {object} [payload] - OK 키일 경우 현재 토스트 데이터가 전달됩니다.
     */
    onKey: PropTypes.func,
};

export default CM_OVERLAY_ToastQueue;

