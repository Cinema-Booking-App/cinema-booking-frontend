'use client'
import React from "react";
import SchedulesTable from "@/components/admin/schedules/schedules-table";
import ScheduleFilter from "@/components/admin/schedules/schedule-filter";

const mockSchedules = [
  {
    id: "SC001",
    movieName: "Avengers: Endgame",
    datetime: "14:00, 10/07/2025",
    room: "Phòng 1",
    cinema: "Rạp CGV Vincom",
    format: "IMAX",
    status: "active",
    statusVi: "Đang hoạt động",
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
  },
];

export default function SchedulesPage() {
  const handleEdit = (schedule: typeof mockSchedules[0]) => {
    alert(`Sửa lịch chiếu: ${schedule.id}`);
  };
  const handleCancel = (schedule: typeof mockSchedules[0]) => {
    alert(`Hủy lịch chiếu: ${schedule.id}`);
  };
  const handleDetail = (schedule: typeof mockSchedules[0]) => {
    alert(`Xem chi tiết lịch chiếu: ${schedule.id}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-red-600">Quản lý lịch chiếu</h1>
        <button className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700">+ Thêm lịch chiếu</button>
      </div>
      <ScheduleFilter />
      <SchedulesTable
        schedules={mockSchedules}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onDetail={handleDetail}
      />
    </div>
  );
}