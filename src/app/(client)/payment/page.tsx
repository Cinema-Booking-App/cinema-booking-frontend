"use client";

import React, { useState } from "react";
import PaymentHeader from "@/components/client/payment/payment-header";
import BookingInfo from "@/components/client/payment/booking-info";
import PaymentMethods from "@/components/client/payment/payment-methods";
import CustomerInfo from "@/components/client/payment/customer-info";
import PaymentSummary from "@/components/client/payment/payment-summary";
import PaymentSuccess from "@/components/client/payment/payment-success";
import { BookingData, PaymentMethod, PaymentState } from "@/components/client/payment/types";

// Mock data cho giao diện
const mockData: BookingData = {
  movie: {
    title: "Thanh Gươm Diệt Quỷ: Phép Màu Từ Hơi Thở",
    poster: "https://tse3.mm.bing.net/th/id/OIP.j2J653sC4Amlp1TCDPHL3QHaKp?r=0&pid=ImgDet&w=201&h=288&c=7&o=7&rm=3",
    duration: "115 phút",
  },
  schedule: {
    date: "08/07/2025",
    time: "18:00",
    theater: "Cinestar Quốc Thanh",
    room: "Phòng 1",
  },
  selectedSeats: ["D5", "D6", "D7"],
  ticketType: "adult",
  price: 120000,
  total: 360000,
};

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

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
      {/* Header */}
      <PaymentHeader backUrl="/booking/1" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Form thanh toán */}
          <div className="xl:col-span-2 space-y-6">
            {/* Thông tin đặt vé */}
            <BookingInfo
              movie={mockData.movie}
              schedule={mockData.schedule}
              selectedSeats={mockData.selectedSeats}
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
                ticketPrice={mockData.price}
                ticketCount={mockData.selectedSeats.length}
                total={mockData.total}
                selectedPaymentMethod={paymentState.selectedPaymentMethod}
                isProcessing={paymentState.isProcessing}
                onPayment={handlePayment}
                formatPrice={formatPrice}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}