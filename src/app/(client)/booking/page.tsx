"use client";
import React from "react";
import { useAppSelector } from "@/store/store";
import BookingClient from "@/components/client/booking/booking-client";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function BookingPage() {
    const bookingData = useAppSelector((state) => state.booking);


  // Tạo dữ liệu thực từ Redux store
  const realBookingData = {
    movie: {
      title: bookingData.movieTitle!,
      poster: bookingData.moviePoster!, // Có thể lấy từ API sau
      duration: "115 phút", // Có thể lấy từ API sau
    },
    schedule: {
      date: format(new Date(bookingData.showDate!), "dd/MM/yyyy", { locale: vi }),
      time: bookingData.showTime!,
      theater: bookingData.theaterName!,
      room: `Phòng ${bookingData.roomId}`,
      price: bookingData.ticketPrice || 0, // Giá vé có thể lấy từ API sau
    },
  };

  return (
    <BookingClient
      id={bookingData.roomId ?? 0}
      showtimeId={bookingData.showtimeId ?? 0} 
      mockData={realBookingData}
    />
  );

}