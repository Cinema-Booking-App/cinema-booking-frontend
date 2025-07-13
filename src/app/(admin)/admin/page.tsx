"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Ticket,
  DollarSign,
  MoreVertical,
  Eye,
  Edit,
  Delete,
  Film,
  Star,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  BarChart,
  DonutChart,
} from "@tremor/react";

export default function Dashboard() {
  // Mock data for demonstration
  const stats = [
    {
      title: "Tổng doanh thu",
      value: "₫125,000,000",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "So với tháng trước",
    },
    {
      title: "Vé đã bán",
      value: "1,234",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: Ticket,
      description: "Trong tháng này",
    },
    {
      title: "Khách hàng mới",
      value: "89",
      change: "+15.3%",
      changeType: "positive" as const,
      icon: Users,
      description: "Khách hàng mới",
    },
    {
      title: "Phim đang chiếu",
      value: "12",
      change: "+2",
      changeType: "positive" as const,
      icon: Film,
      description: "Phim hiện tại",
    },
  ];

  // Chart data
  const revenueData = [
    { month: "T1", "Doanh thu": 85, "Số vé": 1200 },
    { month: "T2", "Doanh thu": 92, "Số vé": 1350 },
    { month: "T3", "Doanh thu": 78, "Số vé": 1100 },
    { month: "T4", "Doanh thu": 95, "Số vé": 1400 },
    { month: "T5", "Doanh thu": 110, "Số vé": 1600 },
    { month: "T6", "Doanh thu": 125, "Số vé": 1800 },
    { month: "T7", "Doanh thu": 98, "Số vé": 1450 },
    { month: "T8", "Doanh thu": 105, "Số vé": 1550 },
    { month: "T9", "Doanh thu": 115, "Số vé": 1700 },
    { month: "T10", "Doanh thu": 130, "Số vé": 1900 },
    { month: "T11", "Doanh thu": 140, "Số vé": 2100 },
    { month: "T12", "Doanh thu": 125, "Số vé": 1850 },
  ];

  // Dữ liệu cho BarChart
  const dailyBookingsData = [
    { day: "T2", "Số đặt vé": 45, "Doanh thu": 72 },
    { day: "T3", "Số đặt vé": 52, "Doanh thu": 83 },
    { day: "T4", "Số đặt vé": 38, "Doanh thu": 61 },
    { day: "T5", "Số đặt vé": 67, "Doanh thu": 105 },
    { day: "T6", "Số đặt vé": 89, "Doanh thu": 142 },
    { day: "T7", "Số đặt vé": 95, "Doanh thu": 152 },
    { day: "CN", "Số đặt vé": 78, "Doanh thu": 125 },
  ];

  const genreData = [
    { name: "Hành động", value: 5 },
    { name: "Tình cảm", value: 25 },
    { name: "Hài", value: 20 },
    { name: "Kinh dị", value: 12 },
    { name: "Hoạt hình", value: 8 },
  ];

  const topMovies = [
    {
      title: "Avengers: Endgame",
      rating: 4.8,
      bookings: 156,
      revenue: "₫31,200,000",
      image: "https://via.placeholder.com/60x90",
      genre: "Hành động",
    },
    {
      title: "Spider-Man: No Way Home",
      rating: 4.6,
      bookings: 134,
      revenue: "₫24,120,000",
      image: "https://via.placeholder.com/60x90",
      genre: "Hành động",
    },
    {
      title: "Black Panther: Wakanda Forever",
      rating: 4.4,
      bookings: 98,
      revenue: "₫15,680,000",
      image: "https://via.placeholder.com/60x90",
      genre: "Hành động",
    },
  ];

  const recentBookings = [
    {
      id: "#BK001",
      customer: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      movie: "Avengers: Endgame",
      date: "2024-01-15",
      time: "19:30",
      seats: "A1, A2",
      status: "confirmed",
      amount: "₫200,000",
    },
    {
      id: "#BK002",
      customer: "Trần Thị B",
      email: "tranthib@email.com",
      movie: "Spider-Man: No Way Home",
      date: "2024-01-15",
      time: "20:00",
      seats: "B5, B6",
      status: "pending",
      amount: "₫180,000",
    },
    {
      id: "#BK003",
      customer: "Lê Văn C",
      email: "levanc@email.com",
      movie: "Black Panther: Wakanda Forever",
      date: "2024-01-16",
      time: "18:30",
      seats: "C3, C4",
      status: "confirmed",
      amount: "₫160,000",
    },
    {
      id: "#BK004",
      customer: "Phạm Thị D",
      email: "phamthid@email.com",
      movie: "Doctor Strange 2",
      date: "2024-01-16",
      time: "21:00",
      seats: "D7, D8",
      status: "cancelled",
      amount: "₫220,000",
    },
    {
      id: "#BK005",
      customer: "Phạm Thị D",
      email: "phamthid@email.com",
      movie: "Doctor Strange 2",
      date: "2024-01-16",
      time: "21:00",
      seats: "D7, D8",
      status: "cancelled",
      amount: "₫220,000",
    },
    {
      id: "#BK006",
      customer: "Phạm Thị D",
      email: "phamthid@email.com",
      movie: "Doctor Strange 2",
      date: "2024-01-16",
      time: "21:00",
      seats: "D7, D8",
      status: "cancelled",
      amount: "₫220,000",
    },
    {
      id: "#BK007",
      customer: "Phạm Thị D",
      email: "phamthid@email.com",
      movie: "Doctor Strange 2",
      date: "2024-01-16",
      time: "21:00",
      seats: "D7, D8",
      status: "cancelled",
      amount: "₫220,000",
    },
    {
      id: "#BK008",
      customer: "Phạm Thị D",
      email: "phamthid@email.com",
      movie: "Doctor Strange 2",
      date: "2024-01-16",
      time: "21:00",
      seats: "D7, D8",
      status: "cancelled",
      amount: "₫220,000",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi hoạt động rạp phim
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                {stat.changeType === "positive" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600" />
                )}
                <span
                  className={
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {stat.change}
                </span>
                <span>so với tháng trước</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Doanh thu theo tháng</CardTitle>
            <CardDescription>
              Biểu đồ doanh thu và số vé bán trong năm 2024
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChart
              className="h-72 mt-4"
              data={revenueData}
              index="month"
              categories={["Doanh thu", "Số vé"]}
              colors={["blue", "green"]}
              valueFormatter={(value) => `${value}`}
              yAxisWidth={40}
            />
          </CardContent>
        </Card>

        {/* Genre Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bố thể loại</CardTitle>
            <CardDescription>
              Tỷ lệ các thể loại phim được yêu thích
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              className="h-72 mt-4"
              data={genreData}
              category="value"
              index="name"
              valueFormatter={(value) => `${value}%`}
              colors={["red", "pink", "yellow", "purple", "cyan"]}
            />
          </CardContent>
        </Card>

        {/* Daily Bookings */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Đặt vé theo ngày trong tuần</CardTitle>
            <CardDescription>
              Số lượng đặt vé và doanh thu theo từng ngày
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              className="h-72 mt-4"
              data={dailyBookingsData}
              index="day"
              categories={["Số đặt vé", "Doanh thu"]}
              colors={["red-500", "green-500"]}
              valueFormatter={(value) => `${value}`}
              yAxisWidth={40}
            />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Bookings */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Đặt vé gần đây</CardTitle>
            <CardDescription>
              Các đơn đặt vé mới nhất trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Phim</TableHead>
                  <TableHead>Ngày/Giờ</TableHead>
                  <TableHead>Ghế</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thành tiền</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {getInitials(booking.customer)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{booking.customer}</div>
                          <div className="text-sm text-muted-foreground">
                            {booking.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Film className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{booking.movie}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{booking.date}</div>
                        <div className="text-xs text-muted-foreground">
                          {booking.time}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{booking.seats}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(booking.status)}
                      >
                        {getStatusText(booking.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{booking.amount}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Mở menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Delete className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Movies & Quick Stats */}
        <div className="col-span-3 space-y-6">
          {/* Top Movies */}
          <Card>
            <CardHeader>
              <CardTitle>Phim phổ biến</CardTitle>
              <CardDescription>
                Top phim có doanh thu cao nhất
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topMovies.map((movie, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={movie.image} />
                    <AvatarFallback>
                      <Film className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {movie.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {movie.genre}
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{movie.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {movie.bookings} vé
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      {movie.revenue}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tỷ lệ lấp đầy</span>
                  <span className="font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Đánh giá trung bình</span>
                  <span className="font-medium">4.6/5</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= 4
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-xs text-muted-foreground">
                    Phim đang chiếu
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">8</div>
                  <div className="text-xs text-muted-foreground">
                    Suất chiếu hôm nay
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 