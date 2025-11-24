"use client";

import React, { useState, useEffect, Suspense } from "react";
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
import { useCreatePaymentMutation } from "@/store/slices/payments/paymentsApi";
import { toast } from "sonner";
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
function PaymentClient() {
  const searchParams = useSearchParams();
  const { sessionId, selectedSeats, ticketType, isInitialized } = useURLBookingState();
  const bookingData = useAppSelector((state) => state.booking);
  const [isClient, setIsClient] = useState(false);
  
  // RTK Query mutation
  const [createPayment, { isLoading: isCreatingPayment }] = useCreatePaymentMutation();
  const user = useAppSelector(state => state.auth.user);

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
      poster: bookingData.moviePoster || "/placeholder-movie.png",
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
      console.log("User:", user);

  // Prefill customer info from logged in user when available. Only fill empty fields so we don't overwrite manual edits.
  useEffect(() => {
    if (!user) return;

    setPaymentState((prev) => ({
      ...prev,
      customerData: {
        fullName:
          prev.customerData.fullName || (user as any).full_name || (user as any).name || "",
        phone: prev.customerData.phone || (user as any).phone || (user as any).phone_number || "",
        email: prev.customerData.email || (user as any).email || "",
        idNumber: prev.customerData.idNumber || (user as any).id_number || (user as any).idNumber || "",
      },
    }));
  }, [user]);

  const handlePayment = async () => {
    if (!paymentState.selectedPaymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    if (!sessionId) {
      toast.error("Không tìm thấy thông tin đặt vé");
      return;
    }

    setPaymentState(prev => ({ ...prev, isProcessing: true }));

    try {
      // Map payment method ID to backend enum
      const paymentMethodMap: { [key: string]: 'VNPAY' | 'MOMO' | 'ZALO_PAY' | 'BANK_TRANSFER' | 'CASH' } = {
        'vnpay': 'VNPAY',
        'momo': 'MOMO',
        'zalopay': 'ZALO_PAY',
        'bank': 'BANK_TRANSFER',
      };

      const paymentMethod = paymentMethodMap[paymentState.selectedPaymentMethod];
      
      if (!paymentMethod) {
        toast.error("Phương thức thanh toán không hợp lệ");
        setPaymentState(prev => ({ ...prev, isProcessing: false }));
        return;
      }
      // Create payment using RTK Query mutation
      const result = await createPayment({
        session_id: sessionId,
        order_desc: `Thanh toán vé xem phim ${bookingData.movieTitle}`,
        payment_method: paymentMethod,
        language: 'vn',
        user_id: user?.user_id
      }).unwrap();

      console.log("Payment result:", result); // Debug log

      // If payment URL exists (for online payment methods like VNPay, MoMo)
      if (result.payment_url) {
        toast.success("Đang chuyển đến trang thanh toán...");
        console.log("Redirecting to:", result.payment_url); // Debug log
        // Redirect to payment gateway
        setTimeout(() => {
          window.location.href = result.payment_url!;
        }, 1000);
      } else {
        // For cash payment or other methods without redirect
        toast.success("Đặt vé thành công!");
        setPaymentState(prev => ({
          ...prev,
          isProcessing: false,
          isSuccess: true,
          bookingCode: result.order_id
        }));
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      const errorMessage = error?.data?.detail || error?.message || "Đã xảy ra lỗi khi xử lý thanh toán";
      toast.error(errorMessage);
      setPaymentState(prev => ({ ...prev, isProcessing: false }));
    }
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
            <CustomerInfo
              data={paymentState.customerData}
              onDataChange={(data) => setPaymentState((prev) => ({ ...prev, customerData: data }))}
            />
          </div>

          {/* Tóm tắt thanh toán */}
          <div className="xl:col-span-1">
            <div className="sticky top-24">
              <PaymentSummary
                ticketPrice={currentBookingData.price}
                ticketCount={currentBookingData.selectedSeats.length}
                total={currentBookingData.total}
                selectedPaymentMethod={paymentState.selectedPaymentMethod}
                isProcessing={paymentState.isProcessing || isCreatingPayment}
                onPayment={handlePayment}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// Đây là phần quan trọng nhất: bọc PaymentClient bằng Suspense để tránh lỗi
export default function PaymentPage() {
  return (
    <Suspense fallback={<div>💳 Đang tải trang thanh toán...</div>}>
      <PaymentClient />
    </Suspense>
  );
}
