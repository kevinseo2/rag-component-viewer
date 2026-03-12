import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { QRCodeSVG } from 'qrcode.react';
import CM_LABEL_Smart from './CM_LABEL_Smart';

/**
 * WD_DIALOG_QRCode - QR 코드 다이얼로그 위젯
 *
 * C 코드(lv_WD_DIALOG_QRCode.c) 기반의 QR 코드 표시 다이얼로그입니다.
 * 경고 아이콘 + 타이틀, QR 코드, 설명 텍스트를 표시합니다.
 * 주로 에러/서비스 안내 시 사용자가 QR을 스캔하여 지원 페이지에 접근하도록 합니다.
 *
 * 레이아웃 (310 x 240px, 배경 검정):
 * - 타이틀 컨테이너: 상단 중앙(TOP_MID, y=0), 50px 높이
 *   - 경고 아이콘: 50x50px (img_alert_2.png)
 *   - 타이틀 텍스트: 최대 250x34px, 30px 폰트
 * - QR 코드: x=21, y=83, 110x110px (흰색 배경, 5px 패딩, 실제 QR 100x100)
 * - 설명 컨테이너: x=147, y=66, 158x145px
 *   - 멀티라인 텍스트, 25px 폰트, 좌측 정렬
 *
 * 키보드 조작:
 * - Enter: onKey('OK', { titleText, descriptionText, qrUrl }) 호출
 * - Escape: onKey('BACK') 호출
 */
const WD_DIALOG_QRCode = ({
    id = "WD_DIALOG_QRCode",
    titleText = "Error",
    descriptionText = "Please scan to contact support",
    qrUrl = "https://www.lge.com/",
    className = "",
    isFocused = true,
    onKey
} = {}) => {
    /** 키보드 이벤트 핸들링 (isFocused가 true일 때만 활성) */
    useEffect(() => {
        if (!isFocused) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onKey?.('BACK');
            } else if (e.key === 'Enter') {
                e.preventDefault();
                onKey?.('OK', { titleText, descriptionText, qrUrl });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, onKey, titleText, descriptionText, qrUrl]);

    return (
        <div
            id={id}
            className={`w-[310px] h-[240px] bg-black relative ${className}`}
        >
            {/* Title Container - TOP_MID, y=0, h=50 */}
            <div
                id={`${id}-container`}
                className="absolute top-0 left-1/2 -translate-x-1/2 h-[50px] flex flex-row items-center justify-center px-[5px]"
            >
                {/* Alert Icon - 50x50 */}
                <img
                    id={`${id}-image`}
                    src="/ui/images/washer_dryer/img_alert_2.png"
                    alt="alert"
                    className="w-[50px] h-[50px]"
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
                {/* Title Text - max 250x34 */}
                <CM_LABEL_Smart
                    key={titleText}
                    id={`${id}-next_label_lite_title`}
                    text={titleText}
                    align="center"
                    multiline={false}
                    maxArea={{ width: 250, height: 34 }}
                    style={{
                        fontSize: 30,
                        color: '#FFFFFF',
                        fontWeight: '600'
                    }}
                />
            </div>

            {/* QR Code - TOP_LEFT, x=21, y=83, 110x110 */}
            <div
                id={`${id}-qrcode`}
                className="absolute top-[83px] left-[21px] w-[110px] h-[110px] bg-white p-[5px]"
                style={{ direction: 'ltr' }}
            >
                <QRCodeSVG
                    value={qrUrl || "https://www.lge.com/"}
                    size={100}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                />
            </div>

            {/* Description Container - TOP_LEFT, x=147, y=66, 158x145 */}
            <div
                id={`${id}-container_desc`}
                className="absolute top-[66px] left-[147px] w-[158px] h-[145px] flex items-center"
            >
                <CM_LABEL_Smart
                    key={descriptionText}
                    id={`${id}-next_label`}
                    text={descriptionText}
                    align="left"
                    multiline={true}
                    maxArea={{ width: 158, height: 145 }}
                    animSpeed={15}
                    style={{
                        fontSize: 25,
                        color: '#FFFFFF',
                        fontWeight: '600',
                        textAlign: 'left'
                    }}
                />
            </div>
        </div>
    );
};

WD_DIALOG_QRCode.propTypes = {
    /** 컴포넌트의 고유 식별자 (HTML id 속성) */
    id: PropTypes.string,

    /**
     * 타이틀 텍스트 (경고 아이콘 옆에 표시)
     * 최대 250x34px 영역에 30px 폰트로 렌더링됩니다.
     * @example "Error", "오류", "서비스 안내"
     */
    titleText: PropTypes.string,

    /**
     * 설명 텍스트 (QR 코드 오른쪽에 표시)
     * 158x145px 영역에 멀티라인으로 렌더링됩니다.
     * 텍스트가 길면 자동 스크롤(animSpeed=15)이 동작합니다.
     * @example "Please scan to contact support", "QR 코드를 스캔하여 서비스센터에 문의하세요"
     */
    descriptionText: PropTypes.string,

    /**
     * QR 코드에 인코딩할 URL 문자열
     * 빈 값이면 기본 URL(https://www.lge.com/)이 사용됩니다.
     * @example "https://www.lge.com/support", "https://www.lge.co.kr/support"
     */
    qrUrl: PropTypes.string,

    /** 외부 컨테이너에 추가할 CSS 클래스명 */
    className: PropTypes.string,

    /**
     * 현재 포커스 상태 여부
     * true일 때만 키보드 이벤트(Enter, Escape)를 수신합니다.
     */
    isFocused: PropTypes.bool,

    /**
     * 키 이벤트 콜백 함수
     * @param {string} action - 'OK' | 'BACK'
     * @param {object} [payload] - OK 시 { titleText, descriptionText, qrUrl } 객체가 전달됩니다.
     */
    onKey: PropTypes.func
};

export default WD_DIALOG_QRCode;

