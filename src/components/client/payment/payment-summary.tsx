"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Receipt } from "lucide-react";

interface PaymentSummaryProps {
  ticketPrice: number;
  ticketCount: number;
  total: number;
  selectedPaymentMethod: string;
  isProcessing: boolean;
  onPayment: () => void;
  formatPrice: (price: number) => string;
}

export default function PaymentSummary({ 
  ticketPrice, 
  ticketCount, 
  total, 
  selectedPaymentMethod, 
  isProcessing, 
  onPayment,
  formatPrice 
}: PaymentSummaryProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Payment Summary Card */}
      <Card className="p-4 sm:p-6 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <h3 className="font-semibold mb-4 flex items-center gap-2 text-base sm:text-lg">
          <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
          Tóm tắt thanh toán
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm sm:text-base">
            <span>Vé người lớn x{ticketCount}</span>
            <span>{formatPrice(ticketPrice * ticketCount)}</span>
          </div>
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Phí dịch vụ</span>
            <span>Miễn phí</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-semibold text-base sm:text-lg">
            <span>Tổng cộng</span>
            <span className="text-red-600 dark:text-red-400">{formatPrice(total)}</span>
          </div>
        </div>
      </Card>

      {/* Payment Action Card */}
      <Card className="p-4 sm:p-6 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <div className="space-y-4">
          {/* Payment Button */}
          <Button 
            className="w-full bg-red-500 shadow-lg h-12 sm:h-14 text-base sm:text-lg font-semibold" 
            disabled={!selectedPaymentMethod || isProcessing}
            onClick={onPayment}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang xử lý...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Thanh toán {formatPrice(total)}</span>
              </div>
            )}
          </Button>
          
          {/* Terms */}
          <p className="text-xs text-center text-muted-foreground leading-relaxed">
            Bằng việc tiếp tục, bạn đồng ý với{" "}
            <a href="#" className="text-blue-600 hover:underline">
              điều khoản và điều kiện
            </a>{" "}
            của chúng tôi
          </p>
          
          {/* Additional Info */}
          <div className="text-xs text-center space-y-1 text-muted-foreground">
            <p>✓ Hoàn tiền 100% nếu huỷ trước 2 giờ</p>
            <p>✓ Hỗ trợ 24/7 qua hotline: 1900-1234</p>
          </div>
        </div>
      </Card>
    </div>
  );
}