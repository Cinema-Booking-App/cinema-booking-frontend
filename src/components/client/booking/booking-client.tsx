"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { SeatMap } from "./seat-map";
import { BookingSidebar } from "./booking-sidebar";
import { useGetSeatsByRoomIdQuery } from "@/store/slices/rooms/roomsApi";
import { useCreateMultipleReservationsMutation, useCancelReservationsMutation, useGetReservedSeatsQuery } from "@/store/slices/reservations/reservationsApi";
import { Seats } from "@/types/seats";
import { useWebSocketSeat } from "@/hooks/useWebSocketSeat";
import { useAppSelector } from "@/store/store";
import { useURLBookingState } from "@/hooks/useURLBookingState";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Interface định nghĩa props cho component BookingClient
interface BookingClientProps {
  id: number; // ID của phòng chiếu
  showtimeId: number; // ID của suất chiếu
  mockData: {
    movie: {
      title: string; // Tên phim
      poster: string; // URL poster phim
      duration: string; // Thời lượng phim
    };
    schedule: {
      date: string; // Ngày chiếu
      time: string; // Giờ chiếu
      theater: string; // Tên rạp
      room: string; // Tên phòng
    };
    price: {
      adult: number; // Giá vé người lớn
      child: number; // Giá vé trẻ em
      student: number; // Giá vé sinh viên
    };
  };
}

