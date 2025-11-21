"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGetTicketDetailQuery } from "@/store/slices/ticker/tickerApi";
import Image from "next/image";
import { Calendar, Clock, Armchair, MapPin } from "lucide-react";

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const { data: ticket } = useGetTicketDetailQuery(Number(ticketId));

  const [qrBase64, setQrBase64] = useState<string | null>(null);
  

  // Fetch QR code as base64
  useEffect(() => {
    async function loadQR() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tickets/${ticketId}/qr-image`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const blob = await res.blob();
        const reader = new FileReader();

        reader.onloadend = () => {
          setQrBase64(reader.result as string); // base64 string
        };

        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("QR Load Error:", error);
      }
    }

    loadQR();
  }, [ticketId]);

  if (!ticket) return <div className="p-4">Không tìm thấy vé.</div>;

  return (
    <div className="container py-10 flex justify-center">
      <div className="w-[380px] bg-white shadow-xl rounded-2xl border overflow-hidden">

        {/* Poster */}
        <div className="relative w-full h-60">
          <Image
            src={ticket.poster_url || "/placeholder-movie.jpg"}
            fill
            alt="poster"
            className="object-cover"
          />
        </div>

        {/* Nội dung */}
        <div className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-red-600">
            {ticket.movie_title}
          </h1>

          <div className="space-y-2 text-sm">
            <div className="flex gap-2 items-center">
              <Calendar className="text-red-600" size={18} />
              <span>{ticket.date}</span>
            </div>

            <div className="flex gap-2 items-center">
              <Clock className="text-red-600" size={18} />
              <span>{ticket.time}</span>
            </div>

            <div className="flex gap-2 items-center">
              <MapPin className="text-red-600" size={18} />
              <span>
                {ticket.theater_name} — Phòng {ticket.room_name}
              </span>
            </div>

            <div className="flex gap-2 items-center">
              <Armchair className="text-red-600" size={18} />
              Ghế: <strong>{ticket.seat_code}</strong>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Mã đặt vé: <strong>{ticket.booking_code}</strong>
          </div>

          {/* QR Code */}
          <div className="mt-5 flex flex-col items-center bg-gray-50 border rounded-xl py-4">
            <h2 className="text-lg font-semibold text-red-600 mb-3">
              Mã QR Check-in
            </h2>

            {qrBase64 ? (
              <img src={qrBase64} className="w-48 h-48 shadow rounded-lg bg-white p-2" />
            ) : (
              <p className="text-sm opacity-70">Đang tải QR...</p>
            )}

            <p className="text-sm text-muted-foreground mt-3">
              Quét mã QR tại cửa soát vé 🎬
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
