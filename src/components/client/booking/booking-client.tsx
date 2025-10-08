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

interface BookingClientProps {
  id: string;
  showtimeId: string;
  mockData: {
    movie: {
      title: string;
      poster: string;
      duration: string;
    };
    schedule: {
      date: string;
      time: string;
      theater: string;
      room: string;
    };
    price: {
      adult: number;
      child: number;
      student: number;
    };
  };
}

export default function BookingClient({ id, showtimeId, mockData }: BookingClientProps) {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
  // URL-based state management - không mất state khi reload/navigate
  const {
    sessionId,
    selectedSeats,
    ticketType: selectedTicketType,
    isInitialized: urlStateInitialized,
    selectSeat: handleSeatToggle,
    setTicketType: handleTicketTypeChange,
    clearSeats,
    hasSelectedSeats
  } = useURLBookingState();
  
  const [reservationTimeout, setReservationTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isSyncingWithServer, setIsSyncingWithServer] = useState(false);

  // Only access Redux state after client hydration
  const bookingData = useAppSelector((state) => isClient ? state.booking : {});
  
  // Get showtime ID from props
  const parsedShowtimeId = showtimeId ? parseInt(showtimeId) : 0;
  
  // Only fetch data after client is ready
  const { data: seatsData, isLoading: seatsLoading, error: seatsError, refetch: refetchSeats } = useGetSeatsByRoomIdQuery(id, {
    skip: !isClient
  });

  // Fetch current user's reservations để restore selected seats sau reload
  const { data: reservationsData, isLoading: reservationsLoading, refetch: refetchReservations } = useGetReservedSeatsQuery(parsedShowtimeId, {
    skip: !isClient || parsedShowtimeId <= 0
  });



  // Sync selected seats with server reservations khi quay lại từ payment
  useEffect(() => {
    if (!isClient || !urlStateInitialized || !sessionId || !reservationsData || !seatsData) {
      setIsSyncingWithServer(false);
      return;
    }

    setIsSyncingWithServer(true);

    // Tìm các reservation pending của session hiện tại
    const myReservations = reservationsData.filter(reservation => 
      reservation.session_id === sessionId && 
      reservation.status === 'pending'
    );



    if (myReservations.length > 0) {
      // Convert seat_id về seat_code để đồng bộ với selectedSeats
      const myReservedSeatCodes = myReservations
        .map(reservation => {
          const seat = seatsData.find(s => s.seat_id === reservation.seat_id);
          return seat?.seat_code;
        })
        .filter(Boolean) as string[];



      // Nếu có ghế reserved trên server mà không có trong URL, thêm vào URL
      const seatsToAdd = myReservedSeatCodes.filter(seatCode => !selectedSeats.includes(seatCode));
      if (seatsToAdd.length > 0) {
        seatsToAdd.forEach(seatCode => {
          handleSeatToggle(seatCode);
        });
        
        // Show notification
        setTimeout(() => {
          toast.success(`Đã khôi phục ${seatsToAdd.length} ghế đã đặt trước đó.`);
        }, 500);
      }
    }

    // Mark sync as complete
    setTimeout(() => {
      setIsSyncingWithServer(false);
    }, 1000);
  }, [isClient, urlStateInitialized, sessionId, reservationsData, seatsData, reservationsLoading]);

  // Ensure component is hydrated before showing dynamic content
  useEffect(() => {
    setIsClient(true);
  }, [showtimeId]);

  // Welcome back notification when returning from payment
  useEffect(() => {
    if (isClient && urlStateInitialized) {
      const fromPayment = sessionStorage.getItem('returning_from_payment');
      if (fromPayment) {
        sessionStorage.removeItem('returning_from_payment');
        
        // Delay để đảm bảo sync với server đã hoàn thành
        setTimeout(() => {
          if (hasSelectedSeats) {
            toast.success(`Chào mừng quay lại! Bạn có thể chỉnh sửa ${selectedSeats.length} ghế đã đặt.`);
          } else {
            toast.info(`Chào mừng quay lại! Đang đồng bộ thông tin ghế...`);
          }
        }, 1000);
      }
    }
  }, [isClient, urlStateInitialized]);

  // API mutations - only initialize after client is ready
  const [createMultipleReservations] = useCreateMultipleReservationsMutation();
  const [cancelReservations] = useCancelReservationsMutation();

  // Tạo cấu hình ghế từ API data
  const seatConfig = useMemo(() => {
    if (!isClient || !seatsData || seatsData.length === 0) {
      return {
        seatRows: [],
        seatColumns: 0,
        occupiedSeats: [],
        seatMatrix: new Map<string, Seats>()
      };
    }

    // Tìm số hàng và cột tối đa
    const maxRow = Math.max(...seatsData.map(seat => seat.row_number));
    const maxCol = Math.max(...seatsData.map(seat => seat.column_number));

    // Tạo danh sách hàng (A, B, C, ..., M, N, ...)
    const seatRows = Array.from({ length: maxRow }, (_, i) =>
      String.fromCharCode(65 + i) // A=65, B=66, ..., M=77, N=78
    );

    // Tạo danh sách ghế đã bị chiếm (không available hoặc reserved by others)
    const occupiedSeats = seatsData
      .filter(seat => !seat.is_available)
      .map(seat => seat.seat_code);

    // Tạo map để dễ tra cứu thông tin ghế
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

  // WebSocket connection for real-time seat updates - only connect if we have valid data and client is hydrated
  const shouldConnectWS = isClient && sessionId && parsedShowtimeId > 0 && !seatsLoading && seatsData && seatsData.length > 0;

  const {
    connected: wsConnected,
    reservedSeats,
    isSeatReservedByOthers,
    isSeatReservedByMe
  } = useWebSocketSeat({
    showtimeId: shouldConnectWS ? parsedShowtimeId : 0,
    sessionId,
    onSeatReserved: (seatIds, userSession) => {
      // Seat reserved callback
    },
    onSeatReleased: (seatIds) => {
      // Seat released callback
    },
    onConnectionStatusChange: (connected) => {
      // Connection status changed
    }
  });

  // Function để xử lý thanh toán - tự động reserve ghế trước khi chuyển trang
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleProceedToPayment = useCallback(async () => {
    if (!isClient || !urlStateInitialized || selectedSeats.length === 0 || parsedShowtimeId <= 0 || isProcessing) return;

    setIsProcessing(true);
    try {
      // Bước 1: Validate seats are still available
      const unavailableSeats: string[] = [];
      selectedSeats.forEach(seatCode => {
        const seatInfo = seatConfig.seatMatrix.get(seatCode);
        if (!seatInfo || !seatInfo.is_available || isSeatReservedByOthers(seatInfo.seat_id)) {
          unavailableSeats.push(seatCode);
        }
      });

      if (unavailableSeats.length > 0) {
        toast.error(`Ghế ${unavailableSeats.join(', ')} không còn khả dụng. Vui lòng chọn ghế khác.`);
        // Remove unavailable seats from selection
        unavailableSeats.forEach(seatCode => handleSeatToggle(seatCode));
        setIsProcessing(false);
        return;
      }

      // Bước 2: Reserve ghế trước
      const reservationRequests = selectedSeats.map(seatCode => {
        const seatInfo = seatConfig.seatMatrix.get(seatCode);
        if (!seatInfo) return null;

        return {
          seat_id: seatInfo.seat_id,
          showtime_id: parsedShowtimeId,
          session_id: sessionId,
          status: 'pending'
        };
      }).filter(req => req !== null);

      if (reservationRequests.length > 0) {
        await createMultipleReservations(reservationRequests).unwrap();
        toast.success('Ghế đã được đặt thành công!');
        
        // Bước 3: Set flag for return detection
        sessionStorage.setItem('returning_from_payment', 'true');
        
        // Navigate to payment page (giữ URL params và thêm roomId, showtimeId)
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('roomId', id);
        currentParams.set('showtimeId', showtimeId);
        router.push(`/payment?${currentParams.toString()}`);
        
        // Refetch reservations để cập nhật UI
        setTimeout(() => {
          refetchReservations();
        }, 500);
      }
    } catch (error) {
      toast.error('Không thể đặt ghế. Vui lòng thử lại.');
      setIsProcessing(false);
    }
  }, [isClient, urlStateInitialized, selectedSeats, parsedShowtimeId, sessionId, createMultipleReservations, seatConfig.seatMatrix, isProcessing, isSeatReservedByOthers, handleSeatToggle, router, refetchReservations]);

  // Cleanup reservations when component unmounts
  useEffect(() => {
    return () => {
      if (reservationTimeout) {
        clearTimeout(reservationTimeout);
      }
    };
  }, [reservationTimeout]);

  // Cleanup localStorage session khi không còn selected seats
  useEffect(() => {
    if (isClient && selectedSeats.length === 0 && sessionId) {
      // Delay một chút để tránh xóa session khi đang load
      const cleanupTimer = setTimeout(() => {
        // Chỉ xóa nếu thực sự không có ghế nào được chọn và không có reservations pending
        if (selectedSeats.length === 0) {
          const myPendingReservations = reservationsData?.filter(r => 
            r.session_id === sessionId && r.status === 'pending'
          ) || [];
          
          if (myPendingReservations.length === 0) {
            localStorage.removeItem(`booking_session_${showtimeId}`);
          }
        }
      }, 2000);

      return () => clearTimeout(cleanupTimer);
    }
  }, [isClient, selectedSeats.length, sessionId, showtimeId, reservationsData]);

  // Cancel reservations when seats are deselected
  const cancelSeatReservations = useCallback(async (seatCodes: string[]) => {
    if (!isClient) return;
    
    try {
      const seatIds = seatCodes
        .map(seatCode => seatConfig.seatMatrix.get(seatCode)?.seat_id)
        .filter(id => id !== undefined) as number[];

      if (seatIds.length > 0 && parsedShowtimeId > 0) {        
        await cancelReservations({
          showtime_id: parsedShowtimeId,
          seat_ids: seatIds,
          session_id: sessionId
        }).unwrap();
        
        // Force refetch both seats and reservations data to get updated state
        setTimeout(() => {
          refetchSeats();
          refetchReservations();
        }, 500);
        
      }
    } catch (error) {
      toast.error('Không thể hủy đặt ghế. Vui lòng thử lại.');
    }
  }, [isClient, seatConfig.seatMatrix, parsedShowtimeId, sessionId, cancelReservations, refetchSeats, refetchReservations]);

  const handleSeatClick = useCallback((seatId: string) => {
    if (!isClient || !urlStateInitialized) return;
    
    const seatInfo = seatConfig.seatMatrix.get(seatId);
    if (!seatInfo) return;

    const isCurrentlySelected = selectedSeats.includes(seatId);
    const isMySeat = isSeatReservedByMe(seatInfo.seat_id);
    const isReservedByOthers = isSeatReservedByOthers(seatInfo.seat_id);

    // Check if seat is reserved by others (không cho phép click)
    if (isReservedByOthers && !isMySeat) {
      toast.error('Ghế này đã được đặt bởi người khác');
      return;
    }

    // Check if seat is available (trừ khi là ghế của mình)
    if (!seatInfo.is_available && !isMySeat) {
      toast.error('Ghế này không khả dụng');
      return;
    }

    // Xử lý chọn/bỏ chọn ghế
    if (isCurrentlySelected || isMySeat) {
      // Update URL state trước
      handleSeatToggle(seatId);
      
      // Cancel server reservation nếu có
      if (isMySeat) {
        cancelSeatReservations([seatId]);
      }
    } else {
      // Chọn ghế mới
      handleSeatToggle(seatId);
    }
  }, [isClient, urlStateInitialized, seatConfig.seatMatrix, isSeatReservedByOthers, isSeatReservedByMe, selectedSeats, handleSeatToggle, cancelSeatReservations]);

  // Compute final occupied seats including reservations by others (nhưng không bao gồm ghế của chính user)
  const finalOccupiedSeats = useMemo(() => {
    if (!isClient) return [];
    
    const baseOccupied = [...seatConfig.occupiedSeats];

    // Add seats reserved by others (không phải session hiện tại)
    reservedSeats.forEach(reservation => {
      if (reservation.user_session !== sessionId) {
        // Find seat code by seat_id
        const seatEntry = Array.from(seatConfig.seatMatrix.entries())
          .find(([_, seat]) => seat.seat_id === reservation.seat_id);

        if (seatEntry && !baseOccupied.includes(seatEntry[0])) {
          baseOccupied.push(seatEntry[0]);
        }
      }
    });

    // Thêm ghế từ reservationsData (confirmed seats) nhưng loại trừ ghế của session hiện tại
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

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }, []);

  // Show consistent loading state on both server and client
  if (!isClient || !urlStateInitialized || seatsLoading || reservationsLoading || !sessionId) {
    return (
      <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {!urlStateInitialized ? 'Đang khởi tạo phiên làm việc...' :
             reservationsLoading ? 'Đang khôi phục ghế đã chọn...' : 
             'Đang tải sơ đồ ghế...'}
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 text-xs text-gray-500">
              <p>isClient: {isClient.toString()}</p>
              <p>urlStateInitialized: {urlStateInitialized.toString()}</p>
              <p>seatsLoading: {seatsLoading.toString()}</p>
              <p>reservationsLoading: {reservationsLoading.toString()}</p>
              <p>sessionId: {sessionId.slice(0, 8) || 'empty'}...</p>
              <p>selectedSeats: {selectedSeats.length}</p>
              <p>roomId: {id}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (seatsError) {
    return (
      <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2 text-red-600">Lỗi tải dữ liệu ghế</p>
          <p className="text-muted-foreground mb-4">Không thể tải thông tin ghế cho phòng {id}</p>
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-red-500 mt-4">
              <pre>{JSON.stringify(seatsError, null, 2)}</pre>
            </div>
          )}
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!seatsData || seatsData.length === 0) {
    return (
      <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Không tìm thấy thông tin ghế</p>
          <p className="text-muted-foreground">Phòng {id} chưa có cấu hình ghế</p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 text-xs text-gray-500">
              <p>Room ID: {id}</p>
              <p>Seats Data: {JSON.stringify(seatsData)}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Phần chọn ghế */}
          <div className="lg:col-span-2">
            <SeatMap
              seatRows={seatConfig.seatRows}
              seatColumns={seatConfig.seatColumns}
              occupiedSeats={finalOccupiedSeats}
              selectedSeats={selectedSeats}
              onSeatClick={handleSeatClick}
              seatsData={seatsData}
            />
            {/* Connection status indicator */}
            <div className="mt-2 text-sm space-y-1">
              <div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${wsConnected
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                  {wsConnected ? '🟢 Realtime Connected' : '🔴 Realtime Disconnected'}
                </span>
              </div>
              {isSyncingWithServer && (
                <div className="text-xs text-blue-600 flex items-center gap-1">
                  <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Đang đồng bộ với server...
                </div>
              )}
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

          {/* Thông tin đặt vé */}
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
    </div>
  );
}