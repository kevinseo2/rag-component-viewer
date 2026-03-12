import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const CM_DIALOG_TextOnly = ({
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

    return (
        <div id={id} className="relative w-[320px] h-[240px] bg-black overflow-hidden font-sans">
            <div
                className="absolute w-[310px] flex flex-col items-center justify-center p-0"
                style={{ top: '47px', left: '5px', height: '145px' }}
            >
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

CM_DIALOG_TextOnly.propTypes = {
    /** 다이얼로그의 고유 식별자 (HTML id 속성) */
    id: PropTypes.string,

    /** 
     * 다이얼로그에 표시될 설명 텍스트
     * - 25px 크기의 흰색 볼드체로 중앙 정렬
     * - 화면 중앙 (y=47px, height=145px 영역)에 배치
     * - 줄바꿈 문자('\n')를 포함하여 여러 줄로 표시 가능
     * - 타이틀 없이 설명만 표시되는 간단한 다이얼로그
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

export default CM_DIALOG_TextOnly;

