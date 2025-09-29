"use client";

import { useState } from "react";
import { Download, RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingFilters } from "@/components/admin/bookings/booking-filters";
import { BookingStats } from "@/components/admin/bookings/booking-stats";
import { BookingTable } from "@/components/admin/bookings/booking-table";
import { BookingDetailDialog } from "@/components/admin/bookings/booking-detail-dialog";

// Mock data for demonstration
const mockBookings = [
  {
    id: "TKT001",
    movieName: "Avengers: Endgame",
    cinema: "CGV Aeon Mall",
    cinemaAddress: "30 Bờ Bao Tân Thắng, Quận 7, TP.HCM",
    schedule: {
      date: "2025-01-15",
      time: "19:30",
      room: "Phòng 3"
    },
    seat: "A12",
    ticketType: "2D",
    customer: {
      name: "Nguyễn Văn A",
      phone: "0901234567",
      email: "nguyenvana@email.com",
      customerId: "CUS001"
    },
    payment: {
      status: "paid",
      method: "Credit Card",
      amount: 85000
    },
    ticketStatus: "unused",
    expiryDate: "2025-01-15T21:30:00",
    promotion: "GIAM20K",
    notes: "Vé không hoàn lại sau khi sử dụng",
    bookingDate: "2025-01-10T14:30:00"
  },
  {
    id: "TKT002",
    movieName: "Spider-Man: No Way Home",
    cinema: "Lotte Cinema Diamond",
    cinemaAddress: "Lầu 7, Diamond Plaza, 34 Lê Duẩn, Quận 1, TP.HCM",
    schedule: {
      date: "2025-01-16",
      time: "20:00",
      room: "Phòng 1"
    },
    seat: "B05",
    ticketType: "3D",
    customer: {
      name: "Trần Thị B",
      phone: "0912345678",
      email: "tranthib@email.com",
      customerId: "CUS002"
    },
    payment: {
      status: "pending",
      method: "E-Wallet",
      amount: 120000
    },
    ticketStatus: "unused",
    expiryDate: "2025-01-16T22:00:00",
    promotion: null,
    notes: "Thanh toán trong vòng 15 phút",
    bookingDate: "2025-01-10T15:45:00"
  },
  {
    id: "TKT003",
    movieName: "The Batman",
    cinema: "BHD Star Bitexco",
    cinemaAddress: "Lầu 6, Bitexco Financial Tower, 2 Hải Triều, Quận 1, TP.HCM",
    schedule: {
      date: "2025-01-14",
      time: "18:30",
      room: "Phòng 2"
    },
    seat: "C08",
    ticketType: "VIP",
    customer: {
      name: "Lê Văn C",
      phone: "0923456789",
      email: "levanc@email.com",
      customerId: "CUS003"
    },
    payment: {
      status: "paid",
      method: "Bank Transfer",
      amount: 150000
    },
    ticketStatus: "used",
    expiryDate: "2025-01-14T20:30:00",
    promotion: "VIP10",
    notes: "Vé VIP bao gồm đồ uống và bắp rang",
    bookingDate: "2025-01-09T10:20:00"
  },
  {
    id: "TKT004",
    movieName: "Black Panther: Wakanda Forever",
    cinema: "Galaxy Cinema",
    cinemaAddress: "Lầu 3, Vincom Center, 72 Lê Thánh Tôn, Quận 1, TP.HCM",
    schedule: {
      date: "2025-01-17",
      time: "21:00",
      room: "Phòng 4"
    },
    seat: "D15",
    ticketType: "2D",
    customer: {
      name: "Phạm Thị D",
      phone: "0934567890",
      email: "phamthid@email.com",
      customerId: "CUS004"
    },
    payment: {
      status: "cancelled",
      method: "Credit Card",
      amount: 95000
    },
    ticketStatus: "cancelled",
    expiryDate: "2025-01-17T23:00:00",
    promotion: null,
    notes: "Vé đã được hoàn tiền",
    bookingDate: "2025-01-10T16:15:00"
  }
];

export default function ManagementBooking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ticketStatusFilter, setTicketStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null);

  // UI Helper Functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTicketStatusColor = (status: string) => {
    switch (status) {
      case "unused":
        return "bg-blue-100 text-blue-800";
      case "used":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý vé</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi tất cả vé đã đặt trong hệ thống
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Filters */}
      <BookingFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        ticketStatusFilter={ticketStatusFilter}
        onTicketStatusFilterChange={setTicketStatusFilter}
      />

      {/* Statistics */}
      <BookingStats
        totalBookings={mockBookings.length}
        paidBookings={mockBookings.filter(b => b.payment.status === "paid").length}
        pendingBookings={mockBookings.filter(b => b.payment.status === "pending").length}
        cancelledBookings={mockBookings.filter(b => b.payment.status === "cancelled").length}
        totalRevenue={mockBookings
          .filter(b => b.payment.status === "paid")
          .reduce((sum, b) => sum + b.payment.amount, 0)
        }
        previousPeriodRevenue={mockBookings
          .filter(b => b.payment.status === "paid")
          .reduce((sum, b) => sum + b.payment.amount, 0) * 0.85
        }
      />

      {/* Bookings Table */}
      <BookingTable
        bookings={mockBookings}
        onViewDetails={(booking) => setSelectedBooking({
          ...mockBookings.find(b => b.id === booking.id)!
        })}
        getStatusColor={getStatusColor}
        getTicketStatusColor={getTicketStatusColor}
        getStatusIcon={getStatusIcon}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />
      <BookingDetailDialog
        booking={selectedBooking}
        open={!!selectedBooking}
        onOpenChange={(open) => !open && setSelectedBooking(null)}
        getStatusColor={getStatusColor}
        getTicketStatusColor={getTicketStatusColor}
        getStatusIcon={getStatusIcon}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        formatDateTime={formatDateTime}
      />
    </div>
  );
}
