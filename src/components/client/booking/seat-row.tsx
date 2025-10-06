import React from "react";
import { Badge } from "@/components/ui/badge";
import { Seat } from "./seat";

interface SeatRowProps {
  row: string;
  seatColumns: number;
  occupiedSeats: string[];
  selectedSeats: string[];
  onSeatClick: (seatId: string) => void;
}

export const SeatRow: React.FC<SeatRowProps> = ({
  row,
  seatColumns,
  occupiedSeats,
  selectedSeats,
  onSeatClick
}) => {
  const getSeatType = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return "occupied";
    if (selectedSeats.includes(seatId)) return "selected";
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
        {Array.from({ length: seatColumns }, (_, col) => {
          const seatId = `${row}${col + 1}`;
          const seatType = getSeatType(seatId);
          
          return (
            <Seat
              key={seatId}
              seatId={seatId}
              seatType={seatType}
              onClick={onSeatClick}
            />
          );
        })}
      </div>
    </div>
  );
};