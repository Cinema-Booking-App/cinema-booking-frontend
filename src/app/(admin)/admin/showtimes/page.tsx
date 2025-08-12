'use client'
import React, { useState } from "react";
import { Search, Filter, Calendar, Clock, MapPin, Film, Plus, Edit, X, Eye } from "lucide-react";

// Types
interface Theater {
  id: number;
  name: string;
  location: string;
  totalRooms: number;
  activeShows: number;
}

interface Room {
  id: number;
  name: string;
  capacity: number;
  format: string;
}

interface Schedule {
  id: string;
  movieName: string;
  datetime: string;
  room: string;
  cinema: string;
  format: string;
  status: 'active' | 'canceled' | 'ended';
  statusVi: string;
  price: string;
  bookedSeats: number;
  totalSeats: number;
}

interface TheaterCardProps {
  theater: Theater;
  onViewDetails: (theaterId: number) => void;
}

interface SchedulesTableProps {
  schedules: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onCancel: (schedule: Schedule) => void;
  onDetail: (schedule: Schedule) => void;
}

interface TheaterDetailModalProps {
  theater: Theater | null;
  rooms: Room[];
  onClose: () => void;
}

// Mock data for theaters
const mockTheaters: Theater[] = [
  { id: 1, name: "CGV Vincom", location: "Quận 1", totalRooms: 8, activeShows: 24 },
  { id: 2, name: "Lotte Cinema", location: "Quận 3", totalRooms: 6, activeShows: 18 },
  { id: 3, name: "BHD Star", location: "Quận 7", totalRooms: 5, activeShows: 15 },
  { id: 4, name: "Galaxy Cinema", location: "Quận 2", totalRooms: 7, activeShows: 21 }
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

const mockSchedules: Schedule[] = [
  {
    id: "SC001",
    movieName: "Avengers: Endgame",
    datetime: "14:00, 10/07/2025",
    room: "Phòng 1",
    cinema: "Rạp CGV Vincom",
    format: "IMAX",
    status: "active",
    statusVi: "Đang hoạt động",
    price: "120,000đ",
    bookedSeats: 85,
    totalSeats: 120
  },
  {
    id: "SC002",
    movieName: "Fast & Furious 10",
    datetime: "19:30, 11/07/2025",
    room: "Phòng 2",
    cinema: "Rạp Lotte Mart",
    format: "2D",
    status: "canceled",
    statusVi: "Đã hủy",
    price: "80,000đ",
    bookedSeats: 0,
    totalSeats: 100
  },
  {
    id: "SC003",
    movieName: "Minions: The Rise of Gru",
    datetime: "09:00, 12/07/2025",
    room: "Phòng A",
    cinema: "Rạp BHD Star",
    format: "3D",
    status: "ended",
    statusVi: "Đã kết thúc",
    price: "95,000đ",
    bookedSeats: 95,
    totalSeats: 95
  },
  {
    id: "SC004",
    movieName: "Spider-Man: No Way Home",
    datetime: "16:45, 10/07/2025",
    room: "Phòng VIP",
    cinema: "Rạp Galaxy Cinema",
    format: "4DX",
    status: "active",
    statusVi: "Đang hoạt động",
    price: "200,000đ",
    bookedSeats: 45,
    totalSeats: 60
  }
];

// Theater Overview Card Component
const TheaterCard: React.FC<TheaterCardProps> = ({ theater, onViewDetails }) => (
  <div className="bg-background rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="font-semibold text-lg text-foreground">{theater.name}</h3>
        <p className="text-foreground flex items-center mt-1">
          <MapPin className="w-4 h-4 mr-1" />
          {theater.location}
        </p>
      </div>
      <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
        {theater.activeShows} suất chiếu
      </span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-foreground">
        <Film className="w-4 h-4 inline mr-1" />
        {theater.totalRooms} phòng
      </span>
      <button
        onClick={() => onViewDetails(theater.id)}
        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
      >
        Xem chi tiết
      </button>
    </div>
  </div>
);

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

// Schedule Table Component
const SchedulesTable: React.FC<SchedulesTableProps> = ({ schedules, onEdit, onCancel, onDetail }) => (
  <div className="bg-background rounded-lg shadow-md border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-background">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
              Mã lịch chiếu
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
              Phim
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
              Ngày giờ chiếu
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
              Phòng / Rạp
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
              Định dạng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
              Giá vé
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
              Tỷ lệ lấp đầy
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-gray-200">
                      {schedules.map((schedule: Schedule) => (
            <tr key={schedule.id} className="hover:bg-background-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                {schedule.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                {schedule.movieName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  {schedule.datetime}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                <div>
                  <div className="font-medium">{schedule.room}</div>
                  <div className="text-foreground">{schedule.cinema}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {schedule.format}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">
                {schedule.price}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  schedule.status === 'active' ? 'bg-green-100 text-green-800' :
                  schedule.status === 'canceled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-foreground'
                }`}>
                  {schedule.statusVi}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${(schedule.bookedSeats / schedule.totalSeats) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-foreground">
                    {schedule.bookedSeats}/{schedule.totalSeats}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onDetail(schedule)}
                    className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(schedule)}
                    className="text-green-600 hover:text-green-900 p-1 hover:bg-green-100 rounded"
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onCancel(schedule)}
                    className="text-red-600 hover:text-red-900 p-1 hover:bg-red-100 rounded"
                    title="Hủy lịch chiếu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
            <p><strong>Địa chỉ:</strong> {theater.location}</p>
            <p><strong>Tổng số phòng:</strong> {theater.totalRooms}</p>
            <p><strong>Suất chiếu hiện tại:</strong> {theater.activeShows}</p>
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
export default function SchedulesPage() {
  const [currentSelectedTheaterId, setCurrentSelectedTheaterId] = useState<number | null>(null);
  const [showTheaterModal, setShowTheaterModal] = useState<boolean>(false);

  const selectedTheater = mockTheaters.find(t => t.id === currentSelectedTheaterId) || null;
  const selectedTheaterRooms = currentSelectedTheaterId ? mockRooms[currentSelectedTheaterId] || [] : [];

  const handleViewTheaterDetails = (theaterId: number) => {
    setCurrentSelectedTheaterId(theaterId);
    setShowTheaterModal(true);
  };

  const handleCloseTheaterModal = () => {
    setShowTheaterModal(false);
    setCurrentSelectedTheaterId(null);
  };

  const handleEdit = (schedule: Schedule) => {
    alert(`Sửa lịch chiếu: ${schedule.id}`);
  };

  const handleCancel = (schedule: Schedule) => {
    if (confirm(`Bạn có chắc chắn muốn hủy lịch chiếu ${schedule.id}?`)) {
      alert(`Đã hủy lịch chiếu: ${schedule.id}`);
    }
  };

  const handleDetail = (schedule: Schedule) => {
    alert(`Xem chi tiết lịch chiếu: ${schedule.id}`);
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
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Thêm lịch chiếu
          </button>
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
                key={theater.id}
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
              <span className="text-sm text-foreground">Hiển thị {mockSchedules.length} kết quả</span>
            </div>
          </div>
          <SchedulesTable
            schedules={mockSchedules}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onDetail={handleDetail}
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