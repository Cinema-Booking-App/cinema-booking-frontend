import React from "react";
import { Button } from "@/components/ui/button";
import { Printer, CheckCircle, Undo2, QrCode, Info } from "lucide-react";
import { Booking } from '@/types/bookings';

interface BookingDetailModalProps {
  booking: Booking | null;
  onClose: () => void;
  onPrint: (b: Booking) => void;
  onReceive: (b: Booking) => void;
  onRefund: (b: Booking) => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ booking, onClose, onPrint, onReceive, onRefund }) => {
  if (!booking) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg max-w-lg w-full p-6 relative animate-fade-in">
        <button
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <span className="text-xl">×</span>
        </button>
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-500" /> Thông tin đặt vé
        </h2>
        <div className="mb-2 text-sm">
          <div><b>Mã đặt vé:</b> {booking.code}</div>
          <div><b>Khách hàng:</b> {booking.customer} ({booking.phone})</div>
          <div><b>Email:</b> {booking.email}</div>
          <div><b>Phim:</b> {booking.movie}</div>
          <div><b>Suất chiếu:</b> {booking.showtime}</div>
          <div><b>Ghế:</b> {booking.seats}</div>
          <div><b>Trạng thái:</b> <span className={booking.status === 'Đã thanh toán' ? 'text-green-600' : booking.status === 'Đã hoàn vé' ? 'text-red-600' : 'text-yellow-600'}>{booking.status}</span></div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => onPrint(booking)} className="bg-primary text-white">
            <Printer className="w-4 h-4 mr-1" /> In vé
          </Button>
          <Button onClick={() => onReceive(booking)} variant="outline" disabled={booking.received || !booking.printed}>
            <CheckCircle className="w-4 h-4 mr-1" /> Đã nhận vé
          </Button>
          <Button onClick={() => onRefund(booking)} variant="outline" disabled={booking.refunded}>
            <Undo2 className="w-4 h-4 mr-1" /> Hoàn vé
          </Button>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
        <div className="mt-4 flex flex-col items-center">
          <span className="text-xs text-muted-foreground mb-1">Mã QR check-in</span>
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
            {booking.qr_code && (
              <div className="flex flex-col items-center mb-4">
                <img
                  src={`data:image/png;base64,${booking.qr_code}`}
                  alt="QR vé"
                  className="w-40 h-40 mx-auto border rounded-lg"
                />
              </div>
            )}          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;
