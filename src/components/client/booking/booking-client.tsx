"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Clock, MapPin, Users, Monitor, User, Calendar, Ticket } from "lucide-react";
import Link from "next/link";

// Cấu hình ghế
const seatRows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
const seatColumns = 12;

// Ghế đã được đặt (mô phỏng)
const occupiedSeats = ["A1", "A2", "B5", "C8", "D3", "E7", "F10", "G4", "H9", "I6", "J2", "K11", "L8"];

interface BookingClientProps {
  id: string;
  mockData: {
    movie: {
      title: string;
      poster: string;
      duration: string;
    };
    schedule: {
      date: string;
      time: string;
      theater: string;
      room: string;
    };
    price: {
      adult: number;
      child: number;
      student: number;
    };
  };
}

export default function BookingClient({ id, mockData }: BookingClientProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedTicketType, setSelectedTicketType] = useState<"adult" | "child" | "student">("adult");

  const handleSeatClick = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return;

    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(seat => seat !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const getSeatType = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return "occupied";
    if (selectedSeats.includes(seatId)) return "selected";
    if (seatId.includes("A") || seatId.includes("B")) return "premium";
    if (seatId.includes("K") || seatId.includes("L")) return "vip";
    return "available";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const calculateTotal = () => {
    return selectedSeats.length * mockData.price[selectedTicketType];
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Header */}
      <Card className="rounded-none border-b-0 border-x-0">
        <CardContent className="p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <Link href={`/movie/${id}`}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold">{mockData.movie.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {mockData.schedule.theater} • {mockData.schedule.room}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Phần chọn ghế */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                  <span>Chọn ghế</span>
                  <div className="hidden sm:flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="w-4 h-4 p-0 bg-background"></Button>
                      <span>Có sẵn</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="default" size="sm" className="w-4 h-4 p-0 bg-gray-800"></Button>
                      <span>Đã chọn</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="w-4 h-4 p-0 bg-gray-500"></Button>
                      <span>Đã đặt</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" size="sm" className="w-4 h-4 p-0 bg-purple-500"></Button>
                      <span>Premium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="destructive" size="sm" className="w-4 h-4 p-0"></Button>
                      <span>VIP</span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Màn hình */}
                <div className="flex justify-center">
                  <div className="bg-gradient-to-r from-muted to-muted/50 text-muted-foreground text-center py-2 sm:py-3 px-4 sm:px-8 rounded-t-lg w-full sm:w-96 border">
                    <Monitor className="w-6 h-6 mx-auto mb-1" />
                    <span className="font-medium text-xs sm:text-base">MÀN HÌNH</span>
                  </div>
                </div>

                {/* Ghế */}
                <div className="overflow-x-auto pb-2">
                  <div className="space-y-1 sm:space-y-2 min-w-[280px] xs:min-w-[320px] sm:min-w-0">
                    {seatRows.map((row) => (
                      <div key={row} className="flex justify-center items-center gap-1 sm:gap-2">
                        <Badge variant="outline" className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center text-[8px] xs:text-[10px] sm:text-xs font-medium">
                          {row}
                        </Badge>
                        <div className="flex gap-0.5 xs:gap-0.5 sm:gap-1">
                          {Array.from({ length: seatColumns }, (_, col) => {
                            const seatId = `${row}${col + 1}`;
                            const seatType = getSeatType(seatId);
                            
                            let buttonVariant: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link" = "outline";
                            let buttonClass = "w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 p-0 text-[8px] xs:text-[10px] sm:text-xs font-medium ";
                            
                            switch (seatType) {
                              case "occupied":
                                buttonVariant = "ghost";
                                buttonClass += "bg-gray-500 text-white cursor-not-allowed";
                                break;
                              case "selected":
                                buttonVariant = "default";
                                buttonClass += "bg-gray-800 text-white hover:bg-gray-900";
                                break;
                              case "premium":
                                buttonVariant = "secondary";
                                buttonClass += "bg-purple-500 text-white hover:bg-purple-600";
                                break;
                              case "vip":
                                buttonVariant = "destructive";
                                buttonClass += "bg-red-500 text-white hover:bg-red-600";
                                break;
                              default:
                                buttonVariant = "outline";
                                buttonClass += "hover:bg-accent hover:text-accent-foreground";
                            }
                            
                            return (
                              <Card key={seatId} className="shadow-none border-none p-0">
                                <Button
                                  variant={buttonVariant}
                                  size="sm"
                                  onClick={() => handleSeatClick(seatId)}
                                  disabled={seatType === "occupied"}
                                  className={buttonClass}
                                  title={`Ghế ${seatId}`}
                                >
                                  {col + 1}
                                </Button>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lối đi */}
                <div className="flex justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
                  <Badge variant="outline">Lối đi</Badge>
                  <Badge variant="outline">Lối đi</Badge>
                </div>
                {/* Hiển thị chú thích cho mobile */}
                <div className="flex sm:hidden flex-wrap gap-2 justify-center text-xs mt-2">
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" className="w-4 h-4 p-0 bg-background"></Button>
                    <span>Có sẵn</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="default" size="sm" className="w-4 h-4 p-0 bg-gray-800"></Button>
                    <span>Đã chọn</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="w-4 h-4 p-0 bg-gray-500"></Button>
                    <span>Đã đặt</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="secondary" size="sm" className="w-4 h-4 p-0 bg-purple-500"></Button>
                    <span>Premium</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="destructive" size="sm" className="w-4 h-4 p-0"></Button>
                    <span>VIP</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Thông tin đặt vé */}
          <div className="space-y-6">
            {/* Thông tin phim */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar className="w-20 h-28">
                    <AvatarImage src={mockData.movie.poster} alt={mockData.movie.title} />
                    <AvatarFallback>
                      <Ticket className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-2">{mockData.movie.title}</h3>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {mockData.movie.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        {mockData.schedule.theater}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        {mockData.schedule.room}
                      </div>
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{mockData.schedule.date}</p>
                  </div>
                  <p className="text-lg font-bold text-primary">{mockData.schedule.time}</p>
                </div>
              </CardContent>
            </Card>

            {/* Loại vé */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Loại vé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(mockData.price).map(([type, price]) => (
                  <Button
                    key={type}
                    variant={selectedTicketType === type ? "default" : "outline"}
                    className={`w-full justify-between p-4 h-auto ${
                      selectedTicketType === type
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                    onClick={() => setSelectedTicketType(type as keyof typeof mockData.price)}
                  >
                    <div className="text-left">
                      <p className="font-medium capitalize">{type}</p>
                      <p className={`text-sm ${selectedTicketType === type ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        {formatPrice(price)}
                      </p>
                    </div>
                    {selectedTicketType === type && (
                      <Badge variant="secondary" className="bg-primary-foreground text-primary">
                        Đã chọn
                      </Badge>
                    )}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Ghế đã chọn */}
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
                          {formatPrice(mockData.price[selectedTicketType])}
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

            {/* Tổng tiền và nút tiếp tục */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium ">Tổng cộng:</span>
                    <span className="text-xl font-bold text-foreground">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                  <Link href="/payment">
                    <Button 
                      className="w-full" 
                      size="lg"
                      disabled={selectedSeats.length === 0}
                    >
                      Tiếp tục thanh toán
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 