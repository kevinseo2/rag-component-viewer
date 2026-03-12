import React from 'react';
import PropTypes from 'prop-types';

/**
 * OV_TITLE_2Line
 * Standard 2-line title template for the oven interface.
 * Matches C-spec: height 68px, initial y: -3px, line-2 offset: 29px.
 */
const OV_TITLE_2Line = ({
    id = "OV_TITLE_2Line",
    title = "",
    subtitle = "",
    hideSubtitle = true,
    style = {}
}) => {
    return (
        <div
            id={id}
            className="absolute top-[-3px] left-0 w-full h-[68px] overflow-hidden pointer-events-none z-50 transition-all duration-300"
            style={style}
        >
            {/* Title Line 1 (label @ y:0) */}
            <div
                id={`${id}-title`}
                className="absolute top-0 left-0 w-full h-[39px] flex items-center justify-center text-[30px] font-['LGSBD'] text-white"
            >
                {title}
            </div>

            {/* Title Line 2 (label_1 @ y:29) */}
            {!hideSubtitle && (
                <div
                    id={`${id}-subtitle`}
                    className="absolute top-[29px] left-0 w-full h-[39px] flex items-center justify-center text-[30px] font-['LGSBD'] text-white"
                >
                    {subtitle}
                </div>
            )}
        </div>
    );
};

OV_TITLE_2Line.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 상단 표시될 메인 타이틀 */
    title: PropTypes.string,
    /** 하단 표시될 서브타이틀 (hideSubtitle이 false일 때 표시) */
    subtitle: PropTypes.string,
    /** 서브타이틀 숨김 여부 */
    hideSubtitle: PropTypes.bool,
    /** 커스텀 스타일 객체 */
    style: PropTypes.object
};

export default OV_TITLE_2Line;

