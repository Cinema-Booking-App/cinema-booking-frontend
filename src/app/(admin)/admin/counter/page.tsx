"use client";


import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer, Search, Info, RefreshCw, Filter, X, CheckCircle, QrCode, Undo2, Ticket, User, Calendar, Film, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useGetListBookingsQuery } from '@/store/slices/bookings/bookingsApi';
import { Booking } from '@/types/bookings';

const statusOptions = [
  { value: "all", label: "Tất cả" },
  { value: "Đã thanh toán", label: "Đã thanh toán" },
  { value: "Chưa thanh toán", label: "Chưa thanh toán" },
  { value: "Đã hoàn vé", label: "Đã hoàn vé" },
];

export default function StaffCounterPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const { data: bookings = [], isLoading, isError } = useGetListBookingsQuery();
  const [results, setResults] = useState<Booking[]>([]);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  // Thống kê nhanh
  const stats = {
    total: bookings.length,
    paid: bookings.filter(b => b.status === "Đã thanh toán").length,
    printed: bookings.filter(b => b.printed).length,
    received: bookings.filter(b => b.received).length,
    refunded: bookings.filter(b => b.refunded).length,
  };

  const handleSearch = () => {
    // Filter client-side from the bookings result
    let filtered = bookings.filter(
      (b) => (
        (b.code ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (b.phone ?? '').includes(search) ||
        (b.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (b.customer ?? '').toLowerCase().includes(search.toLowerCase())
      )
    );
    if (statusFilter !== "all") filtered = filtered.filter(b => b.status === statusFilter);
    if (dateFilter) filtered = filtered.filter(b => b.date === dateFilter);
    setResults(filtered);
    if (filtered.length === 0) toast.error("Không tìm thấy đặt vé phù hợp");
  };

  const handlePrint = (booking: Booking) => {
    // TODO: Replace with real print logic
    toast.success(`In vé cho mã ${booking.code}`);
  };

  const handleRefund = (booking: Booking) => {
    // TODO: Replace with real refund logic
    toast.success(`Hoàn vé cho mã ${booking.code}`);
  };

  const handleReceive = (booking: Booking) => {
    // TODO: Replace with real receive logic
    toast.success(`Đã nhận vé cho mã ${booking.code}`);
  };

  const handleScanQR = () => {
    toast.info("Tính năng quét QR sẽ sớm có!");
  };

  // Sync results when bookings are loaded
  React.useEffect(() => {
    setResults(bookings);
  }, [bookings]);

  React.useEffect(() => {
    if (isError) toast.error('Không tải được danh sách đặt vé');
  }, [isError]);

  return (
    <div className=" py-8 px-2">
      <h1 className="text-2xl font-bold mb-4">Quầy nhân viên - Tra cứu & In vé</h1>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-6">
        <Card className="bg-blue-50 dark:bg-blue-900/30">
          <CardContent className="p-3 flex flex-col items-center">
            <Ticket className="w-6 h-6 text-blue-500 mb-1" />
            <span className="font-bold text-lg">{stats.total}</span>
            <span className="text-xs text-muted-foreground">Tổng vé hôm nay</span>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-900/30">
          <CardContent className="p-3 flex flex-col items-center">
            <CheckCircle className="w-6 h-6 text-green-500 mb-1" />
            <span className="font-bold text-lg">{stats.paid}</span>
            <span className="text-xs text-muted-foreground">Đã thanh toán</span>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 dark:bg-yellow-900/30">
          <CardContent className="p-3 flex flex-col items-center">
            <Printer className="w-6 h-6 text-yellow-500 mb-1" />
            <span className="font-bold text-lg">{stats.printed}</span>
            <span className="text-xs text-muted-foreground">Đã in vé</span>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-900/30">
          <CardContent className="p-3 flex flex-col items-center">
            <User className="w-6 h-6 text-purple-500 mb-1" />
            <span className="font-bold text-lg">{stats.received}</span>
            <span className="text-xs text-muted-foreground">Đã nhận vé</span>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-900/30">
          <CardContent className="p-3 flex flex-col items-center">
            <Undo2 className="w-6 h-6 text-red-500 mb-1" />
            <span className="font-bold text-lg">{stats.refunded}</span>
            <span className="text-xs text-muted-foreground">Đã hoàn/hủy</span>
          </CardContent>
        </Card>
      </div>

      {/* Thanh filter và tìm kiếm */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center">
          <Input
            placeholder="Nhập mã đặt vé, SĐT, email hoặc tên khách..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1"
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={() => setShowFilter(v => !v)} variant="outline" className="h-10 flex gap-2 items-center">
            <Filter className="w-4 h-4" />
            Bộ lọc
            <ChevronDown className={showFilter ? 'rotate-180 transition-transform' : 'transition-transform'} />
          </Button>
          <Button onClick={handleSearch} className="h-10 px-6 flex gap-2 items-center">
            <Search className="w-4 h-4" />
            Tra cứu
          </Button>
          <Button onClick={handleScanQR} variant="outline" className="h-10 flex gap-2 items-center">
            <QrCode className="w-4 h-4" />
            Quét QR
          </Button>
          <Button onClick={() => window.location.reload()} variant="ghost" className="h-10 flex gap-2 items-center">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardContent>
        {showFilter && (
          <div className="px-4 pb-4 flex flex-col sm:flex-row gap-4 items-center animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Trạng thái:</span>
              <select
                className="border rounded px-2 py-1"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Ngày chiếu:</span>
              <input
                type="date"
                className="border rounded px-2 py-1"
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        )}
      </Card>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đặt vé</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Phim</TableHead>
                <TableHead>Suất chiếu</TableHead>
                <TableHead>Ghế</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>In vé</TableHead>
                <TableHead>Nhận vé</TableHead>
                <TableHead>Hoàn vé</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(!isLoading && results.length === 0) && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                    Không có dữ liệu. Hãy nhập thông tin để tra cứu.
                  </TableCell>
                </TableRow>
              )}
              {results.map(b => (
                <TableRow key={b.code} className="hover:bg-accent/30">
                  <TableCell>
                    <button className="text-primary underline" onClick={() => setSelected(b)}>
                      {b.code}
                    </button>
                  </TableCell>
                  <TableCell>{b.customer}</TableCell>
                  <TableCell>{b.movie}</TableCell>
                  <TableCell>{b.showtime}</TableCell>
                  <TableCell>{b.seats}</TableCell>
                  <TableCell>
                    <span className={b.status === 'Đã thanh toán' ? 'text-green-600' : b.status === 'Đã hoàn vé' ? 'text-red-600' : 'text-yellow-600'}>
                      {b.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant={b.printed ? "default" : "outline"} onClick={() => handlePrint(b)} disabled={b.printed}>
                      <Printer className="w-4 h-4 mr-1" /> {b.printed ? "Đã in" : "In vé"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant={b.received ? "default" : "outline"} onClick={() => handleReceive(b)} disabled={b.received || !b.printed}>
                      <CheckCircle className="w-4 h-4 mr-1" /> {b.received ? "Đã nhận" : "Nhận vé"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant={b.refunded ? "default" : "outline"} onClick={() => handleRefund(b)} disabled={b.refunded}>
                      <Undo2 className="w-4 h-4 mr-1" /> {b.refunded ? "Đã hoàn" : "Hoàn vé"}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => setSelected(b)}>
                      <Info className="w-4 h-4 mr-1" /> Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Chi tiết đặt vé */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg max-w-lg w-full p-6 relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              onClick={() => setSelected(null)}
            >
              <span className="text-xl">×</span>
            </button>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" /> Thông tin đặt vé
            </h2>
            <div className="mb-2 text-sm">
              <div><b>Mã đặt vé:</b> {selected.code}</div>
              <div><b>Khách hàng:</b> {selected.customer} ({selected.phone})</div>
              <div><b>Email:</b> {selected.email}</div>
              <div><b>Phim:</b> {selected.movie}</div>
              <div><b>Suất chiếu:</b> {selected.showtime}</div>
              <div><b>Ghế:</b> {selected.seats}</div>
              <div><b>Trạng thái:</b> <span className={selected.status === 'Đã thanh toán' ? 'text-green-600' : selected.status === 'Đã hoàn vé' ? 'text-red-600' : 'text-yellow-600'}>{selected.status}</span></div>
            </div>
            <div className="mb-4">
              <b>Vé:</b>
              <ul className="list-disc ml-6">
                {selected.tickets.map((t, i) => (
                  <li key={i}>{t.seat} - {t.type}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => handlePrint(selected)} className="bg-primary text-white">
                <Printer className="w-4 h-4 mr-1" /> In vé
              </Button>
              <Button onClick={() => handleReceive(selected)} variant="outline" disabled={selected.received || !selected.printed}>
                <CheckCircle className="w-4 h-4 mr-1" /> Đã nhận vé
              </Button>
              <Button onClick={() => handleRefund(selected)} variant="outline" disabled={selected.refunded}>
                <Undo2 className="w-4 h-4 mr-1" /> Hoàn vé
              </Button>
              <Button variant="outline" onClick={() => setSelected(null)}>
                Đóng
              </Button>
            </div>
            <div className="mt-4 flex flex-col items-center">
              <span className="text-xs text-muted-foreground mb-1">Mã QR check-in</span>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                <QrCode className="w-16 h-16 text-blue-500" />
                <div className="text-xs text-center mt-1">{selected.qr}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
