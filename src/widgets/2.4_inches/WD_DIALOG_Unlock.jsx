import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Flex, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

/**
 * WD_Dialog_Unlock Widget Component
 * Displays child lock unlock progress with animation and message.
 */
const WD_Dialog_Unlock = ({
    id,
    description = "Long press to unlock Child Lock",
    isUnlocking = false,
    onComplete = () => { },
    className = "",
    isFocused = true,
    onKey,
}) => {
    const [progress, setProgress] = useState(0);

    React.useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            const keyMap = {
                'Enter': 'OK',
                'Escape': 'BACK',
            };
            const action = keyMap[e.key];
            if (action) {
                e.preventDefault();
                onKey?.(action, action === 'OK' ? { description, isUnlocking, progress } : undefined);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, onKey, description, isUnlocking, progress]);

    useEffect(() => {
        let timer;
        if (isUnlocking) {
            timer = setInterval(() => {
                setProgress((prev) => {
                    const next = prev + 3;
                    if (next >= 100) {
                        clearInterval(timer);
                        onComplete();
                        return 100;
                    }
                    return next;
                });
            }, 50);
        } else {
            setProgress(0);
        }
        return () => clearInterval(timer);
    }, [isUnlocking, onComplete]);

    return (
        <Flex
            id={id}
            w="310px"
            h="240px"
            bg="black"
            flexDirection="column"
            align="center"
            pt="28px"
            className={className}
        >
            {/* Unlock Icon/Animation */}
            <Box w="92px" h="92px" position="relative" mb="15px">
                <svg width="92" height="92" viewBox="0 0 100 100">
                    <circle
                        cx="50" cy="50" r="45"
                        fill="none" stroke="#2D3748" strokeWidth="6"
                    />
                    <motion.circle
                        cx="50" cy="50" r="45"
                        fill="none" stroke="#629dff" strokeWidth="6"
                        strokeDasharray="282.7"
                        strokeDashoffset={282.7 - (282.7 * progress) / 100}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                    />
                </svg>
                <Box
                    position="absolute"
                    top="50%" left="50%"
                    transform="translate(-50%, -50%)"
                    color="white"
                >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {progress < 100 ? (
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        ) : (
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        )}
                        {progress < 100 && <path d="M7 11V7a5 5 0 0 1 10 0v4" />}
                        <circle cx="12" cy="16" r="1" />
                    </svg>
                </Box>
            </Box>

            <Text
                color="white"
                fontSize="25px"
                fontWeight="600"
                textAlign="center"
                px="20px"
                maxH="117px"
            >
                {description}
            </Text>
        </Flex>
    );
};

WD_Dialog_Unlock.propTypes = {
    /** 위젯의 고유 식별자 */
    id: PropTypes.string,

    /** 
     * 화면 중앙에 표시될 안내 문구
     * - 예: "Long press to unlock Child Lock"
     * - 최대 3줄 정도의 텍스트를 수용할 수 있는 영역 (117px)
     */
    description: PropTypes.string,

    /** 
     * 해제 프로세스 시작 여부
     * - true: 원형 프로그레스 바가 차오르기 시작함 (애니메이션 시작)
     * - false: 프로그레스 바가 0으로 초기화됨
     */
    isUnlocking: PropTypes.bool,

    /** 
     * 해제 프로세스가 100% 완료되었을 때 호출되는 콜백 함수
     * - 원형 게이지가 모두 차고 자물쇠 아이콘이 열림으로 바뀌면 호출됨
     */
    onComplete: PropTypes.func,

    /** 
     * 현재 위젯이 포커스를 가지고 있는지 여부
     * - true일 때만 키보드 입력(Enter, Escape)이 작동함
     */
    isFocused: PropTypes.bool,

    /** 
     * 키보드 입력 처리 콜백 함수
     * - 'OK' (Enter): 현재 진행 상태와 정보를 상위로 전달
     * - 'BACK' (Escape): 뒤로가기 동작 수행
     */
    onKey: PropTypes.func,

    /** 컨테이너에 적용할 추가 CSS 클래스명 */
    className: PropTypes.string
};

export default WD_Dialog_Unlock;