export default function BookingClient({ id, showtimeId, mockData }: BookingClientProps) {
  // State để kiểm tra xem component đã được render ở client chưa (tránh hydration issues)
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
  // Quản lý state thông qua URL - giúp không mất dữ liệu khi reload/navigate
  const {
    sessionId, // ID phiên đặt vé duy nhất
    selectedSeats, // Danh sách ghế đã chọn
    ticketType: selectedTicketType, // Loại vé đã chọn (adult/child/student)
    isInitialized: urlStateInitialized, // Trạng thái khởi tạo URL
    selectSeat: handleSeatToggle, // Function để chọn/bỏ chọn ghế
    setTicketType: handleTicketTypeChange, // Function để thay đổi loại vé
    clearSeats, // Function để xóa tất cả ghế đã chọn
    hasSelectedSeats // Boolean kiểm tra có ghế nào được chọn không
  } = useURLBookingState();
  
  // Timeout cho việc đặt ghế tạm thời
  const [reservationTimeout, setReservationTimeout] = useState<NodeJS.Timeout | null>(null);
  // State theo dõi quá trình đồng bộ với server
  const [isSyncingWithServer, setIsSyncingWithServer] = useState(false);

  // Chỉ truy cập Redux state sau khi client đã được hydrate (tránh lỗi SSR)
  const bookingData = useAppSelector((state) => isClient ? state.booking : {});
  
  // Chuyển đổi showtimeId từ string sang number
  const parsedShowtimeId = showtimeId;
  
  // Fetch danh sách ghế của phòng - chỉ gọi API khi client đã sẵn sàng
  const { data: seatsData, isLoading: seatsLoading, error: seatsError, refetch: refetchSeats } = useGetSeatsByRoomIdQuery(id, {
    skip: !isClient
  });

  // Fetch danh sách ghế đã được đặt của user hiện tại để khôi phục sau khi reload
  const { data: reservationsData, isLoading: reservationsLoading, refetch: refetchReservations } = useGetReservedSeatsQuery(parsedShowtimeId, {
    skip: !isClient || parsedShowtimeId <= 0
  });



  // Đồng bộ ghế đã chọn với reservations trên server khi quay lại từ trang thanh toán
  useEffect(() => {
    // Kiểm tra các điều kiện cần thiết trước khi đồng bộ
    if (!isClient || !urlStateInitialized || !sessionId || !reservationsData || !seatsData) {
      if (isClient) {
        setIsSyncingWithServer(false);
      }
      return;
    }

    setIsSyncingWithServer(true);

    // Tìm các đặt ghế tạm thời (pending) của phiên hiện tại
    const myReservations = reservationsData.filter(reservation => 
      reservation.session_id === sessionId && 
      reservation.status === 'pending'
    );



    if (myReservations.length > 0) {
      // Chuyển đổi seat_id thành seat_code để khớp với selectedSeats trong URL
      const myReservedSeatCodes = myReservations
        .map(reservation => {
          const seat = seatsData.find(s => s.seat_id === reservation.seat_id);
          return seat?.seat_code;
        })
        .filter(Boolean) as string[];

      // Nếu có ghế đã đặt trên server mà chưa có trong URL, thêm vào URL
      const seatsToAdd = myReservedSeatCodes.filter(seatCode => !selectedSeats.includes(seatCode));
      if (seatsToAdd.length > 0) {
        // Thêm từng ghế vào selectedSeats
        seatsToAdd.forEach(seatCode => {
          handleSeatToggle(seatCode);
        });
        
        // Hiển thị thông báo khôi phục ghế
        setTimeout(() => {
          toast.success(`Đã khôi phục ${seatsToAdd.length} ghế đã đặt trước đó.`);
        }, 500);
      }
    }

    // Đánh dấu quá trình đồng bộ hoàn tất
    setTimeout(() => {
      setIsSyncingWithServer(false);
    }, 1000);
  }, [isClient, urlStateInitialized, sessionId, reservationsData, seatsData, reservationsLoading]);

  // Đảm bảo component đã được hydrate trước khi hiển thị nội dung động
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Hiển thị thông báo chào mừng khi quay lại từ trang thanh toán
  useEffect(() => {
    if (!isClient || !urlStateInitialized) return;
    
    // Kiểm tra xem user có quay lại từ trang payment không
    const fromPayment = sessionStorage.getItem('returning_from_payment');
    if (fromPayment) {
      sessionStorage.removeItem('returning_from_payment');
      
      // Delay để đảm bảo quá trình đồng bộ với server đã hoàn thành
      setTimeout(() => {
        if (hasSelectedSeats) {
          toast.success(`Chào mừng quay lại! Bạn có thể chỉnh sửa ${selectedSeats.length} ghế đã đặt.`);
        } else {
          toast.info(`Chào mừng quay lại! Đang đồng bộ thông tin ghế...`);
        }
      }, 1000);
    }
  }, [isClient, urlStateInitialized, hasSelectedSeats, selectedSeats.length]);

  // Các API mutations - chỉ khởi tạo sau khi client đã sẵn sàng
  const [createMultipleReservations] = useCreateMultipleReservationsMutation();
  const [cancelReservations] = useCancelReservationsMutation();

  // Tạo cấu hình sơ đồ ghế từ dữ liệu API
  const seatConfig = useMemo(() => {
    // Nếu chưa có dữ liệu, trả về cấu hình rỗng
    if (!isClient || !seatsData || seatsData.length === 0) {
      return {
        seatRows: [],
        seatColumns: 0,
        occupiedSeats: [],
        seatMatrix: new Map<string, Seats>()
      };
    }

    // Tìm số hàng và cột tối đa để tạo lưới ghế
    const maxRow = Math.max(...seatsData.map(seat => seat.row_number));
    const maxCol = Math.max(...seatsData.map(seat => seat.column_number));

    // Tạo danh sách tên hàng (A, B, C, ..., M, N, ...)
    const seatRows = Array.from({ length: maxRow }, (_, i) =>
      String.fromCharCode(65 + i) // A=65, B=66, ..., M=77, N=78
    );

    // Tạo danh sách ghế đã bị chiếm (không khả dụng hoặc đã được đặt bởi người khác)
    const occupiedSeats = seatsData
      .filter(seat => !seat.is_available)
      .map(seat => seat.seat_code);

    // Tạo Map để tra cứu nhanh thông tin ghế theo seat_code
    const seatMatrix = new Map<string, Seats>();
    seatsData.forEach(seat => {
      seatMatrix.set(seat.seat_code, seat);
    });

    return {
      seatRows,
      seatColumns: maxCol,
      occupiedSeats,
      seatMatrix
    };
  }, [isClient, seatsData]);

  // Kết nối WebSocket để cập nhật ghế theo thời gian thực - chỉ kết nối khi có đủ dữ liệu hợp lệ
  const shouldConnectWS = isClient && sessionId && parsedShowtimeId > 0 && !seatsLoading && seatsData && seatsData.length > 0;

  const {
    connected: wsConnected, // Trạng thái kết nối WebSocket
    reservedSeats, // Danh sách ghế đã được đặt qua WebSocket
    isSeatReservedByOthers, // Function kiểm tra ghế có được đặt bởi người khác không
    isSeatReservedByMe // Function kiểm tra ghế có được đặt bởi mình không
  } = useWebSocketSeat({
    showtimeId: shouldConnectWS ? parsedShowtimeId : 0,
    sessionId: sessionId || '',
    onSeatReserved: (seatIds, userSession) => {
      // Callback khi có ghế được đặt
    },
    onSeatReleased: (seatIds) => {
      // Callback khi có ghế được hủy đặt
    },
    onConnectionStatusChange: (connected) => {
      // Callback khi trạng thái kết nối thay đổi
    }
  });

  // Function xử lý chuyển sang trang thanh toán - tự động đặt ghế trước khi chuyển trang
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleProceedToPayment = useCallback(async () => {
    // Kiểm tra các điều kiện cần thiết trước khi xử lý
    if (!isClient || !urlStateInitialized || selectedSeats.length === 0 || parsedShowtimeId <= 0 || isProcessing) return;

    setIsProcessing(true);
    try {
      // Bước 1: Kiểm tra tính khả dụng của ghế đã chọn
      const unavailableSeats: string[] = [];
      selectedSeats.forEach(seatCode => {
        const seatInfo = seatConfig.seatMatrix.get(seatCode);
        if (!seatInfo || !seatInfo.is_available || isSeatReservedByOthers(seatInfo.seat_id)) {
          unavailableSeats.push(seatCode);
        }
      });

      // Nếu có ghế không khả dụng, thông báo lỗi và loại bỏ khỏi danh sách chọn
      if (unavailableSeats.length > 0) {
        toast.error(`Ghế ${unavailableSeats.join(', ')} không còn khả dụng. Vui lòng chọn ghế khác.`);
        // Loại bỏ ghế không khả dụng khỏi danh sách đã chọn
        unavailableSeats.forEach(seatCode => handleSeatToggle(seatCode));
        setIsProcessing(false);
        return;
      }

      // Bước 2: Tạo reservation requests để đặt ghế tạm thời
      const reservationRequests = selectedSeats.map(seatCode => {
        const seatInfo = seatConfig.seatMatrix.get(seatCode);
        if (!seatInfo) return null;

        return {
          seat_id: seatInfo.seat_id,
          showtime_id: parsedShowtimeId,
          session_id: sessionId,
          status: 'pending' // Trạng thái chờ thanh toán
        };
      }).filter(req => req !== null);

      if (reservationRequests.length > 0) {
        // Gọi API để tạo reservations
        await createMultipleReservations(reservationRequests).unwrap();
        toast.success('Ghế đã được đặt thành công!');
        
        // Bước 3: Đặt flag để phát hiện khi user quay lại từ trang thanh toán
        sessionStorage.setItem('returning_from_payment', 'true');
        
        // Chuyển hướng đến trang thanh toán (giữ lại URL params và thêm roomId, showtimeId)
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('roomId', id.toString());
        currentParams.set('showtimeId', showtimeId.toString());
        router.push(`/payment?${currentParams.toString()}`);
        
        // Làm mới dữ liệu reservations để cập nhật UI
        setTimeout(() => {
          refetchReservations();
        }, 500);
      }
    } catch (error) {
      toast.error('Không thể đặt ghế. Vui lòng thử lại.');
      setIsProcessing(false);
    }
  }, [isClient, urlStateInitialized, selectedSeats, parsedShowtimeId, sessionId, createMultipleReservations, seatConfig.seatMatrix, isProcessing, isSeatReservedByOthers, handleSeatToggle, router, refetchReservations]);

  // Dọn dẹp reservations khi component bị unmount
  useEffect(() => {
    return () => {
      if (reservationTimeout) {
        clearTimeout(reservationTimeout);
      }
    };
  }, [reservationTimeout]);

  // Dọn dẹp localStorage session khi không còn ghế nào được chọn
  useEffect(() => {
    if (isClient && selectedSeats.length === 0 && sessionId) {
      // Delay để tránh xóa session khi đang trong quá trình load dữ liệu
      const cleanupTimer = setTimeout(() => {
        // Chỉ xóa session nếu thực sự không có ghế nào được chọn và không có reservations pending
        if (selectedSeats.length === 0) {
          const myPendingReservations = reservationsData?.filter(r => 
            r.session_id === sessionId && r.status === 'pending'
          ) || [];
          
          // Nếu không có reservation pending nào, có thể xóa session
          if (myPendingReservations.length === 0) {
            localStorage.removeItem(`booking_session_${showtimeId}`);
          }
        }
      }, 2000);

      return () => clearTimeout(cleanupTimer);
    }
  }, [isClient, selectedSeats.length, sessionId, showtimeId, reservationsData]);

  // Hủy reservations khi ghế bị bỏ chọn
  const cancelSeatReservations = useCallback(async (seatCodes: string[]) => {
    if (!isClient) return;
    
    try {
      // Chuyển đổi seat codes thành seat IDs
      const seatIds = seatCodes
        .map(seatCode => seatConfig.seatMatrix.get(seatCode)?.seat_id)
        .filter(id => id !== undefined) as number[];

      if (seatIds.length > 0 && parsedShowtimeId > 0) {        
        // Gọi API để hủy reservations
        await cancelReservations({
          showtime_id: parsedShowtimeId,
          seat_ids: seatIds,
          session_id: sessionId
        }).unwrap();
        
        // Làm mới dữ liệu ghế và reservations để cập nhật trạng thái mới
        setTimeout(() => {
          refetchSeats();
          refetchReservations();
        }, 500);
        
      }
    } catch (error) {
      toast.error('Không thể hủy đặt ghế. Vui lòng thử lại.');
    }
  }, [isClient, seatConfig.seatMatrix, parsedShowtimeId, sessionId, cancelReservations, refetchSeats, refetchReservations]);

  // Xử lý khi user click vào ghế
  const handleSeatClick = useCallback((seatId: string) => {
    if (!isClient || !urlStateInitialized) return;
    
    // Lấy thông tin ghế từ seatMatrix
    const seatInfo = seatConfig.seatMatrix.get(seatId);
    if (!seatInfo) return;

    // Kiểm tra các trạng thái của ghế
    const isCurrentlySelected = selectedSeats.includes(seatId);
    const isMySeat = isSeatReservedByMe(seatInfo.seat_id);
    const isReservedByOthers = isSeatReservedByOthers(seatInfo.seat_id);

    // Không cho phép click vào ghế đã được đặt bởi người khác
    if (isReservedByOthers && !isMySeat) {
      toast.error('Ghế này đã được đặt bởi người khác');
      return;
    }

    // Không cho phép click vào ghế không khả dụng (trừ khi là ghế của mình)
    if (!seatInfo.is_available && !isMySeat) {
      toast.error('Ghế này không khả dụng');
      return;
    }

    // Xử lý logic chọn/bỏ chọn ghế
    if (isCurrentlySelected || isMySeat) {
      // Bỏ chọn ghế: cập nhật URL state trước
      handleSeatToggle(seatId);
      
      // Hủy reservation trên server nếu ghế này thuộc về mình
      if (isMySeat) {
        cancelSeatReservations([seatId]);
      }
    } else {
      // Chọn ghế mới: cập nhật URL state
      handleSeatToggle(seatId);
    }
  }, [isClient, urlStateInitialized, seatConfig.seatMatrix, isSeatReservedByOthers, isSeatReservedByMe, selectedSeats, handleSeatToggle, cancelSeatReservations]);

  // Tính toán danh sách ghế bị chiếm cuối cùng (bao gồm reservations của người khác, nhưng không bao gồm ghế của user hiện tại)
  const finalOccupiedSeats = useMemo(() => {
    if (!isClient) return [];
    
    // Bắt đầu với danh sách ghế đã bị chiếm từ cơ sở dữ liệu
    const baseOccupied = [...seatConfig.occupiedSeats];

    // Thêm ghế được đặt bởi người khác qua WebSocket (không phải session hiện tại)
    reservedSeats.forEach(reservation => {
      if (reservation.user_session !== sessionId) {
        // Tìm seat code theo seat_id
        const seatEntry = Array.from(seatConfig.seatMatrix.entries())
          .find(([_, seat]) => seat.seat_id === reservation.seat_id);

        if (seatEntry && !baseOccupied.includes(seatEntry[0])) {
          baseOccupied.push(seatEntry[0]);
        }
      }
    });

    // Thêm ghế từ reservationsData (ghế đã được confirm) nhưng loại trừ ghế của session hiện tại
    if (reservationsData) {
      reservationsData.forEach(reservation => {
        if (reservation.session_id !== sessionId && reservation.status === 'confirmed') {
          const seatEntry = Array.from(seatConfig.seatMatrix.entries())
            .find(([_, seat]) => seat.seat_id === reservation.seat_id);

          if (seatEntry && !baseOccupied.includes(seatEntry[0])) {
            baseOccupied.push(seatEntry[0]);
          }
        }
      });
    }

    return baseOccupied;
  }, [isClient, seatConfig.occupiedSeats, seatConfig.seatMatrix, reservedSeats, reservationsData, sessionId]);

  // Utility function để format giá tiền theo định dạng Việt Nam
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }, []);

  return (
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Phần sơ đồ chọn ghế */}
          <div className="lg:col-span-2">
            <SeatMap
              seatRows={seatConfig.seatRows}
              seatColumns={seatConfig.seatColumns}
              occupiedSeats={finalOccupiedSeats}
              selectedSeats={selectedSeats}
              onSeatClick={handleSeatClick}
              seatsData={seatsData}
            />
            {/* Hiển thị trạng thái kết nối và thông tin debug */}
            <div className="mt-2 text-sm space-y-1">
              <div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${wsConnected
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                  {wsConnected ? '🟢 Realtime Connected' : '🔴 Realtime Disconnected'}
                </span>
              </div>
              {/* Hiển thị indicator khi đang đồng bộ với server */}
              {isSyncingWithServer && (
                <div className="text-xs text-blue-600 flex items-center gap-1">
                  <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Đang đồng bộ với server...
                </div>
              )}
              {/* Thông tin debug chỉ hiển thị trong môi trường development */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500">
                  <div>Showtime: {parsedShowtimeId}</div>
                  <div>Should Connect: {shouldConnectWS ? 'Yes' : 'No'}</div>
                  <div>Reserved Seats: {reservedSeats.length}</div>
                  <div>Session: {sessionId.slice(0, 8)}...</div>
                  <div>Syncing: {isSyncingWithServer ? 'Yes' : 'No'}</div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar thông tin đặt vé */}
          <div>
            <BookingSidebar
              movie={mockData.movie}
              schedule={mockData.schedule}
              price={mockData.price}
              selectedSeats={selectedSeats}
              selectedTicketType={selectedTicketType}
              formatPrice={formatPrice}
              seatsData={seatsData}
              onReserveSeats={handleProceedToPayment}
              isReserving={isProcessing}
              reservedSeats={reservationsData}
              sessionId={sessionId}
              onTicketTypeChange={handleTicketTypeChange}
            />
          </div>
        </div>
      </div>
  );
}