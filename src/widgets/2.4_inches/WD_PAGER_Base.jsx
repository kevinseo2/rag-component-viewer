import React from 'react';
import PropTypes from 'prop-types';

/**
 * WD_PAGER_Base
 * A horizontal paging component with slide animation and indicator dots.
 */
const WD_PAGER_Base = ({
    id = "WD_PAGER_Base",
    currentPage = 0,
    pageCount: pageCountProp = 0,
    children = [],
    indicatorImages = {
        normal: '/ui/images/ic_page_indicator_n.png',
        selected: '/ui/images/ic_page_indicator_s.png'
    },
    isFocused = true,
    onKey,
    style = {}
}) => {
    const childCount = React.Children.count(children);
    const pageCount = childCount > 0 ? childCount : pageCountProp;
    const pages = React.Children.toArray(children);

    return (
        <div
            id={id}
            className="w-[320px] h-[240px] overflow-hidden relative bg-black"
            style={style}
        >
            {/* Pages Container */}
            <div
                id={`${id}-pages-container`}
                className="flex transition-transform duration-[266ms] ease-out h-full"
                style={{ transform: `translateX(-${currentPage * 320}px)` }}
            >
                {pages.map((page, index) => (
                    <div
                        key={index}
                        id={`${id}-page-${index}`}
                        className="w-[320px] h-full flex-shrink-0 relative"
                    >
                        {page}
                    </div>
                ))}
            </div>

            {/* Page Indicator */}
            <div
                id={`${id}-indicator`}
                className="absolute top-[10px] left-0 w-full flex justify-center items-center gap-[6px]"
            >
                {Array.from({ length: pageCount }).map((_, index) => (
                    <img
                        key={index}
                        id={`${id}-dot-${index}`}
                        src={index === currentPage ? indicatorImages.selected : indicatorImages.normal}
                        alt={`page ${index}`}
                        className="w-[10px] h-[10px]"
                    />
                ))}
            </div>
        </div>
    );
};

WD_PAGER_Base.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 현재 표시 중인 페이지 번호 (0부터 시작) */
    currentPage: PropTypes.number,
    /** 내부에 렌더링될 페이지 컴포넌트들 */
    children: PropTypes.node,
    /** 페이지 인디케이터 이미지 설정 */
    indicatorImages: PropTypes.shape({
        /** 일반 상태의 점 이미지 경로 */
        normal: PropTypes.string,
        /** 선택된 상태의 점 이미지 경로 */
        selected: PropTypes.string
    }),
    /** 현재 포커스 상태 여부 */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 */
    onKey: PropTypes.func,
    /** 커스텀 스타일 객체 */
    style: PropTypes.object
};

export default WD_PAGER_Base;

