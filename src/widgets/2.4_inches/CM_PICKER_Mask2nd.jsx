import PropTypes from 'prop-types';

/**
 * CM_PICKER_Mask2nd - 2nd depth 옵션 피커용 오버레이 마스크
 * 
 * 리스트 아이템의 포커스 영역(중앙)을 제외한 상/하단 영역을 어둡게 처리하거나,
 * 하단에 부가적인 설명(Description) 텍스트를 표시하는 역할을 합니다.
 */
const CM_PICKER_Mask2nd = ({ mode = 'hidden', text = "" }) => {
    // ... 내부는 동일 ...
};

CM_PICKER_Mask2nd.propTypes = {
    /** 
     * 마스크의 표시 모드
     * - 'hidden': 아무것도 표시하지 않음 (렌더링 안 함)
     * - 'mask': 상단(38~104px)과 하단(173~240px) 영역을 반투명 검정색으로 덮음
     * - 'description': 'mask' 모드에 추가로 하단 5px 위치에 설명 텍스트를 표시함
     */
    mode: PropTypes.oneOf(['hidden', 'mask', 'description']),

    /** 
     * 하단에 표시될 설명 텍스트
     * - mode 가 'description'일 때만 화면 하단 중앙에 나타남
     * - 25px 폰트 크기, LGSBD23 폰트 사용
     */
    text: PropTypes.string
};

export default CM_PICKER_Mask2nd;

