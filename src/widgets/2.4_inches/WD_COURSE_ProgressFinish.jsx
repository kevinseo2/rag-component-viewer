import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import WD_COURSE_ProgressTitle from './WD_COURSE_ProgressTitle';
import CM_LABEL_Smart from './CM_LABEL_Smart';

/**
 * WD_COURSE_ProgressFinish - 코스 완료 상태 위젯
 *
 * 코스 완료 시 이미지(정지/시퀀스)와 설명 텍스트를 회전 표시합니다.
 * finish_info 객체 하나로 모든 표시 데이터를 전달받습니다.
 *
 * 레이아웃 (310 x 240px, 배경 검정):
 * - 타이틀 영역: 상단 14px, WD_COURSE_ProgressTitle 사용
 * - 이미지 영역: 상단 약 57px, 108x108px (정지 이미지 또는 프레임 시퀀스)
 * - 설명 텍스트: 하단 14px, 300x77px, 28px 폰트
 *
 * 이미지 표시 모드:
 * - show_still_img = true: img_arr에서 정지 이미지를 toggle_period 간격으로 회전
 * - show_still_img = false: imgopt_arr 기반 이미지 시퀀스 재생 (50프레임)
 *
 * 회전 동작:
 * - toggle_period(ms) 간격으로 이미지와 설명 텍스트가 동시에 회전
 * - number_of_img/number_of_desc가 1 이하이면 해당 영역은 회전하지 않음
 *
 * 키보드 조작:
 * - Enter: onKey('OK') 호출
 * - Escape: onKey('BACK') 호출
 * - 화살표: onKey('UP'/'DOWN'/'LEFT'/'RIGHT') 호출
 */
const WD_COURSE_ProgressFinish = ({
    id = "WD_COURSE_ProgressFinish",
    finish_info = {},
    theme = "blue",
    isFocused = true,
    onKey
}) => {
    const {
        course_title_info = {},
        img_arr = [],
        imgopt_arr = [],
        description_arr = [],
        number_of_img = 0,
        number_of_desc = 0,
        toggle_period = 1500,
        show_still_img = true
    } = finish_info;

    /** 현재 표시 중인 이미지 인덱스 (img_arr 내 위치) */
    const [currentImgIdx, setCurrentImgIdx] = useState(0);
    /** 현재 표시 중인 설명 텍스트 인덱스 (description_arr 내 위치) */
    const [currentDescIdx, setCurrentDescIdx] = useState(0);

    /** 이미지 시퀀스 재생 상태 (show_still_img가 false일 때 사용) */
    const [frameIndex, setFrameIndex] = useState(0);
    const totalFrames = 50;
    const duration = imgopt_arr[0]?.duration || 1000;
    const interval = duration / totalFrames;

    useEffect(() => {
        if (show_still_img) return;
        const timer = setInterval(() => {
            setFrameIndex(prev => (prev + 1) % totalFrames);
        }, interval);
        return () => clearInterval(timer);
    }, [show_still_img, interval]);

    /** 키보드 이벤트 핸들링 (isFocused가 true일 때만 활성) */
    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            const keyMap = {
                'Enter': 'OK',
                'Escape': 'BACK',
                'ArrowUp': 'UP',
                'ArrowDown': 'DOWN',
                'ArrowLeft': 'LEFT',
                'ArrowRight': 'RIGHT'
            };
            const action = keyMap[e.key];
            if (action) {
                e.preventDefault();
                onKey?.(action, { finish_info, currentImgIdx, currentDescIdx, theme });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, onKey, finish_info, currentImgIdx, currentDescIdx, theme]);

    /** 이미지/설명 회전 타이머 (toggle_period 간격) */
    useEffect(() => {
        if (toggle_period <= 0) return;

        const timer = setInterval(() => {
            if (number_of_img > 1) {
                setCurrentImgIdx(prev => (prev + 1) % number_of_img);
            }
            if (number_of_desc > 1) {
                setCurrentDescIdx(prev => (prev + 1) % number_of_desc);
            }
        }, toggle_period);

        return () => clearInterval(timer);
    }, [toggle_period, number_of_img, number_of_desc]);

    const currentDescription = description_arr[currentDescIdx]?.string_info || "";

    /** 이미지 시퀀스 프레임 경로 생성 (테마에 따라 세탁기/건조기 폴더 분기) */
    const resolveSequencePath = () => {
        const seqId = imgopt_arr[0]?.imgopt;
        const folder = theme === 'orange' ? 'dryer/img_loading_s/.orig_images' : 'washer/img_loading_s_blue/.orig_images';
        const prefix = theme === 'orange' ? 'img_loading' : 'img_loading_s';
        const frameStr = String(frameIndex).padStart(2, '0');
        return `/ui/image_sequences/${folder}/${prefix}_${frameStr}.png`;
    };

    return (
        <div
            id={id}
            className="w-[310px] h-[240px] bg-black flex flex-col items-center px-[5px]"
        >
            {/* Title Area */}
            <div id={`${id}-title-container`} className="mt-[14px]">
                <WD_COURSE_ProgressTitle
                    id={`${id}-WD_COURSE_ProgressTitle`}
                    title={course_title_info.course_name}
                    show_ai={course_title_info.show_img_ai}
                    show_pentagon={course_title_info.show_img_pentagon}
                />
            </div>

            {/* Image Area - Static or Sequence */}
            <div id={`${id}-image-container`} className="mt-[7px] w-[108px] h-[108px] flex items-center justify-center relative">
                {show_still_img ? (
                    <img
                        id={`${id}-image`}
                        key={`img-${currentImgIdx}`}
                        src={img_arr[currentImgIdx]?.image}
                        className="w-[108px] h-[108px] object-contain"
                        alt="Finish Status"
                    />
                ) : (
                    <img
                        id={`${id}-imageseqopt`}
                        key={`seq-${frameIndex}`}
                        src={resolveSequencePath()}
                        className="w-[108px] h-[108px] object-contain"
                        alt="Loading..."
                    />
                )}
            </div>

            {/* Description Label Area */}
            <div id={`${id}-description-container`} className="mt-auto mb-[14px] w-full flex justify-center">
                <CM_LABEL_Smart
                    id={`${id}-next_label`}
                    key={currentDescription}
                    text={currentDescription}
                    maxArea={{ width: 300, height: 77 }}
                    align="center"
                    style={{
                        fontFamily: 'LGSBD23',
                        fontSize: '28px',
                        color: '#FFFFFF'
                    }}
                />
            </div>
        </div>
    );
};

