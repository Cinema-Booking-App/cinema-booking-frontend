"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { SeatMap } from "./seat-map";
import { BookingSidebar } from "./booking-sidebar";
import { useGetSeatsByRoomIdQuery } from "@/store/slices/rooms/roomsApi";
import { useCreateMultipleReservationsMutation, useCancelReservationsMutation } from "@/store/slices/reservations/reservationsApi";
import { Seats } from "@/types/seats";
import { useWebSocketSeat } from "@/hooks/useWebSocketSeat";
import { useAppSelector } from "@/store/store";
import { v4 as uuidv4 } from 'uuid';



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
  const { data: seatsData, isLoading: seatsLoading } = useGetSeatsByRoomIdQuery(id);
  const bookingData = useAppSelector((state) => state.booking);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedTicketType, setSelectedTicketType] = useState<"adult" | "child" | "student">("adult");
  const [sessionId] = useState(() => uuidv4());
  const [reservationTimeout, setReservationTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // API mutations
  const [createMultipleReservations] = useCreateMultipleReservationsMutation();
  const [cancelReservations] = useCancelReservationsMutation();

  // Get showtime ID from props
  const parsedShowtimeId = showtimeId ? parseInt(showtimeId) : 0;

  // Tạo cấu hình ghế từ API data
  const seatConfig = useMemo(() => {
    if (!seatsData || seatsData.length === 0) {
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
  }, [seatsData]);

  // WebSocket connection for real-time seat updates - only connect if we have valid data
  const shouldConnectWS = parsedShowtimeId > 0 && !seatsLoading && seatsData && seatsData.length > 0;
  
  const {
    connected: wsConnected,
    reservedSeats,
    isSeatReservedByOthers,
    isSeatReservedByMe
  } = useWebSocketSeat({
    showtimeId: shouldConnectWS ? parsedShowtimeId : 0,
    sessionId,
    onSeatReserved: (seatIds, userSession) => {
      console.log('🎫 Seats reserved:', seatIds, 'by:', userSession);
    },
    onSeatReleased: (seatIds) => {
      console.log('🎫 Seats released:', seatIds);
    },
    onConnectionStatusChange: (connected) => {
      console.log('🔌 WebSocket connection status:', connected);
    }
  });

  // Auto-reserve seats when selected (with debounce)
  useEffect(() => {
    if (reservationTimeout) {
      clearTimeout(reservationTimeout);
    }

    if (selectedSeats.length > 0 && parsedShowtimeId > 0) {
      const timeout = setTimeout(async () => {
        try {
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
            console.log('Seats reserved successfully');
          }
        } catch (error) {
          console.error('Failed to reserve seats:', error);
          // Optionally show error to user
        }
      }, 1000); // 1 second debounce

      setReservationTimeout(timeout);
    }

    return () => {
      if (reservationTimeout) {
        clearTimeout(reservationTimeout);
      }
    };
  }, [selectedSeats, parsedShowtimeId, sessionId, createMultipleReservations, seatConfig.seatMatrix]);

  // Cancel reservations when seats are deselected
  const cancelSeatReservations = useCallback(async (seatCodes: string[]) => {
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
        console.log('Seat reservations cancelled');
      }
    } catch (error) {
      console.error('Failed to cancel reservations:', error);
    }
  }, [seatConfig.seatMatrix, parsedShowtimeId, sessionId, cancelReservations]);

  const handleSeatClick = useCallback((seatId: string) => {
    const seatInfo = seatConfig.seatMatrix.get(seatId);
    if (!seatInfo || !seatInfo.is_available) return;

    // Check if seat is reserved by others
    if (isSeatReservedByOthers(seatInfo.seat_id)) {
      console.log('Seat is reserved by another user');
      return;
    }

    setSelectedSeats(prev => {
      const isCurrentlySelected = prev.includes(seatId);
      
      if (isCurrentlySelected) {
        // Cancel reservation for this seat
        cancelSeatReservations([seatId]);
        return prev.filter(seat => seat !== seatId);
      } else {
        // Add to selection (reservation will be handled by useEffect)
        return [...prev, seatId];
      }
    });
  }, [seatConfig.seatMatrix, isSeatReservedByOthers, cancelSeatReservations]);

  // Compute final occupied seats including reservations by others
  const finalOccupiedSeats = useMemo(() => {
    const baseOccupied = [...seatConfig.occupiedSeats];
    
    // Add seats reserved by others
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
    
    return baseOccupied;
  }, [seatConfig.occupiedSeats, seatConfig.seatMatrix, reservedSeats, sessionId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (seatsLoading) {
    return (
      <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải sơ đồ ghế...</p>
        </div>
      </div>
    );
  }

  if (!seatsData || seatsData.length === 0) {
    return (
      <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Không tìm thấy thông tin ghế</p>
          <p className="text-muted-foreground">Vui lòng thử lại sau hoặc liên hệ hỗ trợ</p>
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
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                  wsConnected 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {wsConnected ? '🟢 Realtime Connected' : '🔴 Realtime Disconnected'}
                </span>
              </div>
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500">
                  <div>Showtime: {parsedShowtimeId}</div>
                  <div>Should Connect: {shouldConnectWS ? 'Yes' : 'No'}</div>
                  <div>Reserved Seats: {reservedSeats.length}</div>
                  <div>Session: {sessionId.slice(0, 8)}...</div>
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
            />
          </div>
        </div>
      </div>
    </div>
  );
} 