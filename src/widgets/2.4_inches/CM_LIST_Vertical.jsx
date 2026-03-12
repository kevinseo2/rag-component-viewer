import React from 'react';
import PropTypes from 'prop-types';
import CM_TITLE_WithArrow from './CM_TITLE_WithArrow';
import CM_LIST_ScrollView from './CM_LIST_ScrollView';

/**
 * CM_LIST_Vertical Widget
 * 
 * Assembles the vertical list screen components: Title bar, List, and Gradient masks.
 * 
 * @param {Object} props
 * @param {string} props.title - Title text
 * @param {boolean} props.showBackArrow - Back arrow visibility
 * @param {Array} props.items - List items
 * @param {number} props.selectedIndex - Initial selected index
 * @param {function} props.onKey - Key event handler
 */
const CM_LIST_Vertical = ({
    id = 'CM_LIST_Vertical',
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
                <CM_LIST_ScrollView
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

CM_LIST_Vertical.propTypes = {
    /** 위젯의 고유 식별자 (HTML id 속성) */
    id: PropTypes.string,

    /** 
     * 화면 상단 타이틀 바에 표시될 제목
     * - 30px 크기의 흰색 볼드체로 중앙 정렬
     * - 뒤로가기 화살표와 함께 표시됨
     */
    title: PropTypes.string,

    /** 
     * 타이틀 바의 뒤로가기 화살표 표시 여부
     * - true: 화살표 표시 (왼쪽 상단에 100x50px 크기로 렌더링)
     * - false: 화살표 숨김
     * - 주의: C 코드 원본에서는 항상 표시되도록 되어 있음
     */
    showBackArrow: PropTypes.bool,

    /** 
     * 리스트에 표시될 항목들의 배열
     * 각 항목은 다음 구조를 가짐:
     */
    items: PropTypes.arrayOf(PropTypes.shape({
        /** 
         * 항목의 메인 제목 텍스트
         * - 30px 크기의 볼드체로 표시
         * - enabled가 true일 때: 흰색 (#FFFFFF)
         * - enabled가 false일 때: 회색 (#8C8C8C)
         */
        label: PropTypes.string.isRequired,

        /** 
         * 항목의 부가 설명 텍스트 (선택사항)
         * - 21px 크기의 볼드체로 label 아래에 표시
         * - enabled가 true일 때: 흰색 (#FFFFFF)
         * - enabled가 false일 때: 회색 (#8C8C8C)
         * - showDescription이 false일 경우 렌더링되지 않음
         */
        description: PropTypes.string,

        /** 
         * 설명(description) 텍스트 표시 여부
         * - true: description 텍스트를 label 아래에 표시
         * - false: description을 숨김 (label만 표시되어 항목이 세로 중앙 정렬됨)
         * - 원본 C 코드의 USER0 플래그에 해당
         */
        showDescription: PropTypes.bool,

        /** 
         * 항목의 활성화 상태
         * - true: 활성화됨 (흰색 텍스트로 표시, 선택 가능)
         * - false: 비활성화됨 (회색 텍스트로 표시, 선택은 가능하나 시각적으로 구분)
         * - 원본 C 코드의 USER1 플래그에 해당
         */
        enabled: PropTypes.bool
    })),

    /** 
     * 초기 선택(포커스)될 항목의 인덱스
     * - 0부터 시작하는 배열 인덱스
     * - 선택된 항목은 화면 중앙에 위치하도록 스크롤됨
     */
    selectedIndex: PropTypes.number,

    /** 
     * 키보드 입력 처리 콜백 함수
     * 
     * 호출 시나리오:
     * - 'BACK' 액션: 뒤로가기 화살표 클릭 또는 Back 키를 누를 때
     * - 'OK' 액션: 항목 선택 시 (CM_LIST_ScrollView에서 전달)
     * - 'UP', 'DOWN' 액션: 리스트 스크롤 시 (CM_LIST_ScrollView에서 처리)
     * 
     * @param {string} action - 액션 이름 ('OK', 'BACK', 'UP', 'DOWN')
     * @param {object} payload - 액션 관련 데이터 (선택된 항목 정보 등)
     */
    onKey: PropTypes.func,
};

export default CM_LIST_Vertical;


