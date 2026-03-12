import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Smart from './CM_LABEL_Smart';
import CM_LABEL_Formatted from './CM_LABEL_Formatted';

const LoadingSpinner = ({ theme }) => {
    const [frameIndex, setFrameIndex] = useState(0);
    const totalFrames = 50;
    const duration = 1000;
    const frameInterval = duration / totalFrames;

    useEffect(() => {
        const timer = setInterval(() => {
            setFrameIndex(prev => (prev + 1) % totalFrames);
        }, frameInterval);
        return () => clearInterval(timer);
    }, [frameInterval]);

    const frameStr = String(frameIndex).padStart(2, '0');
    const folder = theme === 'orange' ? 'dryer/img_loading/.orig_images' : 'washer/img_loading/.orig_images';
    const imagePath = `/ui/image_sequences/${folder}/img_loading_${frameStr}.png`;

    return (
        <img src={imagePath} className="w-[62px] h-[62px] object-contain" alt="Loading" />
    );
};

LoadingSpinner.propTypes = {
    theme: PropTypes.string
};

const WD_PROGRESS_ValveCheck = ({
    id = "WD_PROGRESS_ValveCheck",
    percent = 0,
    description = "",
    theme = "blue",
    isFocused = true,
    onKey
}) => {
    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            const keyMap = { 'Enter': 'OK', 'Escape': 'BACK', 'ArrowUp': 'UP', 'ArrowDown': 'DOWN', 'ArrowLeft': 'LEFT', 'ArrowRight': 'RIGHT' };
            const action = keyMap[e.key];
            if (action) {
                e.preventDefault();
                onKey?.(action, { percent, description, theme });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, onKey, percent, description, theme]);

    return (
        <div id={id} className="w-[310px] h-[240px] bg-black flex flex-col items-center">
            <div id={`${id}-spinner-container`} className="mt-[15px]">
                <LoadingSpinner theme={theme} />
            </div>
            <div id={`${id}-percent-container`} className="mt-[3px]">
                <CM_LABEL_Formatted
                    id={`${id}-fmtlabel`}
                    key={String(percent)}
                    format="{0}%"
                    slots={[{ type: 'string', value: String(percent) }]}
                    maxArea={{ width: 100, height: 40 }}
                    style={{ fontFamily: 'LGSBD23', fontSize: '28px', color: '#FFFFFF' }}
                />
            </div>
            <div id={`${id}-container`} className="w-[310px] h-[125px] mt-[3px] flex items-center justify-center bg-transparent">
                <div id={`${id}-label-wrapper`} className="w-[300px]">
                    <CM_LABEL_Smart
                        id={`${id}-next_label`}
                        key={description}
                        text={description}
                        multiline={description?.includes('\n')}
                        maxArea={{ width: 300, height: 125 }}
                        align="center"
                        style={{ fontFamily: 'LGSBD23', fontSize: '25px', color: '#FFFFFF' }}
                    />
                </div>
            </div>
        </div>
    );
};

WD_PROGRESS_ValveCheck.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 체크 진행률 퍼센트 (0-100) */
    percent: PropTypes.number,
    /** 하단 안내 문구 텍스트 */
    description: PropTypes.string,
    /** 테마 모드 ('blue': 세탁기, 'orange': 건조기) */
    theme: PropTypes.oneOf(['blue', 'orange']),
    /** 현재 포커스 상태 여부 */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 */
    onKey: PropTypes.func,
};

export default WD_PROGRESS_ValveCheck;

