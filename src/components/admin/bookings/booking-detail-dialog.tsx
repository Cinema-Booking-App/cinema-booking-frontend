"use client";

import { 
  Ticket, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  QrCode, 
  Edit, 
  Trash2, 
  Printer, 
  Download 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface BookingDetailDialogProps {
  booking: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getStatusColor: (status: string) => string;
  getTicketStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  formatDateTime: (dateString: string) => string;
}

export function BookingDetailDialog({
  booking,
  open,
  onOpenChange,
  getStatusColor,
  getTicketStatusColor,
  getStatusIcon,
  formatCurrency,
  formatDate,
  formatDateTime
}: BookingDetailDialogProps) {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Chi tiết vé {booking.id}
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về vé và khách hàng
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thông tin vé */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin vé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã vé:</span>
                <span className="font-medium">{booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tên phim:</span>
                <span className="font-medium">{booking.movieName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loại vé:</span>
                <Badge variant="outline">{booking.ticketType}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ghế:</span>
                <Badge variant="outline">{booking.seat}</Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{booking.cinema}</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">{booking.cinemaAddress}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatDate(booking.schedule.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{booking.schedule.time} - {booking.schedule.room}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin khách hàng */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{booking.customer.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{booking.customer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{booking.customer.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã khách hàng:</span>
                <span className="font-medium">{booking.customer.customerId}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày đặt:</span>
                <span>{formatDateTime(booking.bookingDate)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin thanh toán */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{booking.payment.method}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(booking.payment.status)}
                <Badge className={getStatusColor(booking.payment.status)}>
                  {booking.payment.status === "paid" ? "Đã thanh toán" :
                   booking.payment.status === "pending" ? "Đang chờ" : "Đã hủy"}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(booking.payment.amount)}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trạng thái vé:</span>
                <Badge className={getTicketStatusColor(booking.ticketStatus)}>
                  {booking.ticketStatus === "unused" ? "Chưa sử dụng" :
                   booking.ticketStatus === "used" ? "Đã sử dụng" : "Đã hủy"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hạn sử dụng:</span>
                <span>{formatDateTime(booking.expiryDate)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin bổ sung */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin bổ sung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {booking.promotion && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Khuyến mãi:</span>
                  <Badge variant="secondary">{booking.promotion}</Badge>
                </div>
              )}
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Ghi chú:</p>
                <p className="text-sm">{booking.notes}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Hỗ trợ khách hàng:</p>
                <p className="text-sm text-muted-foreground">Hotline: 1900-xxxx</p>
                <p className="text-sm text-muted-foreground">Email: support@cinema.com</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline">
            <QrCode className="h-4 w-4 mr-2" />
            Xem mã QR
          </Button>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            In vé
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Tải vé
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Hủy vé
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 