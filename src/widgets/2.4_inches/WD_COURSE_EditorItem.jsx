import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Smart from './CM_LABEL_Smart';
import WD_COURSE_ProgressTitle from './WD_COURSE_ProgressTitle';

const WD_COURSE_EditorItem = ({
    id = "WD_COURSE_EditorItem",
    value_text = "",
    description_text = "",
    selected = false,
    is_mandatory = false,
    show_pentagon = false,
    isFocused = false,
    style = {}
}) => {
    const [checkImage, setCheckImage] = useState("/ui/images/washer_dryer/ic_multiple_selection_off.png");

    useEffect(() => {
        // Logic from lv_WD_COURSE_EditorItem.c: update()
        if (is_mandatory) {
            setCheckImage("/ui/images/washer/ic_multiple_selection_on_d.png");
        } else if (selected) {
            setCheckImage("/ui/images/washer/ic_multiple_selection_on.png");
        } else {
            setCheckImage("/ui/images/washer_dryer/ic_multiple_selection_off.png");
        }
    }, [is_mandatory, selected]);

    // Style from JSON and C code
    const focusedStyle = isFocused ? {
        backgroundColor: "rgba(61, 61, 61, 1)",
    } : {
        backgroundColor: "transparent"
    };

    const containerStyle = {
        width: '310px',
        height: '67px',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        ...focusedStyle,
        ...style
    };

    return (
        <div id={id} style={containerStyle} className="relative overflow-hidden">
            <div
                id={`${id}-container`}
                className="flex flex-row items-center pl-[15px] pr-[15px] gap-[15px] h-[65px]"
            >
                {/* image_check */}
                <img
                    id={`${id}-image_check`}
                    src={checkImage}
                    alt="check"
                    style={{ width: '22px', height: '22px' }}
                />

                {/* container_1 */}
                <div
                    id={`${id}-container_1`}
                    className="flex flex-col justify-center items-start overflow-hidden w-[243px] h-[65px]"
                >
                    <WD_COURSE_ProgressTitle
                        id={`${id}-WD_COURSE_ProgressTitle`}
                        title={value_text}
                        show_pentagon={show_pentagon}
                        isFocused={isFocused}
                        align="left"
                        max_width={243}
                        max_height={34}
                        style={{ height: '34px', paddingTop: '0px' }}
                    />

                    {description_text && (
                        <CM_LABEL_Smart
                            key={description_text}
                            id={`${id}-next_label_desc`}
                            text={description_text}
                            isFocused={isFocused}
                            align="left"
                            style={{
                                width: '243px',
                                height: 'auto',
                                color: '#FFFFFF',
                                fontSize: '21px',
                                fontFamily: 'LGSBD23',
                                backgroundColor: isFocused ? "rgba(61, 61, 61, 1)" : "transparent"
                            }}
                            maxArea={{
                                width: 243,
                                height: 24
                            }}
                        />
                    )}
                </div>
            </div>

            {/* divider_lower */}
            <div
                id={`${id}-divider_lower`}
                className="absolute bottom-0 left-0 w-full h-[2px] bg-[#333333]"
            />
        </div>
    );
};

WD_COURSE_EditorItem.propTypes = {
    id: PropTypes.string,
    value_text: PropTypes.string,
    description_text: PropTypes.string,
    selected: PropTypes.bool,
    is_mandatory: PropTypes.bool,
    show_pentagon: PropTypes.bool,
    isFocused: PropTypes.bool,
    style: PropTypes.object
};

export default WD_COURSE_EditorItem;

