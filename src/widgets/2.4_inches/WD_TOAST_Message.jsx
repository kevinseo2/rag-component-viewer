import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * WD_TOAST_Message Widget Component
 * Reproduces lv_CM_OVERLAY_Toast.c logic for dynamic height and auto-dismiss.
 */
const WD_TOAST_Message = ({
    id,
    text = "",
    duration = 3000, // ms
    initialText,
    initialDuration,
    onDismiss,
    className = "",
    style = {}
}) => {
    // Support both naming conventions
    const displayText = text || initialText || "";
    const displayDuration = duration || initialDuration || 3000;
    const [isVisible, setIsVisible] = useState(true);

    // Auto-dismiss logic (lines 79-83)
    useEffect(() => {
        if (displayDuration <= 0) return;
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onDismiss) onDismiss();
        }, displayDuration);
        return () => clearTimeout(timer);
    }, [displayDuration, onDismiss]);

    // Dynamic Height calculation (lines 68-74)
    const height = useMemo(() => {
        const lineCount = displayText.split('\n').length;
        if (lineCount < 3) return 92;
        if (lineCount < 5) return 120;
        return 150;
    }, [displayText]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    id={id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute bottom-5 left-1/2 -translate-x-1/2 w-[310px] bg-[#1A1A1A] border border-white/20 rounded-[15px] flex items-center justify-center px-4 z-[100] ${className}`}
                    style={{ height, ...style }}
                >
                    <span className="text-[25px] font-semibold text-white text-center leading-tight whitespace-pre-wrap">
                        {displayText}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

WD_TOAST_Message.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 표시할 메시지 텍스트 */
    text: PropTypes.string,
    /** 토스트가 표시되는 시간 (ms) */
    duration: PropTypes.number,
    /** 초기 메시지 (text와 동일한 용도) */
    initialText: PropTypes.string,
    /** 초기 지속 시간 (duration과 동일한 용도) */
    initialDuration: PropTypes.number,
    /** 토스트가 사라질 때 호출되는 콜백 */
    onDismiss: PropTypes.func,
    /** 추가 CSS 클래스명 */
    className: PropTypes.string,
    /** 스타일 객체 */
    style: PropTypes.object,
};

export default WD_TOAST_Message;

