import React from 'react';
import PropTypes from 'prop-types';
import CM_ANIM_Sequence from './CM_ANIM_Sequence';
import CM_LABEL_Smart from './CM_LABEL_Smart';

/**
 * CM_PROGRESS_Spinner - Progress indicator widget (Spinner)
 * Displays a spinning animation with an optional description label.
 */
const CM_PROGRESS_Spinner = ({
    id = "CM_PROGRESS_Spinner",
    desc = "",
    duration = 1000,
    spinnerStyle = { left: '129px', top: '66px' },
    labelStyle = { top: '138px' }
}) => {
    // Frames 1-50 for large_blue spinner
    const images = Array.from({ length: 50 }, (_, i) =>
        `/ui/image_sequences/Loading Spinner/large_blue/img_loading_large_blue_${String(i + 1).padStart(3, '0')}.png`
    );

    return (
        <div id={id} className="relative w-[320px] h-[240px] bg-black overflow-hidden">
            {/* Spinning Animation */}
            <div
                id={`${id}-spinner-wrapper`}
                className="absolute"
                style={spinnerStyle}
            >
                <CM_ANIM_Sequence
                    images={images}
                    duration={duration}
                    width="62px"
                    height="62px"
                    repeat={true}
                />
            </div>

            {/* Label below spinner */}
            <div
                id={`${id}-label-wrapper`}
                className="absolute w-full flex justify-center"
                style={labelStyle}
            >
                <CM_LABEL_Smart
                    id={`${id}-label`}
                    key={desc}
                    text={desc}
                    maxArea={{ width: 320, height: 100 }}
                    style={{
                        color: '#FFFFFF',
                        fontFamily: 'LG_Smart_UI_HA2023_SemiBold',
                        fontSize: '25px',
                        textAlign: 'center'
                    }}
                />
            </div>
        </div>
    );
};

CM_PROGRESS_Spinner.propTypes = {
    /** 컴포넌트 ID */
    id: PropTypes.string,

    /** 
     * 스피너 아래 표시될 설명 텍스트
     * - 25px 크기로 중앙 정렬
     * - 스피너 아래 위치 (기본 top: 138px)
     */
    desc: PropTypes.string,

    /** 
     * 애니메이션 지속 시간 (밀리초)
     * - 50프레임 애니메이션이 완료되는 시간
     * - 기본값: 1000ms (1초)
     */
    duration: PropTypes.number,

    /** 
     * 스피너 위치 스타일 객체
     * - 기본값: { left: '129px', top: '66px' }
     * - 62x62px 크기의 스피너 위치 조정
     */
    spinnerStyle: PropTypes.object,

    /** 
     * 라벨 위치 스타일 객체
     * - 기본값: { top: '138px' }
     * - 설명 텍스트의 수직 위치 조정
     */
    labelStyle: PropTypes.object
};

export default CM_PROGRESS_Spinner;

