"use client";

import React, { useState } from "react";
import { SeatMap } from "./seat-map";
import { BookingSidebar } from "./booking-sidebar";

// Cấu hình ghế
const seatRows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
const seatColumns = 12;

// Ghế đã được đặt (mô phỏng)
const occupiedSeats = ["A1", "A2", "B5", "C8", "D3", "E7", "F10", "G4", "H9", "I6", "J2", "K11", "L8"];

interface BookingClientProps {
  id: string;
  mockData: {
    movie: {
      title: string;
      poster: string;
      duration: string;
    };
    schedule: {
      date: string;
      time: string;
      theater: string;
      room: string;
    };
    price: {
      adult: number;
      child: number;
      student: number;
    };
  };
}

export default function BookingClient({ id, mockData }: BookingClientProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedTicketType, setSelectedTicketType] = useState<"adult" | "child" | "student">("adult");

  const handleSeatClick = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return;

    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(seat => seat !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Phần chọn ghế */}
          <div className="lg:col-span-2">
            <SeatMap
              seatRows={seatRows}
              seatColumns={seatColumns}
              occupiedSeats={occupiedSeats}
              selectedSeats={selectedSeats}
              onSeatClick={handleSeatClick}
            />
          </div>

          {/* Thông tin đặt vé */}
          <div>
            <BookingSidebar
              movie={mockData.movie}
              schedule={mockData.schedule}
              price={mockData.price}
              selectedSeats={selectedSeats}
              selectedTicketType={selectedTicketType}
              formatPrice={formatPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 