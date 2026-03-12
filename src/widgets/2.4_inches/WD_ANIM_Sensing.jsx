import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Formatted from './CM_LABEL_Formatted';
import ImgseqoptIntroLoop from './CM_ANIM_IntroLoop';

const WD_ANIM_Sensing = ({
    introImages = [],
    introDuration = 1000,
    loopImages = [],
    loopDuration = 2000,
    descriptionArr = [],
    togglePeriod = 2000,
    isFocused = true,
    onKey,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentDescription = descriptionArr[currentIndex]?.text || "";

    // Standardized Key handler
    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            const keyMap = {
                'Enter': 'OK',
                'Escape': 'BACK',
                'ArrowLeft': 'LEFT',
                'ArrowRight': 'RIGHT',
                'ArrowUp': 'UP',
                'ArrowDown': 'DOWN'
            };
            const action = keyMap[e.key];
            if (action) {
                e.preventDefault();
                onKey?.(action, action === 'OK' ? { currentDescription } : undefined);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, onKey, currentDescription]);

    useEffect(() => {
        if (descriptionArr.length > 1) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % descriptionArr.length);
            }, togglePeriod);
            return () => clearInterval(timer);
        }
    }, [descriptionArr, togglePeriod]);

    const lineCount = currentDescription.split('\n').length;
    // LUPAGUI-436: n_lines > 1 ? CLIP : WRAP
    // In CM_LABEL_Formatted, we'll map this to appropriate props if needed.
    // CM_LABEL_Formatted usually handles overflow automatically, but we follow the intent.

    return (
        <div
            id="WD_ANIM_Sensing-container"
            className="absolute w-[310px] h-[240px] bg-black overflow-hidden"
            style={{ left: 0, top: 0 }}
        >
            <div id="WD_ANIM_Sensing-imgseq-wrapper" className="absolute inset-0">
                <ImgseqoptIntroLoop
                    id="WD_ANIM_Sensing-imgseq"
                    introImages={introImages}
                    introDuration={introDuration}
                    loopImages={loopImages}
                    loopDuration={loopDuration}
                />
            </div>

            <div
                id="WD_ANIM_Sensing-label-wrapper"
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
                <CM_LABEL_Formatted
                    key={currentDescription}
                    id="WD_ANIM_Sensing-fmtlabel"
                    format={currentDescription}
                    style={{
                        color: '#FFFFFF',
                        fontSize: 32,
                        fontFamily: 'LGSBD',
                        textAlign: 'center'
                    }}
                    maxArea={{ width: 190, height: 109 }}
                    multiline={lineCount > 1}
                />
            </div>
        </div>
    );
};

WD_ANIM_Sensing.propTypes = {
    /** 인트로(진입형) 애니메이션용 이미지 배열 */
    introImages: PropTypes.arrayOf(PropTypes.string),
    /** 인트로 애니메이션 총 재생 시간 (ms) */
    introDuration: PropTypes.number,
    /** 반복 재생될 본문 애니메이션용 이미지 배열 */
    loopImages: PropTypes.arrayOf(PropTypes.string),
    /** 본문 애니메이션 한 루프당 재생 시간 (ms) */
    loopDuration: PropTypes.number,
    /** 순환 표시될 안내 문구 배열 */
    descriptionArr: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string
    })),
    /** 안내 문구 전환 주기 (ms) */
    togglePeriod: PropTypes.number,
    /** 현재 포커스 상태 여부 */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 */
    onKey: PropTypes.func,
};

export default WD_ANIM_Sensing;


