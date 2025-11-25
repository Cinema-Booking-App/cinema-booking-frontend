'use client'
import React, { useState } from "react";
import { Search, Filter, Calendar, Clock, Film, Plus, X, Zap, Calendar as CalendarIcon, List } from "lucide-react";
import { TheaterCard } from "@/components/admin/showtimes/theater-card";
import { Theaters } from "@/types/theaters";
import { ShowtimesTable } from "@/components/admin/showtimes/showtimes-table";
import { CreateShowtime, Showtimes } from "@/types/showtimes";
import { useCreateShowtimeMutation, useGetListShowtimesQuery, useBulkCreateShowtimesMutation } from "@/store/slices/showtimes/showtimesApi";
import ShowtimeForm from "@/components/admin/showtimes/showtimes-form";
import QuickScheduleForm from "@/components/admin/showtimes/quick-schedule-form";
import CalendarView from "@/components/admin/showtimes/calendar-view";
import { useGetListMoviesQuery } from "@/store/slices/movies/moviesApi";
import { useGetListTheatersQuery } from "@/store/slices/theaters/theatersApi";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";


interface Room {
  id: number;
  name: string;
  capacity: number;
  format: string;
}

interface TheaterDetailModalProps {
  theater: Theaters | null;
  rooms: Room[];
  onClose: () => void;
}



// Schedule Filter Component
const ScheduleFilter: React.FC = () => (
  <div className="bg-background rounded-lg shadow-md p-4 mb-6 border border-gray-200">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm phim..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>
      <div className="relative">
        <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
        <input
          type="date"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>
      <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
        <option value="">Tất cả rạp</option>
        <option value="cgv">CGV Vincom</option>
        <option value="lotte">Lotte Cinema</option>
        <option value="bhd">BHD Star</option>
      </select>
      <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
        <option value="">Tất cả trạng thái</option>
        <option value="active">Đang hoạt động</option>
        <option value="canceled">Đã hủy</option>
        <option value="ended">Đã kết thúc</option>
      </select>
    </div>
  </div>
);



