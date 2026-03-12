import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Formatted from './CM_LABEL_Formatted';

/**
 * CM_OVERLAY_Guide - 전체 화면 오버레이 가이드 메시지 컴포넌트
 *
 * 화면 전체를 어두운 반투명 배경(rgba(0,0,0,0.85))으로 덮고,
 * 중앙에 가이드 텍스트를 표시합니다.
 *
 * 표시/숨김 동작:
 * - active가 true로 변경되면 페이드인 (167ms)
 * - dismissManually가 false이면 duration 후 자동 페이드아웃 → onClose 호출
 * - dismissManually가 true이면 외부에서 active를 false로 변경할 때까지 유지
 * - active가 false로 변경되면 즉시 페이드아웃
 *
 * - 오버레이 크기: 310 x 240px, z-index: 100
 * - 텍스트: 흰색, 25px, 중앙 정렬, 멀티라인
 * - 텍스트 영역: 300 x 240px
 */
const CM_OVERLAY_Guide = ({
    id = "CM_OVERLAY_Guide",
    text = "",
    active = false,
    dismissManually = false,
    onClose,
    duration = 4000,
    isFocused = true,
    onKey
}) => {
    /** 오버레이 표시 여부 (페이드인/아웃 애니메이션 제어) */
    const [isVisible, setIsVisible] = useState(false);
    /** 현재 표시 중인 텍스트 (active 전환 시 동기화) */
    const [currentText, setCurrentText] = useState("");

    /** active prop 변경 시 내부 표시 상태 동기화 */
    useEffect(() => {
        if (active) {
            setIsVisible(true);
            setCurrentText(text);
        } else {
            setIsVisible(false);
        }
    }, [active, text]);

    /** 자동 닫힘 타이머: dismissManually가 false일 때 duration 후 페이드아웃 */
    useEffect(() => {
        let timer;
        if (isVisible && !dismissManually) {
            timer = setTimeout(() => {
                setIsVisible(false);
                if (onClose) onClose();
            }, duration);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isVisible, dismissManually, duration, onClose]);

    /** 키보드 이벤트 핸들러: 포커스 상태이고 표시 중일 때만 동작 */
    useEffect(() => {
        if (!isFocused || !isVisible) return;

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
                onKey?.(action, action === 'OK' ? { text: currentText, isVisible } : undefined);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, isVisible, onKey, currentText]);

    return (
        <div
            id={id}
            className={`absolute top-0 left-0 w-[310px] h-[240px] flex items-center justify-center pointer-events-none transition-opacity duration-167 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.85)', // Approximation of toast overlay
                zIndex: 100 // Overlay should be on top
            }}
        >
            <CM_LABEL_Formatted
                key={currentText}
                id={`${id}-label`}
                format={currentText}
                align="center"
                multiline={true}
                maxArea={{ width: 300, height: 240 }}
                style={{
                    color: '#FFFFFF', // style_sb_25pt_white
                    fontSize: '25px', // Approximation 
                    lineHeight: '1.2'
                }}
                animSpeed={15}
            />
        </div>
    );
};

CM_OVERLAY_Guide.propTypes = {
    /**
     * 컴포넌트의 고유 식별자 (HTML id 속성)
     * 내부적으로 `${id}-label` 형태의 하위 요소 id 생성에도 사용됩니다.
     */
    id: PropTypes.string,

    /**
     * 오버레이에 표시할 가이드 텍스트
     * 멀티라인 지원. 포맷 슬롯("{0}" 등)을 포함할 수 있으며 CM_LABEL_Formatted로 렌더링됩니다.
     * @example "문을 닫아주세요", "세제를 투입구에\n넣어주세요"
     */
    text: PropTypes.string,

    /**
     * 오버레이 표시 여부
     * - true: 페이드인하여 가이드 메시지 표시
     * - false: 페이드아웃하여 숨김
     */
    active: PropTypes.bool,

    /**
     * 수동 닫힘 모드
     * - false (기본값): duration 경과 후 자동으로 페이드아웃 → onClose 호출
     * - true: 외부에서 active를 false로 변경할 때까지 계속 표시
     */
    dismissManually: PropTypes.bool,

    /**
     * 오버레이가 자동으로 닫힐 때 호출되는 콜백
     * dismissManually가 false일 때, duration 경과 후 페이드아웃 완료 시 실행됩니다.
     */
    onClose: PropTypes.func,

    /**
     * 오버레이 자동 닫힘까지의 유지 시간 (밀리초)
     * dismissManually가 false일 때만 적용됩니다.
     * @example 4000, 6000
     */
    duration: PropTypes.number,

    /**
     * 현재 포커스 상태 여부
     * true이고 오버레이가 표시 중일 때만 키보드 이벤트를 수신합니다.
     */
    isFocused: PropTypes.bool,

    /**
     * 키 이벤트 콜백 함수
     * @param {string} action - 키 액션 ('OK' | 'BACK' | 'LEFT' | 'RIGHT' | 'UP' | 'DOWN')
     * @param {object} [payload] - OK 키일 경우 { text, isVisible } 객체가 전달됩니다.
     */
    onKey: PropTypes.func
};

export default CM_OVERLAY_Guide;

