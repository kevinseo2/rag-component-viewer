import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import CM_CTRL_Button from './CM_CTRL_Button';
import CM_TITLE_WithArrow from './CM_TITLE_WithArrow';

const CM_DIALOG_ScrollDesc = ({
    id,
    title = "Title",
    description = "Description Description",
    buttonCount = 2,
    btn1Text = "Button",
    btn2Text = "Button",
    isFocused = true,
    onKey = () => { }
}) => {
    const [focusedBtn, setFocusedBtn] = useState(0);
    const scrollRef = useRef(null);

    // Keyboard Handler
    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            let handled = false;
            if (e.key === 'ArrowLeft') {
                if (buttonCount === 2) {
                    setFocusedBtn(0);
                    onKey('LEFT', { index: 0 });
                    handled = true;
                }
            } else if (e.key === 'ArrowRight') {
                if (buttonCount === 2) {
                    setFocusedBtn(1);
                    onKey('RIGHT', { index: 1 });
                    handled = true;
                }
            } else if (e.key === 'ArrowUp') {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop -= 20;
                    onKey('UP');
                    handled = true;
                }
            } else if (e.key === 'ArrowDown') {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop += 20;
                    onKey('DOWN');
                    handled = true;
                }
            } else if (e.key === 'Enter') {
                onKey('OK', { index: focusedBtn, label: focusedBtn === 0 ? btn1Text : btn2Text });
                handled = true;
            } else if (e.key === 'Escape' || e.key === 'Backspace') {
                onKey('BACK');
                handled = true;
            }

            if (handled) e.preventDefault();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, buttonCount, focusedBtn, btn1Text, btn2Text, onKey]);

    return (
        <div id={id} className="relative w-[320px] h-[240px] bg-black overflow-hidden font-sans">
            {/* Title Bar */}
            <CM_TITLE_WithArrow
                title={title}
                style={{ zIndex: 20 }}
            />

            {/* Content Container (Scrollable) */}
            <div
                className="absolute w-[320px] flex flex-col items-center"
                style={{ top: '50px', height: '128px' }}
            >
                {/* Scroll Area */}
                <div
                    ref={scrollRef}
                    className="w-[310px] h-full overflow-y-auto no-scrollbar relative flex flex-col items-center"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    <div className="py-[24px] w-full flex flex-col items-center justify-center min-h-full">
                        <div
                            className="w-[310px] text-center text-white whitespace-pre-wrap leading-tight"
                            style={{ fontSize: '25px', fontFamily: 'LGSBD' }}
                        >
                            {description}
                        </div>
                    </div>
                </div>
            </div>

            {/* Masks */}
            <img
                src="/ui/images/mask_contents_area_common_top.png"
                alt="mask-top"
                className="absolute pointer-events-none"
                style={{ left: 0, top: '50px', width: '320px', height: '8px', zIndex: 10 }}
            />
            <img
                src="/ui/images/mask_contents_area_common_bottom.png"
                alt="mask-bottom"
                className="absolute pointer-events-none"
                style={{ left: 0, top: '170px', width: '320px', height: '8px', zIndex: 10 }}
            />

            {/* Button Container */}
            <div
                className="absolute left-0 bottom-0 w-[320px] h-[62px] flex flex-row items-start justify-center bg-black pt-0 gap-[12px]"
            >
                <CM_CTRL_Button
                    text={btn1Text}
                    focused={focusedBtn === 0}
                    width="auto"
                    height={52}
                    borderRadius={26}
                    bgDefault="#3A3B43"
                    bgFocused="#FFFFFF"
                    textDefault="#FFFFFF"
                    textFocused="#000000"
                    style={{ paddingLeft: '27px', paddingRight: '26px' }}
                    textStyle={{ fontSize: '28px' }}
                />

                {buttonCount > 1 && (
                    <CM_CTRL_Button
                        text={btn2Text}
                        focused={focusedBtn === 1}
                        width="auto"
                        height={52}
                        borderRadius={26}
                        bgDefault="#3A3B43"
                        bgFocused="#FFFFFF"
                        textDefault="#FFFFFF"
                        textFocused="#000000"
                        style={{ minWidth: '139px' }}
                        textStyle={{ fontSize: '28px', textAlign: 'center' }}
                    />
                )}
            </div>
        </div>
    );
};

CM_DIALOG_ScrollDesc.propTypes = {
    /** 컴포넌트 ID */
    id: PropTypes.string,

    /** 상단 타이틀 (30px, CM_TITLE_WithArrow 컴포넌트로 표시) */
    title: PropTypes.string,

    /** 
     * 스크롤 가능한 긴 설명 텍스트 (25px)
     * - 상하 화살표 키로 스크롤 제어
     * - 스크롤 영역: 128px (top: 50px~178px)
     */
    description: PropTypes.string,

    /** 버튼 개수 (1 또는 2) */
    buttonCount: PropTypes.number,

    /** 첫 번째 버튼 텍스트 */
    btn1Text: PropTypes.string,

    /** 두 번째 버튼 텍스트 */
    btn2Text: PropTypes.string,

    /** 키보드 입력 활성화 여부 */
    isFocused: PropTypes.bool,

    /** 
     * 키보드 입력 처리 콜백
     * - 'UP'/'DOWN': 설명 텍스트 스크롤
     * - 'LEFT'/'RIGHT': 버튼 포커스 이동
     * - 'OK': 버튼 선택
     * - 'BACK': 취소
     */
    onKey: PropTypes.func
};

export default CM_DIALOG_ScrollDesc;