// Theater Detail Modal Component
const TheaterDetailModal: React.FC<TheaterDetailModalProps> = ({ theater, rooms, onClose }) => {
  if (!theater) return null;

  return (
    <div className="fixed inset-0 bg-opacity-100 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-foreground">Chi tiết rạp: {theater.name}</h2>
          <button
            onClick={onClose}
            className="text-foreground hover:text-gray-700 p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-background-500 p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">Thông tin cơ bản</h3>
            <p><strong>Tên rạp:</strong> {theater.name}</p>
            <p><strong>Địa chỉ:</strong> {theater.address}</p>
            <p><strong>Tổng số phòng:</strong> {theater.created_at}</p>
            <p><strong>Suất chiếu hiện tại:</strong> {theater.city}</p>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-3">Danh sách phòng chiếu</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rooms?.map((room: Room) => (
              <div key={room.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{room.name}</h4>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {room.format}
                  </span>
                </div>
                <p className="text-foreground text-sm mt-1">
                  Sức chứa: {room.capacity} ghế
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function ShowtimesPage() {
  // Quản lý trạng thái form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isQuickFormOpen, setIsQuickFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  
  // Lấy danh sách lịch chiếu từ API
  const { data: showtimesList, error: showtimesListError, isError: isShowtimesListError, isFetching: showtimesListLoading } = useGetListShowtimesQuery()
  // Lấy danh sách phim từ API
  const { data: moviesList } = useGetListMoviesQuery();
  // Láy danh sách rạp từ API 
  const { data: theatersList } = useGetListTheatersQuery();
  // Xử lý submit form tạo lịch chiếu
  const [createShowtime] = useCreateShowtimeMutation();
  const [bulkCreate] = useBulkCreateShowtimesMutation();

  const handleCreateShowtime = (data: CreateShowtime) => {
    createShowtime(data)
      .unwrap()
      .then(() => {
        setIsFormOpen(false);
        toast.success("Tạo lịch chiếu thành công!");
      })
      .catch((error: any) => {
        console.error("Failed to create showtime:", error);
        // Kiểm tra lỗi trùng lịch chiếu (ví dụ: mã lỗi hoặc message từ backend)
        if (error?.data?.detail?.includes("trùng lịch chiếu") || error?.message?.includes("trùng lịch chiếu")) {
          toast.error("Lịch chiếu bị trùng! Vui lòng chọn thời gian/phòng khác.");
        } else {
          toast.error("Tạo lịch chiếu thất bại!");
        }
      });
  };

  const handleBulkCreate = async (data: CreateShowtime[]) => {
    try {
      await bulkCreate(data).unwrap();
      toast.success(`Tạo thành công ${data.length} suất chiếu!`);
      setIsQuickFormOpen(false);
    } catch (error) {
      console.error("Failed to bulk create showtimes:", error);
      toast.error("Tạo lịch chiếu thất bại!");
    }
  };

  const [currentSelectedTheaterId, setCurrentSelectedTheaterId] = useState<number | null>(null);

  const handleViewTheaterDetails = (theaterId: number) => {
    setCurrentSelectedTheaterId(theaterId);
  };

  const handleCloseTheaterModal = () => {
    setCurrentSelectedTheaterId(null);
  };

  const handleEdit = (schedule: Showtimes) => {
    alert(`Sửa lịch chiếu: ${schedule.showtime_id}`);
  };

  const handleCancel = (schedule: Showtimes) => {
    if (confirm(`Bạn có chắc chắn muốn hủy lịch chiếu ${schedule.showtime_id}?`)) {
      alert(`Đã hủy lịch chiếu: ${schedule.showtime_id}`);
    }
  };

  const handleDetail = (schedule: Showtimes) => {
    alert(`Xem chi tiết lịch chiếu: ${schedule.showtime_id}`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-red-600 mb-2">Quản lý lịch chiếu</h1>
            <p className="text-foreground">Quản lý và theo dõi các lịch chiếu phim tại hệ thống rạp</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsQuickFormOpen(true)}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Tạo nhanh
            </Button>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm lịch chiếu
            </Button>
          </div>
          <ShowtimeForm
            isOpen={isFormOpen}
            onOpenChange={setIsFormOpen}
            onSubmit={handleCreateShowtime}
            movies={moviesList?.items || []}
            theaters={theatersList || []}
          />
          <QuickScheduleForm
            isOpen={isQuickFormOpen}
            onOpenChange={setIsQuickFormOpen}
            onSubmit={handleBulkCreate}
            movies={moviesList?.items || []}
            theaters={theatersList || []}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-background rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground text-sm">Tổng lịch chiếu</p>
                <p className="text-2xl font-bold text-foreground">156</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-background rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground text-sm">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600">98</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Film className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-background rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground text-sm">Đã kết thúc</p>
                <p className="text-2xl font-bold text-foreground">45</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-foreground" />
              </div>
            </div>
          </div>
          <div className="bg-background rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground text-sm">Đã hủy</p>
                <p className="text-2xl font-bold text-red-600">13</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <X className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <ScheduleFilter />

        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'table' | 'calendar')} className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="table" className="gap-2">
                <List className="w-4 h-4" />
                Danh sách
              </TabsTrigger>
              <TabsTrigger value="calendar" className="gap-2">
                <CalendarIcon className="w-4 h-4" />
                Lịch tuần
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-foreground" />
              <span className="text-sm text-foreground">Hiển thị {showtimesList?.length} kết quả</span>
            </div>
          </div>

          <TabsContent value="table">
            <ShowtimesTable
              showtimes={showtimesList}
              onEdit={handleEdit}
              onCancel={handleCancel}
              onDetail={handleDetail}
              isFetching={showtimesListLoading}
              isError={isShowtimesListError}
              error={
                typeof showtimesListError === "string"
                  ? showtimesListError
                  : showtimesListError
                  ? JSON.stringify(showtimesListError)
                  : undefined
              }
            />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView
              showtimes={showtimesList || []}
              onShowtimeClick={handleDetail}
              onDateSelect={(date) => {
                setIsQuickFormOpen(true);
              }}
            />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}