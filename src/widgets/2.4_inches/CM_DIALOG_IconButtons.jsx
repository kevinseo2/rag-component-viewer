import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CM_CTRL_Button from './CM_CTRL_Button';

const CM_DIALOG_IconButtons = ({
    id,
    description = "Description Description",
    buttonCount = 2,
    btn1Text = "Button",
    btn2Text = "Button",
    isFocused = true,
    onKey = () => { }
}) => {
    const [focusedBtn, setFocusedBtn] = useState(0);

    // Logic: Calculate layout based on description lines
    const lines = description ? description.split('\n').length : 1;
    let contentMarginTop = 20;
    let contentGap = 24;

    if (lines === 2) {
        contentMarginTop = 11;
        contentGap = 19;
    } else if (lines >= 3) {
        contentMarginTop = 9;
        contentGap = 6;
    }

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
            {/* Content Container */}
            <div
                className="absolute left-[5px] w-[310px] flex flex-col items-center justify-center transition-all duration-300"
                style={{ top: `${contentMarginTop}px`, gap: `${contentGap}px` }}
            >
                <img
                    src="/ui/images/img_info.png"
                    alt="info"
                    className="w-[62px] h-[62px]"
                />

                <div
                    className="w-[310px] text-center text-white whitespace-pre-wrap leading-tight"
                    style={{ fontSize: '25px', fontFamily: 'LGSBD' }}
                >
                    {description}
                </div>
            </div>

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

CM_DIALOG_IconButtons.propTypes = {
    /** 컴포넌트 ID */
    id: PropTypes.string,

    /** 
     * 설명 텍스트 (아이콘 아래, 25px)
     * - 줄 수에 따라 레이아웃 자동 조정 (1줄: gap 24px, 2줄: gap 19px, 3줄+: gap 6px)
     */
    description: PropTypes.string,

    /** 
     * 버튼 개수 (1 또는 2)
     * - 1: 단일 버튼만 표시
     * - 2: 좌우 2개 버튼 표시 (좌우 화살표로 포커스 이동 가능)
     */
    buttonCount: PropTypes.number,

    /** 첫 번째(왼쪽) 버튼 텍스트 */
    btn1Text: PropTypes.string,

    /** 두 번째(오른쪽) 버튼 텍스트 (buttonCount=2일 때만 표시) */
    btn2Text: PropTypes.string,

    /** 키보드 입력 활성화 여부 */
    isFocused: PropTypes.bool,

    /** 
     * 키보드 입력 처리 콜백
     * - 'LEFT'/'RIGHT': 버튼 간 포커스 이동
     * - 'OK': 현재 포커스된 버튼 선택
     * - 'BACK': 취소
     */
    onKey: PropTypes.func
};

export default CM_DIALOG_IconButtons;

