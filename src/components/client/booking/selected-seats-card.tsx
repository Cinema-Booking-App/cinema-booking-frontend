import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface SelectedSeatsCardProps {
  selectedSeats: string[];
  ticketPrice: number;
  formatPrice: (price: number) => string;
}

export const SelectedSeatsCard: React.FC<SelectedSeatsCardProps> = ({
  selectedSeats,
  ticketPrice,
  formatPrice
}) => {
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
                  {formatPrice(ticketPrice)}
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