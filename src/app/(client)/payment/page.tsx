"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, Lock, CheckCircle, Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Label } from "@/components/ui/label";

// Mock data cho giao diện
const mockData = {
  movie: {
    title: "Thanh Gươm Diệt Quỷ: Phép Màu Từ Hơi Thở",
    poster: "/images/kimetsu-official-poster.jpg",
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

const paymentMethods = [
  {
    id: "momo",
    name: "Ví MoMo",
    icon: "💜",
    description: "Thanh toán qua ví MoMo",
  },
  {
    id: "vnpay",
    name: "VNPay",
    icon: "💙",
    description: "Thanh toán qua VNPay",
  },
  {
    id: "zalopay",
    name: "ZaloPay",
    icon: "💚",
    description: "Thanh toán qua ZaloPay",
  },
  {
    id: "bank",
    name: "Chuyển khoản ngân hàng",
    icon: "🏦",
    description: "Chuyển khoản trực tiếp",
  },
];

export default function PaymentPage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handlePayment = () => {
    if (!selectedPaymentMethod) return;
    
    setIsProcessing(true);
    
    // Mô phỏng xử lý thanh toán
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Thanh toán thành công!</h1>
          <p className="text-muted-foreground mb-6">
            Vé của bạn đã được đặt thành công. Vui lòng kiểm tra email để xem chi tiết.
          </p>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium">Mã đặt vé: #BK123456</p>
              <p className="text-sm text-muted-foreground">
                Vui lòng giữ mã này để nhận vé tại rạp
              </p>
            </div>
            <Link href="/">
              <Button className="w-full">Về trang chủ</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/booking/1">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold">Thanh toán</h1>
              <p className="text-sm text-muted-foreground">
                Hoàn tất đặt vé của bạn
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form thanh toán */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thông tin đặt vé */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Thông tin đặt vé</h2>
              <div className="flex gap-4">
                <Image
                  src={mockData.movie.poster}
                  alt={mockData.movie.title}
                  width={80}
                  height={120}
                  className="rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{mockData.movie.title}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {mockData.schedule.date} • {mockData.schedule.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {mockData.schedule.theater}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {mockData.schedule.room}
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium">Ghế đã chọn:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {mockData.selectedSeats.map((seat) => (
                        <Badge key={seat} variant="secondary">
                          {seat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Phương thức thanh toán */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPaymentMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-500">Bảo mật</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Thông tin khách hàng */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Thông tin khách hàng</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input id="fullName" placeholder="Nhập họ và tên" />
                </div>
                <div>
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" placeholder="Nhập số điện thoại" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="Nhập email" type="email" />
                </div>
                <div>
                  <Label htmlFor="cmnd">CMND/CCCD</Label>
                  <Input id="cmnd" placeholder="Nhập số CMND/CCCD" />
                </div>
              </div>
            </Card>
          </div>

          {/* Tóm tắt thanh toán */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Tóm tắt thanh toán</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Vé người lớn x{mockData.selectedSeats.length}</span>
                  <span>{formatPrice(mockData.price * mockData.selectedSeats.length)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Tổng cộng</span>
                  <span className="text-lg text-primary">{formatPrice(mockData.total)}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>Thông tin thanh toán được bảo mật</span>
                </div>
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={!selectedPaymentMethod || isProcessing}
                  onClick={handlePayment}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Thanh toán {formatPrice(mockData.total)}
                    </div>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Bằng việc tiếp tục, bạn đồng ý với các điều khoản và điều kiện của chúng tôi
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}