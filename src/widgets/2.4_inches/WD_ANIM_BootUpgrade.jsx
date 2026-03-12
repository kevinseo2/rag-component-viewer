import React from 'react';
import PropTypes from 'prop-types';

/**
 * WD_ANIM_BootUpgrade
 * Seasonal upgrade promotion image widget.
 */
const WD_ANIM_BootUpgrade = ({
    id = "WD_ANIM_BootUpgrade",
    upgradeImageIndex = 0,
    isFocused = true,
    onKey,
    style = {}
}) => {
    const UPGRADE_IMAGES = [
        '/ui/images/Upgradable/img_upgradable_01_autumn_kr.png',
        '/ui/images/Upgradable/img_upgradable_02_chistmas_kr.png',
        '/ui/images/Upgradable/img_upgradable_03_halloween_kr.png',
        '/ui/images/Upgradable/img_upgradable_04_happynewyear_kr.png',
        '/ui/images/Upgradable/img_upgradable_05_spring_01_kr.png',
        '/ui/images/Upgradable/img_upgradable_06_spring_02_kr.png',
        '/ui/images/Upgradable/img_upgradable_07_summer_01_kr.png',
        '/ui/images/Upgradable/img_upgradable_08_summer_02_kr.png',
        '/ui/images/Upgradable/img_upgradable_09_winter_01_kr.png',
        '/ui/images/Upgradable/img_upgradable_10_winter_02_kr.png',
        '/ui/images/Upgradable/img_upgradable_11_winter_03_kr.png'
    ];

    return (
        <div
            id={id}
            className="w-[320px] h-[240px] bg-black relative"
            style={style}
        >
            <img
                id={`${id}-promotion-img`}
                src={UPGRADE_IMAGES[upgradeImageIndex] || UPGRADE_IMAGES[0]}
                alt="Upgrade promotion"
                className="w-full h-full object-contain"
            />
        </div>
    );
};

WD_ANIM_BootUpgrade.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 업그레이드 프로모션 이미지 인덱스 (0: 가을, 1: 크리스마스, 2: 할로윈, 3: 신년, 4-5: 봄, 6-7: 여름, 8-10: 겨울) */
    upgradeImageIndex: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    /** 현재 포커스 상태 여부 */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 */
    onKey: PropTypes.func,
    /** 커스텀 스타일 객체 */
    style: PropTypes.object
};

export default WD_ANIM_BootUpgrade;

