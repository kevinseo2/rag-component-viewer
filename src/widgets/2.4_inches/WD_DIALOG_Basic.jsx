import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Smart from './CM_LABEL_Smart';
import CM_LABEL_Formatted from './CM_LABEL_Formatted';
import CM_ANIM_SequencePlayer from './CM_ANIM_SequencePlayer';

/**
 * WD_DIALOG_Basic Widget Component
 * Reproduces lv_WD_DIALOG_Basic.c logic for layout and style updates.
 */
const WD_DIALOG_Basic = ({
    id,
    titleText = "",
    descriptionText = "",
    descriptionSize = 25,
    descriptionTextType = "normal",
    iconType = "none", // "none", "normal", "animList"
    iconSource = null,
    animationPlaylist = [],
    style = {},
    className = "",
    isFocused = true,
    onKey,
}) => {
    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            const keyMap = {
                'Enter': 'OK',
                'Escape': 'BACK',
                'ArrowLeft': 'LEFT',
                'ArrowRight': 'RIGHT',
                'ArrowUp': 'UP',
                'ArrowDown': 'DOWN'
            };

            const action = keyMap[e.key];
            if (action) {
                e.preventDefault();
                onKey?.(action, action === 'OK' ? { titleText, descriptionText } : undefined);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, onKey, titleText, descriptionText]);

    const hasTitle = titleText && titleText.length > 0;
    const isNoneIcon = iconType === "none";
    const titleLineCount = titleText.split('\n').length;
    const descLineCount = descriptionText.split('\n').length;

    // Calculate Description Max Height based on C code logic (lines 138-194)
    const descMaxHeight = useMemo(() => {
        if (descriptionSize === 30) {
            return isNoneIcon ? 240 : 143;
        } else if (descriptionSize === 28) {
            return !hasTitle ? 124 : 31;
        } else {
            // Size 25
            if (isNoneIcon) {
                return hasTitle ? 204 : 240;
            } else {
                if (!hasTitle) return 178;
                return titleLineCount > 1 ? 106 : 144;
            }
        }
    }, [descriptionSize, isNoneIcon, hasTitle, titleLineCount]);

    // Determine Title Style (Top vs Middle)
    const showTitleTop = isNoneIcon && hasTitle;
    const showTitleMiddle = !isNoneIcon && hasTitle;

    return (
        <div
            id={id}
            className={`relative w-[310px] h-[240px] bg-black overflow-hidden flex flex-col ${className}`}
            style={style}
        >
            {/* Title Top (lines 76-84) */}
            {showTitleTop && (
                <div id="label_title_top" className="absolute top-0 w-full flex justify-center pt-0">
                    <span className="text-[30px] font-semibold text-white text-center leading-tight">
                        {titleText}
                    </span>
                </div>
            )}

            {/* Main Container (lines 256-266) */}
            <div
                id="container"
                className={`flex flex-col items-center justify-center w-full transition-all duration-300 ${showTitleTop ? 'mt-[36px] h-[204px]' : 'h-full'
                    }`}
            >
                {/* Icon / Animation (lines 113-126) */}
                {!isNoneIcon && (
                    <div id="WD_DIALOG_Basic-icon-container" className="w-full flex items-center justify-center mb-1 flex-shrink-0">
                        {iconType === "normal" && iconSource && (
                            <img id="image_icon" src={iconSource} alt="icon" className="max-w-full max-h-full" />
                        )}
                        {iconType === "animList" && (
                            <CM_ANIM_SequencePlayer id="imgopt_list_player" playlist={animationPlaylist} />
                        )}
                    </div>
                )}

                {/* Title Middle (lines 85-107) */}
                {showTitleMiddle && (
                    <CM_LABEL_Smart
                        key={titleText}
                        id="next_label_lite_title_middle"
                        text={titleText}
                        align="center"
                        multiline={titleLineCount > 1}
                        isFocused={true}
                        maxArea={{ width: 300, height: titleLineCount > 1 ? 72 : 34 }}
                        style={{
                            fontSize: 30,
                            fontWeight: '600',
                            color: '#FFFFFF',
                            textAlign: 'center',
                        }}
                        className="mb-1"
                    />
                )}

                {/* Description (lines 130-213) */}
                <CM_LABEL_Formatted
                    key={descriptionText}
                    id="next_fmtlabel_desc"
                    format={descriptionText}
                    align="center"
                    multiline={descriptionSize === 28 && hasTitle ? false : true}
                    isFocused={true}
                    maxArea={{ width: 300, height: descMaxHeight }}
                    style={{
                        fontSize: descriptionSize,
                        fontWeight: descriptionSize === 28 && descriptionTextType === "regular" ? '400' : '600',
                        color: '#FFFFFF',
                        textAlign: 'center',
                    }}
                />
            </div>
        </div>
    );
};

WD_DIALOG_Basic.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 다이얼로그 상단 타이틀 텍스트 */
    titleText: PropTypes.string,
    /** 다이얼로그 중앙/하단 상세 설명 텍스트 */
    descriptionText: PropTypes.string,
    /** 상세 설명 텍스트 크기 (px) */
    descriptionSize: PropTypes.number,
    /** 상세 설명 텍스트 스타일 타입 ('normal', 'small' 등) */
    descriptionTextType: PropTypes.string,
    /** 표시할 아이콘/애니메이션 타입 ('none': 없음, 'normal': 정지 이미지, 'animList': 플레이리스트 애니메이션, 'warning'/'info' 등의 프리셋 대응 가능) */
    iconType: PropTypes.oneOf(["none", "normal", "animList", "warning", "info", "check", "loading", "image"]),
    /** 정지 이미지 아이콘일 경우의 소스 경로 */
    iconSource: PropTypes.string,
    /** 'animList' 타입일 경우 재생할 애니메이션 목록 */
    animationPlaylist: PropTypes.arrayOf(PropTypes.shape({
        src: PropTypes.string.isRequired,
        duration: PropTypes.number
    })),
    /** 커스텀 스타일 객체 */
    style: PropTypes.object,
    /** 추가 CSS 클래스명 */
    className: PropTypes.string,
    /** 현재 포커스 여부 (키 이벤트 수신 제어) */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 */
    onKey: PropTypes.func
};

export default WD_DIALOG_Basic;

