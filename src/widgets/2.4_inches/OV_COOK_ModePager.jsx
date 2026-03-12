import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import WD_PAGER_Base from './WD_PAGER_Base';
import OV_COOK_ModeItem from './OV_COOK_ModeItem';

/**
 * OV_COOK_ModePager
 * Widget that manages the Cook Mode list with horizontal paging.
 */
const OV_COOK_ModePager = ({
    id = "OV_COOK_ModePager",
    dataset = [],
    initialIndex = 1,
    isFocused = true,
    onKey,
    style = {}
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const maxPage = dataset.length - 1;

    // Sync state with props when initialIndex changes
    useEffect(() => {
        // Ensure index is valid within new bounds
        const validIndex = Math.min(Math.max(0, initialIndex), dataset.length - 1);
        setCurrentIndex(validIndex > 0 ? validIndex : 0);
    }, [initialIndex, dataset]); // Re-run when initialIndex or dataset changes

    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            e.stopPropagation();
            switch (e.key) {
                case 'ArrowLeft':
                    setCurrentIndex(prev => Math.max(0, prev - 1));
                    break;
                case 'ArrowRight':
                    setCurrentIndex(prev => Math.min(maxPage, prev + 1));
                    break;
                case 'Enter':
                    if (onKey) onKey('OK', { index: currentIndex, item: dataset[currentIndex] });
                    break;
                case 'Escape':
                    if (onKey) onKey('BACK');
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, currentIndex, maxPage, dataset, onKey]);

    return (
        <WD_PAGER_Base
            id={id}
            currentPage={currentIndex}
            style={style}
        >
            {dataset.map((item, index) => (
                <OV_COOK_ModeItem
                    key={item.id}
                    id={`${id}-item-${index}`}
                    {...item}
                />
            ))}
        </WD_PAGER_Base>
    );
};

OV_COOK_ModePager.propTypes = {
    /** 컴포넌트 고유 ID */
    id: PropTypes.string,
    /** 조리 모드 데이터 배열 */
    dataset: PropTypes.arrayOf(PropTypes.shape({
        /** 고유 아이디 */
        id: PropTypes.string,
        /** 조리 모드 명칭 */
        title: PropTypes.string,
        /** 상세 설명 문구 */
        description: PropTypes.string,
        /** 아이콘 이미지 경로 */
        image: PropTypes.string,
        /** 아이콘 표시 여부 */
        showIcon: PropTypes.bool
    })),
    /** 초기 선택 인덱스 */
    initialIndex: PropTypes.number,
    /** 현재 포커스 상태 여부 */
    isFocused: PropTypes.bool,
    /** 키 이벤트 콜백 함수 (Action, {index, item} 전달) */
    onKey: PropTypes.func,
    /** 커스텀 스타일 객체 */
    style: PropTypes.object
};

export default OV_COOK_ModePager;

