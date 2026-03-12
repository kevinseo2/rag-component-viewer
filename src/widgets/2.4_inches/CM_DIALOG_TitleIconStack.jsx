import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * CM_DIALOG_TitleIconStack - Dialogue widget with centered icon and title
 * Displays an icon, optional title, and description text.
 */
const CM_DIALOG_TitleIconStack = ({
    id = "CM_DIALOG_TitleIconStack",
    title = "Title",
    description = "Description Description",
    iconSrc = "/ui/images/img_info.png",
    isFocused = true,
    onKey = () => { }
}) => {
    // Keyboard Handler
    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            let handled = false;
            if (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'ArrowLeft') {
                onKey('BACK');
                handled = true;
            }
            if (handled) e.preventDefault();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, onKey]);

    return (
        <div id={id} className="relative w-[320px] h-[240px] bg-black overflow-hidden font-sans">
            <div
                id={`${id}-content`}
                className="w-full h-full flex flex-col items-center justify-center"
                style={{ gap: '0px' }}
            >
                <img
                    id={`${id}-icon`}
                    src={iconSrc}
                    alt="icon"
                    className="w-[62px] h-[62px]"
                />

                {title && (
                    <div
                        id={`${id}-title`}
                        className="text-center text-white whitespace-pre-wrap leading-tight"
                        style={{ fontSize: '30px', fontFamily: 'LGSBD' }}
                    >
                        {title}
                    </div>
                )}

                <div
                    id={`${id}-description`}
                    className="text-center text-white whitespace-pre-wrap leading-tight"
                    style={{ fontSize: '25px', fontFamily: 'LGSBD', paddingTop: '6px' }}
                >
                    {description}
                </div>
            </div>
        </div>
    );
};

CM_DIALOG_TitleIconStack.propTypes = {
    /** 다이얼로그의 고유 식별자 (HTML id 속성) */
    id: PropTypes.string,

    /** 타이틀 텍스트 (아이콘 아래, 선택사항, 30px) */
    title: PropTypes.string,

    /** 설명 텍스트 (타이틀 아래 6px 간격, 25px) */
    description: PropTypes.string,

    /** 
     * 아이콘 이미지 경로
     * - 62x62px 크기로 중앙 상단에 표시
     * - 예: '/ui/images/img_info.png'
     */
    iconSrc: PropTypes.string,

    /** 키보드 입력 활성화 여부 */
    isFocused: PropTypes.bool,

    /** 키보드 입력 처리 콜백 ('BACK' 액션만 처리) */
    onKey: PropTypes.func
};

export default CM_DIALOG_TitleIconStack;

