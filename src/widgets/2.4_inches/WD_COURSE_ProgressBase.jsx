import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import WD_COURSE_ProgressTitle from './WD_COURSE_ProgressTitle';
import WD_PROGRESS_RemainTime from './WD_PROGRESS_RemainTime';
import WD_CLOCK_ReservationTime from './WD_CLOCK_ReservationTime';
import CM_LABEL_Smart from './CM_LABEL_Smart';
import CM_LABEL_Formatted from './CM_LABEL_Formatted';

/**
 * WD_COURSE_ProgressBase - 코스 진행 상태 기본 위젯
 *
 * C 코드(lv_WD_COURSE_ProgressBase.c) 기반의 코스 진행 화면입니다.
 * 코스명, 잔여/예약 시간, 상태 텍스트, 프로그레스 바, 페이지 인디케이터를 표시합니다.
 *
 * 레이아웃 (310 x 240px, 배경 검정):
 * - 타이틀 영역: 상단 14px (delay_text 있으면 0px), WD_COURSE_ProgressTitle 사용
 * - 지연 텍스트: 상단 31px, 20px 폰트, 흰색
 * - 시간 영역: 상단 60px, 85px 높이 (remain → WD_PROGRESS_RemainTime, reservation → WD_CLOCK_ReservationTime)
 * - 상태 텍스트: 하단 44px, 28px 폰트, blink 시 500ms 간격 흰색/암회색 전환
 * - 설명 텍스트: 하단 8px, 25px 폰트
 * - 프로그레스 바: 상단 147px, 310x5px (진행값 × 3 + 10 으로 translateX 계산)
 * - 페이지 인디케이터: 상단 3px, 도트 이미지 14px 간격
 *
 * 애니메이션:
 * - 상태 텍스트 변경 시 200ms 페이드 아웃/인 전환
 * - blink_status 활성 시 500ms 간격 텍스트 색상 깜빡임 (흰색 ↔ #333333)
 * - contents_visible 변경 시 200ms 불투명도 전환
 * - 프로그레스 바 이동 시 300ms linear 전환
 *
 * 테마:
 * - 'blue': 세탁기용 파란색 프로그레스 바 (washer/progress_bar.png)
 * - 'orange': 건조기용 주황색 프로그레스 바 (dryer/progress_bar.png)
 */
