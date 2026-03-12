import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import CM_TITLE_WithArrow from './CM_TITLE_WithArrow';

const CM_DIALOG_DescOnly = ({
    id,
    title = "Title",
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

    return (
        <div id={id} className="relative w-[320px] h-[240px] bg-black overflow-hidden font-sans">
            {/* Title Bar */}
            <CM_TITLE_WithArrow
                title={title}
                style={{ zIndex: 20 }}
            />

            {/* Content Container */}
            <div
                className="absolute w-[320px] flex flex-col items-center justify-center"
                style={{ top: '50px', height: '190px' }}
            >
                <div
                    className="w-[310px] text-center text-white whitespace-pre-wrap leading-tight"
                    style={{ fontSize: '25px', fontFamily: 'LGSBD' }}
                >
                    {description}
                </div>
            </div>
        </div>
    );
};

CM_DIALOG_DescOnly.propTypes = {
    /** 컴포넌트 ID */
    id: PropTypes.string,

    /** 상단 타이틀 (30px, CM_TITLE_WithArrow 포함) */
    title: PropTypes.string,

    /** 
     * 설명 텍스트 (25px)
     * - 타이틀 아래 중앙 영역 (height: 190px)에 표시
     * - 버튼 없이 설명만 표시
     */
    description: PropTypes.string,

    /** 키보드 입력 활성화 여부 */
    isFocused: PropTypes.bool,

    /** 키보드 입력 처리 콜백 ('BACK', 'OK') */
    onKey: PropTypes.func
};

export default CM_DIALOG_DescOnly;


