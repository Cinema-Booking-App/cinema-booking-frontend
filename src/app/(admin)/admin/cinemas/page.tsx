// src/app/(admin)/admin/cinemas/page.tsx

"use client";

import CinemaDetailManagement from '@/components/admin/cinemas/cinemas-detail';
import CinemaOverviewList from '@/components/admin/cinemas/cinemas-list';
import { useGetRoomsByTheaterIdQuery } from '@/store/slices/rooms/roomsApi';
import { useGetListTheatersQuery, useGetRoomsTheaterByIdQuery } from '@/store/slices/theaters/theatersApi';
import { CombinedTheater } from '@/types/theaters';
import { useState, useEffect } from 'react';

export default function ManagementCinemas() {
  // Thay đổi từ string | null sang number | null vì theater_id là number
  const [selectedTheaterId, setSelectedTheaterId] = useState<number | null>(null);
  const [combinedTheaterData, setCombinedTheaterData] = useState<CombinedTheater | null>(null);

  const { data: theatersList, isLoading: isLoadingTheaters } = useGetListTheatersQuery();

  // Sử dụng useGetTheaterByIdQuery nếu cần lấy chi tiết rạp riêng
  const { data: singleTheaterData, isLoading: isLoadingSingleTheater, error: singleTheaterError } = useGetRoomsTheaterByIdQuery(selectedTheaterId!, {
    skip: selectedTheaterId === null,
  });

  const {
    data: roomsOfSelectedTheater,
    isLoading: isLoadingRooms,
    error: roomsError
  } = useGetRoomsByTheaterIdQuery(selectedTheaterId!, {
    skip: selectedTheaterId === null,
  });

  // Effect để kết hợp dữ liệu rạp và phòng khi có đủ
  useEffect(() => {
    // Sẽ dùng singleTheaterData nếu API getTheaterById trả về đầy đủ hơn getListTheaters
    const currentTheaterDetails = singleTheaterData || theatersList?.find(t => t.theater_id === selectedTheaterId);

    if (selectedTheaterId !== null && currentTheaterDetails && roomsOfSelectedTheater) {
      setCombinedTheaterData({
        ...currentTheaterDetails,
        rooms: roomsOfSelectedTheater,
      });
    } else {
      setCombinedTheaterData(null);
    }
  }, [selectedTheaterId, singleTheaterData, theatersList, roomsOfSelectedTheater]);

  // Hàm được truyền xuống CinemaOverviewList
  const handleViewCinemaDetails = (theaterId: number) => { // Tham số là number
    setSelectedTheaterId(theaterId);
  };

  // Hàm được truyền xuống CinemaOverviewList
  const handleDeleteCinema = (theaterId: number) => { // Tham số là number
    if (window.confirm("Bạn có chắc chắn muốn xóa rạp này không?")) {
      // Gọi mutation xóa rạp ở đây
      console.log(`Đã yêu cầu xóa rạp với ID: ${theaterId}`);
      setSelectedTheaterId(null);
    }
  };

  const handleAddCinema = () => {
    alert("Chức năng thêm rạp mới sẽ được triển khai tại đây!");
  };

  const handleBackToList = () => {
    setSelectedTheaterId(null);
    setCombinedTheaterData(null);
  };

  // Hiển thị trạng thái tải và lỗi
  if (isLoadingTheaters) return <div className="text-center py-10">Đang tải danh sách rạp...</div>;
  // Bạn có thể thêm isLoadingSingleTheater || isLoadingRooms ở đây nếu muốn hiển thị loading khi chuyển trang chi tiết
  if (selectedTheaterId !== null && (isLoadingSingleTheater || isLoadingRooms)) {
    return <div className="text-center py-10">Đang tải chi tiết rạp và các phòng...</div>;
  }
  if (selectedTheaterId !== null && (singleTheaterError || roomsError)) {
    return <div className="text-center py-10 text-red-600">Lỗi khi tải chi tiết rạp hoặc phòng</div>;
  }


  return (
    <>
      {combinedTheaterData && selectedTheaterId !== null ? (
        <CinemaDetailManagement theaters={combinedTheaterData} onBackToList={handleBackToList} />
      ) : (
        <CinemaOverviewList
          theaters={theatersList || []} // Đảm bảo theatersList là mảng rỗng nếu chưa có dữ liệu
          onViewDetails={handleViewCinemaDetails}
          onDeleteCinema={handleDeleteCinema}
          onAddCinema={handleAddCinema}
        />
      )}
    </>
  );
}