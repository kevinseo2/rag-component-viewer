import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const CM_DIALOG_IconTitleDesc = ({
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
            <div
                className="w-full h-full flex flex-col items-center justify-center"
                style={{ gap: '0px' }}
            >
                <img
                    src="/ui/images/img_info.png"
                    alt="icon"
                    className="w-[62px] h-[62px]"
                />

                {title && (
                    <div
                        className="text-center text-white whitespace-pre-wrap leading-tight"
                        style={{ fontSize: '30px', fontFamily: 'LGSBD' }}
                    >
                        {title}
                    </div>
                )}

                <div
                    className="text-center text-white whitespace-pre-wrap leading-tight"
                    style={{ fontSize: '25px', fontFamily: 'LGSBD', paddingTop: '6px' }}
                >
                    {description}
                </div>
            </div>
        </div>
    );
};

CM_DIALOG_IconTitleDesc.propTypes = {
    /** 다이얼로그의 고유 식별자 (HTML id 속성) */
    id: PropTypes.string,

    /** 
     * 타이틀 텍스트 (선택사항)
     * - 아이콘 아래, 설명 위에 표시
     * - 30px 크기의 흰색 볼드체로 중앙 정렬
     */
    title: PropTypes.string,

    /** 
     * 설명 텍스트
     * - 타이틀 아래 6px 간격으로 표시
     * - 25px 크기의 흰색 볼드체로 중앙 정렬
     */
    description: PropTypes.string,

    /** 키보드 입력 활성화 여부 */
    isFocused: PropTypes.bool,

    /** 키보드 입력 처리 콜백 ('BACK', 'OK') */
    onKey: PropTypes.func
};

export default CM_DIALOG_IconTitleDesc;

