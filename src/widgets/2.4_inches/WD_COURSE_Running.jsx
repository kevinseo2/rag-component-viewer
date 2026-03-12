import React from 'react';
import PropTypes from 'prop-types';
import WD_COURSE_ProgressBase from './WD_COURSE_ProgressBase';

/**
 * WD_COURSE_Running component
 * Wrapper for WD_COURSE_ProgressBase
 */
const WD_COURSE_Running = ({
    id = "WD_COURSE_Running",
    isFocused = true,
    onKey,
    ...props
}) => {
    React.useEffect(() => {
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
                onKey?.(action, action === 'OK' ? props : undefined);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, onKey, props]);

    return (
        <div
            id={id}
            className="relative w-[310px] h-[240px] overflow-hidden"
        >
            <WD_COURSE_ProgressBase
                id={`${id}-WD_COURSE_ProgressBase`}
                {...props}
            />
        </div>
    );
};

WD_COURSE_Running.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 현재 동작 중인 코스 이름 */
    course_name: PropTypes.string,
    /** AI 아이콘 표시 여부 */
    show_ai: PropTypes.bool,
    /** 오각형 아이콘 표시 여부 */
    show_pentagon: PropTypes.bool,
    /** 예약 지연 텍스트 */
    delay_text: PropTypes.string,
    /** 현재 코스 상태 (세탁, 헹굼, 탈수 등) */
    course_status: PropTypes.string,
    /** 전체 진행률 (0-100) */
    course_progress: PropTypes.number,
    /** 하단 보조 설명 텍스트 */
    description_text: PropTypes.string,
    /** 인디케이터 전체 개수 */
    indicator_count: PropTypes.number,
    /** 현재 활성화된 인디케이터 인덱스 */
    indicator_current_idx: PropTypes.number,
    /** 인디케이터 표시 여부 */
    show_indicator: PropTypes.bool,
    /** 코스 상태 텍스트 깜빡임 활성화 여부 */
    blink_status: PropTypes.bool,
    /** 남은 시간 - 시 */
    remain_hour: PropTypes.number,
    /** 남은 시간 - 분 */
    remain_min: PropTypes.number,
    /** 전체 콘텐츠 가시성 제어 */
    contents_visible: PropTypes.bool,
    /** 현재 포커스 상태 여부 */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 */
    onKey: PropTypes.func,
    /** 스타일 객체 */
    style: PropTypes.object
};

export default WD_COURSE_Running;

