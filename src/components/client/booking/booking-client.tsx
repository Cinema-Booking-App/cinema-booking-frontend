"use client";

import React, { useState, useMemo } from "react";
import { SeatMap } from "./seat-map";
import { BookingSidebar } from "./booking-sidebar";
import { useGetSeatsByRoomIdQuery } from "@/store/slices/rooms/roomsApi";
import { Seats } from "@/types/seats";



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
  const { data: seatsData, isLoading: seatsLoading } = useGetSeatsByRoomIdQuery(id);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedTicketType, setSelectedTicketType] = useState<"adult" | "child" | "student">("adult");

  // Tạo cấu hình ghế từ API data
  const seatConfig = useMemo(() => {
    if (!seatsData || seatsData.length === 0) {
      return {
        seatRows: [],
        seatColumns: 0,
        occupiedSeats: [],
        seatMatrix: new Map<string, Seats>()
      };
    }

    // Tìm số hàng và cột tối đa
    const maxRow = Math.max(...seatsData.map(seat => seat.row_number));
    const maxCol = Math.max(...seatsData.map(seat => seat.column_number));
    
    // Tạo danh sách hàng (A, B, C, ..., M, N, ...)
    const seatRows = Array.from({ length: maxRow }, (_, i) => 
      String.fromCharCode(65 + i) // A=65, B=66, ..., M=77, N=78
    );

    // Tạo danh sách ghế đã bị chiếm (không available)
    const occupiedSeats = seatsData
      .filter(seat => !seat.is_available)
      .map(seat => seat.seat_code);

    // Tạo map để dễ tra cứu thông tin ghế
    const seatMatrix = new Map<string, Seats>();
    seatsData.forEach(seat => {
      seatMatrix.set(seat.seat_code, seat);
    });

    return {
      seatRows,
      seatColumns: maxCol,
      occupiedSeats,
      seatMatrix
    };
  }, [seatsData]);

  const handleSeatClick = (seatId: string) => {
    const seatInfo = seatConfig.seatMatrix.get(seatId);
    if (!seatInfo || !seatInfo.is_available) return;

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

  if (seatsLoading) {
    return (
      <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải sơ đồ ghế...</p>
        </div>
      </div>
    );
  }

  if (!seatsData || seatsData.length === 0) {
    return (
      <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Không tìm thấy thông tin ghế</p>
          <p className="text-muted-foreground">Vui lòng thử lại sau hoặc liên hệ hỗ trợ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Phần chọn ghế */}
          <div className="lg:col-span-2">
            <SeatMap
              seatRows={seatConfig.seatRows}
              seatColumns={seatConfig.seatColumns}
              occupiedSeats={seatConfig.occupiedSeats}
              selectedSeats={selectedSeats}
              onSeatClick={handleSeatClick}
              seatsData={seatsData}
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
              seatsData={seatsData}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 