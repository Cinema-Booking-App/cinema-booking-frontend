"use client";

import React, { useMemo, useState, useEffect } from "react";
// ...existing code...
import { useGetDashboardStatsQuery } from "@/store/slices/dashboard/dashboardApi";
import { Users, Ticket, DollarSign, Film } from "lucide-react";
import StatsCard from "../../../components/admin/StatsCard";
import RevenueChartCard from "../../../components/admin/RevenueChartCard";
import RecentBookingsTable from "../../../components/admin/RecentBookingsTable";
import TopMoviesCard from "../../../components/admin/TopMoviesCard";
import { useGetListBookingsQuery } from "@/store/slices/bookings/bookingsApi";
import { useGetListMoviesQuery } from "@/store/slices/movies/moviesApi";

export default function Dashboard() {
  const [stats, setStats] = useState([
    {
      title: "Tổng doanh thu",
      value: "...",
      change: "",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "So với tháng trước",
    },
    {
      title: "Vé đã bán",
      value: "...",
      change: "",
      changeType: "positive" as const,
      icon: Ticket,
      description: "Trong tháng này",
    },
    {
      title: "Khách hàng mới",
      value: "...",
      change: "",
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
  ]);

  const { data: dashboardStats } = useGetDashboardStatsQuery();

  useEffect(() => {
    if (dashboardStats) {
      setStats([
        {
          title: "Tổng doanh thu",
          value: `₫${dashboardStats.total_revenue.toLocaleString()}`,
          change: "",
          changeType: "positive",
          icon: DollarSign,
          description: "So với tháng trước",
        },
        {
          title: "Vé đã bán",
          value: dashboardStats.ticket_count.toLocaleString(),
          change: "",
          changeType: "positive",
          icon: Ticket,
          description: "Trong tháng này",
        },
        {
          title: "Khách hàng mới",
          value: dashboardStats.user_count.toLocaleString(),
          change: "",
          changeType: "positive",
          icon: Users,
          description: "Khách hàng mới",
        },
        {
          title: "Phim đang chiếu",
          value: "12",
          change: "+2",
          changeType: "positive",
          icon: Film,
          description: "Phim hiện tại",
        },
      ]);
    }
  }, [dashboardStats]);

  // Chart data
  // API hooks
  const { data: bookings = [], isLoading: bookingsLoading } = useGetListBookingsQuery();
  console.log('Bookings data:', bookings);
  const { data: moviesRaw = [], isLoading: moviesLoading } = useGetListMoviesQuery();
  // Extract movies array from PaginatedResponse
  const movies: any[] = Array.isArray(moviesRaw)
    ? moviesRaw
    : (moviesRaw && 'items' in moviesRaw ? moviesRaw.items : []);

  // Chart data from bookings
  const revenueData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    return months.map((m: number) => {
      const monthBookings = bookings.filter((b: any) => {
        const d = new Date(b.created_at || b.date || b.booking_date);
        return d.getMonth() + 1 === m;
      });
      const totalRevenue = monthBookings.reduce((sum: number, b: any) => sum + (b.amount || 0), 0);
      return {
        month: `T${m}`,
        "Doanh thu": Math.round(totalRevenue / 1000),
        "Số vé": monthBookings.length,
      };
    });
  }, [bookings]);

  // Daily bookings chart
  const dailyBookingsData = useMemo(() => {
    const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    return days.map((day: string, idx: number) => {
      const dayBookings = bookings.filter((b: any) => {
        const d = new Date(b.created_at || b.date || b.booking_date);
        return d.getDay() === (idx === 6 ? 0 : idx + 1);
      });
      const totalRevenue = dayBookings.reduce((sum: number, b: any) => sum + (b.amount || 0), 0);
      return {
        day,
        "Số đặt vé": dayBookings.length,
        "Doanh thu": Math.round(totalRevenue / 1000),
      };
    });
  }, [bookings]);

  // Genre distribution from movies
  const genreData = useMemo(() => {
    const genreCount: Record<string, number> = {};
    movies.forEach((m: any) => {
      if (m.genre) genreCount[m.genre] = (genreCount[m.genre] || 0) + 1;
    });
    return Object.entries(genreCount).map(([name, value]: [string, number]) => ({ name, value }));
  }, [movies]);

  // Top movies by bookings
  const topMovies = useMemo(() => {
    const movieStats: Record<number, { bookings: number; revenue: number }> = {};
    bookings.forEach((b: any) => {
      if (b.movie_id) {
        if (!movieStats[b.movie_id]) movieStats[b.movie_id] = { bookings: 0, revenue: 0 };
        movieStats[b.movie_id].bookings++;
        movieStats[b.movie_id].revenue += b.amount || 0;
      }
    });
    return movies
      .map((m: any) => ({
        title: m.title,
        rating: m.rating || 0,
        bookings: movieStats[m.id]?.bookings || 0,
        revenue: `₫${(movieStats[m.id]?.revenue || 0).toLocaleString()}`,
        image: m.poster_url || "https://via.placeholder.com/60x90",
        genre: m.genre || "Khác",
      }))
      .sort((a: any, b: any) => b.bookings - a.bookings)
      .slice(0, 3);
  }, [movies, bookings]);

  // Recent bookings from API
  const recentBookings = useMemo(() => {
    return bookings.slice(0, 8).map((b: any) => ({
      ...b, // giữ nguyên tất cả trường, đặc biệt là tickets
      id: b.code || b.id,
      customer: b.customer_name || b.user?.name || b.customer || "Khách lẻ",
      email: b.customer_email || b.user?.email || b.email || "",
      movie:
        movies.find((m: any) => m.id === b.movie_id)?.title || b.movie_title || b.movie || "",
      date: b.date || b.created_at?.slice(0, 10) || "",
      time: b.time || b.showtime || "",
      seats: Array.isArray(b.seats)
        ? b.seats.join(", ")
        : b.seats || "",
      status: b.status || "pending",
    }));
  }, [bookings, movies]);

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
            <StatsCard key={index} {...stat} />
          ))}
        </div>

      {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <RevenueChartCard data={revenueData} />
           <TopMoviesCard movies={topMovies} />
            {/* <QuickStatsCard /> */}
          {/* <GenreDistributionCard data={genreData} /> */}
          {/* <DailyBookingsChartCard data={dailyBookingsData} /> */}
        </div>

      {/* Main Content Grid */}
        <div className="">
          <div className="col-span-4">
            <RecentBookingsTable
              bookings={recentBookings}
              getInitials={getInitials}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
            />
          </div>
        </div>
    </div>
  );
}