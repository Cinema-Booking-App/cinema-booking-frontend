"use client";


import { useGetMyTicketsQuery, useGetTicketDetailQuery } from "@/store/slices/ticker/tickerApi";
import { Ticket, Calendar, Clock, MapPin, Armchair } from "lucide-react";
import Image from "next/image";
import { useState } from "react";


export default function MyTicketsPage() {
  const { data: bookings, isLoading } = useGetMyTicketsQuery();
  const [openBooking, setOpenBooking] = useState<any | null>(null);

  if (isLoading)
    return <p className="text-center py-8">Đang tải vé...</p>;

  if (!bookings || bookings.length === 0)
    return (
      <div className="text-center py-10 text-muted-foreground">
        Bạn chưa có vé nào.
      </div>
    );

  // Helper for trạng thái
  const getStatusBadge = (status: string) => {
    if (status === 'cancelled') return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Đã hủy</span>;
    if (status === 'upcoming') return <span className="px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">Sắp xem</span>;
    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Đã xem</span>;
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-red-600">
        <Ticket className="text-red-600" /> Vé của tôi
      </h1>

      {/* GRID HIỂN THỊ VÉ */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 justify-center"
      >
        {bookings.map((b: any) => (
          <div
            key={b.booking_code}
            className="relative flex flex-col bg-white w-[350px] mx-auto shadow-xl rounded-2xl border overflow-hidden hover:shadow-2xl transition cursor-pointer group"
            onClick={() => setOpenBooking(b)}
          >
            {/* Poster */}
            <div className="relative w-full h-52 bg-black">
              <Image
                src={b.poster_url || "/placeholder-movie.jpg"}
                alt={b.movie_title}
                fill
                className="object-cover"
              />
            </div>
            {/* Nội dung vé */}
            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-amber-400" />
                    {b.movie_title}
                  </h2>
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded border border-dashed border-amber-300 text-amber-600">
                    #{b.booking_code}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-1">
                  <div><span className="font-medium">Rạp:</span> {b.theater_name}</div>
                  <div><span className="font-medium">Phòng:</span> {b.room}</div>
                  <div><span className="font-medium">Ghế:</span> <span className="font-bold text-base text-amber-600">{b.seats?.join(", ")}</span></div>
                  <div><span className="font-medium">Ngày:</span> {b.date}</div>
                  <div><span className="font-medium">Giờ:</span> {b.time}</div>
                  <div><span className="font-medium">Thành phố:</span> {b.theater_city}</div>
                </div>
              </div>
              {/* Có thể bổ sung trạng thái hoặc tổng tiền nếu backend trả về */}
            </div>
            {/* Đường cắt răng cưa */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-11/12 h-3 border-b-2 border-dashed border-gray-300 z-10"></div>
          </div>
        ))}
      </div>

      {/* Dialog chi tiết booking */}
      {openBooking && (
        (() => { console.log('openBooking data:', openBooking); return null; })()
      )}
      {openBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={e => {
            if (e.target === e.currentTarget) setOpenBooking(null);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl border w-[400px] max-w-full overflow-hidden animate-fadeIn relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setOpenBooking(null)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl font-bold z-10">×</button>
            <div className="relative w-full h-60">
              <Image
                src={openBooking.poster_url || "/placeholder-movie.jpg"}
                fill
                alt="poster"
                className="object-cover"
              />
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-xl font-bold text-red-600 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-amber-400" />
                  {openBooking.movie_title}
                </h1>
                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded border border-dashed border-amber-300 text-amber-600">
                  #{openBooking.booking_code}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-2">
                <div><span className="font-medium">Rạp:</span> {openBooking.theater_name}</div>
                <div><span className="font-medium">Phòng:</span> {openBooking.room}</div>
                <div><span className="font-medium">Ngày:</span> {openBooking.date}</div>
                <div><span className="font-medium">Giờ:</span> {openBooking.time}</div>
                <div><span className="font-medium">Thành phố:</span> {openBooking.theater_city}</div>
                <div><span className="font-bold">Ghế:</span> {Array.isArray(openBooking.seats) ? openBooking.seats.join(', ') : openBooking.seats}</div>
              </div>
              {/* Hiển thị mã QR nếu backend trả `qr_code` ở cấp booking */}
              {openBooking.qr_code && (
                <div className="flex flex-col items-center mb-4">
                  <div className="font-semibold mb-1">Mã QR vé:</div>
                  <img
                    src={`data:image/png;base64,${openBooking.qr_code}`}
                    alt="QR vé"
                    className="w-40 h-40 mx-auto border rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
