"use client";
import CinemaDetailManagement from '@/components/admin/theaters/theater-detail';
import CinemaOverviewList from '@/components/admin/theaters/theaters-list';
import { useGetRoomsByTheaterIdQuery } from '@/store/slices/rooms/roomsApi';
import { useDeleteTheaterMutation, useGetListTheatersQuery, useGetTheaterByIdQuery } from '@/store/slices/theaters/theatersApi';
import { CombinedTheater } from '@/types/theaters';
import { useState } from 'react';

export default function ManagementTheaters() {
  // lưu trữ ID của rạp đang được chọn.
  const [currentSelectedTheaterId, setCurrentSelectedTheaterId] = useState<number | null>(null);

  // danh sách tất cả các rạp.
  const { data: theatersList, isLoading: isFetchingTheaters, error: theatersError, isError: istheatersError } = useGetListTheatersQuery();

  // chi tiết của một rạp cụ thể theo ID.
  const { data: selectedTheaterData, isLoading: isFetchingSelectedTheater, error: selectedTheaterError } = useGetTheaterByIdQuery(currentSelectedTheaterId!, {
    skip: currentSelectedTheaterId === null, // Bỏ qua query nếu không có rạp nào được chọn
  });

  // danh sách các phòng của rạp đang được chọn.
  const { data: roomsOfSelectedTheater, isLoading: isFetchingRooms, error: roomsLoadingError } = useGetRoomsByTheaterIdQuery(currentSelectedTheaterId!, {
    skip: currentSelectedTheaterId === null, // Bỏ qua query nếu không có rạp nào được chọn
  });

  //Xóa rạp phim
    const [deleteTheater] = useDeleteTheaterMutation()

  // Bước 1: Xác định chi tiết rạp hiện tại.
  const currentTheaterDetails = selectedTheaterData || theatersList?.find(theater => theater.theater_id === currentSelectedTheaterId);

  const combinedTheaterDetails: CombinedTheater | null =
    currentSelectedTheaterId !== null && currentTheaterDetails && roomsOfSelectedTheater
      ? { ...currentTheaterDetails, rooms: roomsOfSelectedTheater } // Kết hợp dữ liệu
      : null; // Nếu không đủ điều kiện, trả về null

  console.log(currentTheaterDetails)
  // Xử lý khi người dùng nhấn "Xem chi tiết" một rạp
  const handleViewTheaterDetails = (theaterId: number) => {
    setCurrentSelectedTheaterId(theaterId); // Cập nhật ID rạp đang chọn để hiển thị chi tiết
  };

  // Xử lý khi người dùng nhấn "Xóa rạp"
  const handleDeleteTheater = async (theaterId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa rạp này không?")) {
      await deleteTheater(theaterId)
      setCurrentSelectedTheaterId(null); 
    }
  };

  // Xử lý khi người dùng nhấn "Quay lại danh sách" từ trang chi tiết
  const handleGoBackToList = () => {
    setCurrentSelectedTheaterId(null); // Đặt lại ID rạp về null để hiển thị danh sách
  };

  // Hiển thị thông báo tải khi đang lấy chi tiết rạp hoặc phòng (chỉ khi có rạp được chọn)
  if (currentSelectedTheaterId !== null && (isFetchingSelectedTheater || isFetchingRooms)) {
    return <div className="text-center py-10">Đang tải chi tiết rạp và các phòng...</div>;
  }

  // Hiển thị thông báo lỗi nếu có vấn đề khi tải chi tiết rạp hoặc phòng
  console.log("currentSelectedTheaterId", currentSelectedTheaterId)
  console.log("selectedTheaterError", selectedTheaterError)
  console.log("roomsLoadingError", roomsLoadingError)
  if (currentSelectedTheaterId !== null && (selectedTheaterError || roomsLoadingError)) {
    return <div className="text-center py-10 text-red-600">Lỗi khi tải chi tiết rạp hoặc phòng. Vui lòng thử lại.</div>;
  }

  return (
    <>
      {/* Kiểm tra nếu có dữ liệu rạp kết hợp và có rạp được chọn */}
      {combinedTheaterDetails && currentSelectedTheaterId !== null ? (
        // Nếu có, hiển thị component quản lý chi tiết rạp
        <CinemaDetailManagement
          theaters={combinedTheaterDetails} // Truyền dữ liệu rạp và phòng đã kết hợp
          onBackToList={handleGoBackToList} // Truyền hàm quay lại danh sách
        />
      ) : (
        // Nếu không, hiển thị component danh sách rạp tổng quan
        <CinemaOverviewList
          theaters={theatersList || []} // Truyền danh sách rạp (đảm bảo là mảng rỗng nếu chưa có dữ liệu)
          onViewDetails={handleViewTheaterDetails} // Truyền hàm xem chi tiết rạp
          onDeleteTheater={handleDeleteTheater} // Truyền hàm xóa rạp
          isFetchingTheaters={isFetchingTheaters}
          theatersError={theatersError}
          istheatersError={istheatersError}
        />
      )}
    </>
  );
}