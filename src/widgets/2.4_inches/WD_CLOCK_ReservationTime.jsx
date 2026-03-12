import React from 'react';
import PropTypes from 'prop-types';
import CM_LABEL_Formatted from './CM_LABEL_Formatted';

/**
 * WD_CLOCK_ReservationTime Widget Component
 * Displays scheduled finish time with Date, AM/PM and HH:MM
 */
const WD_CLOCK_ReservationTime = ({
    id = "WD_CLOCK_ReservationTime",
    reservationDate = "Today",
    reservationAmpm = "AM",
    reservationHour = 12,
    reservationMin = 0,
    style = {}
}) => {
    const formattedMin = String(reservationMin).padStart(2, '0');

    return (
        <div
            id={id}
            className="flex flex-row items-center justify-center h-[85px] bg-transparent"
            style={style}
        >
            {/* Date and AM/PM Section */}
            <div
                id={`${id}-date_ampm_container`}
                className="flex flex-col items-center justify-center mr-2"
            >
                <div
                    id={`${id}-label_date`}
                    className="text-white text-[28px] font-semibold"
                    style={{ fontFamily: 'LGSBD23' }}
                >
                    {reservationDate}
                </div>
                <div
                    id={`${id}-label_ampm`}
                    className="text-white text-[28px] font-semibold"
                    style={{ fontFamily: 'LGSBD23' }}
                >
                    {reservationAmpm}
                </div>
            </div>

            {/* Time Section (Large Display) */}
            <div id={`${id}-fmtlabel_time_container`} className="flex items-center">
                <CM_LABEL_Formatted
                    id={`${id}-fmtlabel_time`}
                    key={`${reservationHour}:${reservationMin}`}
                    format="{0}{1}{2}"
                    slots={[
                        { type: 'string', value: String(reservationHour) },
                        { type: 'image', value: '/ui/images/washer_dryer/ic_clock_colon2.png', width: 18, height: 85 },
                        { type: 'string', value: formattedMin }
                    ]}
                    style={{
                        fontFamily: 'LOCK3B23',
                        fontSize: '87px',
                        color: '#FFFFFF'
                    }}
                    maxArea={{ width: 230, height: 85 }}
                />
            </div>
        </div>
    );
};

WD_CLOCK_ReservationTime.propTypes = {
    /** 위젯 고유 식별자 */
    id: PropTypes.string,

    /** 
     * 예약된 날짜 표시 (예: "Today", "Tomorrow")
     * - 좌측 상단에 표시됨
     */
    reservationDate: PropTypes.string,

    /** 
     * 오전/오후 구분 표시 ('AM' 또는 'PM')
     * - 좌측 하단에 표시됨
     */
    reservationAmpm: PropTypes.oneOf(['AM', 'PM']),

    /** 
     * 예약 완료 시간 - 시 (1~12)
     * - 중앙 대형 폰트로 표시됨
     */
    reservationHour: PropTypes.number,

    /** 
     * 예약 완료 시간 - 분 (0~59)
     * - 중앙 대형 폰트로 표시됨 (내부적으로 2자리 0 채움 처리)
     */
    reservationMin: PropTypes.number,

    /** 컴포넌트 최상위 컨테이너에 적용할 추가 스타일 객체 */
    style: PropTypes.object
};

export default WD_CLOCK_ReservationTime;

