import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Edit, Delete, Film } from "lucide-react";

interface RecentBookingsTableProps {
  bookings: any[];
  getInitials: (name: string) => string;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const RecentBookingsTable: React.FC<RecentBookingsTableProps> = ({ bookings, getInitials, getStatusColor, getStatusText }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Khách hàng</TableHead>
        <TableHead>Phim</TableHead>
        <TableHead>Ngày/Giờ</TableHead>
        <TableHead>Ghế</TableHead>
        <TableHead>Trạng thái</TableHead>
        <TableHead>Thành tiền</TableHead>
        <TableHead className="text-right">Hành động</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {bookings.map((booking) => (
        <TableRow key={booking.id}>
          <TableCell>
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback>{getInitials(booking.customer)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{booking.customer}</div>
                <div className="text-sm text-muted-foreground">{booking.email}</div>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-2">
              <Film className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{booking.movie}</span>
            </div>
          </TableCell>
          <TableCell>
            <div>
              <div className="text-sm">{booking.date}</div>
              <div className="text-xs text-muted-foreground">{booking.time}</div>
            </div>
          </TableCell>
          <TableCell>
            <Badge variant="secondary">{booking.seats}</Badge>
          </TableCell>
          <TableCell>
            <Badge variant="outline" className={getStatusColor(booking.status)}>{getStatusText(booking.status)}</Badge>
          </TableCell>
          <TableCell>
            <span className="font-medium">
              {(() => {
                let total = 0;
                if (Array.isArray(booking.tickets) && booking.tickets.length > 0) {
                  total = booking.tickets.reduce((sum: number, t: { price?: number | null }) => sum + (t.price || 0), 0);
                } else if (typeof booking.amount === 'number') {
                  total = booking.amount;
                }
                return `₫${total.toLocaleString()}`;
              })()}
            </span>
          </TableCell>
          <TableCell className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Mở menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Delete className="mr-2 h-4 w-4" />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default RecentBookingsTable;
