import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CM_DIALOG_TextButtons = ({
    desc = "Description Description",
    button1Text = "Button 1",
    button2Text = "Button 2",
    buttonHeight = 40,
    onKey,
}) => {
    const [focusedIndex, setFocusedIndex] = useState(1); // Default focus on Button 2 (Primary usually)

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                setFocusedIndex(0);
            } else if (e.key === 'ArrowRight') {
                setFocusedIndex(1);
            } else if (e.key === 'Enter') {
                onKey?.('OK', { index: focusedIndex, label: focusedIndex === 0 ? button1Text : button2Text });
            } else if (e.key === 'Escape' || e.key === 'Backspace') {
                onKey?.('BACK');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focusedIndex, onKey, button1Text, button2Text]);

    return (
        <div id="screen_CM_Confirmation_Button" className="relative w-[320px] h-[240px] bg-black overflow-hidden flex flex-col justify-center items-center">
            {/* Description Container */}
            <div id="container-desc" className="w-[310px] flex justify-center items-center text-center">
                <span
                    id="label_CM_Desc"
                    className="text-white font-semibold text-[25px] whitespace-pre-wrap leading-[30px] font-sans"
                >
                    {desc}
                </span>
            </div>

            {/* Button Row (Reset to logical row alignment) */}
            <div
                id="container_CM_Confirm"
                className="w-[320px] flex flex-row items-center justify-center pt-[18px] gap-[12px]"
                style={{ backgroundColor: 'transparent' }}
            >
                {/* Button 1 */}
                <div
                    id="container_CM_Confirm1"
                    className="flex items-center justify-center rounded-[24px] transition-colors duration-200"
                    style={{
                        width: 'auto',
                        minWidth: '132px',
                        height: `${buttonHeight}px`,
                        backgroundColor: focusedIndex === 0 ? '#FFFFFF' : '#000000'
                    }}
                >
                    <span
                        id="label_CM_CF_Button1"
                        className="font-semibold text-[22px] px-[26px] text-center whitespace-pre-wrap leading-tight"
                        style={{ color: focusedIndex === 0 ? '#000000' : '#FFFFFF' }}
                    >
                        {button1Text}
                    </span>
                </div>

                {/* Button 2 */}
                <div
                    id="container_CM_Confirm2"
                    className="flex items-center justify-center rounded-[24px] transition-colors duration-200"
                    style={{
                        width: 'auto',
                        minWidth: '132px',
                        height: `${buttonHeight}px`,
                        backgroundColor: focusedIndex === 1 ? '#FFFFFF' : '#3A3B43'
                    }}
                >
                    <span
                        id="label_CM_CF_Button2"
                        className="font-semibold text-[22px] px-[20px] text-center whitespace-pre-wrap leading-tight"
                        style={{ color: focusedIndex === 1 ? '#000000' : '#FFFFFF' }}
                    >
                        {button2Text}
                    </span>
                </div>
            </div>
        </div>
    );
};

CM_DIALOG_TextButtons.propTypes = {
    /** 
     * 버튼 위에 표시될 설명 텍스트
     * - 사용자에게 확인을 요청하는 메시지나 안내 문구
     * - 25px 크기의 흰색 볼드체로 중앙 정렬
     * - 줄바꿈 문자('\n')를 포함하여 여러 줄로 표시 가능
     */
    desc: PropTypes.string,

    /** 
     * 왼쪽 버튼(버튼1)에 표시될 텍스트
     * - 일반적으로 부정적 액션 (예: '취소', '아니오')
     * - 줄바꿈 문자('\n')를 포함하여 여러 줄로 표시 가능
     * - 22px 크기의 텍스트로 표시됨
     */
    button1Text: PropTypes.string,

    /** 
     * 오른쪽 버튼(버튼2)에 표시될 텍스트
     * - 일반적으로 긍정적 액션 (예: '확인', '예')
     * - 기본 포커스 대상 (focusedIndex 초기값 = 1)
     * - 줄바꿈 문자('\n')를 포함하여 여러 줄로 표시 가능
     * - 22px 크기의 텍스트로 표시됨
     */
    button2Text: PropTypes.string,

    /** 
     * 버튼의 높이 (픽셀 단위)
     * - 기본값: 40px (1줄 텍스트용)
     * - 여러 줄 버튼: 66px (2줄 텍스트용)
     * - 버튼의 텍스트 줄 수에 따라 조절 필요
     */
    buttonHeight: PropTypes.number,

    /** 
     * 키보드 입력 및 버튼 선택 처리 콜백 함수
     * 
     * 호출 시나리오:
     * - 'OK' 액션: Enter 키를 누르면 현재 포커스된 버튼 정보와 함께 호출
     *   payload: { index: 0 또는 1, label: button1Text 또는 button2Text }
     * - 'BACK' 액션: Escape 또는 Backspace 키를 누르면 호출
     * 
     * @param {string} action - 액션 이름 ('OK' 또는 'BACK')
     * @param {object} payload - 액션 관련 데이터
     * @param {number} payload.index - 선택된 버튼 인덱스 (0: 버튼1, 1: 버튼2)
     * @param {string} payload.label - 선택된 버튼의 텍스트
     */
    onKey: PropTypes.func,
};

export default CM_DIALOG_TextButtons;

