"use client";

import { Ticket, CheckCircle, AlertCircle, XCircle, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BookingStatsProps {
  totalBookings: number;
  paidBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue?: number;
  previousPeriodRevenue?: number;
}

export function BookingStats({
  totalBookings,
  paidBookings,
  pendingBookings,
  cancelledBookings,
  totalRevenue = 0,
  previousPeriodRevenue = 0
}: BookingStatsProps) {
  // UI Calculations for display
  const revenueChange = previousPeriodRevenue > 0 
    ? ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 
    : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const stats = [
    {
      title: "Tổng số vé",
      value: totalBookings,
      icon: Ticket,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Tổng số vé đã đặt",
      change: null
    },
    {
      title: "Đã thanh toán",
      value: paidBookings,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Vé đã thanh toán thành công",
      change: totalBookings > 0 ? ((paidBookings / totalBookings) * 100).toFixed(1) : "0"
    },
    {
      title: "Đang chờ",
      value: pendingBookings,
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      description: "Vé đang chờ thanh toán",
      change: totalBookings > 0 ? ((pendingBookings / totalBookings) * 100).toFixed(1) : "0"
    },
    {
      title: "Đã hủy",
      value: cancelledBookings,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Vé đã bị hủy",
      change: totalBookings > 0 ? ((cancelledBookings / totalBookings) * 100).toFixed(1) : "0"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <TooltipProvider key={stat.title}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          {stat.change && (
                            <div className="flex items-center gap-1">
                              <Badge variant="secondary" className="text-xs">
                                {stat.change}%
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                          <Icon className={`h-8 w-8 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{stat.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      {/* Revenue Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Tổng doanh thu
          </CardTitle>
          <CardDescription>
            Doanh thu từ các vé đã thanh toán
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(totalRevenue)}
              </p>
              <div className="flex items-center gap-2">
                {revenueChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${
                  revenueChange > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {revenueChange > 0 ? '+' : ''}{revenueChange.toFixed(1)}%
                </span>
                <span className="text-sm text-muted-foreground">
                  so với kỳ trước
                </span>
              </div>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm text-muted-foreground">Tỷ lệ thanh toán</p>
              <p className="text-lg font-semibold">
                {totalBookings > 0 ? ((paidBookings / totalBookings) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tỷ lệ thành công</p>
                <p className="text-xl font-bold text-green-600">
                  {totalBookings > 0 ? ((paidBookings / totalBookings) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tỷ lệ hủy</p>
                <p className="text-xl font-bold text-red-600">
                  {totalBookings > 0 ? ((cancelledBookings / totalBookings) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Đang chờ xử lý</p>
                <p className="text-xl font-bold text-yellow-600">
                  {pendingBookings} vé
                </p>
              </div>
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 