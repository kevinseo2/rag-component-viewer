import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Smart from './CM_LABEL_Smart';
import CM_CTRL_Switch from './CM_CTRL_Switch';
import CM_TITLE_WithArrow from './CM_TITLE_WithArrow';

/**
 * CM_LIST_SwitchList Widget
 * - Vertical scrollable list with toggle switches.
 * - Manages internal focus/selection state.
 * - Handles internal toggle of switch states.
 * - Handles keyboard navigation (Up/Down) and interaction (Enter/Back).
 */
const CM_LIST_SwitchList = ({
    id = "CM_LIST_SwitchList",
    title = "Title",
    showBackArrow = false,
    items = [],
    initialSelectedIndex = 0,
    isFocused = true,
    onKey = () => { }
}) => {
    const [internalItems, setInternalItems] = useState(items);
    const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
    const scrollRef = useRef(null);

    const ITEM_HEIGHT = 68;
    const CONTAINER_HEIGHT = 190;

    // Synchronize internal state with props if they change
    useEffect(() => {
        setInternalItems(items);
        setSelectedIndex(initialSelectedIndex);
    }, [items, initialSelectedIndex]);

    // Internal toggle logic
    const handleToggleInternal = useCallback((index) => {
        setInternalItems(prevItems => {
            const nextItems = [...prevItems];
            const item = nextItems[index];
            // Simple toggle logic: 0 (ON) <-> 1 (OFF). If 2 (Hidden), do nothing.
            if (item && item.switchState !== 2) {
                const newSwitchState = item.switchState === 0 ? 1 : 0;
                nextItems[index] = {
                    ...item,
                    switchState: newSwitchState
                };
                // Notify parent of the change
                onKey('OK', { index, item: nextItems[index] });
            }
            return nextItems;
        });
    }, [onKey]);

    // Handle Keyboard Events
    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            let handled = false;
            if ((e.key === 'ArrowUp') || (e.key === 'ArrowLeft')) {
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                handled = true;
            } else if ((e.key === 'ArrowDown') || (e.key === 'ArrowRight')) {
                setSelectedIndex((prev) => (prev < internalItems.length - 1 ? prev + 1 : prev));
                handled = true;
            } else if (e.key === 'Enter') {
                handleToggleInternal(selectedIndex);
                handled = true;
            } else if (e.key === 'Escape' || e.key === 'Backspace') {
                onKey('BACK');
                handled = true;
            }

            if (handled) {
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, selectedIndex, internalItems, onKey, handleToggleInternal]);

    // Auto-scroll to keep selected item in view
    useEffect(() => {
        if (scrollRef.current) {
            const scrollPos = selectedIndex * ITEM_HEIGHT;

            if (scrollPos < scrollRef.current.scrollTop) {
                scrollRef.current.scrollTop = scrollPos;
            } else if (scrollPos + ITEM_HEIGHT > scrollRef.current.scrollTop + CONTAINER_HEIGHT) {
                scrollRef.current.scrollTop = scrollPos + ITEM_HEIGHT - CONTAINER_HEIGHT;
            }
        }
    }, [selectedIndex]);

    return (
        <div
            id={id}
            className="w-[320px] h-[240px] bg-black overflow-hidden relative"
        >
            {/* Title Bar Widget */}
            <CM_TITLE_WithArrow
                id={`${id}-header`}
                title={title}
                showBackArrow={showBackArrow}
                onBack={() => onKey('BACK')}
            />

            {/* List Content */}
            <div
                id={`${id}-content`}
                className="absolute top-[50px] left-0 w-full h-[CONTAINER_HEIGHT] overflow-hidden bg-transparent"
                style={{ height: CONTAINER_HEIGHT }}
            >
                <div
                    ref={scrollRef}
                    className="w-full h-full overflow-y-auto no-scrollbar scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {internalItems.map((item, index) => {
                        const isSelected = index === selectedIndex && isFocused;
                        return (
                            <div
                                key={index}
                                id={`${id}-item-${index}`}
                                className={`w-[320px] h-[68px] relative transition-colors duration-150 ${isSelected ? 'bg-[#333333]' : 'bg-transparent'
                                    }`}
                            >
                                {/* Option Label */}
                                <div className="absolute left-[20px] top-[16px] w-[200px] h-[34px]">
                                    <CM_LABEL_Smart
                                        id={`${id}-label-${index}`}
                                        key={`${item.label_option}-${index}`}
                                        text={item.label_option}
                                        align="left"
                                        maxArea={{
                                            width: 200,
                                            height: 34
                                        }}
                                        style={{
                                            fontFamily: 'LG_Smart_UI_HA2023_SemiBold',
                                            fontSize: 30,
                                            color: '#FFFFFF',
                                            fontWeight: '600'
                                        }}
                                    />
                                </div>

                                {/* Switch Component */}
                                <CM_CTRL_Switch
                                    id={`${id}-switch-${index}`}
                                    className="absolute left-[245px] top-[18px]"
                                    checked={item.switchState === 0}
                                    visible={item.switchState !== 2}
                                    onToggle={() => {
                                        if (isFocused) {
                                            setSelectedIndex(index);
                                            handleToggleInternal(index);
                                        }
                                    }}
                                />

                                {/* 2px Separator Line */}
                                <div
                                    id={`${id}-line-${index}`}
                                    className="absolute left-[20px] top-[66px] w-[280px] h-[2px] bg-[#333333]"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

CM_LIST_SwitchList.propTypes = {
    /** 컴포넌트 ID */
    id: PropTypes.string,

    /** 상단 타이틀 */
    title: PropTypes.string,

    /** 뒤로가기 화살표 표시 여부 */
    showBackArrow: PropTypes.bool,

    /** 
     * 스위치 리스트 항목들
     * 각 항목의 구조:
     */
    items: PropTypes.arrayOf(PropTypes.shape({
        /** 
         * 옵션 라벨 텍스트
         * - 30px 크기로 왼쪽에 표시
         */
        label_option: PropTypes.string,

        /** 
         * 스위치 상태
         * - 0: ON (체크됨, 파란색)
         * - 1: OFF (체크 해제, 회색)
         * - 2: Hidden (스위치 숨김)
         */
        switchState: PropTypes.number
    })),

    /** 초기 선택될 항목 인덱스 */
    initialSelectedIndex: PropTypes.number,

    /** 키보드 입력 활성화 여부 */
    isFocused: PropTypes.bool,

    /** 
     * 키보드 입력 처리 콜백
     * - 'OK': Enter 키로 스위치 토글 (payload: { index, item })
     * - 'BACK': Escape/Backspace 키
     */
    onKey: PropTypes.func
};

export default CM_LIST_SwitchList;


