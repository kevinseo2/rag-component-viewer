import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Smart from './CM_LABEL_Smart';
import CM_LABEL_Formatted from './CM_LABEL_Formatted';
import CM_ANIM_SequencePlayer from './CM_ANIM_SequencePlayer';
import WD_COURSE_ItemOption from './WD_COURSE_ItemOption';

/**
 * WD_COURSE_Item - 코스 리스트 개별 아이템 위젯
 *
 * 코스명, 배지(AI/Cloud/Additional), 회전 설명 영역을 표시합니다.
 * C 코드(lv_WD_COURSE_Item.c) init_description_order 로직을 재현합니다.
 *
 * 회전 영역 표시 우선순위:
 * 1. courseDescription이 있으면 → 설명만 표시 (회전 없음)
 * 2. fastdlStatus가 "processing"이면 → FastDL 감지 텍스트만 표시 (회전 없음)
 * 3. fastdlStatus가 "none"이면 → 옵션만 표시 (4개면 A/B 패널로 분할 회전)
 * 4. fastdlStatus가 "remain"/"reservation"이면 → FastDL 시간 + 옵션 패널 회전
 *
 * 회전 주기: 4초 (C 코드 line 91, 623)
 *
 * 레이아웃:
 * - 배지 영역: 25px 높이 (cloud/additional 타입일 때 표시)
 * - AI 아이콘: absolute top 26px (ai 타입일 때 표시)
 * - 타이틀 영역: 310 x 88px, 최대 61px 폰트
 * - 회전 설명 영역: 310 x 108px
 */
