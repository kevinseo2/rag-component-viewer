import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * CM_DIALOG_CustomIcon - Dialogue widget with centered icon and title
 * Displays an icon, optional title, and description text.
 */
const CM_DIALOG_CustomIcon = ({
    id = "CM_DIALOG_CustomIcon",
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

CM_DIALOG_CustomIcon.propTypes = {
    /** 다이얼로그의 고유 식별자 (HTML id 속성) */
    id: PropTypes.string,

    /** 
     * 다이얼로그 제목 텍스트
     * - 아이콘 아래에 표시되는 제목 (선택사항)
     * - 30px 크기의 흰색 볼드체로 중앙 정렬
     * - 값이 없으면 제목 영역이 렌더링되지 않음
     */
    title: PropTypes.string,

    /** 
     * 다이얼로그 설명 텍스트
     * - 제목 아래에 표시되는 상세 설명 또는 안내 메시지
     * - 25px 크기의 흰색 볼드체로 중앙 정렬
     * - 제목과 6px 간격으로 배치됨
     */
    description: PropTypes.string,

    /** 
     * 아이콘 이미지 경로
     * - 다이얼로그 상단 중앙에 표시될 아이콘
     * - 62x62px 크기로 렌더링
     * - 예: '/ui/images/img_info.png' (정보 아이콘)
     */
    iconSrc: PropTypes.string,

    /** 
     * 키보드 입력 활성화 여부
     * - true: 이 위젯이 키보드 이벤트를 수신함 (BACK 키 처리 가능)
     * - false: 키보드 이벤트를 무시함
     */
    isFocused: PropTypes.bool,

    /** 
     * 키보드 입력 처리 콜백 함수
     * - 'BACK' 액션: Escape, Backspace, ArrowLeft 키가 눌렸을 때 호출됨
     * @param {string} action - 액션 이름 ('BACK')
     */
    onKey: PropTypes.func
};

export default CM_DIALOG_CustomIcon;

