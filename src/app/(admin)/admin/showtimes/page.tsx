'use client'
import React, { useState } from "react";
import { Search, Filter, Calendar, Clock, Film, Plus, X } from "lucide-react";
import { TheaterCard } from "@/components/admin/showtimes/theater-card";
import { Theaters } from "@/types/theaters";
import { ShowtimesTable } from "@/components/admin/showtimes/showtimes-table";
import { CreateShowtime, Showtimes } from "@/types/showtimes";
import { useCreateShowtimeMutation, useGetListShowtimesQuery } from "@/store/slices/showtimes/showtimesApi";
import ShowtimeForm from "@/components/admin/showtimes/showtimes-form";
import { useGetListMoviesQuery } from "@/store/slices/movies/moviesApi";
import { useGetListTheatersQuery } from "@/store/slices/theaters/theatersApi";


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

// Mock data for theaters
const mockTheaters: Theaters[] = [
  { theater_id: 1, name: "CGV Vincom", address: "Quận 1", phone: '8', city: '24', created_at: '10-10-2025' },
  { theater_id: 2, name: "Lotte Cinema", address: "Quận 3", phone: '6', city: '18', created_at: '10-10-2025' },
  { theater_id: 3, name: "BHD Star", address: "Quận 7", phone: '5', city: '15', created_at: '10-10-2025' },
  { theater_id: 4, name: "Galaxy Cinema", address: "Quận 2", phone: '7', city: '21', created_at: '10-10-2025' }
];

// Mock data for rooms
const mockRooms: Record<number, Room[]> = {
  1: [
    { id: 1, name: "Phòng 1", capacity: 120, format: "IMAX" },
    { id: 2, name: "Phòng 2", capacity: 100, format: "2D" },
    { id: 3, name: "Phòng 3", capacity: 80, format: "3D" }
  ],
  2: [
    { id: 4, name: "Phòng A", capacity: 90, format: "2D" },
    { id: 5, name: "Phòng B", capacity: 110, format: "3D" }
  ],
  3: [
    { id: 6, name: "Phòng VIP", capacity: 60, format: "4DX" },
    { id: 7, name: "Phòng Standard", capacity: 95, format: "2D" }
  ]
};





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
  // Lấy danh sách lịch chiếu từ API
  const { data: showtimesList, error: showtimesListError, isError: isShowtimesListError, isFetching: showtimesListLoading } = useGetListShowtimesQuery()
  // Lấy danh sách phim từ API
  const { data: moviesList } = useGetListMoviesQuery();
  // Láy danh sách rạp từ API 
  const { data: theatersList } = useGetListTheatersQuery();
  // Xử lý submit form tạo lịch chiếu
  const [createShowtime] = useCreateShowtimeMutation();

  const handleCreateShowtime = (data: CreateShowtime) => {
    console.log("Creating showtime with data:", data);
    createShowtime(data)
      .unwrap()
      .then(() => {
        setIsFormOpen(false);
      })
      .catch((error) => {
        console.error("Failed to create showtime:", error);
      });
  };

  const [currentSelectedTheaterId, setCurrentSelectedTheaterId] = useState<number | null>(null);
  const [showTheaterModal, setShowTheaterModal] = useState<boolean>(false);

  const selectedTheater = mockTheaters.find(t => t.theater_id === currentSelectedTheaterId) || null;
  const selectedTheaterRooms = currentSelectedTheaterId ? mockRooms[currentSelectedTheaterId] || [] : [];

  const handleViewTheaterDetails = (theaterId: number) => {
    setCurrentSelectedTheaterId(theaterId);
    setShowTheaterModal(true);
  };

  const handleCloseTheaterModal = () => {
    setShowTheaterModal(false);
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
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="w-5 h-5" />
            Thêm lịch chiếu
          </button>
          <ShowtimeForm
            isOpen={isFormOpen}
            onOpenChange={setIsFormOpen}
            onSubmit={handleCreateShowtime}
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

        {/* Theater Overview */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Tổng quan rạp chiếu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockTheaters.map((theater) => (
              <TheaterCard
                key={theater.theater_id}
                theater={theater}
                onViewDetails={handleViewTheaterDetails}
              />
            ))}
          </div>
        </div>

        {/* Filter */}
        <ScheduleFilter />

        {/* Schedules Table */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">Danh sách lịch chiếu</h2>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-foreground" />
              <span className="text-sm text-foreground">Hiển thị {showtimesList?.length} kết quả</span>
            </div>
          </div>
          <ShowtimesTable
            showtimes={showtimesList}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onDetail={handleDetail}
            isFetching={showtimesListLoading}
            isError={isShowtimesListError}
            error={showtimesListError}
          />
        </div>

        {/* Theater Detail Modal */}
        {showTheaterModal && (
          <TheaterDetailModal
            theater={selectedTheater}
            rooms={selectedTheaterRooms}
            onClose={handleCloseTheaterModal}
          />
        )}
      </div>
    </div>
  );
}