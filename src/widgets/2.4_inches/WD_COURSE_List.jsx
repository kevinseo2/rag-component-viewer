import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import WD_COURSE_Item from './WD_COURSE_Item';

/**
 * WD_COURSE_List - 코스 리스트 수평 페이저 위젯
 *
 * C 코드(lv_WD_COURSE_List.c) 기반의 수평 스와이프 페이저입니다.
 * 각 페이지에 WD_COURSE_Item을 렌더링하며, 스냅 스크롤과 페이지 인디케이터를 지원합니다.
 *
 * 데이터 입력 방식 (2가지):
 * 1. courses — 가공된 데이터 배열 (우선 적용)
 * 2. courseListData — 원본 JSON 데이터 배열 (courses가 비어있을 때 내부에서 정규화)
 *
 * 키보드 조작:
 * - 좌/우 화살표: 페이지 전환 (순환)
 * - 상/하 화살표: onKey('UP'/'DOWN') 호출
 * - Enter: onKey('OK', { pageIndex, course }) 호출
 * - Escape: onKey('BACK') 호출
 *
 * - 컨테이너: 320 x 240px, 배경 검정
 * - 페이지 인디케이터: 상단 3px, 6x6px 원형 도트 (활성: 흰색, 비활성: 30% 흰색)
 * - 절전 아이콘: default 타입 코스에서 energySaverEnabled가 true일 때 표시
 */
