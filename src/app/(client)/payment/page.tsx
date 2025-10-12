"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import BookingInfo from "@/components/client/payment/booking-info";
import PaymentMethods from "@/components/client/payment/payment-methods";
import CustomerInfo from "@/components/client/payment/customer-info";
import PaymentSummary from "@/components/client/payment/payment-summary";
import PaymentSuccess from "@/components/client/payment/payment-success";
import { BookingData, PaymentMethod, PaymentState } from "@/components/client/payment/types";
import { useURLBookingState } from "@/hooks/useURLBookingState";
import { useAppSelector } from "@/store/store";
import LoadingComponent from "@/components/ui/cinema-loading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const paymentMethods: PaymentMethod[] = [
  {
    id: "momo",
    name: "Ví MoMo",
    logo: "https://developers.momo.vn/v3/assets/images/MOMO-Logo-App-6262c3743a290ef02396a24ea2b66c35.png",
    description: "Thanh toán qua ví MoMo",
    color: "from-pink-500 to-purple-600",
    popular: true,
  },
  {
    id: "vnpay",
    name: "VNPay",
    logo: "https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png",
    description: "Thanh toán qua VNPay",
    color: "from-blue-600 to-blue-800",
    popular: false,
  },
  {
    id: "zalopay",
    name: "ZaloPay",
    logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png",
    description: "Thanh toán qua ZaloPay",
    color: "from-blue-500 to-cyan-500",
    popular: false,
  },
  {
    id: "bank",
    name: "Chuyển khoản ngân hàng",
    logo: "https://cdn-icons-png.flaticon.com/512/1077/1077976.png",
    description: "Chuyển khoản trực tiếp",
    color: "from-gray-600 to-gray-800",
    popular: false,
  },
];

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const { sessionId, selectedSeats, ticketType, isInitialized } = useURLBookingState();
  const bookingData = useAppSelector((state) => state.booking);
  const [isClient, setIsClient] = useState(false);

  // Get additional params from URL
  const roomId = searchParams.get('roomId');
  const showtimeId = searchParams.get('showtimeId');

  const [paymentState, setPaymentState] = useState<PaymentState>({
    selectedPaymentMethod: "",
    isProcessing: false,
    isSuccess: false,
    customerData: {
      fullName: "",
      phone: "",
      email: "",
      idNumber: "",
    },
    bookingCode: "#BK123456",
  });

  // Ensure hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Create booking data from URL params and Redux store
  const currentBookingData: BookingData = {
    movie: {
      title: bookingData.movieTitle || "Đang tải...",
      poster: bookingData.moviePoster || "https://tse3.mm.bing.net/th/id/OIP.j2J653sC4Amlp1TCDPHL3QHaKp?r=0&pid=ImgDet&w=201&h=288&c=7&o=7&rm=3",
      duration: "115 phút",
    },
    schedule: {
      date: bookingData.showDate || "Đang tải...",
      time: bookingData.showTime || "Đang tải...",
      theater: bookingData.theaterName || "Đang tải...",
      room: `Phòng ${roomId || bookingData.roomId || "N/A"}`,
    },
    selectedSeats: selectedSeats,
    ticketType: ticketType,
    price: getTicketPrice(ticketType),
    total: selectedSeats.length * getTicketPrice(ticketType),
  };

  // Calculate ticket price based on type using Redux store data
  function getTicketPrice(type: 'adult' | 'child' | 'student'): number {
    const basePrice = bookingData.ticketPrice || 120000; // Default fallback
    
    const priceMultipliers = {
      adult: 1.0,     // 100% giá gốc
      child: 0.75,    // 75% giá người lớn  
      student: 0.83   // 83% giá người lớn
    };
    
    return Math.floor(basePrice * (priceMultipliers[type] || priceMultipliers.adult));
  }


  const handlePaymentMethodSelect = (methodId: string) => {
    setPaymentState(prev => ({
      ...prev,
      selectedPaymentMethod: methodId
    }));
  };

  const handlePayment = () => {
    if (!paymentState.selectedPaymentMethod) return;
    
    setPaymentState(prev => ({ ...prev, isProcessing: true }));
    
    // Mô phỏng xử lý thanh toán
    setTimeout(() => {
      setPaymentState(prev => ({
        ...prev,
        isProcessing: false,
        isSuccess: true
      }));
    }, 3000);
  };

  // Show loading while hydrating or initializing
  if (!isClient || !isInitialized) {
    return <LoadingComponent />;
  }

  // Check if we have required booking data
  if (!sessionId || selectedSeats.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Không có thông tin đặt vé</h2>
              <p className="text-muted-foreground mb-6">
                Vui lòng quay lại trang chọn ghế để tiếp tục đặt vé.
              </p>
              <Button asChild>
                <Link href="/booking" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại chọn ghế
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (paymentState.isSuccess) {
    return (
      <PaymentSuccess 
        bookingCode={paymentState.bookingCode || "#BK123456"}
        email={paymentState.customerData.email}
      />
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back to booking button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href={`/booking?${searchParams.toString()}`} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Quay lại chọn ghế
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Form thanh toán */}
          <div className="xl:col-span-2 space-y-6">
            {/* Thông tin đặt vé */}
            <BookingInfo
              movie={currentBookingData.movie}
              schedule={currentBookingData.schedule}
              selectedSeats={currentBookingData.selectedSeats}
            />

            {/* Phương thức thanh toán */}
            <PaymentMethods
              methods={paymentMethods}
              selectedMethod={paymentState.selectedPaymentMethod}
              onMethodSelect={handlePaymentMethodSelect}
            />

            {/* Thông tin khách hàng */}
            <CustomerInfo />
          </div>

          {/* Tóm tắt thanh toán */}
          <div className="xl:col-span-1">
            <div className="sticky top-24">
              <PaymentSummary
                ticketPrice={currentBookingData.price}
                ticketCount={currentBookingData.selectedSeats.length}
                total={currentBookingData.total}
                selectedPaymentMethod={paymentState.selectedPaymentMethod}
                isProcessing={paymentState.isProcessing}
                onPayment={handlePayment}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}