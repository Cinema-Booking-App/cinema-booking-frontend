import React from "react";
import { MovieInfoCard } from "./movie-info-card";
import { SelectedSeatsCard } from "./selected-seats-card";
import { BookingSummaryCard } from "./booking-summary-card";
import { Seats } from "@/types/seats";

interface MovieInfo {
    title: string;
    poster: string;
    duration: string;
}

interface ScheduleInfo {
    date: string;
    time: string;
    theater: string;
    room: string;
    price: number;
}


interface BookingSidebarProps {
    movie: MovieInfo;
    schedule: ScheduleInfo;
    selectedSeats: string[];
    seatsData?: Seats[];
    onReserveSeats?: () => void;
    isReserving?: boolean;
    reservedSeats?: any[];
    sessionId?: string;
}

export const BookingSidebar: React.FC<BookingSidebarProps> = ({
    schedule,
    selectedSeats,
    seatsData,
    onReserveSeats,
    isReserving = false,
    reservedSeats = [],
    sessionId = '',
}) => {
    const calculateTotal = () => {
        if (!seatsData) {
            return selectedSeats.length * schedule.price;
        }

        return selectedSeats.reduce((total, seatId) => {
            const seatInfo = seatsData.find(seat => seat.seat_code === seatId);
            if (!seatInfo) return total + schedule.price;

            const basePrice = schedule.price;
            switch (seatInfo.seat_type.toLowerCase()) {
                case 'premium':
                    return total + (basePrice * 1.2);
                case 'vip':
                    return total + (basePrice * 1.5);
                case 'couple':
                    return total + (basePrice * 2.0);
                case 'regular':
                default:
                    return total + basePrice;
            }
        }, 0);
    };

    return (
        <div className="space-y-6">
            {/* Thông tin phim */}
            {/* <MovieInfoCard movie={movie} schedule={schedule} /> */}

            {/* Ghế đã chọn */}
            <SelectedSeatsCard
                selectedSeats={selectedSeats}
                ticketPrice={schedule.price}
                seatsData={seatsData}
                reservedSeats={reservedSeats}
                sessionId={sessionId}
            />

            {/* Tổng tiền và nút tiếp tục */}
            <BookingSummaryCard
                total={calculateTotal()}
                selectedSeatsCount={selectedSeats.length}
                onProceedToPayment={onReserveSeats}
                isProcessing={isReserving}
                hasSelectedSeats={selectedSeats.length > 0}
                hasReservedSeats={reservedSeats?.some(res => res.session_id === sessionId && res.status === 'pending') || false}
                prices={schedule.price}
            />
        </div>
    );
};