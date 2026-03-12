import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CM_LIST_Grid = ({ items = [], onKey }) => {
    const ITEMS_PER_PAGE = 4;
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const startIdx = currentPage * ITEMS_PER_PAGE;
    const currentPageItems = items.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const gridCols = 2;

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => {
                    const newIdx = prev - gridCols;
                    return newIdx >= 0 ? newIdx : prev;
                });
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => {
                    const newIdx = prev + gridCols;
                    return newIdx < currentPageItems.length ? newIdx : prev;
                });
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                if (selectedIndex % gridCols === 0) {
                    if (currentPage > 0) {
                        setCurrentPage(prev => prev - 1);
                        setSelectedIndex(0);
                    }
                } else {
                    setSelectedIndex(prev => prev - 1);
                }
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                if (selectedIndex % gridCols === gridCols - 1 || selectedIndex === currentPageItems.length - 1) {
                    if (currentPage < totalPages - 1) {
                        setCurrentPage(prev => prev + 1);
                        setSelectedIndex(0);
                    }
                } else {
                    setSelectedIndex(prev => Math.min(prev + 1, currentPageItems.length - 1));
                }
            } else if (e.key === 'Enter') {
                const globalIndex = startIdx + selectedIndex;
                onKey?.('OK', { index: globalIndex, item: items[globalIndex] });
            } else if (e.key === 'Escape' || e.key === 'Backspace') {
                onKey?.('BACK');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentPage, selectedIndex, currentPageItems.length, totalPages, items, startIdx, onKey]);

    return (
        <div id="screen_CM_gridview" className="relative w-[320px] h-[240px] bg-black overflow-hidden">
            <div id="CM_gridview_pager" className="absolute top-[24px] left-0 w-[320px] h-[216px]">
                <div id="grid_page" className="w-[320px] h-[216px] flex flex-row flex-wrap justify-start content-start">
                    {currentPageItems.map((item, idx) => (
                        <div
                            key={idx}
                            id={`grid_button_${idx}`}
                            className="w-[159px] h-[107px] bg-black flex flex-col justify-center items-center"
                        >
                            <span
                                id={`label_gridview1_${idx}`}
                                className="text-white font-semibold text-[28px] text-center whitespace-pre-wrap leading-tight"
                            >
                                {item.label1}
                            </span>
                            <span
                                id={`label_gridview2_${idx}`}
                                className="text-[#CDCDCD] font-semibold text-[28px] text-center leading-tight"
                            >
                                {item.label2}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Page Indicators - C code: auto-centered by pager, pad_top: 2px, pad_left/right: 6px (internal padding) */}
                <div id="page_indicators" className="absolute top-[2px] left-0 w-full flex justify-center items-center" style={{ paddingLeft: '6px', paddingRight: '6px' }}>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <div
                            key={idx}
                            style={{
                                width: idx === currentPage ? '8px' : '5px',
                                height: idx === currentPage ? '8px' : '5px',
                                backgroundColor: idx === currentPage ? '#FFFFFF' : '#565656',
                                borderRadius: '50%',
                                marginLeft: idx === 0 ? 0 : '13px'
                            }}
                        />
                    ))}
                </div>
            </div>

            <img
                id="image_left"
                src="/ui/images/btn_arrow_left_n.png"
                alt="Previous"
                className="absolute left-0 top-[85px] w-[70px] h-[70px] pointer-events-none"
            />
            <img
                id="image_right"
                src="/ui/images/btn_arrow_right_n.png"
                alt="Next"
                className="absolute left-[250px] top-[85px] w-[70px] h-[70px] pointer-events-none"
            />
        </div>
    );
};

CM_LIST_Grid.propTypes = {
    /** 
     * 그리드 항목 배열
     * - 2열 그리드 레이아웃으로 표시
     * - 페이지당 4개 항목 (2x2)
     */
    items: PropTypes.arrayOf(
        PropTypes.shape({
            /** 첫 번째 라벨 (28px, 흰색) */
            label1: PropTypes.string.isRequired,
            /** 두 번째 라벨 (28px, 회색) */
            label2: PropTypes.string.isRequired,
        })
    ),

    /** 
     * 키보드 입력 처리 콜백
     * - 화살표 키로 그리드 탐색 및 페이지 전환
     * - Enter: 선택, Escape/Backspace: 뒤로가기
     */
    onKey: PropTypes.func,
};

export default CM_LIST_Grid;

