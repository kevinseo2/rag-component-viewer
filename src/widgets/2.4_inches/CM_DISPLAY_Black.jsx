import React from 'react';
import PropTypes from 'prop-types';

/**
 * CM_DISPLAY_Black
 * A simple empty black screen widget.
 */
const CM_DISPLAY_Black = ({
    id = "CM_DISPLAY_Black",
    style = {}
}) => {
    return (
        <div
            id={id}
            className="w-[320px] h-[240px] bg-black"
            style={style}
        />
    );
};

CM_DISPLAY_Black.propTypes = {
    id: PropTypes.string,
    style: PropTypes.object
};

export default CM_DISPLAY_Black;

