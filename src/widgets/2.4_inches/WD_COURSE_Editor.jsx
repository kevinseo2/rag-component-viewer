import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CM_TITLE_Bar from './CM_TITLE_Bar';
import WD_COURSE_EditorItem from './WD_COURSE_EditorItem';

/**
 * WD_COURSE_Editor (Internal UI Widget)
 * - Handles internal list selection (Up/Down)
 * - Handles internal data state for toggling (Enter)
 * - Provides callbacks for external actions (Left/Right)
 */
const WD_COURSE_Editor = ({
    id = "WD_COURSE_Editor",
    title_text = "코스 목록 편집",
    data = [],
    initialSelectedIndex = 0,
    isFocused = true,
    onKey,
    style = {}
}) => {
    // 1. Internal State Management
    const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
    const [internalData, setInternalData] = useState(data);

    // Sync state if props change externally (e.g. environment reset)
    useEffect(() => {
        setSelectedIndex(initialSelectedIndex);
    }, [initialSelectedIndex]);

    useEffect(() => {
        setInternalData(data);
    }, [data]);

    // 2. Internal Toggle Logic
    const handleInternalToggle = (index) => {
        const item = internalData[index];
        if (!item || item.is_mandatory) return;

        const newData = [...internalData];
        newData[index] = { ...item, selected: !item.selected };
        setInternalData(newData);

        // Notify parent if needed
        onToggle?.(index, newData[index].selected);
    };

    // 3. Keyboard Interaction
    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    setSelectedIndex(prev => (prev > 0 ? prev - 1 : internalData.length - 1));
                    break;
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    setSelectedIndex(prev => (prev < internalData.length - 1 ? prev + 1 : 0));
                    break;
                case 'Enter':
                    e.preventDefault();
                    handleInternalToggle(selectedIndex);
                    onKey?.('OK', { index: selectedIndex, item: internalData[selectedIndex], isSelected: !internalData[selectedIndex].selected });
                    break;
                case 'Escape':
                    e.preventDefault();
                    onKey?.('BACK');
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, selectedIndex, internalData, onKey]);

    // 4. Layout and Scrolling Constants
    const containerStyle = {
        width: '310px',
        height: '240px',
        backgroundColor: '#000000',
        position: 'relative',
        overflow: 'hidden',
        ...style
    };

    const itemHeight = 67;
    const visibleCount = 3;
    const topIndex = Math.max(0, selectedIndex - (visibleCount - 1));
    const [scrollOffset, setScrollOffset] = useState(0);

    useEffect(() => {
        const offset = -(topIndex * itemHeight);
        setScrollOffset(offset);
    }, [topIndex, itemHeight]);

    return (
        <div
            id={id}
            style={containerStyle}
            className="flex flex-col relative overflow-hidden"
        >
            <CM_TITLE_Bar
                id={`${id}-CM_TITLE_Bar`}
                title={title_text}
                style={{ position: 'relative', zIndex: 10 }}
            />

            <div id={`${id}-picker-window`} className="relative flex-1 overflow-hidden">
                <div
                    id={`${id}-picker-list`}
                    className="absolute left-0 w-[310px] transition-transform duration-300 ease-out"
                    style={{
                        height: `${internalData.length * itemHeight}px`,
                        top: 0,
                        transform: `translateY(${scrollOffset}px)`
                    }}
                >
                    {internalData.map((item, index) => (
                        <WD_COURSE_EditorItem
                            key={item.id || index}
                            id={`${id}-item-${index}`}
                            value_text={item.value_text}
                            description_text={item.description_text}
                            selected={item.selected}
                            is_mandatory={item.is_mandatory}
                            show_pentagon={item.show_pentagon}
                            isFocused={index === selectedIndex}
                        />
                    ))}
                </div>

                <div id={`${id}-container_for_scrollbar`} className="absolute inset-0 pointer-events-none">
                    <div id={`${id}-scrollbar-track`} className="absolute right-[5px] top-0 h-full w-[4px] bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="w-full bg-[#666666] rounded-full transition-all duration-300"
                            style={{
                                height: `${(visibleCount / Math.max(internalData.length, 1)) * 100}%`,
                                transform: `translateY(${(topIndex / Math.max(internalData.length, 1)) * 100}%)`
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

WD_COURSE_Editor.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 상단 타이틀 텍스트 */
    title_text: PropTypes.string,
    /** 코스 목록 데이터 배열 */
    data: PropTypes.arrayOf(PropTypes.shape({
        /** 고유 ID */
        id: PropTypes.number,
        /** 항목 텍스트 (코스명) */
        value_text: PropTypes.string,
        /** 보조 설명 텍스트 */
        description_text: PropTypes.string,
        /** 선택 여부 (체크박스 상태) */
        selected: PropTypes.bool,
        /** 필수 코스 여부 (해제 불가) */
        is_mandatory: PropTypes.bool,
        /** 오각형 아이콘 표시 여부 */
        show_pentagon: PropTypes.bool
    })),
    /** 초기 포커스 인덱스 */
    initialSelectedIndex: PropTypes.number,
    /** 이전 화면(Left) 이동 콜백 */
    onPrev: PropTypes.func,
    /** 다음 화면(Right) 이동 콜백 */
    onNext: PropTypes.func,
    /** 선택 토글 시 콜백 */
    onToggle: PropTypes.func,
    /** 현재 포커스 상태 여부 */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 */
    onKey: PropTypes.func,
    /** 스타일 객체 */
    style: PropTypes.object
};

export default WD_COURSE_Editor;

