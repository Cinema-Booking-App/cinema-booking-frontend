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
}

interface PriceInfo {
    adult: number;
    child: number;
    student: number;
}

interface BookingSidebarProps {
    movie: MovieInfo;
    schedule: ScheduleInfo;
    price: PriceInfo;
    selectedSeats: string[];
    selectedTicketType: "adult" | "child" | "student";
    formatPrice: (price: number) => string;
    seatsData?: Seats[];
    onReserveSeats?: () => void;
    isReserving?: boolean;
}

export const BookingSidebar: React.FC<BookingSidebarProps> = ({
    movie,
    schedule,
    price,
    selectedSeats,
    selectedTicketType,
    formatPrice,
    seatsData,
    onReserveSeats,
    isReserving = false
}) => {
    const calculateTotal = () => {
        if (!seatsData) {
            return selectedSeats.length * price[selectedTicketType];
        }

        return selectedSeats.reduce((total, seatId) => {
            const seatInfo = seatsData.find(seat => seat.seat_code === seatId);
            if (!seatInfo) return total + price[selectedTicketType];

            const basePrice = price[selectedTicketType];
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
            <MovieInfoCard movie={movie} schedule={schedule} />

            {/* Ghế đã chọn */}
            <SelectedSeatsCard
                selectedSeats={selectedSeats}
                ticketPrice={price[selectedTicketType]}
                formatPrice={formatPrice}
                seatsData={seatsData}
            />

            {/* Tổng tiền và nút tiếp tục */}
            <BookingSummaryCard
                total={calculateTotal()}
                selectedSeatsCount={selectedSeats.length}
                formatPrice={formatPrice}
                onReserveSeats={onReserveSeats}
                isReserving={isReserving}
                hasSelectedSeats={selectedSeats.length > 0}
            />
        </div>
    );
};