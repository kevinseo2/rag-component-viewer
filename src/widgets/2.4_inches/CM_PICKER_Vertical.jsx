import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const ITEM_HEIGHT = 94; // Base Item Height
const VIEWPORT_HEIGHT = 240;
const CENTER_OFFSET = (VIEWPORT_HEIGHT - ITEM_HEIGHT) / 2; // 73px

const CM_PICKER_Vertical = ({ items = [], onKey, isFocused = true, initialSelectedIndex = 0 }) => {
    const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);

    // Sync index when data changes (e.g. variant switch) or initialSelectedIndex changes
    useEffect(() => {
        setSelectedIndex(initialSelectedIndex);
    }, [items, initialSelectedIndex]);

    useEffect(() => {
        if (!isFocused) return;
        const handleKeyDown = (e) => {
            let handled = false;
            if ((e.key === 'ArrowUp') || (e.key === 'ArrowLeft')) {
                setSelectedIndex((prev) => Math.max(0, prev - 1));
                handled = true;
            } else if ((e.key === 'ArrowDown') || (e.key === 'ArrowRight')) {
                setSelectedIndex((prev) => Math.min(items.length - 1, prev + 1));
                handled = true;
            } else if (e.key === 'Enter') {
                onKey?.('OK', { index: selectedIndex, item: items[selectedIndex] });
                handled = true;
            } else if (e.key === 'Backspace' || e.key === 'Escape') {
                onKey?.('BACK');
                handled = true;
            }

            if (handled) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, items.length, selectedIndex, onKey]);

    return (
        <div id="CM_PICKER_Vertical-root" className="relative w-[320px] h-[240px] bg-black overflow-hidden">
            {/* Dividers */}
            <div id="container-boarder-up" className="absolute left-[20px] top-[71px] w-[280px] h-[2px] bg-[#333333] rounded-full z-10" />
            <div id="container-boarder-down" className="absolute left-[20px] top-[167px] w-[280px] h-[2px] bg-[#333333] rounded-full z-10" />

            {/* Picker List */}
            <div
                id="picker-list-container"
                className="absolute w-full h-full transition-transform duration-300 ease-out"
                style={{ transform: `translateY(${CENTER_OFFSET - (selectedIndex * ITEM_HEIGHT)}px)` }}
            >
                {items.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    const isSmallFont = item.isSmallFont || false;
                    const isDoubleHeight = item.isDoubleHeight || false;
                    const isValueHidden = item.isValueHidden || false;

                    // Semantic Properties Logic
                    // isSmallFont: Use smaller font (30px) instead of default (36px).
                    // isDoubleHeight: Use taller item (82px) and hide value.
                    // isValueHidden: Hide value label explicitly.

                    let titleFontSize = isSmallFont ? "text-[30px]" : "text-[36px]";
                    let titleHeight = isDoubleHeight ? "h-[82px]" : "h-[41px]";
                    let showValue = isSelected && !isDoubleHeight && !isValueHidden;

                    return (
                        <div
                            key={index}
                            id={`picker-item-${index}`}
                            className="flex flex-col items-center justify-center w-[320px]"
                            style={{ height: `${ITEM_HEIGHT}px`, gap: '5px' }}
                        >
                            {/* Title */}
                            <div
                                id={`item-title-${index}`}
                                className={`flex items-center justify-center w-[310px] ${titleHeight}`}
                            >
                                <span className={`font-LG_Smart_UI_HA2023_SemiBold text-white text-center ${titleFontSize} leading-none`}>
                                    {item.title}
                                </span>
                            </div>

                            {/* Value (Conditional) */}
                            <div
                                id={`item-value-${index}`}
                                className={`transition-opacity duration-200 ${showValue ? 'opacity-100' : 'opacity-0 hidden'}`}
                            >
                                <span className="font-LG_Smart_UI_HA2023_Regular text-[30px] text-white leading-none">
                                    {item.value}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mask Overlay */}
            <img
                id="image-overlay"
                src="/ui/images/mask_vertical_list_depth_first.png"
                alt="Mask"
                className="absolute top-0 left-0 w-[320px] h-[240px] pointer-events-none z-20"
            />
        </div>
    );
};

CM_PICKER_Vertical.propTypes = {
    /** 
     * 피커에 표시될 항목들의 배열
     * - 수직 스크롤 방식으로 항목을 선택할 수 있음
     * - 선택된 항목은 화면 중앙(73px 오프셋)에 위치
     * - 각 항목 높이: 94px (고정)
     * 
     * 각 항목의 구조:
     */
    items: PropTypes.arrayOf(PropTypes.shape({
        /** 
         * 항목의 메인 제목 텍스트
         * - 기본 폰트 크기: 36px (isSmallFont=false일 때)
         * - 작은 폰트 크기: 30px (isSmallFont=true일 때)
         * - 흰색 (#FFFFFF)으로 표시
         * - 중앙 정렬
         */
        title: PropTypes.string.isRequired,

        /** 
         * 항목의 부가 값 텍스트 (선택사항)
         * - 30px 크기의 Regular 폰트로 표시
         * - title 아래에 5px 간격으로 배치됨
         * - 선택된 항목에서만 표시됨 (isSelected=true)
         * - isDoubleHeight=true 또는 isValueHidden=true일 경우 숨김
         */
        value: PropTypes.string,

        /** 
         * 제목(title)에 작은 폰트 사용 여부
         * - true: 30px 크기 사용
         * - false 또는 undefined: 36px 크기 사용 (기본값)
         * - 긴 텍스트를 표시할 때 유용함
         */
        isSmallFont: PropTypes.bool,

        /** 
         * 제목 영역을 2배 높이로 표시 여부
         * - true: 제목 높이를 82px로 확장하고 value를 숨김
         * - false 또는 undefined: 제목 높이 41px 사용 (기본값)
         * - 제목만 크게 강조하고 싶을 때 사용
         */
        isDoubleHeight: PropTypes.bool,

        /** 
         * value 텍스트 숨김 여부
         * - true: 선택된 항목이어도 value를 표시하지 않음
         * - false 또는 undefined: 선택된 항목에서 value 표시 (기본값)
         * - value가 의미 없거나 불필요한 항목에 사용
         */
        isValueHidden: PropTypes.bool
    })),

    /** 
     * 키보드 입력 처리 콜백 함수
     * 
     * 호출 시나리오:
     * - 'OK' 액션: Enter 키를 누르면 현재 선택된 항목 정보와 함께 호출
     *   payload: { index: selectedIndex, item: data[selectedIndex] }
     * - 'BACK' 액션: Escape 또는 Backspace 키를 누르면 호출
     * - 'UP', 'DOWN' 액션은 내부적으로 처리되어 외부로 전달되지 않음
     * 
     * @param {string} action - 액션 이름 ('OK' 또는 'BACK')
     * @param {object} payload - 액션 관련 데이터
     * @param {number} payload.index - 선택된 항목의 인덱스
     * @param {object} payload.item - 선택된 항목 객체
     */
    onKey: PropTypes.func,

    /** 
     * 키보드 입력 활성화 여부
     * - true: 이 위젯이 키보드 이벤트를 수신함
     * - false: 키보드 이벤트를 무시함
     */
    isFocused: PropTypes.bool,

    /** 
     * 초기 선택될 항목의 인덱스
     * - 0부터 시작하는 배열 인덱스
     * - 초기 렌더링 시 해당 항목이  화면 중앙에 위치
     * - 기본값: 0 (첫 번째 항목)
     */
    initialSelectedIndex: PropTypes.number
};

export default CM_PICKER_Vertical;

