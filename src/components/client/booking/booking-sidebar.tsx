import React from "react";
import { MovieInfoCard } from "./movie-info-card";
import { SelectedSeatsCard } from "./selected-seats-card";
import { BookingSummaryCard } from "./booking-summary-card";

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
}

export const BookingSidebar: React.FC<BookingSidebarProps> = ({
  movie,
  schedule,
  price,
  selectedSeats,
  selectedTicketType,
  formatPrice
}) => {
  const calculateTotal = () => {
    return selectedSeats.length * price[selectedTicketType];
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
      />

      {/* Tổng tiền và nút tiếp tục */}
      <BookingSummaryCard
        total={calculateTotal()}
        selectedSeatsCount={selectedSeats.length}
        formatPrice={formatPrice}
      />
    </div>
  );
};