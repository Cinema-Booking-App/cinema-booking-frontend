"use client";


import { useGetMyTicketsQuery, useGetTicketDetailQuery } from "@/store/slices/ticker/tickerApi";
import { Ticket, Calendar, Clock, MapPin, Armchair } from "lucide-react";
import Image from "next/image";
import { useState } from "react";


export default function MyTicketsPage() {
  const { data: tickets, isLoading } = useGetMyTicketsQuery();
  const [openId, setOpenId] = useState<number|null>(null);
  const { data: ticketDetail } = useGetTicketDetailQuery(openId!, { skip: openId === null });

  if (isLoading)
    return <p className="text-center py-8">Đang tải vé...</p>;

  if (!tickets || tickets.length === 0)
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
        {tickets.map((t: any) => (
          <div
            key={t.ticket_id}
            className="relative flex flex-col bg-white w-[350px] mx-auto shadow-xl rounded-2xl border overflow-hidden hover:shadow-2xl transition cursor-pointer group"
            onClick={() => setOpenId(t.ticket_id)}
          >
            {/* Poster */}
            <div className="relative w-full h-52 bg-black">
              <Image
                src={t.poster_url || "/placeholder-movie.jpg"}
                alt={t.movie_title}
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
                    {t.movie_title}
                  </h2>
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded border border-dashed border-amber-300 text-amber-600">
                    #{t.booking_code}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-1">
                  <div><span className="font-medium">Rạp:</span> {t.theater_name}</div>
                  <div><span className="font-medium">Phòng:</span> {t.room}</div>
                  <div><span className="font-medium">Ghế:</span> <span className="font-bold text-base text-amber-600">{t.seat_code}</span></div>
                  <div><span className="font-medium">Ngày:</span> {t.date}</div>
                  <div><span className="font-medium">Giờ:</span> {t.time}</div>
                  <div><span className="font-medium">Thành phố:</span> {t.theater_city}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                {getStatusBadge(t.status || "completed")}
                <div className="font-semibold text-lg text-amber-700">
                  {t.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(t.price) : '—'}
                </div>
              </div>
            </div>
            {/* Đường cắt răng cưa */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-11/12 h-3 border-b-2 border-dashed border-gray-300 z-10"></div>
          </div>
        ))}
      </div>

      {/* Dialog chi tiết vé */}
      {openId && ticketDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={e => {
            if (e.target === e.currentTarget) setOpenId(null);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl border w-[400px] max-w-full overflow-hidden animate-fadeIn relative" onClick={e => e.stopPropagation()}>
            {/* Nút đóng */}
            <button onClick={() => setOpenId(null)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl font-bold z-10">×</button>
            {/* Poster */}
            <div className="relative w-full h-60">
              <Image
                src={ticketDetail.poster_url || "/placeholder-movie.jpg"}
                fill
                alt="poster"
                className="object-cover"
              />
            </div>
            {/* Nội dung vé */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-xl font-bold text-red-600 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-amber-400" />
                  {ticketDetail.movie_title}
                </h1>
                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded border border-dashed border-amber-300 text-amber-600">
                  #{ticketDetail.booking_code}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-2">
                <div><span className="font-medium">Rạp:</span> {ticketDetail.theater_name}</div>
                <div><span className="font-medium">Phòng:</span> {ticketDetail.room_name || ticketDetail.room}</div>
                <div><span className="font-medium">Ghế:</span> <span className="font-bold text-base text-amber-600">{ticketDetail.seat_code}</span></div>
                <div><span className="font-medium">Ngày:</span> {ticketDetail.date}</div>
                <div><span className="font-medium">Giờ:</span> {ticketDetail.time}</div>
                <div><span className="font-medium">Thành phố:</span> {ticketDetail.theater_city}</div>
              </div>
              <div className="flex items-center justify-between mt-2">
                {getStatusBadge(ticketDetail.status || "completed")}
                <div className="font-semibold text-lg text-amber-700">
                  {ticketDetail.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ticketDetail.price) : '—'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
