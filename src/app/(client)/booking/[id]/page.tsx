import BookingClient from "@/components/client/booking/booking-client";
import React from "react";


// Mock data cho giao diện
const mockData = {
  movie: {
    title: "Thanh Gươm Diệt Quỷ: Phép Màu Từ Hơi Thở",
    poster: "/images/kimetsu-official-poster.jpg",
    duration: "115 phút",
  },
  schedule: {
    date: "08/07/2025",
    time: "18:00",
    theater: "Cinestar Quốc Thanh",
    room: "Phòng 1",
  },
  price: {
    adult: 120000,
    child: 90000,
    student: 100000,
  },
};

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookingClient id={id} mockData={mockData} />;
} 