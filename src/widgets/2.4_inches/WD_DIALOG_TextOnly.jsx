import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Smart from './CM_LABEL_Smart';

/**
 * WD_DIALOG_TextOnly
 * A simple text-only dialogue widget.
 */
const WD_DIALOG_TextOnly = ({
    id = "WD_DIALOG_TextOnly",
    text = "",
    isFocused = true,
    onKey,
    style = {}
}) => {
    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                onKey?.('OK');
            } else if (e.key === 'Escape') {
                onKey?.('BACK');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, onKey]);

    return (
        <div
            id={id}
            className="w-[320px] h-[240px] bg-black relative"
            style={style}
        >
            <div
                id={`${id}-container`}
                className="absolute left-[5px] top-[47px] w-[310px] h-[145px] flex items-center justify-center p-2"
            >
                <CM_LABEL_Smart
                    id={`${id}-label`}
                    key={text}
                    text={text}
                    maxArea={{ width: 310, height: 145 }}
                    style={{ fontSize: 25, fontFamily: "LGSBD", color: "#ffffff", lineHeight: "1.1" }}
                    align="center"
                    multiline={true}
                />
            </div>
        </div>
    );
};

WD_DIALOG_TextOnly.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 다이얼로그에 표시될 안내 텍스트 */
    text: PropTypes.string,
    /** 현재 포커스 상태 여부 */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 */
    onKey: PropTypes.func,
    /** 커스텀 스타일 객체 */
    style: PropTypes.object
};

export default WD_DIALOG_TextOnly;

