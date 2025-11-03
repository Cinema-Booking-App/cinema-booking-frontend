import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeatRow } from "./seat-row";
import { SeatLegend } from "./seat-legend";
import { Seats } from "@/types/seats";
import { Monitor } from "lucide-react";

interface SeatMapProps {
  seatRows: string[];
  seatColumns: number;
  occupiedSeats: string[];
  selectedSeats: string[];
  onSeatClick: (seatId: string) => void;
  seatsData?: Seats[];
}

export const SeatMap: React.FC<SeatMapProps> = ({
  seatRows,
  seatColumns,
  occupiedSeats,
  selectedSeats,
  onSeatClick,
  seatsData
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base sm:text-lg">
          <span>Chọn ghế</span>
          <div className="hidden sm:flex">
            <SeatLegend />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Màn hình */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-muted to-muted/50 text-muted-foreground text-center py-2 sm:py-3 px-4 sm:px-8 rounded-t-lg w-full sm:w-96 border">
            <Monitor className="w-6 h-6 mx-auto mb-1" />
            <span className="font-medium text-xs sm:text-base">MÀN HÌNH</span>
          </div>
        </div>

        {/* Ghế */}
        <div className="overflow-x-auto pb-2">
          <div className="space-y-1 sm:space-y-2 min-w-[280px] xs:min-w-[320px] sm:min-w-0">
            {seatRows.map((row) => (
              <SeatRow
                key={row}
                row={row}
                seatColumns={seatColumns}
                occupiedSeats={occupiedSeats}
                selectedSeats={selectedSeats}
                onSeatClick={onSeatClick}
                seatsData={seatsData}
              />
            ))}
          </div>
        </div>

        {/* Lối đi */}
        <div className="flex justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
          <Badge variant="outline">Lối đi</Badge>
          <Badge variant="outline">Lối đi</Badge>
        </div>

        {/* Hiển thị chú thích cho mobile */}
        <div className="flex sm:hidden flex-wrap gap-2 justify-center text-xs mt-2">
          <SeatLegend className="flex-wrap gap-2" />
        </div>
      </CardContent>
    </Card>
  );
};