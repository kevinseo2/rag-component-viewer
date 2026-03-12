import React from 'react';
import PropTypes from 'prop-types';
import CM_TITLE_WithArrow from './CM_TITLE_WithArrow';
import CM_LIST_ScrollView2Col from './CM_LIST_ScrollView2Col';

/**
 * CM_LIST_Vertical2Col Widget
 * 
 * Core structural widget for the two-column vertical list screen.
 */
const CM_LIST_Vertical2Col = ({
    id = 'CM_LIST_Vertical2Col',
    title = 'Title',
    showBackArrow = true,
    items = [],
    selectedIndex = 0,
    onKey = null,
}) => {
    return (
        <div id={id} className="w-[320px] h-[240px] bg-black relative overflow-hidden">
            {/* Title Bar */}
            <CM_TITLE_WithArrow
                id={`${id}-title-bar`}
                title={title}
                showBackArrow={showBackArrow}
                onBack={() => onKey?.('BACK')}
            />

            {/* List Area */}
            <div id={`${id}-list-wrapper`} className="absolute top-[50px] left-0 w-[320px] h-[190px]">
                <CM_LIST_ScrollView2Col
                    id={`${id}-listview`}
                    items={items}
                    initialSelectedIndex={selectedIndex}
                    onKey={onKey}
                />
            </div>

            {/* Gradient Masks */}
            <img
                id={`${id}-mask-top`}
                src="/ui/images/mask_contents_area_common_top.png"
                className="absolute top-[50px] left-0 z-10 w-[320px] h-auto pointer-events-none"
                alt=""
            />
            <img
                id={`${id}-mask-bottom`}
                src="/ui/images/mask_contents_area_common_bottom.png"
                className="absolute top-[232px] left-0 z-10 w-[320px] h-auto pointer-events-none"
                alt=""
            />
        </div>
    );
};

CM_LIST_Vertical2Col.propTypes = {
    /** 컴포넌트 ID */
    id: PropTypes.string,

    /** 상단 타이틀 텍스트 */
    title: PropTypes.string,

    /** 뒤로가기 화살표 표시 여부 */
    showBackArrow: PropTypes.bool,

    /** 
     * 2열 리스트에 표시될 항목들의 배열
     * - CM_LIST_ScrollView2Col에서 2열 레이아웃으로 렌더링됨
     * - 각 항목의 구조는 CM_LIST_ScrollView2Col의 요구사항에 따름
     */
    items: PropTypes.arrayOf(PropTypes.object),

    /** 초기 선택될 항목의 인덱스 */
    selectedIndex: PropTypes.number,

    /** 
     * 키보드 입력 처리 콜백
     * - 'BACK': 뒤로가기
     * - 기타 이벤트는 CM_LIST_ScrollView2Col에서 처리
     */
    onKey: PropTypes.func,
};

export default CM_LIST_Vertical2Col;


