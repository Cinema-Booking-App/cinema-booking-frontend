import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { Seats } from "@/types/seats";
import { formatPrice } from "@/utils/date";

interface SelectedSeatsCardProps {
  selectedSeats: string[];
  ticketPrice: number;
  seatsData?: Seats[];
  reservedSeats?: any[];
  sessionId?: string;
}

export const SelectedSeatsCard: React.FC<SelectedSeatsCardProps> = ({
  selectedSeats,
  ticketPrice,
  seatsData,
  reservedSeats = [],
  sessionId = ''
}) => {
  const getSeatPrice = (seatId: string) => {
    if (!seatsData) return ticketPrice;
    
    const seatInfo = seatsData.find(seat => seat.seat_code === seatId);
    if (!seatInfo) return ticketPrice;
    
    // Tính giá theo loại ghế (có thể điều chỉnh theo logic business)
    const basePrice = ticketPrice;
    switch (seatInfo.seat_type.toLowerCase()) {
      case 'premium':
        return basePrice * 1.2; // Premium +20%
      case 'vip':
        return basePrice * 1.5; // VIP +50%
      case 'couple':
        return basePrice * 2.0; // Couple x2 (2 ghế)
      case 'regular':
      default:
        return basePrice;
    }
  };

  // Kiểm tra ghế nào đã được reserve bởi user hiện tại
  const getReservationStatus = (seatCode: string) => {
    if (!seatsData || !sessionId) return { isReserved: false, status: 'unselected' };
    
    const seatInfo = seatsData.find(seat => seat.seat_code === seatCode);
    if (!seatInfo) return { isReserved: false, status: 'unselected' };

    const reservation = reservedSeats.find(res => 
      res.seat_id === seatInfo.seat_id && 
      res.user_session === sessionId
    );

    if (reservation) {
      return { 
        isReserved: true, 
        status: reservation.status,
        expiresAt: reservation.expires_at 
      };
    }

    return { isReserved: false, status: 'selected' };
  };

  // Combine selected seats và reserved seats của user
  const allUserSeats = [...new Set([...selectedSeats])];
  const myReservedSeats = reservedSeats
    .filter(res => res.user_session === sessionId)
    .map(res => {
      const seat = seatsData?.find(s => s.seat_id === res.seat_id);
      return seat?.seat_code;
    })
    .filter(Boolean);

  const combinedSeats = [...new Set([...allUserSeats, ...myReservedSeats])];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ghế đã chọn</CardTitle>
      </CardHeader>
      <CardContent>
        {combinedSeats.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium text-primary">
              <span>Đã chọn {combinedSeats.length} ghế</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                myReservedSeats.length > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-primary/10 text-primary'
              }`}>
                {myReservedSeats.length > 0 ? 'Đã xác nhận' : 'Chưa xác nhận'}
              </span>
            </div>
            {combinedSeats.map((seat) => {
              if (!seat) return null;
              const reservationStatus = getReservationStatus(seat);
              return (
                <div key={seat} className={`flex items-center justify-between p-3 rounded-lg border ${
                  reservationStatus.isReserved 
                    ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200' 
                    : 'bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      reservationStatus.isReserved 
                        ? 'bg-green-200' 
                        : 'bg-primary/20'
                    }`}>
                      <User className={`w-4 h-4 ${
                        reservationStatus.isReserved 
                          ? 'text-green-700' 
                          : 'text-primary'
                      }`} />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">Ghế {seat}</span>
                      <div className="text-xs text-muted-foreground">
                        {seatsData?.find(s => s.seat_code === seat)?.seat_type || 'Regular'}
                        {reservationStatus.isReserved && (
                          <span className="ml-2 text-green-600 font-medium">
                            • Đã giữ
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className={
                    reservationStatus.isReserved 
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : 'bg-primary/10 text-primary border-primary/20'
                  }>
                    {formatPrice(getSeatPrice(seat))}
                  </Badge>
                </div>
              );
            })}
            {myReservedSeats.length > 0 ? (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-medium">
                    Ghế đã được giữ trong 10 phút. Bạn có thể thay đổi ghế bằng cách nhấp vào ghế khác.
                  </span>
                </div>
              </div>
            ) : selectedSeats.length > 0 ? (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 text-amber-800">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-xs font-medium">
                    Nhấn "Tiếp tục thanh toán" để giữ ghế trong 10 phút
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Chưa chọn ghế nào
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Nhấp vào ghế trên sơ đồ để chọn
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};