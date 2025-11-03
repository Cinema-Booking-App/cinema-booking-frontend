import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/date";

interface BookingSummaryCardProps {
  total: number;
  selectedSeatsCount: number;
  onProceedToPayment?: () => void;
  isProcessing?: boolean;
  hasSelectedSeats?: boolean;
  hasReservedSeats?: boolean;
  prices?: number;
}

export const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({
  total,
  selectedSeatsCount,
  onProceedToPayment,
  isProcessing = false,
  hasReservedSeats = false,
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
          {/* Nút thanh toán - tự động xác nhận ghế khi nhấn */}
          <Button 
            onClick={onProceedToPayment}
            className="w-full bg-primary hover:bg-primary/90 font-semibold shadow-lg transition-all duration-200" 
            size="lg"
            disabled={selectedSeatsCount === 0 || isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang xử lý...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {hasReservedSeats 
                  ? `Thanh toán ngay (${selectedSeatsCount} ghế đã đặt)` 
                  : selectedSeatsCount > 0 
                    ? `Tiếp tục thanh toán (${selectedSeatsCount} ghế)` 
                    : 'Chọn ghế để tiếp tục'
                }
              </div>
            )}
          </Button>
          {/* Thông báo cho user biết có thể thay đổi ghế */}
          {hasReservedSeats && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                💡 Bạn có thể thay đổi ghế bằng cách nhấp vào ghế khác trên sơ đồ
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};