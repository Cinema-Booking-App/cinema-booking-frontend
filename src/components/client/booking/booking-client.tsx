"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { SeatMap } from "./seat-map";
import { BookingSidebar } from "./booking-sidebar";
import { useGetSeatsByRoomIdQuery } from "@/store/slices/rooms/roomsApi";
import { useCreateMultipleReservationsMutation, useCancelReservationsMutation, useGetReservedSeatsQuery } from "@/store/slices/reservations/reservationsApi";
import { Seats } from "@/types/seats";
import { useWebSocketSeat } from "@/hooks/useWebSocketSeat";
import { useURLBookingState } from "@/hooks/useURLBookingState";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BookingClientProps {
  id: number;
  showtimeId: number;
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
      price: number;
    };
  };
}

export default function BookingClient({ id, showtimeId, mockData }: BookingClientProps) {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const {
    sessionId,
    selectedSeats,
    isInitialized: urlStateInitialized,
    selectSeat: handleSeatToggle,
    clearSeats,
    hasSelectedSeats
  } = useURLBookingState();

  const [isSyncingWithServer, setIsSyncingWithServer] = useState(false);

  // ✅ FIX: Thêm pollingInterval để tự động refetch
  const { data: seatsData, isLoading: seatsLoading, refetch: refetchSeats } = useGetSeatsByRoomIdQuery(id, {
    skip: !isClient,
    pollingInterval: 0 // Không dùng polling, chỉ refetch khi cần
  });

  const { data: reservationsData, isLoading: reservationsLoading, refetch: refetchReservations } = useGetReservedSeatsQuery(showtimeId, {
    skip: !isClient || showtimeId <= 0,
    pollingInterval: 0 // Không dùng polling, chỉ refetch khi cần
  });

  // ✅ FIX: Thêm state để force re-render khi cần
  const [wsUpdateTrigger, setWsUpdateTrigger] = useState(0);

  // ✅ FIX: Callbacks với force update
  const handleSeatReleasedFromWS = useCallback(async (seatIds: number[]) => {
    console.log('🔄 Ghế được release từ WS:', seatIds);
    
    try {
      // Đợi một chút để WebSocket state được cập nhật
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Force refetch API data
      await Promise.all([
        refetchReservations(),
        refetchSeats()
      ]);
      
      // Trigger re-render với delay để đảm bảo state sync
      setTimeout(() => {
        setWsUpdateTrigger(prev => prev + 1);
        console.log('✅ Đã cập nhật giao diện sau khi release ghế');
      }, 100);
      
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật sau khi release ghế:', error);
    }
  }, [refetchReservations, refetchSeats]);

  const handleSeatReservedFromWS = useCallback(async (seatIds: number[], userSession: string) => {
    console.log('🔄 Ghế được đặt từ WS:', seatIds, 'Session:', userSession);
    
    // Chỉ refetch nếu không phải session của mình
    if (userSession !== sessionId) {
      try {
        await refetchReservations();
        setWsUpdateTrigger(prev => prev + 1);
        console.log('✅ Đã cập nhật giao diện sau khi reserve ghế');
      } catch (error) {
        console.error('❌ Lỗi khi cập nhật sau khi reserve ghế:', error);
      }
    }
  }, [refetchReservations, sessionId]);

  useEffect(() => {
    if (!isClient || !urlStateInitialized || !sessionId || !reservationsData || !seatsData || reservationsLoading) {
      if (isClient) {
        setIsSyncingWithServer(false);
      }
      return;
    }

    setIsSyncingWithServer(true);

    const myReservations = reservationsData.filter(reservation =>
      reservation.session_id === sessionId &&
      reservation.status === 'pending'
    );

    if (myReservations.length > 0) {
      const myReservedSeatCodes = myReservations
        .map(reservation => {
          const seat = seatsData.find(s => s.seat_id === reservation.seat_id);
          return seat?.seat_code;
        })
        .filter(Boolean) as string[];

      const seatsToAdd = myReservedSeatCodes.filter(seatCode => !selectedSeats.includes(seatCode));
      if (seatsToAdd.length > 0) {
        seatsToAdd.forEach(seatCode => {
          handleSeatToggle(seatCode);
        });
      }
    }

    setTimeout(() => {
      setIsSyncingWithServer(false);
    }, 1000);
  }, [isClient, urlStateInitialized, sessionId, reservationsData, seatsData, reservationsLoading, selectedSeats, handleSeatToggle]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !urlStateInitialized) return;

    const fromPayment = sessionStorage.getItem('returning_from_payment');
    if (fromPayment) {
      sessionStorage.removeItem('returning_from_payment');

      setTimeout(() => {
        if (hasSelectedSeats) {
          toast.success(`Chào mừng quay lại! Bạn có thể chỉnh sửa ${selectedSeats.length} ghế đã đặt.`);
        } else {
          toast.info(`Chào mừng quay lại! Đang đồng bộ thông tin ghế...`);
        }
      }, 1000);
    }
  }, [isClient, urlStateInitialized, hasSelectedSeats, selectedSeats.length]);



  const [createMultipleReservations] = useCreateMultipleReservationsMutation();
  const [cancelReservations] = useCancelReservationsMutation();

  const seatConfig = useMemo(() => {
    if (!isClient || !seatsData || seatsData.length === 0) {
      return {
        seatRows: [],
        seatColumns: 0,
        occupiedSeats: [],
        seatMatrix: new Map<string, Seats>()
      };
    }

    const maxRow = Math.max(...seatsData.map(seat => seat.row_number));
    const maxCol = Math.max(...seatsData.map(seat => seat.column_number));

    const seatRows = Array.from({ length: maxRow }, (_, i) =>
      String.fromCharCode(65 + i)
    );

    const occupiedSeats = seatsData
      .filter(seat => !seat.is_available)
      .map(seat => seat.seat_code);

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

  const shouldConnectWS = isClient && sessionId && showtimeId > 0 && !seatsLoading && seatsData && seatsData.length > 0;

  // Thêm forceUnselect callback để xử lý realtime
  const forceUnselect = useCallback((seatId: number, status: string, otherSessionId: string) => {
    // Tìm seatCode từ seatId
    const seatInfo = seatConfig.seatMatrix && Array.from(seatConfig.seatMatrix.values()).find(s => s.seat_id === seatId);
    if (!seatInfo) return;
    const seatCode = seatInfo.seat_code;
    // Nếu ghế đang được chọn bởi mình thì bỏ chọn
    if (selectedSeats.includes(seatCode)) {
      handleSeatToggle(seatCode);
      toast.info(`Ghế ${seatCode} vừa được ${status === 'confirmed' ? 'xác nhận' : 'giữ'} bởi người khác. Vui lòng chọn ghế khác.`);
    }
  }, [selectedSeats, handleSeatToggle, seatConfig.seatMatrix]);

  const {
    reservedSeats,
    isSeatReservedByOthers,
    isSeatReservedByMe
  } = useWebSocketSeat({
    showtimeId: shouldConnectWS ? showtimeId : 0,
    sessionId: sessionId || '',
    onSeatReserved: handleSeatReservedFromWS,
    onSeatReleased: handleSeatReleasedFromWS,
    onConnectionStatusChange: (connected) => {},
    forceUnselect
  });

  // ✅ FIX: Thêm wsUpdateTrigger vào dependencies để force re-calculate
  const finalOccupiedSeats = useMemo(() => {
    if (!isClient) return [];

    // Tạo Map để theo dõi ghế occupied theo nguồn
    const occupiedMap = new Map<string, { source: string[], seatId: number }>();

    // 1. Ghế không available từ database
    seatConfig.occupiedSeats.forEach(seatCode => {
      const seatInfo = seatConfig.seatMatrix.get(seatCode);
      if (seatInfo) {
        occupiedMap.set(seatCode, { 
          source: ['database'], 
          seatId: seatInfo.seat_id 
        });
      }
    });

    // 2. Ghế từ reservationsData (API) - chỉ lấy ghế của users khác
    if (reservationsData) {
      reservationsData.forEach(reservation => {
        if (reservation.session_id !== sessionId &&
          (reservation.status === 'confirmed' || reservation.status === 'pending')) {
          const seatEntry = Array.from(seatConfig.seatMatrix.entries())
            .find(([_, seat]) => seat.seat_id === reservation.seat_id);

          if (seatEntry) {
            const [seatCode] = seatEntry;
            const existing = occupiedMap.get(seatCode) || { source: [], seatId: reservation.seat_id };
            existing.source.push(`api-${reservation.session_id}`);
            occupiedMap.set(seatCode, existing);
          }
        }
      });
    }

    // 3. Ghế từ WebSocket (real-time) - ưu tiên cao nhất
    reservedSeats.forEach(reservation => {
      if (reservation.session_id !== sessionId) {
        const seatEntry = Array.from(seatConfig.seatMatrix.entries())
          .find(([_, seat]) => seat.seat_id === reservation.seat_id);

        if (seatEntry) {
          const [seatCode] = seatEntry;
          const existing = occupiedMap.get(seatCode) || { source: [], seatId: reservation.seat_id };
          existing.source.push(`ws-${reservation.session_id}`);
          occupiedMap.set(seatCode, existing);
        }
      }
    });

    // 4. Xác định ghế thực sự bị occupied sau khi xử lý các source
    const finalOccupied: string[] = [];
    
    occupiedMap.forEach((info, seatCode) => {
      const seatInfo = seatConfig.seatMatrix.get(seatCode);
      if (!seatInfo) return;

      // Ghế không available từ DB luôn occupied
      if (!seatInfo.is_available) {
        finalOccupied.push(seatCode);
        console.log('🚫 Permanently occupied (DB):', seatCode);
        return;
      }

      // Kiểm tra WebSocket data trước (real-time)
      const wsReservation = reservedSeats.find(r => 
        r.seat_id === seatInfo.seat_id && 
        r.session_id !== sessionId
      );

      if (wsReservation) {
        finalOccupied.push(seatCode);
        console.log('📡 Occupied from WebSocket:', seatCode, 'Session:', wsReservation.session_id);
        return;
      }

      // Kiểm tra API data (fallback)
      const apiReservation = reservationsData?.find(r =>
        r.seat_id === seatInfo.seat_id &&
        r.session_id !== sessionId &&
        (r.status === 'pending' || r.status === 'confirmed')
      );

      if (apiReservation) {
        // Chỉ tin API data nếu không có WebSocket data cho ghế này
        const hasWSDataForThisSeat = reservedSeats.some(r => r.seat_id === seatInfo.seat_id);
        if (!hasWSDataForThisSeat) {
          finalOccupied.push(seatCode);
          console.log('📊 Occupied from API:', seatCode, 'Session:', apiReservation.session_id);
        } else {
          console.log('🔄 API data ignored - WS has fresher data for:', seatCode);
        }
      }
    });

    return finalOccupied;
  }, [
    isClient, 
    seatConfig.occupiedSeats, 
    seatConfig.seatMatrix, 
    reservedSeats, 
    reservationsData, 
    sessionId,
    wsUpdateTrigger // ✅ Thêm dependency này để force re-calculate
  ]);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleProceedToPayment = useCallback(async () => {
    if (!isClient || !urlStateInitialized || selectedSeats.length === 0 || showtimeId <= 0 || isProcessing) {
      return;
    }

    setIsProcessing(true);
    try {
      const unavailableSeats: string[] = [];
      selectedSeats.forEach(seatCode => {
        const seatInfo = seatConfig.seatMatrix.get(seatCode);
        if (!seatInfo || !seatInfo.is_available || isSeatReservedByOthers(seatInfo.seat_id)) {
          unavailableSeats.push(seatCode);
        }
      });

      if (unavailableSeats.length > 0) {
        toast.error(`Ghế ${unavailableSeats.join(', ')} không còn khả dụng. Vui lòng chọn ghế khác.`);
        unavailableSeats.forEach(seatCode => handleSeatToggle(seatCode));
        return;
      }

      const existingReservations = reservationsData?.filter(r =>
        r.session_id === sessionId && r.status === 'pending'
      ) || [];

      const seatsNeedingReservation = selectedSeats.filter(seatCode => {
        const seatInfo = seatConfig.seatMatrix.get(seatCode);
        if (!seatInfo) return false;

        const hasReservation = existingReservations.some(r => r.seat_id === seatInfo.seat_id);
        return !hasReservation;
      });

      if (seatsNeedingReservation.length > 0) {
        const reservationRequests = seatsNeedingReservation.map(seatCode => {
          const seatInfo = seatConfig.seatMatrix.get(seatCode);
          if (!seatInfo) return null;

          return {
            seat_id: seatInfo.seat_id,
            showtime_id: showtimeId,
            session_id: sessionId,
            status: 'pending'
          };
        }).filter(req => req !== null);

        await createMultipleReservations(reservationRequests).unwrap();
      }

      toast.success('Chuyển đến trang thanh toán!');

      sessionStorage.setItem('returning_from_payment', 'true');

      const currentParams = new URLSearchParams(window.location.search);
      currentParams.set('roomId', id.toString());
      currentParams.set('showtimeId', showtimeId.toString());

      const paymentUrl = `/payment?${currentParams.toString()}`;
      router.push(paymentUrl);

      refetchReservations();

    } catch (error) {
      toast.error('Không thể chuyển đến trang thanh toán. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  }, [isClient, urlStateInitialized, selectedSeats, showtimeId, sessionId, createMultipleReservations, seatConfig.seatMatrix, isProcessing, isSeatReservedByOthers, handleSeatToggle, router, refetchReservations, id, reservationsData]);

  const cancelSeatReservations = useCallback(async (seatCodes: string[]) => {
    if (!isClient) return;

    try {
      const seatIds = seatCodes
        .map(seatCode => {
          const seat = seatConfig.seatMatrix.get(seatCode);
          return seat?.seat_id;
        })
        .filter(id => id !== undefined) as number[];

      if (seatIds.length > 0 && showtimeId > 0 && sessionId) {
        await cancelReservations({
          showtime_id: showtimeId,
          seat_ids: seatIds,
          session_id: sessionId
        }).unwrap();

        seatCodes.forEach(seatCode => {
          handleSeatToggle(seatCode);
        });

        await refetchSeats();
        await refetchReservations();
      }
    } catch (error) {
      toast.error('Không thể hủy đặt ghế. Vui lòng thử lại.');
    }
  }, [isClient, seatConfig.seatMatrix, showtimeId, sessionId, cancelReservations, refetchSeats, refetchReservations, handleSeatToggle]);

  useEffect(() => {
    if (isClient && selectedSeats.length === 0 && sessionId) {
      const cleanupTimer = setTimeout(() => {
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

  const handleSeatClick = useCallback((seatId: string) => {
    if (!isClient || !urlStateInitialized) return;

    const seatInfo = seatConfig.seatMatrix.get(seatId);
    if (!seatInfo) return;

    const isCurrentlySelected = selectedSeats.includes(seatId);

    const myPendingReservation = reservationsData?.find(r =>
      r.seat_id === seatInfo.seat_id &&
      r.session_id === sessionId &&
      r.status === 'pending'
    );
    const isMySeatAPI = !!myPendingReservation;
    const isMySeatWS = isSeatReservedByMe(seatInfo.seat_id);
    const isMySeat = isMySeatAPI || isMySeatWS;

    const isReservedByOthers = isSeatReservedByOthers(seatInfo.seat_id) ||
      (reservationsData?.some(r =>
        r.seat_id === seatInfo.seat_id &&
        r.session_id !== sessionId &&
        (r.status === 'pending' || r.status === 'confirmed')
      ) || false);

    // --- BỔ SUNG KIỂM TRA QUY TẮC CHỌN GHẾ ---
    // 1. Không cho chọn full hàng
    const rowSeats = Array.from(seatConfig.seatMatrix.values()).filter(s => s.row_number === seatInfo.row_number);
    const selectedInRow = selectedSeats.filter(code => {
      const s = seatConfig.seatMatrix.get(code);
      return s && s.row_number === seatInfo.row_number;
    });
    if (!isCurrentlySelected && selectedInRow.length + 1 >= rowSeats.length) {
      toast.error('Không thể chọn toàn bộ hàng ghế.');
      return;
    }

    // 2. Không để lại ghế lẻ (sole seat) giữa các ghế đã chọn hoặc đã đặt
    // Xây dựng mảng trạng thái ghế trong hàng: 0 = trống, 1 = đã chọn, 2 = đã đặt
    const rowSeatCodes = rowSeats.map(s => s.seat_code);
    const rowStatus = rowSeatCodes.map(code => {
      if (selectedSeats.includes(code) || code === seatId) return 1;
      const s = seatConfig.seatMatrix.get(code);
      if (!s?.is_available) return 2;
      const isReserved = reservationsData?.some(r => r.seat_id === s.seat_id && r.session_id !== sessionId && (r.status === 'pending' || r.status === 'confirmed'));
      if (isReserved) return 2;
      return 0;
    });
    // Kiểm tra sole seat: nếu có ghế trống bị kẹp giữa 2 ghế đã chọn/đặt
    for (let i = 1; i < rowStatus.length - 1; i++) {
      if (rowStatus[i] === 0 && (rowStatus[i - 1] > 0 && rowStatus[i + 1] > 0)) {
        toast.error('Không được để lại ghế lẻ giữa các ghế đã chọn hoặc đã đặt.');
        return;
      }
    }

    // 3. Không cho chọn ghế lẻ ở cạnh lề nếu bên cạnh đã bị chọn/đặt
    if (rowStatus[0] === 0 && rowStatus[1] > 0 && seatId === rowSeatCodes[0]) {
      toast.error('Không được để lại ghế lẻ ở cạnh lề.');
      return;
    }
    if (rowStatus[rowStatus.length - 1] === 0 && rowStatus[rowStatus.length - 2] > 0 && seatId === rowSeatCodes[rowSeatCodes.length - 1]) {
      toast.error('Không được để lại ghế lẻ ở cạnh lề.');
      return;
    }

    // --- KẾT THÚC KIỂM TRA ---

    if (isReservedByOthers && !isMySeat) {
      toast.error('Ghế này đã được đặt bởi người khác');
      return;
    }

    if (!seatInfo.is_available && !isMySeat) {
      toast.error('Ghế này không khả dụng');
      return;
    }

    if (isCurrentlySelected || isMySeat) {
      if (isCurrentlySelected) {
        handleSeatToggle(seatId);
      }
      if (isMySeatAPI && myPendingReservation) {
        cancelSeatReservations([seatId]);
      } else if (!isMySeatAPI && isMySeatWS) {
        handleSeatToggle(seatId);
      }
    } else {
      handleSeatToggle(seatId);
    }
  }, [isClient, urlStateInitialized, seatConfig.seatMatrix, isSeatReservedByOthers, isSeatReservedByMe, selectedSeats, handleSeatToggle, cancelSeatReservations, sessionId, reservationsData]);

  // ✅ FIX: Effect để monitor state changes và debug
  useEffect(() => {
    if (!isClient) return;
  }, [isClient, reservedSeats, reservationsData, finalOccupiedSeats.length, sessionId, wsUpdateTrigger]);

  // Tính tổng tiền đúng theo loại ghế
  const calculateTotal = () => {
    if (!seatsData) {
      return selectedSeats.length * mockData.schedule.price;
    }
    return selectedSeats.reduce((total, seatId) => {
      const seatInfo = seatsData.find(seat => seat.seat_code === seatId);
      if (!seatInfo) return total + mockData.schedule.price;
      const basePrice = mockData.schedule.price;
      switch (seatInfo.seat_type?.toLowerCase()) {
        case 'premium':
          return total + (basePrice * 1.2);
        case 'vip':
          return total + (basePrice * 1.5);
        case 'couple':
          return total + (basePrice * 2.0);
        case 'regular':
        default:
          return total + basePrice;
      }
    }, 0);
  };

  useEffect(() => {
    // Lưu tổng tiền vào sessionStorage để payment sử dụng lại
    if (isClient && seatsData && selectedSeats.length > 0) {
      sessionStorage.setItem('booking_total', JSON.stringify(calculateTotal()));
    }
  }, [isClient, seatsData, selectedSeats]);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        <div className="lg:col-span-2">
          <SeatMap
            seatRows={seatConfig.seatRows}
            seatColumns={seatConfig.seatColumns}
            occupiedSeats={finalOccupiedSeats}
            selectedSeats={selectedSeats}
            onSeatClick={handleSeatClick}
            seatsData={seatsData}
          />
        </div>

        <div>
          <BookingSidebar
            movie={mockData.movie}
            schedule={mockData.schedule}
            selectedSeats={selectedSeats}
            seatsData={seatsData}
            onReserveSeats={handleProceedToPayment}
            isReserving={isProcessing}
            reservedSeats={reservationsData}
            sessionId={sessionId}
          />
        </div>
      </div>
    </div>
  );
}