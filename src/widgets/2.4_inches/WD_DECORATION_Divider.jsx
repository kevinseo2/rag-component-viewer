import React from 'react';
import PropTypes from 'prop-types';

/**
 * WD_DECORATION_Divider
 * A simple vertical divider line component.
 */
const WD_DECORATION_Divider = ({
    id = "WD_DECORATION_Divider",
    className = ""
}) => {
    return (
        <div
            id={id}
            className={`w-[2px] h-[33px] bg-white opacity-[0.3] ${className}`}
        />
    );
};

WD_DECORATION_Divider.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string
};

export default WD_DECORATION_Divider;