WD_COURSE_ProgressFinish.propTypes = {
    /** 컴포넌트의 고유 식별자 (HTML id 속성) */
    id: PropTypes.string,

    /**
     * 완료 화면 표시 정보 객체
     * 코스 타이틀, 이미지 배열, 설명 배열, 회전 주기 등 모든 표시 데이터를 포함합니다.
     */
    finish_info: PropTypes.shape({
        /**
         * 코스 타이틀 정보
         * WD_COURSE_ProgressTitle에 전달되는 데이터입니다.
         */
        course_title_info: PropTypes.shape({
            /** 코스 이름 @example "표준세탁" */
            course_name: PropTypes.string,
            /** AI 아이콘 표시 여부 */
            show_img_ai: PropTypes.bool,
            /** 오각형 아이콘 표시 여부 */
            show_img_pentagon: PropTypes.bool
        }),
        /**
         * 정지 이미지 배열 (show_still_img가 true일 때 사용)
         * toggle_period 간격으로 순환 표시됩니다.
         */
        img_arr: PropTypes.arrayOf(PropTypes.shape({
            /** 이미지 경로 @example "/ui/images/washer_dryer/finish_ok.png" */
            image: PropTypes.string
        })),
        /**
         * 이미지 시퀀스 옵션 배열 (show_still_img가 false일 때 사용)
         * 첫 번째 항목의 duration으로 프레임 간격을 계산합니다.
         */
        imgopt_arr: PropTypes.arrayOf(PropTypes.shape({
            /** 이미지 시퀀스 식별자 */
            imgopt: PropTypes.string,
            /** 시퀀스 전체 재생 시간 (밀리초) @example 1000 */
            duration: PropTypes.number
        })),
        /**
         * 설명 텍스트 배열
         * toggle_period 간격으로 순환 표시됩니다.
         */
        description_arr: PropTypes.arrayOf(PropTypes.shape({
            /** 표시할 설명 텍스트 @example "세탁이 완료되었습니다" */
            string_info: PropTypes.string
        })),
        /** 이미지 배열의 유효 개수 (회전에 사용) */
        number_of_img: PropTypes.number,
        /** 설명 배열의 유효 개수 (회전에 사용) */
        number_of_desc: PropTypes.number,
        /**
         * 이미지/설명 회전 주기 (밀리초)
         * 0 이하이면 회전하지 않습니다.
         * @example 1500
         */
        toggle_period: PropTypes.number,
        /**
         * 이미지 표시 모드
         * - true: 정지 이미지 (img_arr에서 순환)
         * - false: 이미지 시퀀스 재생 (imgopt_arr 기반)
         */
        show_still_img: PropTypes.bool
    }),

    /**
     * 색상 테마
     * - 'blue': 세탁기용 (파란색 로딩 시퀀스)
     * - 'orange': 건조기용 (주황색 로딩 시퀀스)
     */
    theme: PropTypes.oneOf(['blue', 'orange']),

    /**
     * 현재 포커스 상태 여부
     * true일 때만 키보드 이벤트를 수신합니다.
     */
    isFocused: PropTypes.bool,

    /**
     * 키 이벤트 콜백 함수
     * @param {string} action - 'OK' | 'BACK' | 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
     * @param {object} [payload] - { finish_info, currentImgIdx, currentDescIdx, theme }
     */
    onKey: PropTypes.func
};

export default WD_COURSE_ProgressFinish;

