import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CM_TITLE_WithArrow from './CM_TITLE_WithArrow';

const CM_CTRL_SliderDiscrete = ({
    id,
    title = "Speed",
    level: initialLevel = 3,
    maxLevels = 5,
    isFocused = true,
    onKey = () => { }
}) => {
    const [level, setLevel] = useState(initialLevel);

    useEffect(() => {
        setLevel(initialLevel);
    }, [initialLevel]);

    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            let handled = false;
            if (e.key === 'ArrowLeft') {
                if (level > 0) {
                    const newLevel = level - 1;
                    setLevel(newLevel);
                    onKey('LEFT', { level: newLevel });
                    handled = true;
                }
            } else if (e.key === 'ArrowRight') {
                if (level < maxLevels) {
                    const newLevel = level + 1;
                    setLevel(newLevel);
                    onKey('RIGHT', { level: newLevel });
                    handled = true;
                }
            } else if (e.key === 'Enter') {
                onKey('OK', { level });
                handled = true;
            } else if (e.key === 'Escape' || e.key === 'Backspace') {
                onKey('BACK');
                handled = true;
            }

            if (handled) e.preventDefault();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, level, maxLevels, onKey]);

    return (
        <div id={id} className="relative w-[320px] h-[240px] bg-black overflow-hidden font-sans">
            <CM_TITLE_WithArrow title={title} />

            <div
                className="absolute text-white text-center flex items-center justify-center font-semibold"
                style={{
                    left: '0',
                    top: '74px',
                    width: '320px',
                    fontSize: '42px',
                    fontFamily: 'LG_Smart_UI_HA2023_SemiBold'
                }}
            >
                {`Value ${level}`}
            </div>

            {/* Segments Container */}
            <div
                className="absolute"
                style={{
                    left: '38px',
                    top: '150px',
                    width: '250px',
                    height: '20px'
                }}
            >
                {[...Array(maxLevels)].map((_, i) => {
                    const isActive = level > i;
                    return (
                        <div
                            key={i}
                            className="absolute"
                            style={{
                                left: `${i * 50}px`,
                                top: '0px',
                                width: '44px',
                                height: '5px'
                            }}
                        >
                            <img
                                src={isActive ? "/ui/images/img_discrete_slider_bar_5_primary.png" : "/ui/images/img_discrete_slider_bar_5_track.png"}
                                alt={`Segment ${i + 1}`}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Thumb */}
            <img
                src="/ui/images/img_slider_thumb.png"
                alt="CM_CTRL_Slider Thumb"
                className="absolute transition-all duration-200"
                style={{
                    left: `${19 + level * 50}px`,
                    top: '137px',
                    width: '32px',
                    height: '32px',
                    pointerEvents: 'none'
                }}
            />
        </div>
    );
};

CM_CTRL_SliderDiscrete.propTypes = {
    /** 컴포넌트 ID */
    id: PropTypes.string,

    /** 상단 타이틀 텍스트 (예: 'Speed', 'Level') */
    title: PropTypes.string,

    /** 
     * 현재 레벨 (0~maxLevels)
     * - 각 레벨은 이산적(discrete)이며 세그먼트로 시각화됨
     * - 레벨 3은 3개의 활성 세그먼트를 의미
     */
    level: PropTypes.number,

    /** 
     * 최대 레벨 수
     * - 표시될 세그먼트의 총 개수
     * - 기본값: 5 (5개 세그먼트)
     */
    maxLevels: PropTypes.number,

    /** 키보드 입력 활성화 여부 */
    isFocused: PropTypes.bool,

    /** 
     * 키보드 입력 처리 콜백
     * - 'LEFT': 레벨 감소 (payload: { level })
     * - 'RIGHT': 레벨 증가 (payload: { level })
     * - 'OK': Enter 키 (payload: { level })
     * - 'BACK': Escape/Backspace 키
     */
    onKey: PropTypes.func
};

export default CM_CTRL_SliderDiscrete;


