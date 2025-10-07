"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Mail, Home } from "lucide-react";
import Link from "next/link";

interface PaymentSuccessProps {
  bookingCode: string;
  email?: string;
}

export default function PaymentSuccess({ bookingCode, email }: PaymentSuccessProps) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-950 min-h-screen flex items-center justify-center p-4">
      <Card className="p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
        {/* Success Icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full w-20 h-20 mx-auto opacity-20 animate-pulse"></div>
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto relative z-10 animate-bounce" />
        </div>
        
        {/* Success Message */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Thanh toán thành công!
        </h1>
        <p className="text-muted-foreground mb-8 text-base sm:text-lg">
          Vé của bạn đã được đặt thành công. Vui lòng kiểm tra email để xem chi tiết.
        </p>
        
        {/* Booking Code */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 sm:p-6 rounded-xl border border-green-200 dark:border-green-800">
            <p className="font-bold text-lg sm:text-xl text-green-700 dark:text-green-300 mb-2">
              Mã đặt vé: {bookingCode}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Vui lòng giữ mã này để nhận vé tại rạp
            </p>
          </div>
          
          {/* Email Confirmation */}
          {email && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
                <Mail className="w-4 h-4" />
                <span className="font-medium">Email xác nhận</span>
              </div>
              <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                Chi tiết vé đã được gửi đến: {email}
              </p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-lg transform hover:scale-105 transition-all duration-200 h-11 sm:h-12"
              onClick={() => {
                // Logic to download ticket
                console.log('Download ticket');
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Tải vé về máy
            </Button>
            
            <Link href="/" className="block">
              <Button 
                variant="outline" 
                className="w-full border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/20 h-11 sm:h-12"
              >
                <Home className="w-4 h-4 mr-2" />
                Về trang chủ
              </Button>
            </Link>
          </div>
          
          {/* Additional Info */}
          <div className="text-xs text-center text-muted-foreground space-y-1 mt-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p>📧 Kiểm tra hộp thư đến hoặc thư rác</p>
            <p>📱 Có thể sử dụng mã đặt vé để checkin tại rạp</p>
            <p>🎫 Đến trước giờ chiếu 15 phút để nhận vé</p>
          </div>
        </div>
      </Card>
    </div>
  );
}