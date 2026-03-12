import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Smart from './CM_LABEL_Smart';

/**
 * CM_PROGRESS_Bar Widget
 * 
 * Logic & Behavior (from Analysis MD):
 * - Progress Bar: Visually represented by shifting foreground image horizontally.
 *   - Formula: x = -320 + (3.2 * percent)
 * - Typography: Numbers (Lock3_87) and units (SemiBold_25) are separate.
 * - Alignment: Bottom labels use OUT_BOTTOM_MID alignment with 13px offsets.
 */
const CM_PROGRESS_Bar = ({
    id = "CM_PROGRESS_Bar",
    percent = 0,
    label_CM_PB_Title = "Title",
    label = "1",
    label_2 = "30",
    label_CM_PB_Desc = "Description",
    label_CM_PB_Desc_1 = "Description Text",
    isFocused = true,
    onKey = () => { }
}) => {
    // Formula: x = -320 + (3.2 * percent)
    // We use transition-transform for smooth updates if percent changes.
    const progressX = -320 + (3.2 * (percent || 0));

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isFocused) return;

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
                onKey?.(action, { percent, label, label_2 });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, onKey, percent, label, label_2]);

    return (
        <div id={id} className="relative w-[320px] h-[240px] bg-black overflow-hidden select-none text-white">
            {/* 1. Main Title - Top Center */}
            <div id={`${id}-title-wrapper`} className="absolute top-0 left-0 w-full h-auto">
                <CM_LABEL_Smart
                    id={`${id}-title`}
                    key={label_CM_PB_Title}
                    text={label_CM_PB_Title}
                    align="center"
                    maxArea={{ width: 320, height: 40 }}
                    style={{
                        fontFamily: 'LG_Smart_UI_HA2023_SemiBold',
                        fontSize: '25px',
                        color: '#FFFFFF',
                        lineHeight: '1'
                    }}
                />
            </div>

            {/* 2. Middle Section (Time Display) - Large Numbers */}
            {/* Visual Balance: Moved up to 52px to ensure cleaner gap with progress bar at 149px */}
            <div id={`${id}-time-container`} className="absolute top-[52px] left-0 w-full flex justify-center items-end h-[87px]">
                {/* Hours Group */}
                <div id={`${id}-hours-group`} className="flex items-baseline">
                    <CM_LABEL_Smart
                        id={`${id}-h-value`}
                        key={label}
                        text={label}
                        align="center"
                        maxArea={{ width: 100, height: 90 }}
                        style={{
                            fontFamily: 'LG_Lock3_HA2023_Regular',
                            fontSize: '87px',
                            color: '#FFFFFF',
                            lineHeight: '1'
                        }}
                    />
                    <CM_LABEL_Smart
                        id={`${id}-h-unit`}
                        key="hr"
                        text="hr"
                        align="center"
                        maxArea={{ width: 60, height: 40 }}
                        style={{
                            fontFamily: 'LG_Smart_UI_HA2023_SemiBold',
                            fontSize: '25px',
                            color: '#FFFFFF',
                            lineHeight: '1'
                        }}
                    />
                </div>

                {/* Minutes Group */}
                <div id={`${id}-minutes-group`} className="flex items-baseline">
                    <CM_LABEL_Smart
                        id={`${id}-m-value`}
                        key={label_2}
                        text={label_2}
                        align="center"
                        maxArea={{ width: 100, height: 90 }}
                        style={{
                            fontFamily: 'LG_Lock3_HA2023_Regular',
                            fontSize: '87px',
                            color: '#FFFFFF',
                            lineHeight: '1'
                        }}
                    />
                    <CM_LABEL_Smart
                        id={`${id}-m-unit`}
                        key="min"
                        text="min"
                        align="center"
                        maxArea={{ width: 60, height: 40 }}
                        style={{
                            fontFamily: 'LG_Smart_UI_HA2023_SemiBold',
                            fontSize: '25px',
                            color: '#FFFFFF',
                            lineHeight: '1'
                        }}
                    />
                </div>
            </div>

            {/* 3. Progress Bar Section (Images) & Status Labels */}
            {/* Math: Image(149) + H(5) + Gap(13) + Desc1(30) + Gap(13) + Desc2(30) = 240 (Perfect Full Height) */}
            <div id={`${id}-bottom-container`} className="absolute top-[149px] left-0 w-full flex flex-col items-center">

                {/* Progress Bar Group (image & image_1 from JSON) */}
                <div id="progress-bar-group" className="relative w-[310px] h-[5px] overflow-hidden">
                    {/* Background Image (id: image) */}
                    <img
                        id="image"
                        src="/ui/images/progress_bar_bg.png"
                        alt="Background"
                        className="absolute top-0 left-0 w-full h-full"
                    />
                    {/* Foreground Image (id: image_1) - Shifts per Percentage() logic */}
                    <div
                        id="image_1-mask"
                        className="absolute inset-0 overflow-hidden"
                    >
                        <img
                            id="image_1"
                            src="/ui/images/progress_bar.png"
                            alt="Progress"
                            className="absolute top-0 h-full transition-transform duration-300 ease-out"
                            style={{
                                left: 0,
                                transform: `translateX(${progressX}px)`
                            }}
                        />
                    </div>
                </div>

                {/* Description Labels - Aligned 'OUT_BOTTOM_MID' to image with 13px gap */}
                <div id={`${id}-labels-stack`} className="flex flex-col items-center mt-[13px] gap-y-[13px]">
                    <div id={`${id}-desc-1-wrapper`} className="h-[30px] flex items-center">
                        <CM_LABEL_Smart
                            id={`${id}-desc-label-1`}
                            key={label_CM_PB_Desc}
                            text={label_CM_PB_Desc}
                            align="center"
                            maxArea={{ width: 320, height: 30 }}
                            style={{
                                fontFamily: 'LG_Smart_UI_HA2023_SemiBold',
                                fontSize: '30px',
                                color: '#FFFFFF',
                                lineHeight: '1.1'
                            }}
                        />
                    </div>
                    <div id={`${id}-desc-2-wrapper`} className="h-[30px] flex items-center">
                        <CM_LABEL_Smart
                            id={`${id}-desc-label-2`}
                            key={label_CM_PB_Desc_1}
                            text={label_CM_PB_Desc_1}
                            align="center"
                            maxArea={{ width: 320, height: 30 }}
                            style={{
                                fontFamily: 'LG_Smart_UI_HA2023_SemiBold',
                                fontSize: '25px',
                                color: '#FFFFFF',
                                lineHeight: '1.1'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

CM_PROGRESS_Bar.propTypes = {
    /** 컴포넌트 ID */
    id: PropTypes.string,

    /** 
     * 진행률 (0~100)
     * - 프로그레스 바 전경 이미지의 x 위치 계산: x = -320 + (3.2 * percent)
     */
    percent: PropTypes.number,

    /** 상단 타이틀 텍스트 (25px) */
    label_CM_PB_Title: PropTypes.string,

    /** 
     * 시간 값 - 시(hours)
     * - 87px 크기의 Lock3 폰트로 표시
     * - 단위 "hr"과 baseline 정렬
     */
    label: PropTypes.string,

    /** 
     * 시간 값 - 분(minutes)
     * - 87px 크기의 Lock3 폰트로 표시
     * - 단위 "min"과 baseline 정렬
     */
    label_2: PropTypes.string,

    /** 
     * 프로그레스 바 아래 첫 번째 설명 (30px)
     * - 프로그레스 바 하단 13px 간격
     */
    label_CM_PB_Desc: PropTypes.string,

    /** 
     * 두 번째 설명 텍스트 (25px)
     * - 첫 번째 설명 아래 13px 간격
     */
    label_CM_PB_Desc_1: PropTypes.string,

    /** 키보드 입력 활성화 여부 */
    isFocused: PropTypes.bool,

    /** 키보드 입력 처리 콜백 (모든 방향키 + OK/BACK 지원) */
    onKey: PropTypes.func
};

export default CM_PROGRESS_Bar;

