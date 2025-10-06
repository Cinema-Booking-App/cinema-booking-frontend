import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BookingSummaryCardProps {
  total: number;
  selectedSeatsCount: number;
  formatPrice: (price: number) => string;
}

export const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({
  total,
  selectedSeatsCount,
  formatPrice
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="font-medium">Tổng cộng:</span>
            <span className="text-xl font-bold text-foreground">
              {formatPrice(total)}
            </span>
          </div>
          <Link href="/payment">
            <Button 
              className="w-full" 
              size="lg"
              disabled={selectedSeatsCount === 0}
            >
              Tiếp tục thanh toán
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};