"use client";


import { useGetListBookingsQuery } from "@/store/slices/bookings/bookingsApi";
import { Booking } from "@/types/bookings";
import React, { useState, useRef } from "react";
import { toast } from "sonner";
import PrintTicket from "./PrintTicket";
import StatsCards from "./StatsCards";
import FilterBar from "./FilterBar";
import BookingTable from "./BookingTable";
import BookingDetailModal from "./BookingDetailModal";
export default function StaffCounterPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const { data: bookings = [], isLoading, isError } = useGetListBookingsQuery();
  const [results, setResults] = useState<Booking[]>([]);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [printBooking, setPrintBooking] = useState<Booking | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  // Thống kê nhanh
  const stats = {
    total: bookings.length,
    paid: bookings.filter((b) => b.status === "Đã thanh toán").length,
    printed: bookings.filter((b) => b.printed).length,
    received: bookings.filter((b) => b.received).length,
    refunded: bookings.filter((b) => b.refunded).length,
  };

  const handleSearch = () => {
    let filtered = bookings.filter(
      (b) =>
        (b.code ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (b.phone ?? "").includes(search) ||
        (b.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (b.customer ?? "").toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== "all") filtered = filtered.filter((b) => b.status === statusFilter);
    if (dateFilter) filtered = filtered.filter((b) => b.date === dateFilter);
    setResults(filtered);
    if (filtered.length === 0) toast.error("Không tìm thấy đặt vé phù hợp");
  };

  const handlePrint = (booking: Booking) => {
    setPrintBooking(booking);
  };

  const handleRefund = (booking: Booking) => {
    toast.success(`Hoàn vé cho mã ${booking.code}`);
  };

  const handleReceive = (booking: Booking) => {
    toast.success(`Đã nhận vé cho mã ${booking.code}`);
  };

  const handleScanQR = () => {
    toast.info("Tính năng quét QR sẽ sớm có!");
  };

  React.useEffect(() => {
    setResults(bookings);
  }, [bookings]);

  React.useEffect(() => {
    if (isError) toast.error("Không tải được danh sách đặt vé");
  }, [isError]);

  return (
    <>
      <style>{`
        @media print {
          .print-area {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            min-height: 100vh !important;
            background: white !important;
            z-index: 9999 !important;
          }
          body > *:not(.print-area) { display: none !important; }
          .ticket-container { box-shadow: none !important; }
          @page { margin: 0; }
        }
      `}</style>
        <style>{`
          @media print {
            .print-area {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              width: 100vw !important;
              height: 100vh !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              min-height: 100vh !important;
              background: white !important;
              z-index: 9999 !important;
            }
            body > *:not(.print-area) { display: none !important; }
            .ticket-container { box-shadow: none !important; }
            @page { margin: 0; }
          }
        `}</style>
      <div className="py-8 px-2">
        <PrintTicket booking={printBooking} onClose={() => setPrintBooking(null)} />
        <h1 className="text-2xl font-bold mb-4">Quầy nhân viên - Tra cứu & In vé</h1>
        <StatsCards stats={stats} />
        <FilterBar
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          onSearch={handleSearch}
          onScanQR={handleScanQR}
        />
        <BookingTable
          isLoading={isLoading}
          results={results}
          onPrint={handlePrint}
          onReceive={handleReceive}
          onSelect={setSelected}
        />
        <BookingDetailModal
          booking={selected}
          onClose={() => setSelected(null)}
          onPrint={handlePrint}
          onReceive={handleReceive}
          onRefund={handleRefund}
        />
      </div>
    </>
  );
}
