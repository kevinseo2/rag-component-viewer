import React from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Formatted from './CM_LABEL_Formatted';

/**
 * CM_OVERLAY_Toast - 단일 토스트 메시지 표시 컴포넌트
 *
 * CM_OVERLAY_ToastQueue에 의해 관리되며, 실제 토스트 UI를 렌더링합니다.
 * 텍스트 줄 수에 따라 컨테이너 높이가 자동으로 결정됩니다.
 *
 * - 배경색: #313137 (어두운 회색)
 * - 텍스트: 흰색, 25px, LGSBD 폰트, 중앙 정렬
 * - 너비: 310px (고정), 높이: 줄 수에 따라 가변
 * - 텍스트 영역: 300px (좌우 5px 패딩 효과)
 *
 * 높이 결정 규칙 (C 코드 lv_CM_OVERLAY_Toast.c 기준):
 * - 1~2줄: 92px
 * - 3~4줄: 120px
 * - 5줄 이상: 150px
 */
const CM_OVERLAY_Toast = ({ text = "", duration = 2000, slots = [] }) => {
    /* 줄 수에 따른 토스트 높이 결정 (C 코드 lv_CM_OVERLAY_Toast.c 기준) */
    const lineCount = text.split('\n').length;
    let height = 92;
    if (lineCount < 3) height = 92;
    else if (lineCount < 5) height = 120;
    else height = 150;

    return (
        <div
            id="CM_OVERLAY_Toast-container"
            className="absolute flex items-center justify-center bg-[#313137] opacity-100 overflow-hidden transition-all duration-500 ease-in-out"
            style={{
                width: '310px',
                height: `${height}px`,
                left: '0px',
            }}
        >
            <div id="CM_OVERLAY_Toast-label-wrapper" className="w-[300px] flex items-center justify-center">
                <CM_LABEL_Formatted
                    key={text}
                    id="CM_OVERLAY_Toast-fmtlabel"
                    format={text}
                    slots={slots}
                    style={{
                        color: '#FFFFFF',
                        fontSize: 25,
                        fontFamily: 'LGSBD',
                        textAlign: 'center'
                    }}
                    maxArea={{ width: 300, height: 150 }}
                    multiline={lineCount > 1}
                />
            </div>
        </div>
    );
};

CM_OVERLAY_Toast.propTypes = {
    /**
     * 토스트에 표시할 메시지 텍스트
     * 줄바꿈(\n)으로 멀티라인 지원. 줄 수에 따라 컨테이너 높이가 자동 결정됩니다.
     * 포맷 슬롯("{0}", "{1}" 등)을 포함할 수 있으며, slots 배열과 매핑됩니다.
     * @example "세탁이 완료되었습니다", "건조 시간\n약 2시간 소요됩니다"
     */
    text: PropTypes.string,

    /**
     * 토스트 유지 시간 (밀리초)
     * 이 컴포넌트 자체는 duration을 직접 사용하지 않으며,
     * 부모(CM_OVERLAY_ToastQueue)가 애니메이션 타이밍에 활용합니다.
     * @example 2000, 3500
     */
    duration: PropTypes.number,

    /**
     * 포맷 슬롯 데이터 배열
     * text 내의 "{0}", "{1}" 플레이스홀더에 매핑되어 CM_LABEL_Formatted로 렌더링됩니다.
     * @example ["값1", { type: "image", value: "icon.png" }]
     */
    slots: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            /** 슬롯 타입 — 'string': 텍스트, 'image': 이미지, 'number': 숫자 */
            type: PropTypes.oneOf(['string', 'image', 'number']),
            /** 슬롯 값 (텍스트 문자열 또는 이미지 경로 또는 숫자) */
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            /** 슬롯별 개별 스타일 */
            style: PropTypes.object
        })
    ])),
};

export default CM_OVERLAY_Toast;

