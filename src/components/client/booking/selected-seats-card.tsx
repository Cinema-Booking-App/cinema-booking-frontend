import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { Seats } from "@/types/seats";

interface SelectedSeatsCardProps {
  selectedSeats: string[];
  ticketPrice: number;
  formatPrice: (price: number) => string;
  seatsData?: Seats[];
}

export const SelectedSeatsCard: React.FC<SelectedSeatsCardProps> = ({
  selectedSeats,
  ticketPrice,
  formatPrice,
  seatsData
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ghế đã chọn</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedSeats.length > 0 ? (
          <div className="space-y-2">
            {selectedSeats.map((seat) => (
              <div key={seat} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Ghế {seat}</span>
                </div>
                <Badge variant="secondary">
                  {formatPrice(getSeatPrice(seat))}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <User className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Chưa chọn ghế nào
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};