const WD_COURSE_List = ({
    id = "WD_COURSE_List",
    courses = [], // Pre-processed data
    courseListData = [], // Raw JSON data
    selectedPageIndex = 0,
    energySaverEnabled = false,
    indicatorInfo = { count: 0, currentIdx: 0, show: true },
    strTitleCloudCycle = "Cloud Course",
    strTitleAdditionalCycles = "More Cycles",
    strFastdlDetecting = "Detecting...",
    className = "",
    isFocused = true,
    onKey
} = {}) => {
    // Data Normalization: Prefer courses, fall back to processing courseListData
    const itemsToRender = courses.length > 0 ? courses : courseListData.map((course, idx) => ({
        id: `course_item_${idx}`,
        courseName: course.courseName || '',
        courseDescription: course.courseDescription || '',
        courseType: course.courseType === 'COURSE_TYPE_DEFAULT' ? 'default' :
            course.courseType === 'COURSE_TYPE_DEFAULT_AI' ? 'ai' :
                course.courseType === 'COURSE_TYPE_CLOUD' ? 'cloud' :
                    course.courseType === 'COURSE_TYPE_ADDITIONAL' ? 'additional' : 'default',
        options: (course.options || []).map(opt => ({
            title: opt.name || opt.title || '',
            value: opt.value || '',
            unit: opt.unit || ''
        })),
        fastdlStatus: course.fastdlStatus === 'COURSE_FASTDL_STATUS_PROCESSING' ? 'processing' :
            course.fastdlStatus === 'COURSE_FASTDL_STATUS_SHOW_REMAIN' ? 'remain' :
                course.fastdlStatus === 'COURSE_FASTDL_STATUS_SHOW_RESERVATION' ? 'reservation' : 'none',
        // FastDL data:
        // - processing: use strFastdlDetecting (e.g., "Detecting...")
        // - remain: hour/min for remaining time display (e.g., "1hr 30min")
        // - reservation: hour/min for reservation time display (e.g., "Start at Today 11:59 AM")
        fastdlDetectingText: strFastdlDetecting || 'Detecting...',
        fastdlHour: course.fastdlHour ?? 0,
        fastdlMin: course.fastdlMin ?? 0,
        showImgTM: course.showTmOrPentagon === 'tm',
        showImgPentagon: course.showTmOrPentagon === 'pentagon'
    }));

    const [activeIdx, setActiveIdx] = useState(selectedPageIndex);
    const scrollRef = useRef(null);

    // Sync with prop
    useEffect(() => {
        setActiveIdx(selectedPageIndex);
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ left: selectedPageIndex * 320, behavior: 'smooth' });
        }
    }, [selectedPageIndex]);

    // Keyboard Handler
    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            if (itemsToRender.length === 0) return;

            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const newIdx = activeIdx > 0 ? activeIdx - 1 : itemsToRender.length - 1;
                setActiveIdx(newIdx);
                if (scrollRef.current) {
                    scrollRef.current.scrollTo({ left: newIdx * 320, behavior: 'smooth' });
                }
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                const newIdx = (activeIdx + 1) % itemsToRender.length;
                setActiveIdx(newIdx);
                if (scrollRef.current) {
                    scrollRef.current.scrollTo({ left: newIdx * 320, behavior: 'smooth' });
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                onKey?.('UP');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                onKey?.('DOWN');
            } else if (e.key === 'Enter') {
                e.preventDefault();
                onKey?.('OK', { pageIndex: activeIdx, course: itemsToRender[activeIdx] });
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onKey?.('BACK');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, itemsToRender, activeIdx, onKey]);

    const handleScroll = (e) => {
        const scrollLeft = e.target.scrollLeft;
        const index = Math.round(scrollLeft / 320);
        if (index !== activeIdx && index >= 0 && index < itemsToRender.length) {
            setActiveIdx(index);
        }
    };

    // Determine indicator visibility
    const showIndicator = indicatorInfo?.show !== false && itemsToRender.length > 1;

    // Get title based on course type
    const getTitle = (courseType) => {
        if (courseType === 'cloud') return strTitleCloudCycle;
        if (courseType === 'additional') return strTitleAdditionalCycles;
        return null;
    };

    return (
        <div
            id={id}
            className={`relative w-[320px] h-[240px] bg-black overflow-hidden ${className}`}
        >
            {/* Page Indicator */}
            {showIndicator && (
                <div id={`${id}-page-indicator`} className="absolute top-[3px] left-0 w-full flex justify-center gap-1 z-10">
                    {itemsToRender.map((_, i) => (
                        <div
                            key={i}
                            id={`${id}-page-indicator-${i}`}
                            className={`w-[6px] h-[6px] rounded-full transition-colors duration-300 ${i === activeIdx ? 'bg-white' : 'bg-white/30'}`}
                        />
                    ))}
                </div>
            )}

            {/* Energy Saver Icon */}
            {energySaverEnabled && itemsToRender[activeIdx]?.courseType === 'default' && (
                <img
                    id={`${id}-energy-saver-icon`}
                    src="/ui/images/dryer/ic_eco.png"
                    alt="eco"
                    className="absolute top-[17px] left-1/2 -translate-x-1/2 z-10"
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
            )}

            {/* Horizontal Pager */}
            <div
                id={`${id}-pager`}
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
                style={{ scrollBehavior: 'smooth' }}
            >
                {itemsToRender.map((course, i) => (
                    <div key={i} id={`${id}-page-${i}`} className="min-w-[320px] h-full snap-start">
                        <WD_COURSE_Item
                            {...course}
                            id={`${id}_item_${i}`}
                            categoryTitle={getTitle(course.courseType)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

WD_COURSE_List.propTypes = {
    /**
     * 컴포넌트의 고유 식별자 (HTML id 속성)
     * 내부적으로 `${id}-pager`, `${id}-page-indicator`, `${id}_item_${i}` 등에 사용됩니다.
     */
    id: PropTypes.string,

    /**
     * 가공된 코스 데이터 배열 (우선 적용)
     * 이 배열이 비어있으면 courseListData를 내부에서 정규화하여 사용합니다.
     * 각 항목은 WD_COURSE_Item에 직접 spread 됩니다.
     */
    courses: PropTypes.arrayOf(PropTypes.shape({
        /** 코스 아이템 고유 ID */
        id: PropTypes.string,
        /** 코스 이름 */
        courseName: PropTypes.string,
        /** 코스 타입 */
        courseType: PropTypes.oneOf(['default', 'ai', 'cloud', 'additional']),
        /** 코스 옵션 배열 (최대 4개) */
        options: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            value: PropTypes.string,
            unit: PropTypes.string
        })),
        /** FastDL 상태 */
        fastdlStatus: PropTypes.oneOf(['none', 'processing', 'remain', 'reservation']),
        /** FastDL 감지 중 텍스트 */
        fastdlDetectingText: PropTypes.string,
        /** FastDL 시간 - 시 */
        fastdlHour: PropTypes.number,
        /** FastDL 시간 - 분 */
        fastdlMin: PropTypes.number,
        /** TM 이미지 표시 여부 */
        showImgTM: PropTypes.bool,
        /** 오각형 아이콘 표시 여부 */
        showImgPentagon: PropTypes.bool
    })),

    /**
     * 원본 JSON 코스 리스트 데이터 배열
     * courses가 비어있을 때 내부에서 courseType/fastdlStatus 등을 정규화합니다.
     * C 코드의 enum 문자열(COURSE_TYPE_DEFAULT 등)을 소문자 키워드로 변환합니다.
     */
    courseListData: PropTypes.arrayOf(PropTypes.shape({
        /** 코스 이름 */
        courseName: PropTypes.string,
        /** C 코드 enum 문자열 @example "COURSE_TYPE_DEFAULT", "COURSE_TYPE_DEFAULT_AI" */
        courseType: PropTypes.string,
        /** 옵션 개수 */
        optionCount: PropTypes.number,
        /** 옵션 배열 (원본 형식) */
        options: PropTypes.array,
        /** C 코드 FastDL enum 문자열 @example "COURSE_FASTDL_STATUS_PROCESSING" */
        fastdlStatus: PropTypes.string,
        /** FastDL 시간 - 시 */
        fastdlHour: PropTypes.number,
        /** FastDL 시간 - 분 */
        fastdlMin: PropTypes.number,
        /**
         * TM/오각형 아이콘 표시 옵션
         * - 'tm': TM 이미지 표시
         * - 'pentagon': 오각형 아이콘 표시
         * - 'none': 아무것도 표시하지 않음
         */
        showTmOrPentagon: PropTypes.oneOf(['tm', 'pentagon', 'none'])
    })),

    /**
     * 초기 활성화 페이지 인덱스
     * 이 값이 변경되면 해당 페이지로 스크롤됩니다 (smooth).
     * @example 0, 1, 2
     */
    selectedPageIndex: PropTypes.number,

    /**
     * 절전 모드 아이콘(eco) 표시 여부
     * true이고 현재 활성 코스가 'default' 타입일 때 상단에 아이콘을 표시합니다.
     */
    energySaverEnabled: PropTypes.bool,

    /**
     * 페이지 인디케이터 설정
     * show가 false이거나 코스가 1개 이하이면 인디케이터를 숨깁니다.
     */
    indicatorInfo: PropTypes.shape({
        /** 총 페이지 수 */
        count: PropTypes.number,
        /** 현재 활성 인덱스 */
        currentIdx: PropTypes.number,
        /** 인디케이터 표시 여부 */
        show: PropTypes.bool
    }),

    /**
     * 클라우드 코스 카테고리 타이틀 텍스트
     * courseType이 'cloud'인 항목의 categoryTitle로 주입됩니다.
     * @example "Cloud Course"
     */
    strTitleCloudCycle: PropTypes.string,

    /**
     * 추가 코스 카테고리 타이틀 텍스트
     * courseType이 'additional'인 항목의 categoryTitle로 주입됩니다.
     * @example "More Cycles"
     */
    strTitleAdditionalCycles: PropTypes.string,

    /**
     * FastDL 감지 중 텍스트 (courseListData 정규화 시 사용)
     * @example "Detecting...", "감지 중..."
     */
    strFastdlDetecting: PropTypes.string,

    /** 외부 컨테이너에 추가할 CSS 클래스명 */
    className: PropTypes.string,

    /**
     * 현재 포커스 상태 여부
     * true일 때만 키보드 이벤트(화살표, Enter, Escape)를 수신합니다.
     */
    isFocused: PropTypes.bool,

    /**
     * 키 이벤트 콜백 함수
     * @param {string} action - 'OK' | 'BACK' | 'UP' | 'DOWN'
     * @param {object} [payload] - OK 시 { pageIndex, course } 객체가 전달됩니다.
     */
    onKey: PropTypes.func
};

export default WD_COURSE_List;

