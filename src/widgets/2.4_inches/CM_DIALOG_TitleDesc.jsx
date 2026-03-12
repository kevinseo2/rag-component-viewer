import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const CM_DIALOG_TitleDesc = ({
    id,
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
            {/* Title Label */}
            <div
                className="absolute text-white text-center flex items-center justify-center"
                style={{
                    left: '0px',
                    top: '0px',
                    width: '320px',
                    height: '36px',
                    fontSize: '25px',
                    fontFamily: 'LGSBD'
                }}
            >
                {title}
            </div>

            {/* Description Container */}
            <div
                className="absolute flex items-center justify-center"
                style={{
                    left: '5px',
                    top: '80px',
                    width: '310px',
                    height: '116px'
                }}
            >
                <div
                    className="text-white text-center"
                    style={{
                        fontSize: '25px',
                        whiteSpace: 'pre-line',
                        lineHeight: '1.3',
                        fontFamily: 'LGSBD'
                    }}
                >
                    {description}
                </div>
            </div>
        </div>
    );
};

CM_DIALOG_TitleDesc.propTypes = {
    /** 다이얼로그의 고유 식별자 (HTML id 속성) */
    id: PropTypes.string,

    /** 
     * 화면 상단에 표시될 타이틀 텍스트
     * - 25px 크기의 흰색 볼드체로 중앙 정렬
     * - 화면 상단 (y=0, height=36px)에 배치
     */
    title: PropTypes.string,

    /** 
     * 다이얼로그 본문 설명 텍스트
     * - 25px 크기의 흰색 볼드체로 중앙 정렬
     * - 타이틀 아래 (y=80px, height=116px 영역)에 배치
     * - 줄바꿈 문자('\n')를 포함하여 여러 줄로 표시 가능
     */
    description: PropTypes.string,

    /** 
     * 키보드 입력 활성화 여부
     * - true: 이 위젯이 키보드 이벤트를 수신함
     * - false: 키보드 이벤트를 무시함
     */
    isFocused: PropTypes.bool,

    /** 
     * 키보드 입력 처리 콜백 함수
     * - 'BACK' 액션: Escape, Backspace, ArrowLeft 키를 누를 때
     * - 'OK' 액션: Enter 키를 누를 때
     * @param {string} action - 액션 이름 ('BACK' 또는 'OK')
     */
    onKey: PropTypes.func
};

export default CM_DIALOG_TitleDesc;

