import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * WD_CLOCK_Picker - 단일 숫자 시간 표시 컴포넌트
 *
 * 진행 화면(Progress Screen)에서 시, 분, 초의 각 자릿수를 표시하는 데 사용됩니다.
 * 0~9까지의 숫자를 세로로 나열하고, `scrollIndex` 값이 변경되면
 * translateY 애니메이션(500ms ease-in-out)을 통해 해당 숫자로 슬라이드합니다.
 *
 * - 고정 크기: 너비 52px, 높이 81px (각 숫자 셀의 높이와 동일)
 * - 폰트: 'LOCK3R' 커스텀 폰트, 81px 크기의 흰색 텍스트
 * - overflow: hidden으로 현재 값만 보이도록 마스킹 처리
 *
 * @example
 * // 시간 "12:34:56"을 표시할 때, 각 자릿수마다 WD_CLOCK_Picker를 사용
 * <WD_CLOCK_Picker id="hour-tens" scrollIndex={1} />
 * <WD_CLOCK_Picker id="hour-ones" scrollIndex={2} />
 */
const WD_CLOCK_Picker = ({
    id = "WD_CLOCK_Picker",
    scrollIndex = 0,
    style = {}
}) => {
    /** 현재 스크롤 위치 (scrollIndex prop 변경 시 동기화되어 애니메이션 트리거) */
    const [currentIndex, setCurrentIndex] = useState(scrollIndex);

    /** 표시 가능한 숫자 목록 (0~9) */
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    /** scrollIndex prop이 변경될 때 내부 상태를 갱신하여 슬라이드 애니메이션을 실행 */
    useEffect(() => {
        setCurrentIndex(scrollIndex);
    }, [scrollIndex]);

    return (
        /* 외부 컨테이너: 고정 크기(52x81px)로 하나의 숫자만 보이도록 마스킹 */
        <div
            id={id}
            className="w-[52px] h-[81px] overflow-hidden relative"
            style={style}
        >
            {/* 숫자 슬라이더: currentIndex에 따라 Y축으로 이동하여 해당 숫자를 표시 */}
            <div
                id={`${id}-shifter`}
                className="flex flex-col items-center transition-transform duration-500 ease-in-out"
                style={{ transform: `translateY(-${currentIndex * 81}px)` }}
            >
                {digits.map((digit) => (
                    /* 개별 숫자 셀: 81px 높이, 중앙 정렬, LOCK3R 폰트 적용 */
                    <div
                        key={digit}
                        id={`${id}-digit-${digit}`}
                        className="w-full h-[81px] flex items-center justify-center text-[81px] text-white leading-none font-['LOCK3R']"
                    >
                        {digit}
                    </div>
                ))}
            </div>
        </div>
    );
};

WD_CLOCK_Picker.propTypes = {
    /**
     * 컴포넌트의 고유 식별자 (HTML id 속성)
     * 내부적으로 `${id}-shifter`, `${id}-digit-${digit}` 형태의 하위 요소 id 생성에도 사용됩니다.
     * 동일 화면에 여러 WD_CLOCK_Picker를 배치할 때 각각 고유한 id를 부여해야 합니다.
     * @example "hour-tens", "minute-ones", "second-tens"
     */
    id: PropTypes.string,

    /**
     * 세로 스크롤 인덱스 (0~9)
     * 이 값에 따라 translateY 오프셋이 결정되어 해당 숫자 위치로 슬라이드합니다.
     * - 0: 최상단 (translateY 0px) → 숫자 '0' 표시
     * - 9: 최하단 (translateY -729px) → 숫자 '9' 표시
     *
     * 주의: 0~9 범위를 벗어나는 값을 전달하면 빈 영역이 표시될 수 있습니다.
     */
    scrollIndex: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),

    /**
     * 외부 컨테이너에 적용할 추가 인라인 스타일
     * 기본 스타일(너비 52px, 높이 81px, overflow hidden)을 오버라이드하거나
     * 추가적인 위치/마진 등을 지정할 때 사용합니다.
     * @example { marginLeft: '4px', opacity: 0.8 }
     */
    style: PropTypes.object
};

export default WD_CLOCK_Picker;

