// Debug component to check booking data
"use client";

import { useAppSelector } from "@/store/store";
import { useEffect } from "react";

export default function BookingDebug() {
  const bookingData = useAppSelector((state) => state.booking);

  useEffect(() => {
    console.log("🔍 Booking Data Debug:", bookingData);
  }, [bookingData]);

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm">
      <h4 className="font-bold mb-2">🔍 Booking Debug</h4>
      <div>
        <div>Movie ID: {bookingData.movieId || '❌'}</div>
        <div>Room ID: {bookingData.roomId || '❌'}</div>
        <div>Showtime ID: {bookingData.showtimeId || '❌'}</div>
        <div>Movie Title: {bookingData.movieTitle || '❌'}</div>
        <div>Theater: {bookingData.theaterName || '❌'}</div>
        <div>Date: {bookingData.showDate || '❌'}</div>
        <div>Time: {bookingData.showTime || '❌'}</div>
      </div>
    </div>
  );
}