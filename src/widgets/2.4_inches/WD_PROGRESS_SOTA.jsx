import React from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Smart from './CM_LABEL_Smart';

const ProgressIcon = ({ progress, theme }) => {
    const frameIndex = Math.floor(Math.min(100, Math.max(0, progress)) / 2);
    const frameStr = String(frameIndex).padStart(2, '0');
    const folder = theme === 'orange' ? 'dryer/loading_upgrade_orange/.orig_images' : 'washer/loading_upgrade_blue/.orig_images';
    const prefix = theme === 'orange' ? 'img_loading_upgrade_orange' : 'loading_upgrade_blue';
    const imagePath = `/ui/image_sequences/${folder}/${prefix}_${frameStr}.png`;

    return (
        <img
            src={imagePath}
            className="w-8 h-8 object-contain"
            alt="Progress"
        />
    );
};

ProgressIcon.propTypes = {
    progress: PropTypes.number,
    theme: PropTypes.string
};

const WD_PROGRESS_SOTA = ({
    id = "WD_PROGRESS_SOTA",
    title = "Upgrading",
    progress = 0,
    theme = "blue",
    isFocused = true,
    onKey
}) => {
    React.useEffect(() => {
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
                onKey?.(action, { title, progress, theme });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, onKey, title, progress, theme]);

    return (
        <div id={id} className="w-[310px] h-[240px] flex items-start justify-center">
            <div
                id={`${id}-container`}
                className="mt-[22px] h-9 flex items-center px-[10px] rounded-[18px]"
                style={{ backgroundColor: '#3b3b3b' }}
            >
                <ProgressIcon progress={progress} theme={theme} />
                <CM_LABEL_Smart
                    id={`${id}-next_label`}
                    key={title}
                    text={title}
                    maxArea={{ width: 162, height: 30 }}
                    style={{
                        fontFamily: 'LGSBD23',
                        fontSize: '26px',
                        color: '#FFFFFF',
                        paddingLeft: '15px',
                        paddingRight: '15px',
                        backgroundColor: '#3b3b3b'
                    }}
                />
            </div>
        </div>
    );
};

WD_PROGRESS_SOTA.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 상단 진행 상태 타이틀 */
    title: PropTypes.string,
    /** 업그레이드 진행률 (0-100) */
    progress: PropTypes.number,
    /** 테마 모드 ('blue': 세탁기, 'orange': 건조기) */
    theme: PropTypes.oneOf(['blue', 'orange']),
    /** 현재 포커스 상태 여부 */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 */
    onKey: PropTypes.func,
};

export default WD_PROGRESS_SOTA;

