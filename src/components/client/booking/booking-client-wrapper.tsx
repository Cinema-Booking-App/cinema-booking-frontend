"use client";
import React from "react";
import { useAppSelector } from "@/store/store";
import BookingClient from "@/components/client/booking/booking-client";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import LoadingComponent from "@/components/ui/cinema-loading";

export default function BookingClientWrapper() {
  const bookingData = useAppSelector((state) => state.booking);

  // Kiểm tra nếu không có dữ liệu booking
  if (!bookingData.movieId || !bookingData.roomId || !bookingData.showtimeId) {
    return (
      <LoadingComponent />
    );
  }

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
    },
    price: {
      adult: bookingData.ticketPrice!,
      child: Math.floor(bookingData.ticketPrice! * 0.75), // 75% giá người lớn
      student: Math.floor(bookingData.ticketPrice! * 0.83), // 83% giá người lớn
    },
  };

  return <BookingClient id={bookingData.roomId} showtimeId={bookingData.showtimeId} mockData={realBookingData} />;
}