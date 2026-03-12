import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const CM_DIALOG_Icon = ({
    id,
    description = "Description Description",
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
            } else if (e.key === 'Enter') {
                onKey('OK');
                handled = true;
            }

            if (handled) e.preventDefault();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, onKey]);

    const lines = description ? description.split('\n').length : 1;
    const gap = lines > 2 ? '6px' : '16px';

    return (
        <div id={id} className="relative w-[320px] h-[240px] bg-black overflow-hidden font-sans">
            <div
                className="w-full h-full flex flex-col items-center justify-center p-0"
                style={{ gap: gap }}
            >
                <img
                    src="/ui/images/img_info.png"
                    alt="icon"
                    className="w-[62px] h-[62px]"
                />

                <div
                    className="text-center text-white whitespace-pre-wrap leading-tight"
                    style={{ fontSize: '25px', fontFamily: 'LGSBD' }}
                >
                    {description}
                </div>
            </div>
        </div>
    );
};

CM_DIALOG_Icon.propTypes = {
    /** 다이얼로그의 고유 식별자 (HTML id 속성) */
    id: PropTypes.string,

    /** 
     * 다이얼로그 설명 텍스트
     * - 아이콘 아래에 표시됨
     * - 25px 크기의 흰색 볼드체로 중앙 정렬
     * - 줄바꿈에 따라 아이콘과의 간격 자동 조절 (2줄 이하: 16px, 3줄 이상: 6px)
     */
    description: PropTypes.string,

    /** 키보드 입력 활성화 여부 */
    isFocused: PropTypes.bool,

    /** 
     * 키보드 입력 처리 콜백
     * - 'BACK': Escape/Backspace/ArrowLeft
     * - 'OK': Enter
     */
    onKey: PropTypes.func
};

export default CM_DIALOG_Icon;

