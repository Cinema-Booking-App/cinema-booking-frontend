"use client";

import Link from "next/link";
import { useGetMyTicketsQuery } from "@/store/slices/ticker/tickerApi";
import { Ticket, Calendar, Clock, MapPin, Armchair } from "lucide-react";
import Image from "next/image";

export default function MyTicketsPage() {
  const { data: tickets, isLoading } = useGetMyTicketsQuery();

  if (isLoading)
    return <p className="text-center py-8">Đang tải vé...</p>;

  if (!tickets || tickets.length === 0)
    return (
      <div className="text-center py-10 text-muted-foreground">
        Bạn chưa có vé nào.
      </div>
    );

  return (
  <div className="container py-10">
    <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-red-600">
      <Ticket className="text-red-600" /> Vé của tôi
    </h1>

    {/* GRID HIỂN THỊ VÉ */}
    <div
      className="
        grid 
        grid-cols-1 
        sm:grid-cols-2
        xl:grid-cols-3
        gap-10
        justify-center
      "
    >
      {tickets.map((t: any) => (
        <Link
          key={t.ticket_id}
          href={`/myticket/${t.ticket_id}`}
          className="bg-white w-[350px] mx-auto shadow-xl rounded-2xl border overflow-hidden hover:shadow-2xl transition"
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

          {/* Nội dung */}
          <div className="p-5 space-y-3">
            <h2 className="text-xl font-bold text-red-600">
              {t.movie_title}
            </h2>

            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} className="text-red-600" />
              <span>{t.date}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} className="text-red-600" />
              <span>{t.time}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} className="text-red-600" />
              <span>{t.theater_name} — Phòng {t.room}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Armchair size={16} className="text-red-600" />
              Ghế: <strong>{t.seat_code}</strong>
            </div>

            <div className="text-xs text-muted-foreground pt-1">
              Mã đặt vé: <strong>{t.booking_code}</strong>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="bg-red-600/10 text-red-600 text-center py-3 font-medium hover:bg-red-600 hover:text-white transition">
            Xem chi tiết & QR Code
          </div>
        </Link>
      ))}
    </div>
  </div>
);

}
