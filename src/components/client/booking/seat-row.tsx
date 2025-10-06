import React from "react";
import { Badge } from "@/components/ui/badge";
import { Seat } from "./seat";
import { Seats } from "@/types/seats";

interface SeatRowProps {
  row: string;
  seatColumns: number;
  occupiedSeats: string[];
  selectedSeats: string[];
  onSeatClick: (seatId: string) => void;
  seatsData?: Seats[];
}

export const SeatRow: React.FC<SeatRowProps> = ({
  row,
  seatColumns,
  occupiedSeats,
  selectedSeats,
  onSeatClick,
  seatsData
}) => {
  const getSeatType = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return "occupied";
    if (selectedSeats.includes(seatId)) return "selected";
    
    // Nếu có seatsData, sử dụng seat_type từ API
    if (seatsData) {
      const seatInfo = seatsData.find(seat => seat.seat_code === seatId);
      if (seatInfo) {
        // Map seat_type từ API sang UI types
        switch (seatInfo.seat_type.toLowerCase()) {
          case 'premium':
            return "premium";
          case 'vip':
            return "vip";
          case 'couple':
            return "couple";
          case 'regular':
          default:
            return "available";
        }
      }
    }
    
    // Fallback logic (giữ lại cho trường hợp không có API data)
    if (seatId.includes("A") || seatId.includes("B")) return "premium";
    if (seatId.includes("K") || seatId.includes("L")) return "vip";
    return "available";
  };

  return (
    <div className="flex justify-center items-center gap-1 sm:gap-2">
      <Badge variant="outline" className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center text-[8px] xs:text-[10px] sm:text-xs font-medium">
        {row}
      </Badge>
      <div className="flex gap-0.5 xs:gap-0.5 sm:gap-1">
        {(() => {
          const seats = [];
          let skipNext = false;
          
          for (let col = 1; col <= seatColumns; col++) {
            if (skipNext) {
              skipNext = false;
              continue;
            }
            
            const singleSeatId = `${row}${col}`;
            const coupleSeatId = `${row}${col}-${col + 1}`;
            
            // Kiểm tra xem có ghế đôi tại vị trí này không
            let coupleSeat = null;
            if (seatsData) {
              coupleSeat = seatsData.find(seat => seat.seat_code === coupleSeatId);
            }
            
            if (coupleSeat) {
              // Render ghế đôi
              const seatType = getSeatType(coupleSeatId);
              seats.push(
                <Seat
                  key={coupleSeatId}
                  seatId={coupleSeatId}
                  seatType={seatType}
                  onClick={onSeatClick}
                  isCouple={true}
                />
              );
              skipNext = true; // Bỏ qua cột tiếp theo vì ghế đôi đã chiếm 2 vị trí
            } else {
              // Kiểm tra ghế đơn
              if (seatsData) {
                const seatExists = seatsData.some(seat => seat.seat_code === singleSeatId);
                if (!seatExists) {
                  // Hiển thị ô trống cho ghế không tồn tại
                  seats.push(
                    <div 
                      key={singleSeatId} 
                      className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                    />
                  );
                  continue;
                }
              }
              
              // Render ghế đơn
              const seatType = getSeatType(singleSeatId);
              seats.push(
                <Seat
                  key={singleSeatId}
                  seatId={singleSeatId}
                  seatType={seatType}
                  onClick={onSeatClick}
                  isCouple={false}
                />
              );
            }
          }
          
          return seats;
        })()}
      </div>
    </div>
  );
};