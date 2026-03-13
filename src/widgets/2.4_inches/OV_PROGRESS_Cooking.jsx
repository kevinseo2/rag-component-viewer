import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import OV_TITLE_2Line from './OV_TITLE_2Line';
import WD_PROGRESS_Bar from './WD_PROGRESS_Bar';
import WD_CLOCK_Picker from './WD_CLOCK_Picker';
import WD_DECORATION_Divider from './WD_DECORATION_Divider';
import CM_LABEL_Smart from './CM_LABEL_Smart';

/**
 * CookOptionImage mapping table from C code (setup_ui.c)
 * Index: [rack/accessory value][0=Accessory1, 1=Accessory2, 2=Accessory3]
 */
const CookOptionImage = [
    ["/ui/images/accessory/ic_accessory_rack_01.png", "/ui/images/accessory/ic_accessory_ceramicgrill.png", "/ui/images/accessory/ic_accessory_gridiron.png"],
    ["/ui/images/accessory/ic_accessory_rack_02.png", "/ui/images/accessory/ic_accessory_ceramicgrill.png", "/ui/images/accessory/ic_accessory_gridiron.png"],
    ["/ui/images/accessory/ic_accessory_rack_03.png", "/ui/images/accessory/ic_accessory_enamel.png", "/ui/images/accessory/ic_accessory_gridiron.png"],
    ["/ui/images/accessory/ic_accessory_rack_04.png", "/ui/images/accessory/ic_accessory_gridiron.png", "/ui/images/accessory/ic_accessory_gridiron.png"],
    ["/ui/images/accessory/ic_accessory_rack_05.png", "/ui/images/accessory/ic_accessory_enamel.png", "/ui/images/accessory/ic_accessory_gridiron.png"],
    ["/ui/images/accessory/ic_accessory_rack_06.png", "/ui/images/accessory/ic_accessory_enamel.png", "/ui/images/accessory/ic_accessory_ceramicgrill.png"],
    ["/ui/images/accessory/ic_accessory_rack_06.png", "/ui/images/accessory/ic_accessory_ceramicgrill.png", "/ui/images/accessory/ic_accessory_gridiron.png"],
];

/**
 * OV_PROGRESS_Cooking
 * Main progress display for cooking.
 */
