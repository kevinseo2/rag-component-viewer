import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * CM_DIALOG_TitleWide - Dialogue widget with integrated title and centered description
 * Features a fixed-height title bar and a large description area.
 */
const CM_DIALOG_TitleWide = ({
    id = "CM_DIALOG_TitleWide",
    title = "Title",
    description = "Description",
    isFocused = true,
    onKey = () => { }
}) => {
    // Keyboard Handler
    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            let handled = false;
            // standard dialogue navigation
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
        <div
            id={id}
            className="relative bg-black overflow-hidden"
            style={{
                width: '320px',
                height: '240px',
                fontFamily: 'LGSBD, sans-serif'
            }}
        >
            {/* Title Bar */}
            <div
                id={`${id}-title-container`}
                className="absolute flex items-center justify-center"
                style={{
                    left: '0px',
                    top: '0px',
                    width: '320px',
                    height: '36px'
                }}
            >
                <div
                    id={`${id}-label-title`}
                    className="text-white text-center leading-tight"
                    style={{
                        fontSize: '30px'
                    }}
                >
                    {title}
                </div>
            </div>

            {/* Description Area */}
            <div
                id={`${id}-description-container`}
                className="absolute flex items-center justify-center"
                style={{
                    left: '5px',
                    top: '36px',
                    width: '310px',
                    height: '204px'
                }}
            >
                <div
                    id={`${id}-label-description`}
                    className="text-white text-center"
                    style={{
                        fontSize: '25px',
                        whiteSpace: 'pre-line',
                        lineHeight: '1.3'
                    }}
                >
                    {description}
                </div>
            </div>
        </div>
    );
};

CM_DIALOG_TitleWide.propTypes = {
    /** 다이얼로그의 고유 식별자 (HTML id 속성) */
    id: PropTypes.string,

    /** 
     * 타이틀 텍스트
     * - 화면 최상단 고정 영역 (height=36px)에 표시
     * - 30px 크기의 흰색 볼드체로 중앙 정렬
     */
    title: PropTypes.string,

    /** 
     * 설명 텍스트
     * - 타이틀 바 아래 넓은 영역 (height=204px)에 표시
     * - 25px 크기, 줄간격 1.3으로 여유있게 표시
     * - 긴 설명을 표시하기에 적합한 레이아웃
     */
    description: PropTypes.string,

    /** 키보드 입력 활성화 여부 */
    isFocused: PropTypes.bool,

    /** 키보드 입력 처리 콜백 ('BACK' 액션만 처리) */
    onKey: PropTypes.func
};

export default CM_DIALOG_TitleWide;

