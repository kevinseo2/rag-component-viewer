import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import WD_COURSE_ProgressBase from './WD_COURSE_ProgressBase';

/**
 * WD_CLOCK_Reservation Widget Component
 * A wrapper for WD_COURSE_ProgressBase specifically configured for reservation display
 */
const WD_CLOCK_Reservation = ({
    id = "WD_CLOCK_Reservation",
    courseProgressInfo = {},
    reservationDate = "Today",
    reservationAmpm = "AM",
    reservationHour = 12,
    reservationMin = 0,
    theme = "blue",
    isFocused = true,
    onKey
}) => {
    // Standardized Keyboard interaction
    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            const keyMap = {
                'Enter': 'OK',
                'Escape': 'BACK',
                'ArrowUp': 'UP',
                'ArrowDown': 'DOWN',
                'ArrowLeft': 'LEFT',
                'ArrowRight': 'RIGHT'
            };
            const action = keyMap[e.key];
            if (action) {
                e.preventDefault();
                onKey?.(action, { courseProgressInfo, reservationDate, reservationAmpm, reservationHour, reservationMin, theme });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, onKey, courseProgressInfo, reservationDate, reservationAmpm, reservationHour, reservationMin, theme]);

    return (
        <div id={id} className="relative w-[310px] h-[240px] overflow-hidden">
            <WD_COURSE_ProgressBase
                id={`${id}-WD_COURSE_ProgressBase`}
                course_name={courseProgressInfo.courseTitleInfo?.courseName}
                show_ai={courseProgressInfo.courseTitleInfo?.showImgAi}
                show_pentagon={courseProgressInfo.courseTitleInfo?.showImgPentagon}
                delay_text={courseProgressInfo.delayText}
                course_status={courseProgressInfo.courseStatus}
                course_progress={courseProgressInfo.courseProgress}
                description_text={courseProgressInfo.descriptionFmtstr}
                indicator_count={courseProgressInfo.indicatorCount}
                indicator_current_idx={courseProgressInfo.indicatorCurrentIdx}
                show_indicator={courseProgressInfo.showIndicator}
                blink_status={courseProgressInfo.blinkStatus}
                reservation_date={reservationDate}
                reservation_ampm={reservationAmpm}
                reservation_hour={reservationHour}
                reservation_min={reservationMin}
                time_type="reservation"
                theme={theme}
            />
        </div>
    );
};

WD_CLOCK_Reservation.propTypes = {
    /** 위젯의 고유 식별자 (기본값: "WD_CLOCK_Reservation") */
    id: PropTypes.string,

    /** 
     * 코스 진행 및 상태 정보를 담은 객체 (상세 구조화)
     */
    courseProgressInfo: PropTypes.shape({
        /** 코스 타이틀 관련 정보 */
        courseTitleInfo: PropTypes.shape({
            /** 코스 이름 (예: "표준", "강력") */
            courseName: PropTypes.string,
            /** AI 아이콘 표시 여부 */
            showImgAi: PropTypes.bool,
            /** 오각형 아이콘 표시 여부 */
            showImgPentagon: PropTypes.bool
        }),
        /** 지연 시작 시 표시될 텍스트 */
        delayText: PropTypes.string,
        /** 현재 코스 상태 (예: "Running", "Paused") */
        courseStatus: PropTypes.string,
        /** 현재 진행률 (0~100) */
        courseProgress: PropTypes.number,
        /** 상세 설명 문구 (포맷팅 문자열) */
        descriptionFmtstr: PropTypes.string,
        /** 인디케이터 총 개수 (하단 점 개수) */
        indicatorCount: PropTypes.number,
        /** 현재 활성화된 인디케이터 인덱스 */
        indicatorCurrentIdx: PropTypes.number,
        /** 하단 인디케이터 표시 여부 */
        showIndicator: PropTypes.bool,
        /** 깜빡임 효과 활성화 여부 */
        blinkStatus: PropTypes.bool
    }),

    /** 
     * 예약된 날짜 텍스트
     * - 예: "Today", "Tomorrow"
     */
    reservationDate: PropTypes.string,

    /** 
     * 오전/오후 구분
     * - 'AM' 또는 'PM'
     */
    reservationAmpm: PropTypes.oneOf(['AM', 'PM']),

    /** 
     * 예약 시간 - 시 (1~12)
     */
    reservationHour: PropTypes.number,

    /** 
     * 예약 시간 - 분 (0~59)
     */
    reservationMin: PropTypes.number,

    /** 
     * UI 시각적 테마 선택
     * - 'blue': 세탁기 표준 테마 (파란색 계열)
     * - 'orange': 건조기 표준 테마 (주황색 계열)
     */
    theme: PropTypes.oneOf(['blue', 'orange']),

    /** 현재 위젯의 포커스 활성화 상태 */
    isFocused: PropTypes.bool,

    /** 
     * 키보드 이벤트 발생 시 호출되는 콜백 함수
     * - 상하좌우(UP/DOWN/LEFT/RIGHT), 확인(OK), 취소(BACK) 등을 payload와 함께 전달
     */
    onKey: PropTypes.func,
};

export default WD_CLOCK_Reservation;

