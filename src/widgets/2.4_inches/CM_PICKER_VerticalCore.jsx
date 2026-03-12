import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CM_PICKER_Vertical2ndItem from './CM_PICKER_Vertical2ndItem';

/**
 * CM_PICKER_VerticalCore (Atom Widget)
 *
 * A vertical list picker component that displays a scrollable list of items.
 * It supports controlled selection and smooth scrolling to the selected item.
 */
const CM_PICKER_VerticalCore = ({
    items = [],
    itemHeight = 67,
    height = 201,
    onChange,
    selectedIndex: controlledIndex = 0
}) => {
    const scrollRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(controlledIndex);

    // Sync with controlled index (Directly move when key is pressed)
    useEffect(() => {
        setSelectedIndex(controlledIndex);
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: controlledIndex * itemHeight,
                behavior: 'smooth'
            });
        }
    }, [controlledIndex, itemHeight]);

    return (
        <div
            className="relative w-full overflow-hidden"
            style={{
                height: `${height}px`,
                top: '0px'
            }}
        >
            <div
                ref={scrollRef}
                className="w-full h-full overflow-hidden no-scrollbar" // Disabled manual scroll
                style={{
                    paddingTop: `${(height - itemHeight) / 2}px`,
                    paddingBottom: `${(height - itemHeight) / 2}px`
                }}
            >
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="w-full flex items-center justify-center"
                        style={{ height: `${itemHeight}px` }}
                    >
                        <CM_PICKER_Vertical2ndItem
                            text={item.value_text}
                            selected={index === selectedIndex}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

CM_PICKER_VerticalCore.propTypes = {
    /** 리스트 아이템 배열 */
    items: PropTypes.arrayOf(PropTypes.shape({
        value_text: PropTypes.string
    })),
    /** 아이템별 높이 (px) */
    itemHeight: PropTypes.number,
    /** 컴포넌트 전체 높이 (px) */
    height: PropTypes.number,
    /** 선택 변경 시 호출되는 콜백 (현재는 위젯 스크롤 동기화에 사용) */
    onChange: PropTypes.func,
    /** 제어되는 선택 인덱스 */
    selectedIndex: PropTypes.number
};

export default CM_PICKER_VerticalCore;