const WD_COURSE_Item = ({
    id,
    courseName = "",
    courseDescription = "",
    courseType = "default", // "default", "ai", "cloud", "additional"
    options = [],
    fastdlStatus = "none", // "none", "processing", "remain", "reservation"
    fastdlDetectingText = "Detecting...", // Text for "processing" status
    fastdlHour = 0, // Hour value for remain/reservation
    fastdlMin = 0, // Minute value for remain/reservation
    showImgTM = false,
    showImgPentagon = false,
    className = "",
}) => {
    const [rotationIdx, setRotationIdx] = useState(0);

    /**
     * Format FastDL time text based on status and hour/min values
     * C code reference: screen_course_ex.h lines 74-86
     * - remain: "{0}hr {2}min" format (e.g., "1hr 30min")
     * - reservation: "{5} {6} {0}:{2} {4}" format (e.g., "Start at Today 11:59 AM")
     */
    const formatFastdlTime = (status, hour, min) => {
        if (status === 'remain') {
            // Format: "1hr 30min" or "30min" if hour is 0
            if (hour > 0) {
                return `${hour}hr ${min}min`;
            }
            return `${min}min`;
        } else if (status === 'reservation') {
            // Format: "Start at Today 11:59 AM"
            const isPM = hour >= 12;
            const displayHour = hour % 12 || 12;
            const displayMin = min.toString().padStart(2, '0');
            const ampm = isPM ? 'PM' : 'AM';
            return `Start at Today ${displayHour}:${displayMin} ${ampm}`;
        }
        return '';
    };

    /**
     * Build rotation panels following C code logic (init_description_order)
     * Reference: lv_WD_COURSE_Item.c lines 250-295
     */
    const panels = useMemo(() => {
        const list = [];

        // Priority 1: If description exists, show ONLY description (C code line 237-242)
        if (courseDescription) {
            list.push({ type: 'description', data: courseDescription });
            return list; // Early return - no rotation with other panels
        }

        // Priority 2: If PROCESSING, show ONLY FastDL (C code line 272-277)
        if (fastdlStatus === "processing") {
            list.push({ type: 'fastdl', data: fastdlDetectingText, status: 'processing' });
            return list; // Early return - no rotation
        }

        // Priority 3: Build rotation panels based on fastdlStatus
        // C code lines 266-294

        if (fastdlStatus === "none") {
            // NO_SHOW: FastDL is completely excluded (C code line 266-271)
            // Show only options
            if (options.length > 0) {
                const optionsA = options.length === 4 ? options.slice(0, 2) : options;
                list.push({ type: 'options_A', data: optionsA });
            }
            if (options.length === 4) {
                list.push({ type: 'options_B', data: options.slice(2, 4) });
            }
        } else {
            // SHOW_REMAIN or SHOW_RESERVATION (C code line 278-294)
            // FastDL appears FIRST (lv_obj_move_foreground at line 288)
            const formattedTime = formatFastdlTime(fastdlStatus, fastdlHour, fastdlMin);
            list.push({ type: 'fastdl', data: formattedTime, status: fastdlStatus });

            // Then add options based on count
            if (options.length === 4) {
                // 4 options: FastDL → Option A → Option B (C code line 282-284)
                list.push({ type: 'options_A', data: options.slice(0, 2) });
                list.push({ type: 'options_B', data: options.slice(2, 4) });
            } else if (options.length > 0) {
                // 1-3 options: FastDL → Option A (C code line 286)
                list.push({ type: 'options_A', data: options });
            }
        }

        return list;
    }, [options, courseDescription, fastdlStatus, fastdlDetectingText, fastdlHour, fastdlMin]);

    // Reset rotation index when panels change (e.g., switching courses)
    useEffect(() => {
        setRotationIdx(0);
    }, [panels]);

    // Rotation Timer (4 seconds) - C code line 91, 623
    useEffect(() => {
        if (panels.length <= 1) return; // No rotation needed

        const interval = setInterval(() => {
            setRotationIdx((prev) => (prev + 1) % panels.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [panels]);

    const currentPanel = panels[rotationIdx] || null;

    return (
        <div
            id={id}
            className={`relative w-full h-full bg-black flex flex-col items-center ${className}`}
        >
            {/* AI Icon - Absolute positioning (C code line 430: top 26px) */}
            {courseType === "ai" && (
                <img
                    src="/ui/images/washer_dryer/ic_ai.png"
                    alt="ai"
                    className="absolute top-[26px] left-1/2 -translate-x-1/2 h-[20px] z-10"
                />
            )}

            {/* Badges (lines 407-425) - Cloud and Additional only */}
            <div id="WD_COURSE_Item-badges" className="h-[25px] flex items-center justify-center mb-1">
                {courseType === "cloud" && (
                    <span className="text-[20px] font-semibold text-[#629dff]">Cloud Course</span>
                )}
                {courseType === "additional" && (
                    <span className="bg-[#629dff] text-white px-5 rounded-full text-[22px] font-semibold">
                        More Cycles
                    </span>
                )}
            </div>

            {/* Title Area (lines 433-470) - Container: 310x88, padding 5px left/right */}
            <div id="WD_COURSE_Item-title-area" className="flex items-center justify-center h-[88px] w-[310px] px-[5px]">
                <CM_LABEL_Smart
                    key={courseName}
                    id={`${id}_title`}
                    text={courseName}
                    multiline={true}
                    maxArea={{ width: 300, height: 88 }}
                    style={{
                        fontSize: 61,
                        fontWeight: '600',
                        color: '#FFFFFF',
                        textAlign: 'center',
                    }}
                />
                {showImgTM && (
                    <img src="/ui/images/washer_dryer/img_tm.png" alt="tm" className="ml-1 self-end mb-4" />
                )}
                {showImgPentagon && (
                    <img src="/ui/images/washer_dryer/ic_title_pentagon.png" alt="pentagon" className="ml-1" />
                )}
            </div>

            {/* Rotating Description Area (lines 472-586) */}
            <div id="WD_COURSE_Item-rotating-area" className="mt-2 w-full h-[108px] flex flex-col items-center justify-center">
                {currentPanel?.type === 'options_A' && (
                    <div id="WD_COURSE_Item-options-A" className="flex flex-col gap-1">
                        {currentPanel.data.map((opt, i) => (
                            <WD_COURSE_ItemOption
                                key={i}
                                title={opt.title || opt.name || ''}
                                value={opt.value || ''}
                                unit={opt.unit || ''}
                            />
                        ))}
                    </div>
                )}

                {currentPanel?.type === 'options_B' && (
                    <div id="WD_COURSE_Item-options-B" className="flex flex-col gap-1">
                        {/* Panel B shows Options 3 and 4 when exactly 4 options exist */}
                        {currentPanel.data.map((opt, i) => (
                            <WD_COURSE_ItemOption
                                key={i}
                                title={opt.title || opt.name || ''}
                                value={opt.value || ''}
                                unit={opt.unit || ''}
                            />
                        ))}
                    </div>
                )}

                {currentPanel?.type === 'description' && (
                    <CM_LABEL_Smart
                        key={courseDescription}
                        text={courseDescription}
                        multiline={true}
                        style={{ fontSize: 28, color: '#FFFFFF', textAlign: 'center' }}
                        maxArea={{ width: 310, height: 108 }}
                    />
                )}

                {currentPanel?.type === 'fastdl' && (
                    <div id="WD_COURSE_Item-fastdl" className="flex items-center gap-2">
                        {currentPanel.status === "processing" && (
                            <CM_ANIM_SequencePlayer
                                playlist={[{ CM_ANIM_Sequence: { path: "/ui/image_sequences/Common_assets/img_loading_s_blue/.orig_images", totalFrames: 50 }, duration: 1000 }]}
                                style={{ width: 32, height: 32 }}
                            />
                        )}
                        <CM_LABEL_Formatted
                            key={currentPanel.data}
                            format={currentPanel.data}
                            maxArea={{ width: 310, height: 34 }}
                            style={{
                                // C code line 289-293: RESERVATION uses LV_STATE_USER_1 (fontSize 28)
                                // REMAIN uses default state (fontSize 30)
                                fontSize: currentPanel.status === 'reservation' ? 28 : 30,
                                color: '#FFFFFF',
                                textAlign: 'center'
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

WD_COURSE_Item.propTypes = {
    /** 컴포넌트의 고유 식별자 (HTML id 속성) */
    id: PropTypes.string,

    /**
     * 코스 이름 (주 타이틀)
     * 타이틀 영역(310x88px)에 최대 61px 폰트로 표시됩니다.
     * 텍스트가 길면 자동 축소되며, 멀티라인을 지원합니다.
     * @example "표준세탁", "찬물세탁", "울/섬세"
     */
    courseName: PropTypes.string,

    /**
     * 코스 설명 텍스트
     * 이 값이 있으면 회전 영역에 설명만 표시되고, 옵션/FastDL 패널은 무시됩니다.
     * @example "이 코스는 일반 의류에 적합합니다"
     */
    courseDescription: PropTypes.string,

    /**
     * 코스 타입 — 배지 및 아이콘 표시를 결정
     * - 'default': 배지 없음
     * - 'ai': AI 아이콘 표시 (상단)
     * - 'cloud': "Cloud Course" 파란색 텍스트 배지
     * - 'additional': "More Cycles" 파란색 배경 배지
     */
    courseType: PropTypes.oneOf(['default', 'ai', 'cloud', 'additional']),

    /**
     * 코스 옵션 배열 (최대 4개)
     * - 1~3개: 패널 A 하나로 표시
     * - 4개: 패널 A(0,1번), 패널 B(2,3번)로 분할하여 회전
     * 각 옵션은 WD_COURSE_ItemOption으로 렌더링됩니다.
     */
    options: PropTypes.arrayOf(PropTypes.shape({
        /** 옵션 제목 @example "온도", "헹굼" */
        title: PropTypes.string,
        /** 옵션 값 @example "40", "3" */
        value: PropTypes.string,
        /** 값 단위 @example "℃", "회" */
        unit: PropTypes.string
    })),

    /**
     * FastDL(세제 자동 투입) 상태
     * - 'none': FastDL 패널 미표시
     * - 'processing': 감지 중 텍스트 + 로딩 애니메이션만 표시 (회전 없음)
     * - 'remain': 남은 시간 표시 + 옵션 패널과 회전
     * - 'reservation': 예약 시간 표시 + 옵션 패널과 회전
     */
    fastdlStatus: PropTypes.oneOf(['none', 'processing', 'remain', 'reservation']),

    /**
     * fastdlStatus가 'processing'일 때 표시할 텍스트
     * @example "Detecting...", "감지 중..."
     */
    fastdlDetectingText: PropTypes.string,

    /**
     * FastDL 시간 - 시 (remain: 남은 시간, reservation: 예약 시간)
     * @example 1, 11
     */
    fastdlHour: PropTypes.number,

    /**
     * FastDL 시간 - 분 (remain: 남은 시간, reservation: 예약 시간)
     * @example 30, 59
     */
    fastdlMin: PropTypes.number,

    /** TM(상표) 이미지 표시 여부 — 타이틀 오른쪽에 표시 */
    showImgTM: PropTypes.bool,

    /** 오각형 아이콘 표시 여부 — 타이틀 오른쪽에 표시 */
    showImgPentagon: PropTypes.bool,

    /** 하단 카테고리 타이틀 (부모 WD_COURSE_List에서 코스 타입에 따라 주입) */
    categoryTitle: PropTypes.string,

    /** 외부 컨테이너에 추가할 CSS 클래스명 */
    className: PropTypes.string,
};

export default WD_COURSE_Item;

