import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import WD_PAGER_Base from './WD_PAGER_Base';
import CM_LABEL_Smart from './CM_LABEL_Smart';

/**
 * OV_COOK_AutoPager
 * Container widget for Auto Cook modes.
 * Manages pager state and keyboard navigation.
 */
const OV_COOK_AutoPager = ({
    id = "OV_COOK_AutoPager",
    currentPage: initialPage = 0,
    isFocused = true,
    onKey,
    style = {}
}) => {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const pages = [
        { title: "최근 사용 메뉴", msg: "다이얼 눌러 들어가기", titleSize: 48 },
        { title: "해동", msg: "냉동된 식품을 빠르게 녹이기", titleSize: 61 },
        { title: "에어프라이", msg: "고온의 공기로 튀김 요리를 기름 없이 바삭하게 익히기", titleSize: 61 },
        { title: "레인지", msg: "간편하게 음식물을 끓이거나 데우기", titleSize: 61 },
        { title: "오븐", msg: "열기를 이용하여 음식물을 균일하게 익히기", titleSize: 61 },
        { title: "토스트", msg: "다이얼 눌러 들어가기", titleSize: 61 },
        { title: "구이", msg: "음식물의 표면을 노릇노릇하게 굽기", titleSize: 61 },
        { title: "스팀(찜)", msg: "스팀을 이용하여 채소, 생선, 떡 등을 촉촉하게 요리", titleSize: 61 }
    ];

    useEffect(() => {
        setCurrentPage(initialPage);
    }, [initialPage]);

    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') {
                const next = Math.min(pages.length - 1, currentPage + 1);
                if (next !== currentPage) {
                    setCurrentPage(next);
                    onKey?.('RIGHT', { page: next });
                }
            } else if (e.key === 'ArrowLeft') {
                const prev = Math.max(0, currentPage - 1);
                if (prev !== currentPage) {
                    setCurrentPage(prev);
                    onKey?.('LEFT', { page: prev });
                }
            } else if (e.key === 'Enter') {
                onKey?.('OK', { page: currentPage, mode: pages[currentPage].title });
            } else if (e.key === 'Escape') {
                onKey?.('BACK');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, currentPage, onKey, pages.length]);

    return (
        <WD_PAGER_Base
            id={id}
            currentPage={currentPage}
            indicatorImages={{
                normal: '/ui/images/Indicator/ic_page_indicator_n.png',
                selected: '/ui/images/Indicator/ic_page_indicator_s.png'
            }}
            style={style}
        >
            {pages.map((page, idx) => (
                <div key={idx} id={`${id}-page-${idx}`} className="w-full h-full relative">
                    {/* Title Area */}
                    <div id={`${id}-title-wrapper-${idx}`} className="absolute top-[55px] left-[5px] w-[310px] h-[70px] flex items-center justify-center">
                        <CM_LABEL_Smart
                            id={`${id}-title-${idx}`}
                            key={`title-${idx}`}
                            text={page.title}
                            maxArea={{ width: 310, height: 70 }}
                            style={{ fontSize: page.titleSize, fontFamily: "LGSBD", color: "#ffffff" }}
                            align="center"
                        />
                    </div>
                    {/* Message Area */}
                    <div id={`${id}-msg-wrapper-${idx}`} className="absolute top-[128px] left-[5px] w-[310px] h-[102px] flex items-center justify-center">
                        <CM_LABEL_Smart
                            id={`${id}-msg-${idx}`}
                            key={`msg-${idx}`}
                            text={page.msg}
                            maxArea={{ width: 310, height: 102 }}
                            style={{ fontSize: 30, fontFamily: "LGSBD", color: "#ffffff" }}
                            align="center"
                            multiline={true}
                        />
                    </div>
                </div>
            ))}
        </WD_PAGER_Base>
    );
};

OV_COOK_AutoPager.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 현재 활성화된 페이지 인덱스 (0: 최근사용, 1: 해동, 2: 에어프라이, 3: 레인지, 4: 오븐, 5: 토스트, 6: 구이, 7: 스팀) */
    currentPage: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7]),
    /** 현재 포커스 상태 여부 (키 이벤트 수신 제어) */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 */
    onKey: PropTypes.func,
    /** 커스텀 스타일 객체 */
    style: PropTypes.object
};

export default OV_COOK_AutoPager;

