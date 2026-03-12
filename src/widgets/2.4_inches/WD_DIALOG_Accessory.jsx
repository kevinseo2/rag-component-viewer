import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Smart from './CM_LABEL_Smart';

/**
 * WD_DIALOG_Accessory
 * Accessory usage guide widget.
 */
const WD_DIALOG_Accessory = ({
    id = "WD_DIALOG_Accessory",
    accessoryIndex = 1,
    rackIndex = 1,
    isFocused = true,
    onKey,
    style = {}
}) => {
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

    const ACCESSORY_IMAGES = [
        "/ui/images/accessory/img_noti_accessory_01.png",
        "/ui/images/accessory/img_noti_accessory_02.png",
        "/ui/images/accessory/img_noti_accessory_03.png",
        "/ui/images/accessory/img_noti_accessory_04.png",
        "/ui/images/accessory/img_noti_accessory_05.png"
    ];

    const RACK_IMAGES = [
        "/ui/images/accessory/img_noti_accessory_rack_01.png", // 0: 바닥
        "/ui/images/accessory/img_noti_accessory_rack_02.png", // 1
        "/ui/images/accessory/img_noti_accessory_rack_03.png", // 2
        "/ui/images/accessory/img_noti_accessory_rack_04.png", // 3
        "/ui/images/accessory/img_noti_accessory_rack_05.png", // 4
        "/ui/images/accessory/img_noti_accessory_rack_06.png"  // 5: 1/4 단
    ];

    const getRackLabel = (index) => {
        if (index === 0) return "바닥";
        if (index === 5) return "1/4 단";
        return `${index}단`;
    };

    return (
        <div
            id={id}
            className="w-[320px] h-[240px] bg-black relative"
            style={style}
        >
            {/* Background Overlay */}
            <img src="/ui/images/Background/bg_overlay_guide.png" className="absolute inset-0" alt="bg" />

            {/* Title */}
            <div id={`${id}-title-container`} className="absolute top-0 left-[5px] w-[310px] h-[34px] flex items-center justify-center">
                <CM_LABEL_Smart
                    id={`${id}-title`}
                    key="title"
                    text="부속품 사용 안내"
                    maxArea={{ width: 310, height: 34 }}
                    style={{ fontSize: 30, fontFamily: "LGSBD", color: "#ffffff" }}
                    align="center"
                />
            </div>

            {/* Main Content Area */}
            <div id={`${id}-main-container`} className="absolute top-[54px] left-[15px] w-[286px] h-[113px]">
                {/* Accessory Image */}
                <img
                    id={`${id}-accessory-img`}
                    src={ACCESSORY_IMAGES[accessoryIndex - 1] || ACCESSORY_IMAGES[0]}
                    className="absolute left-0 top-0 w-auto h-auto"
                    alt="accessory"
                />

                {/* Arrow */}
                <img
                    id={`${id}-arrow-img`}
                    src="/ui/images/accessory/ic_noti_accessory_arrow.png"
                    className="absolute left-[134px] top-[43px] w-auto h-auto"
                    alt="arrow"
                />

                {/* Rack Info */}
                <div id={`${id}-rack-container`} className="absolute left-[169px] top-0 w-[117px] h-full flex flex-col items-center">
                    <img
                        id={`${id}-rack-img`}
                        src={RACK_IMAGES[rackIndex] || RACK_IMAGES[1]}
                        className="w-auto h-auto"
                        alt="rack"
                    />
                    <div id={`${id}-rack-position-container`} className="absolute top-[84px] w-[117px] h-[29px] flex items-center justify-center">
                        <CM_LABEL_Smart
                            id={`${id}-rack-label`}
                            key={`rack-${rackIndex}`}
                            text={getRackLabel(rackIndex)}
                            maxArea={{ width: 117, height: 29 }}
                            style={{ fontSize: 25, fontFamily: "LGSBD", color: "#ffffff" }}
                            align="center"
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Message */}
            <div id={`${id}-msg-container`} className="absolute top-[187px] left-[5px] w-[310px] h-[29px] flex items-center justify-center">
                <CM_LABEL_Smart
                    id={`${id}-msg`}
                    key="msg"
                    text="계속하려면 다이얼을 눌러주세요"
                    maxArea={{ width: 310, height: 29 }}
                    style={{ fontSize: 25, fontFamily: "LGSBD", color: "#ffffff" }}
                    align="center"
                />
            </div>
        </div>
    );
};

WD_DIALOG_Accessory.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 부속품 이미지 인덱스 (1: 법랑접시, 2: 석쇠, 3: 구이반판, 4: 에어프라이 소쿠리, 5: 베이킹 트레이 등) */
    accessoryIndex: PropTypes.oneOf([1, 2, 3, 4, 5]),
    /** 선반 단 위치 인덱스 (0: 바닥, 1~4: 1~4단, 5: 1/4단) */
    rackIndex: PropTypes.oneOf([0, 1, 2, 3, 4, 5]),
    /** 현재 포커스 상태 여부 (키 이벤트 수신 제어) */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 */
    onKey: PropTypes.func,
    /** 커스텀 스타일 객체 */
    style: PropTypes.object
};

export default WD_DIALOG_Accessory;