const OV_PROGRESS_Cooking = ({
    id = "OV_PROGRESS_Cooking",
    title = "에어프라이",
    hour = 0,
    min = 0,
    sec = 0,
    percent = 0,
    temp = 0,
    weight = 0,
    unit = 0,
    rack = 0,
    accessory = 0,
    steam = 0,
    statusText = "조리 중",
    guideText = "",
    isFocused = true,
    onKey,
    style = {}
}) => {
    const showHour = hour > 0;
    const showMin = min > 0 || hour > 0;

    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                onKey?.('OK');
            } else if (e.key === 'Escape') {
                onKey?.('BACK');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, onKey]);

    const displayInfo = (() => {
        if (temp > 0) return { value: temp.toString(), unit: '℃' };
        if (weight > 0) {
            if (unit === 1) return { value: (weight / 100).toFixed(1), unit: 'kg' };
            return { value: weight.toString(), unit: 'g' };
        }
        return null;
    })();

    const hasAccessory = accessory > 0;
    const hasSteam = steam > 0;
    const hasDisplayInfo = displayInfo !== null;

    return (
        <div
            id={id}
            className="w-[320px] h-[240px] bg-black relative"
            style={style}
        >
            {/* Title - rendered FIRST (bottom layer in z-order, like LVGL) */}
            <OV_TITLE_2Line id={`${id}-title`} title={title} />

            {/* Time Display Container - rendered AFTER title (on top of title) */}
            <div
                id={`${id}-time-container`}
                className="absolute left-0 top-[36px] w-full h-[81px] flex flex-row items-center justify-center p-0 z-10"
            >
                {showHour && (
                    <>
                        <WD_CLOCK_Picker id={`${id}-h10`} scrollIndex={Math.floor(hour / 10)} />
                        <WD_CLOCK_Picker id={`${id}-h01`} scrollIndex={hour % 10} />
                        <div id={`${id}-colon1`} className="text-[81px] text-white font-['LOCK3R'] leading-none">:</div>
                    </>
                )}
                {showMin && (
                    <>
                        <WD_CLOCK_Picker id={`${id}-m10`} scrollIndex={Math.floor(min / 10)} />
                        <WD_CLOCK_Picker id={`${id}-m01`} scrollIndex={min % 10} />
                        <div id={`${id}-colon2`} className="text-[81px] text-white font-['LOCK3R'] leading-none">:</div>
                    </>
                )}
                <WD_CLOCK_Picker id={`${id}-s10`} scrollIndex={Math.floor(sec / 10)} />
                <WD_CLOCK_Picker id={`${id}-s01`} scrollIndex={sec % 10} />
            </div>

            {/* Mask Overlay - z-0 background layer */}
            <img
                src="/ui/images/Background/mask_opreate.png"
                className="absolute top-0 left-0 pointer-events-none z-0"
                alt="mask"
                onError={(e) => e.target.style.display = 'none'}
            />

            {/* Progress Bar - z-10 above mask */}
            <div id={`${id}-progress-wrapper`} className="absolute top-[149px] left-0 w-full z-10">
                <WD_PROGRESS_Bar id={`${id}-progress`} percent={percent} />
            </div>

            {/* Status Text */}
            {statusText && (
                <div id={`${id}-status-wrapper`} className="absolute top-[164px] left-[10px] w-[310px] h-[39px] flex items-center justify-center z-10">
                    <CM_LABEL_Smart
                        id={`${id}-status-label`}
                        key={`status-${statusText}`}
                        text={statusText}
                        maxArea={{ width: 310, height: 39 }}
                        style={{ fontSize: 28, fontFamily: "LGSBD", color: "#ffffff" }}
                        align="center"
                    />
                </div>
            )}

            {/* Notification Icons bar - between time (bottom:117px) and progress bar (149px) */}
            <div
                id={`${id}-noti-bar`}
                className="absolute left-1/2 top-[118px] flex flex-row items-center gap-[5px] z-10"
                style={{ transform: 'translateX(-50%)' }}
            >
                {hasDisplayInfo && (
                    <div id={`${id}-temp-info`} className="flex flex-row items-center justify-center p-0">
                        <span className="text-[25px] text-white font-['LGREG'] leading-none">{displayInfo.value}</span>
                        <span className="text-[25px] text-white font-['LGREG'] leading-none ml-0.5">{displayInfo.unit}</span>
                    </div>
                )}

                {hasDisplayInfo && hasSteam && <WD_DECORATION_Divider id={`${id}-div1`} />}

                {hasSteam && (
                    <img
                        id={`${id}-steam-icon`}
                        src="/ui/images/accessory/ic_steam.png"
                        className="w-auto h-auto"
                        alt="steam"
                        onError={(e) => e.target.style.display = 'none'}
                    />
                )}

                {hasSteam && hasAccessory && <WD_DECORATION_Divider id={`${id}-div2`} />}

                {hasAccessory && (
                    <div id={`${id}-accessory-icons`} className="flex flex-row items-center gap-[2px]">
                        {/* image_acc1: CookOptionImage[rack][0] */}
                        {rack >= 0 && rack < CookOptionImage.length && CookOptionImage[rack][0] && (
                            <img
                                id={`${id}-acc1`}
                                src={CookOptionImage[rack][0]}
                                className="w-auto h-auto"
                                alt="rack"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        )}
                        {/* image_acc2: CookOptionImage[accessory][1] */}
                        {accessory >= 0 && accessory < CookOptionImage.length && CookOptionImage[accessory][1] && (
                            <img
                                id={`${id}-acc2`}
                                src={CookOptionImage[accessory][1]}
                                className="w-auto h-auto"
                                alt="acc2"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        )}
                        {/* image_acc3: CookOptionImage[accessory][2] */}
                        {accessory >= 0 && accessory < CookOptionImage.length && CookOptionImage[accessory][2] && (
                            <img
                                id={`${id}-acc3`}
                                src={CookOptionImage[accessory][2]}
                                className="w-auto h-auto"
                                alt="acc3"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Guide Text */}
            {guideText && (
                <div id={`${id}-guide-wrapper`} className="absolute top-[203px] left-[5px] w-[310px] h-[37px] flex items-center justify-center">
                    <CM_LABEL_Smart
                        id={`${id}-guide-label`}
                        key={`guide-${guideText}`}
                        text={guideText}
                        maxArea={{ width: 310, height: 37 }}
                        style={{ fontSize: 28, fontFamily: "LGSBD", color: "#ffffff" }}
                        align="center"
                    />
                </div>
            )}
        </div>
    );
};

OV_PROGRESS_Cooking.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 조리 모드 타이틀 */
    title: PropTypes.string,
    /** 남은 시간 - 시 */
    hour: PropTypes.number,
    /** 남은 시간 - 분 */
    min: PropTypes.number,
    /** 남은 시간 - 초 */
    sec: PropTypes.number,
    /** 진행률 퍼센트 (0-100) */
    percent: PropTypes.number,
    /** 설정 온도 (0일 경우 미표시) */
    temp: PropTypes.number,
    /** 음식 무게 (0일 경우 미표시) */
    weight: PropTypes.number,
    /** 무게 단위 (1: kg, 기타: g) */
    unit: PropTypes.oneOf([0, 1]),
    /**
     * 선반 이미지 인덱스 — CookOptionImage[rack][0]으로 선반 이미지를 결정
     * - 0: rack_01 (1단)
     * - 1: rack_02 (2단)
     * - 2: rack_03 (3단)
     * - 3: rack_04 (4단)
     * - 4: rack_05 (5단)
     * - 5: rack_06 (6단 - A타입)
     * - 6: rack_06 (6단 - B타입)
     */
    rack: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
    /**
     * 부속품 이미지 인덱스 — CookOptionImage[accessory][1], [2]로 부속품 이미지를 결정
     * - 0: 부속품 미표시 (hasAccessory = false)
     * - 1: 세라믹그릴 + 석쇠
     * - 2: 에나멜 + 석쇠
     * - 3: 석쇠 + 석쇠
     * - 4: 에나멜 + 석쇠
     * - 5: 에나멜 + 세라믹그릴
     * - 6: 세라믹그릴 + 석쇠
     */
    accessory: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
    /** 스팀 사용 여부 (0: 미사용, 1: 사용) */
    steam: PropTypes.oneOf([0, 1]),
    /**
     * 상태 텍스트 — 프로그레스 바 아래에 표시되는 현재 상태 문구
     * 빈 문자열("")이면 미표시
     * @example "조리 중", "일시 정지"
     */
    statusText: PropTypes.string,
    /**
     * 가이드 텍스트 — 화면 하단에 표시되는 사용자 안내 문구
     * 빈 문자열("")이면 미표시
     * @example "다이얼을 눌러 시간을 추가하세요", "다이얼을 눌러 다시 시작하세요"
     */
    guideText: PropTypes.string,
    /** 현재 포커스 상태 여부 */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 */
    onKey: PropTypes.func,
    /** 커스텀 스타일 객체 */
    style: PropTypes.object
};

export default OV_PROGRESS_Cooking;