const WD_COURSE_ProgressBase = (props) => {
    const {
        id = "WD_COURSE_ProgressBase",
        course_name = "",
        show_ai = false,
        show_pentagon = false,
        delay_text = "",
        course_status = "",
        course_progress = 0,
        description_text = "",
        indicator_count = 5,
        indicator_current_idx = 0,
        show_indicator = false,
        blink_status = false,
        remain_hour = 0,
        remain_min = 0,
        reservation_date = "Today",
        reservation_ampm = "AM",
        reservation_hour = 12,
        reservation_min = 0,
        time_type = "remain", // "remain" or "reservation"
        contents_visible = true,
        theme = "blue",
        style = {}
    } = props;

    /** 상태 텍스트 깜빡임 타이머 (500ms 간격, blink_status가 true일 때 활성) */
    const [isStatusDisabled, setIsStatusDisabled] = useState(false);
    useEffect(() => {
        let timer;
        if (blink_status) {
            timer = setInterval(() => {
                setIsStatusDisabled(prev => !prev);
            }, 500);
        } else {
            setIsStatusDisabled(false);
        }
        return () => clearInterval(timer);
    }, [blink_status]);

    /** 상태 텍스트 페이드 전환 — 변경 시 200ms 페이드 아웃 후 새 텍스트로 페이드 인 */
    const [displayStatus, setDisplayStatus] = useState(course_status);
    const [statusOpacity, setStatusOpacity] = useState(1);
    const prevStatusRef = useRef(course_status);

    useEffect(() => {
        if (course_status !== prevStatusRef.current) {
            // Fade out
            setStatusOpacity(0);
            const timer = setTimeout(() => {
                setDisplayStatus(course_status);
                setStatusOpacity(1);
            }, 200);
            prevStatusRef.current = course_status;
            return () => clearTimeout(timer);
        }
    }, [course_status]);

    /** 프로그레스 바 X 위치 계산: progress × 3 + 10 (C 코드 기반) */
    const progressX = (course_progress * 3) + 10;

    /** 컨텐츠 표시/숨김 애니메이션 (200ms 불투명도 전환) */
    const [contentsOpacity, setContentsOpacity] = useState(contents_visible ? 1 : 0);
    useEffect(() => {
        setContentsOpacity(contents_visible ? 1 : 0);
    }, [contents_visible]);

    /** 타이틀 영역 동적 크기 계산 (코스명/아이콘 변경 시 재측정) */
    const titleAreaRef = useRef(null);
    const [titleAreaSize, setTitleAreaSize] = useState({ width: 310, height: 36 });

    useEffect(() => {
        if (titleAreaRef.current) {
            setTitleAreaSize({
                width: titleAreaRef.current.offsetWidth,
                height: 36
            });
        }
    }, [course_name, show_ai, show_pentagon, delay_text]); // Recalculate if content changes height

    const progressBarSrc = theme === 'orange' ? '/ui/images/dryer/progress_bar.png' : '/ui/images/washer/progress_bar.png';
    const progressBarBgSrc = theme === 'orange' ? '/ui/images/dryer/progress_bar_bg.png' : '/ui/images/washer/progress_bar_bg.png';

    return (
        <div
            id={id}
            className="relative bg-black overflow-hidden"
            style={{ width: '310px', height: '240px', ...style }}
        >
            {/* Course Title Area */}
            <div
                ref={titleAreaRef}
                id={`${id}-course_title_area`}
                className="absolute w-[310px] transition-all duration-200"
                style={{
                    top: delay_text ? '0px' : '14px', // USER_1 state y=0, default y=14
                    opacity: contentsOpacity
                }}
            >
                <WD_COURSE_ProgressTitle
                    id={`${id}-WD_COURSE_ProgressTitle`}
                    title={course_name}
                    show_ai={show_ai}
                    show_pentagon={show_pentagon}
                    max_width={titleAreaSize.width}
                    max_height={titleAreaSize.height}
                />
            </div>

            {/* Container Body */}
            <div
                id={`${id}-container_body`}
                className="absolute inset-0 w-[310px] h-[240px] pointer-events-none transition-opacity duration-200"
                style={{ opacity: contentsOpacity }}
            >
                {/* Delay Label */}
                {delay_text && (
                    <div
                        id={`${id}-label_delay_text`}
                        className="absolute w-full top-[31px] flex justify-center text-white text-[20px] font-bold"
                        style={{ fontFamily: 'LGSBD23' }}
                    >
                        <CM_LABEL_Smart
                            id={`${id}-next_label_delay`}
                            key={delay_text}
                            text={delay_text}
                            maxArea={{ width: 300, height: 30 }}
                            align="center"
                            style={{ fontSize: 20, color: '#FFFFFF' }}
                        />
                    </div>
                )}

                {/* Time Area */}
                <div
                    id={`${id}-progress_content_area`}
                    className="absolute w-full top-[60px] px-[5px] flex items-end justify-center"
                    style={{ height: '85px' }}
                >
                    {time_type === 'reservation' ? (
                        <WD_CLOCK_ReservationTime
                            id={`${id}-WD_CLOCK_ReservationTime`}
                            reservationDate={reservation_date}
                            reservationAmpm={reservation_ampm}
                            reservationHour={reservation_hour}
                            reservationMin={reservation_min}
                        />
                    ) : (
                        <WD_PROGRESS_RemainTime
                            id={`${id}-WD_PROGRESS_RemainTime`}
                            remain_hour={remain_hour}
                            remain_min={remain_min}
                        />
                    )}
                </div>

                {/* Status Label */}
                <div
                    id={`${id}-status-wrapper`}
                    className="absolute w-full bottom-[44px] flex justify-center"
                    style={{ opacity: statusOpacity }}
                >
                    <CM_LABEL_Smart
                        key={displayStatus}
                        id={`${id}-next_label_status`}
                        text={displayStatus}
                        maxArea={{ width: 300, height: 31 }}
                        align="center"
                        style={{
                            fontSize: 28,
                            fontFamily: 'LGSBD23',
                            color: isStatusDisabled ? '#333333' : '#FFFFFF'
                        }}
                    />
                </div>

                {/* Description Label */}
                {description_text && (
                    <div
                        id={`${id}-description-wrapper`}
                        className="absolute w-full bottom-[8px] flex justify-center"
                    >
                        <CM_LABEL_Formatted
                            key={description_text}
                            id={`${id}-next_fmtlabel_description`}
                            format="{0}"
                            slots={[{ type: 'string', value: description_text }]}
                            maxArea={{ width: 300, height: 30 }}
                            align="center"
                            style={{
                                fontSize: 25,
                                fontFamily: 'LGSBD23',
                                color: '#FFFFFF'
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Progress Bar BG */}
            <img
                id={`${id}-image_track_bg`}
                src={progressBarBgSrc}
                alt="progress bg"
                className="absolute top-[147px] left-1/2 -translate-x-1/2 w-[310px] h-[5px]"
            />

            {/* Progress Bar Track */}
            <div
                id={`${id}-image_track_progress_wrapper`}
                className="absolute top-[147px] left-0 w-full h-[5px] overflow-hidden"
            >
                <img
                    id={`${id}-image_track_progress`}
                    src={progressBarSrc}
                    alt="progress bar"
                    className="absolute transition-transform duration-300 ease-linear"
                    style={{
                        width: '310px',
                        height: '5px',
                        transform: `translateX(${progressX - 310}px)`
                    }}
                />
            </div>

            {/* Page Indicator */}
            {show_indicator && (
                <div
                    id={`${id}-indicator`}
                    className="absolute inset-0 flex items-start justify-center pt-[3px]"
                >
                    <div
                        id={`${id}-indicator-dot-container`}
                        className="flex flex-row space-x-[14px]"
                    >
                        {Array.from({ length: indicator_count }).map((_, i) => (
                            <img
                                key={i}
                                id={`${id}-indicator-dot-${i}`}
                                src={i === indicator_current_idx ? "/ui/images/Common_assets/ic_page_indicator_s.png" : "/ui/images/Common_assets/ic_page_indicator_n.png"}
                                alt="dot"
                                className="w-[10px] h-[10px] object-contain"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

WD_COURSE_ProgressBase.propTypes = {
    /** 컴포넌트의 고유 식별자 (HTML id 속성) */
    id: PropTypes.string,

    /**
     * 코스 이름 (타이틀 영역에 표시)
     * WD_COURSE_ProgressTitle의 title prop으로 전달됩니다.
     * @example "표준세탁", "찬물세탁", "울/섬세"
     */
    course_name: PropTypes.string,

    /**
     * AI 아이콘 표시 여부
     * true이면 코스명 앞에 AI 아이콘이 표시됩니다.
     */
    show_ai: PropTypes.bool,

    /**
     * 오각형 아이콘 표시 여부
     * true이면 코스명 뒤에 오각형 아이콘이 표시됩니다.
     */
    show_pentagon: PropTypes.bool,

    /**
     * 지연 텍스트 (타이틀 아래에 표시)
     * 값이 있으면 타이틀 영역이 상단 0px로 이동하고, 31px 위치에 지연 텍스트가 표시됩니다.
     * 빈 문자열이면 타이틀이 기본 위치(14px)에 위치하고, 지연 텍스트는 숨겨집니다.
     * @example "예약 지연 중", "Added Time"
     */
    delay_text: PropTypes.string,

    /**
     * 코스 상태 텍스트 (하단 44px 위치)
     * 변경 시 200ms 페이드 전환이 적용됩니다.
     * blink_status가 true이면 500ms 간격으로 깜빡입니다.
     * @example "세탁 중", "헹굼", "탈수", "일시 정지"
     */
    course_status: PropTypes.string,

    /**
     * 코스 진행률 (0~100)
     * 프로그레스 바의 translateX 값으로 변환됩니다 (progress × 3 + 10).
     * @example 0, 50, 100
     */
    course_progress: PropTypes.number,

    /**
     * 설명 텍스트 (하단 8px 위치)
     * 빈 문자열이면 숨겨집니다.
     * @example "세제를 투입하세요", "문을 확인하세요"
     */
    description_text: PropTypes.string,

    /**
     * 페이지 인디케이터 총 도트 수
     * show_indicator가 true일 때만 표시됩니다.
     * @example 3, 5
     */
    indicator_count: PropTypes.number,

    /**
     * 페이지 인디케이터 현재 활성 인덱스 (0부터 시작)
     * 해당 인덱스의 도트가 활성 이미지(ic_page_indicator_s.png)로 표시됩니다.
     */
    indicator_current_idx: PropTypes.number,

    /**
     * 페이지 인디케이터 표시 여부
     * true이면 상단에 도트 형태의 인디케이터가 표시됩니다.
     */
    show_indicator: PropTypes.bool,

    /**
     * 상태 텍스트 깜빡임 활성 여부
     * true이면 course_status 텍스트가 500ms 간격으로 흰색(#FFFFFF) ↔ 암회색(#333333) 전환됩니다.
     */
    blink_status: PropTypes.bool,

    /**
     * 잔여 시간 - 시 (time_type이 'remain'일 때 사용)
     * WD_PROGRESS_RemainTime의 remain_hour prop으로 전달됩니다.
     * @example 0, 1, 2
     */
    remain_hour: PropTypes.number,

    /**
     * 잔여 시간 - 분 (time_type이 'remain'일 때 사용)
     * WD_PROGRESS_RemainTime의 remain_min prop으로 전달됩니다.
     * @example 0, 30, 59
     */
    remain_min: PropTypes.number,

    /**
     * 예약 날짜 텍스트 (time_type이 'reservation'일 때 사용)
     * WD_CLOCK_ReservationTime의 reservationDate prop으로 전달됩니다.
     * @example "Today", "오늘"
     */
    reservation_date: PropTypes.string,

    /**
     * 예약 시간 오전/오후 표시
     * @example "AM", "PM"
     */
    reservation_ampm: PropTypes.oneOf(['AM', 'PM']),

    /**
     * 예약 시간 - 시 (0~23)
     * WD_CLOCK_ReservationTime의 reservationHour prop으로 전달됩니다.
     * @example 0, 12, 23
     */
    reservation_hour: PropTypes.number,

    /**
     * 예약 시간 - 분 (0~59)
     * WD_CLOCK_ReservationTime의 reservationMin prop으로 전달됩니다.
     * @example 0, 30, 59
     */
    reservation_min: PropTypes.number,

    /**
     * 시간 표시 타입
     * - 'remain': 잔여 시간 표시 (WD_PROGRESS_RemainTime)
     * - 'reservation': 예약 시간 표시 (WD_CLOCK_ReservationTime)
     */
    time_type: PropTypes.oneOf(['remain', 'reservation']),

    /**
     * 컨텐츠 영역 표시 여부
     * false이면 타이틀, 시간, 상태, 설명 영역이 200ms 페이드 아웃됩니다.
     * 프로그레스 바와 인디케이터는 항상 표시됩니다.
     */
    contents_visible: PropTypes.bool,

    /**
     * 색상 테마
     * - 'blue': 세탁기용 — 파란색 프로그레스 바 (washer/progress_bar.png)
     * - 'orange': 건조기용 — 주황색 프로그레스 바 (dryer/progress_bar.png)
     */
    theme: PropTypes.oneOf(['blue', 'orange']),

    /** 외부 컨테이너에 적용할 추가 인라인 스타일 */
    style: PropTypes.object
};

export default WD_COURSE_ProgressBase;

