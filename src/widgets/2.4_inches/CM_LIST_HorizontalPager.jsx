import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * CM_LIST_HorizontalPager - A legacy horizontal pager widget (320x240 per page)
 * Strictly follows LVGL PagerTemplate structure from Acacia 2.4"
 * 
 * NAVIGATION:
 * - Internal state 'activeIndex' manages pagination.
 * - ArrowLeft/Right keys navigate pages internally.
 * - onKey('OK', payload) called on 'Enter' key.
 * - onKey('BACK') called on 'Escape' or 'Backspace' key.
 */
const CM_LIST_HorizontalPager = ({
    items = [],
    initialIndex = 0,
    onKey,
    variant = "1st"
}) => {
    const [activeIndex, setActiveIndex] = useState(initialIndex);

    useEffect(() => {
        setActiveIndex(initialIndex);
    }, [initialIndex]);

    const goToIndex = (index) => {
        if (index >= 0 && index < items.length) {
            setActiveIndex(index);
        }
    };

    // Unified Key Listener matching user standard (GridViewWidget pattern)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToIndex(activeIndex - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                goToIndex(activeIndex + 1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                onKey?.('OK', { index: activeIndex, item: items[activeIndex] });
            } else if (e.key === 'Escape' || e.key === 'Backspace') {
                onKey?.('BACK');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex, items, onKey]);

    const pageTransition = `translateX(-${activeIndex * 320}px)`;

    return (
        <div
            id="CM_LIST_HorizontalPager-root"
            className="relative w-[320px] h-[240px] overflow-hidden bg-black select-none"
        >
            {/* Pages Container */}
            <div
                className="flex flex-row transition-transform duration-300 ease-out h-full"
                style={{ transform: pageTransition, width: `${items.length * 320}px` }}
            >
                {items.map((item, index) => {
                    const is2nd = variant === "2nd";
                    if (is2nd) {
                        const labelTitle = item.title || (item.CM_label_title && item.CM_label_title.text) || "Title";
                        const labelValue = item.value || (item.CM_label_value && item.CM_label_value.text) || "Value";
                        const labelDesc = item.description || (item.CM_label_descript && item.CM_label_descript.text) || "";
                        const hasDesc = labelDesc !== "";
                        const isValueGray = item.USER0 === 0 || item.isValueGray;

                        let valY = "106px";
                        let descY = "148px";
                        if (hasDesc) {
                            valY = labelValue.includes('\n') ? "70px" : "92px";
                            descY = labelValue.includes('\n') ? "182px" : "148px";
                        } else {
                            valY = labelTitle.includes('\n') ? "126px" : "106px";
                        }

                        return (
                            <div key={index} id={`page_${index}`} className="relative w-[320px] h-[240px] flex-shrink-0 pointer-events-none">
                                <div id="CM_label_title" className="absolute top-[33px] left-[5px] w-[310px] text-center text-white text-[30px] font-semibold leading-tight">{labelTitle}</div>
                                <div id="CM_label_value" className="absolute left-[5px] w-[310px] text-center font-semibold leading-tight" style={{ top: valY, fontSize: '49px', color: isValueGray ? '#8C8C8C' : '#FFFFFF' }}>{labelValue}</div>
                                {hasDesc && <div id="CM_label_descript" className="absolute left-[5px] w-[310px] text-center text-[#FFFFFF] text-[25px] font-normal leading-tight" style={{ top: descY }}>{labelDesc}</div>}
                            </div>
                        );
                    } else {
                        const label1 = item.label1 || item.label || (item.CM_label_1 && item.CM_label_1.text);
                        const label2 = item.label2 || (item.CM_label_2 && item.CM_label_2.text);
                        const hasLabel2 = label2 && label2 !== "";
                        const hasCommand = item.hasCommand || item.USER0 === 2;

                        let label1Top = "85px";
                        let label1Size = "61px";
                        if (hasCommand) {
                            label1Top = "40px"; label1Size = "56px";
                        } else if (hasLabel2) {
                            label1Top = "55px"; label1Size = "61px";
                        }

                        return (
                            <div key={index} id={`page_${index}`} className="relative w-[320px] h-[240px] flex-shrink-0 pointer-events-none">
                                <div id="CM_label_1" className="absolute left-[5px] w-[310px] text-center text-white font-semibold leading-tight flex items-center justify-center" style={{ top: label1Top, fontSize: label1Size }}>{label1}</div>
                                {hasLabel2 && <div id="CM_label_2" className="absolute top-[128px] left-[5px] w-[310px] text-center text-white text-[30px] font-semibold leading-tight">{label2}</div>}
                                {hasCommand && (
                                    <div id="container_command" className="absolute bottom-[20px] left-1/2 -translate-x-1/2 w-[162px] h-[52px] rounded-[26px] bg-[#3A3B43] flex items-center justify-center">
                                        <span className="text-white text-[28px] font-semibold">{item.commandText || "label"}</span>
                                    </div>
                                )}
                            </div>
                        );
                    }
                })}
            </div>

            {/* Visual Indicator (Dots) - Restored to Pixel-Perfect Step 918 Style */}
            <div
                id="CM_indicator"
                className="absolute left-0 w-full h-[20px] flex flex-row items-center justify-center p-0"
                style={{ top: '6px', gap: '14px' }}
            >
                {items.map((_, index) => {
                    const isSelected = index === activeIndex;
                    return (
                        <div
                            key={index}
                            className="transition-all duration-300 rounded-full"
                            style={{
                                width: isSelected ? '10px' : '4px',
                                height: isSelected ? '10px' : '4px',
                                backgroundColor: isSelected ? '#FFFFFF' : '#8E8E8E',
                                boxShadow: isSelected ? '0 0 4px 1px rgba(255, 255, 255, 0.4)' : 'none'
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

CM_LIST_HorizontalPager.propTypes = {
    /** 
     * 페이지 항목 배열 (필수)
     * - 전체 화면 가로 페이저 형태로 표시
     * - 각 페이지는 320x240px 크기
     */
    items: PropTypes.array.isRequired,

    /** 초기 페이지 인덱스 */
    initialIndex: PropTypes.number,

    /** 
     * 키보드 입력 처리 콜백
     * - 'OK': Enter 키 (payload: { index, item })
     * - 'BACK': Escape/Backspace 키
     * - 좌우 화살표는 내부적으로 페이지 전환에 사용
     */
    onKey: PropTypes.func, // (action, payload) => void

    /** 
     * 레이아웃 변형
     * - '1st': 큰 라벨 표시 (label1, label2)
     * - '2nd': 타이틀+값+설명 표시 (title, value, description)
     */
    variant: PropTypes.oneOf(["1st", "2nd"])
};

export default CM_LIST_HorizontalPager;

