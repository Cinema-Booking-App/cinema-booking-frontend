"use client";
import React from "react";
import { useAppSelector } from "@/store/store";
import BookingClient from "@/components/client/booking/booking-client";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function BookingClientWrapper() {
  const bookingData = useAppSelector((state) => state.booking);

  // Kiểm tra nếu không có dữ liệu booking
  if (!bookingData.movieId || !bookingData.roomId || !bookingData.showtimeId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Không có thông tin đặt vé</h2>
          <p className="text-gray-600">Vui lòng chọn suất chiếu trước khi đặt vé.</p>
          <div className="mt-4 text-sm text-red-600">
            <p>Missing data:</p>
            <ul>
              {!bookingData.movieId && <li>- Movie ID</li>}
              {!bookingData.roomId && <li>- Room ID</li>}
              {!bookingData.showtimeId && <li>- Showtime ID</li>}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Tạo dữ liệu thực từ Redux store
  const realBookingData = {
    movie: {
      title: bookingData.movieTitle!,
      poster: "/images/kimetsu-official-poster.jpg", // Có thể lấy từ API sau
      duration: "115 phút", // Có thể lấy từ API sau
    },
    schedule: {
      date: format(new Date(bookingData.showDate!), "dd/MM/yyyy", { locale: vi }),
      time: bookingData.showTime!,
      theater: bookingData.theaterName!,
      room: `Phòng ${bookingData.roomId}`,
    },
    price: {
      adult: bookingData.ticketPrice!,
      child: Math.floor(bookingData.ticketPrice! * 0.75), // 75% giá người lớn
      student: Math.floor(bookingData.ticketPrice! * 0.83), // 83% giá người lớn
    },
  };

  return <BookingClient id={bookingData.roomId} showtimeId={bookingData.showtimeId} mockData={realBookingData} />;
}