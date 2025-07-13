"use client";

import { useState } from "react";
import { 
  Eye, 
  Edit, 
  Trash2, 
  QrCode, 
  MoreHorizontal, 
  Printer, 
  Download,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface BookingTableProps {
  bookings: {
    id: string;
    movieName: string;
    cinema: string;
    customer: {
      name: string;
      phone: string;
    };
    schedule: {
      date: string;
      time: string;
      room: string;
    };
    seat: string;
    payment: {
      status: string;
      amount: number;
    };
    ticketStatus: string;
  }[];
  onViewDetails: (booking: {
    id: string;
    movieName: string;
    cinema: string;
    customer: {
      name: string;
      phone: string;
    };
    schedule: {
      date: string;
      time: string;
      room: string;
    };
    seat: string;
    payment: {
      status: string;
      amount: number;
    };
    ticketStatus: string;
  }) => void;
  getStatusColor: (status: string) => string;
  getTicketStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

export function BookingTable({
  bookings,
  onViewDetails,
  getStatusColor,
  getTicketStatusColor,
  getStatusIcon,
  formatCurrency,
  formatDate
}: BookingTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // UI Pagination
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = bookings.slice(startIndex, endIndex);

  // UI Sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === "asc" ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )
        )}
      </div>
    </TableHead>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Danh sách vé</CardTitle>
            <CardDescription>
              Hiển thị {currentBookings.length} vé trong tổng số {bookings.length} vé
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Hiển thị:</span>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader field="id">Mã vé</SortableHeader>
              <SortableHeader field="movieName">Tên phim</SortableHeader>
              <SortableHeader field="customer.name">Khách hàng</SortableHeader>
              <SortableHeader field="schedule.date">Suất chiếu</SortableHeader>
              <TableHead>Ghế</TableHead>
              <SortableHeader field="payment.amount">Thanh toán</SortableHeader>
              <TableHead>Trạng thái vé</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentBookings.map((booking) => (
              <TableRow key={booking.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{booking.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{booking.movieName}</p>
                    <p className="text-sm text-muted-foreground">{booking.cinema}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{booking.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{booking.customer.phone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{formatDate(booking.schedule.date)} {booking.schedule.time}</p>
                    <p className="text-sm text-muted-foreground">{booking.schedule.room}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{booking.seat}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(booking.payment.status)}>
                      {getStatusIcon(booking.payment.status)}
                      <span className="ml-1">
                        {booking.payment.status === "paid" ? "Đã thanh toán" :
                         booking.payment.status === "pending" ? "Đang chờ" : "Đã hủy"}
                      </span>
                    </Badge>
                    <p className="text-sm font-medium">{formatCurrency(booking.payment.amount)}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getTicketStatusColor(booking.ticketStatus)}>
                    {booking.ticketStatus === "unused" ? "Chưa sử dụng" :
                     booking.ticketStatus === "used" ? "Đã sử dụng" : "Đã hủy"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onViewDetails(booking)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <QrCode className="h-4 w-4 mr-2" />
                        Xem mã QR
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Printer className="h-4 w-4 mr-2" />
                        In vé
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Tải vé
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hủy vé
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Hiển thị {startIndex + 1} đến {Math.min(endIndex, bookings.length)} trong tổng số {bookings.length} vé
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Trước
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 