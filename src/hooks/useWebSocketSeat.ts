import { SeatReservation } from '@/types/seat-reservation';
import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketSeatData extends Omit<SeatReservation, 'session_id' | 'reservation_id'> {
  reservation_id?: number;
  user_session: string;
}
interface WebSocketMessage {
  type: 'initial_data' | 'seat_update' | 'seats_reserved' | 'seats_released' | 'pong' | 'error';
  showtime_id: number;
  data: any;
}

interface UseWebSocketSeatOptions {
  showtimeId: number;
  sessionId: string;
  onSeatReserved?: (seatIds: number[], userSession: string) => void;
  onSeatReleased?: (seatIds: number[]) => void;
  onConnectionStatusChange?: (connected: boolean) => void;
}

export const useWebSocketSeat = ({
  showtimeId,
  sessionId,
  onSeatReserved,
  onSeatReleased,
  onConnectionStatusChange
}: UseWebSocketSeatOptions) => {
  // Khởi tạo các state quản lý kết nối WebSocket
  const [connected, setConnected] = useState(false);              // Trạng thái kết nối WebSocket
  const [reservedSeats, setReservedSeats] = useState<SeatReservation[]>([]); // Danh sách ghế đã được đặt
  const wsRef = useRef<WebSocket | null>(null);                   // Biến tham chiếu lưu instance WebSocket
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Biến timeout cho việc kết nối lại
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);    // Biến interval cho heartbeat ping
  const reconnectAttemptsRef = useRef(0);                         // Biến đếm số lần thử kết nối lại
  const [reconnectAttempts, setReconnectAttempts] = useState(0);   // State hiển thị số lần thử lại
  const maxReconnectAttempts = 5;                                 // Số lần tối đa thử kết nối lại
  const mountedRef = useRef(true);                                // Kiểm tra component còn mounted không

  // Các hằng số cấu hình
  const PING_INTERVAL = 30000; // 30 giây
  const MAX_RECONNECT_DELAY = 10000; // 10 giây
  const CLOSE_CODE_MANUAL = 1000;
  const CLOSE_CODE_GOING_AWAY = 1001;

  // Hàm hỗ trợ tạo URL cho WebSocket
  const createWebSocketUrl = useCallback((showtimeId: number, sessionId: string): string => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    
  // Chuyển đổi URL HTTP sang URL WebSocket
    const protocol = apiUrl.startsWith('https://') ? 'wss://' : 'ws://';
    const baseUrl = apiUrl.replace(/^https?:\/\//, '').replace('/api/v1', '');
    
    return `${protocol}${baseUrl}/api/v1/ws/seats/${showtimeId}?session_id=${sessionId}`;
  }, []);

  // Hàm hỗ trợ xóa interval ping
  const clearPingInterval = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
  }, []);

  // Hàm hỗ trợ dọn dẹp tất cả tài nguyên khi đóng kết nối
  const cleanupResources = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(CLOSE_CODE_MANUAL, 'Cleanup');
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    clearPingInterval();
  }, [clearPingInterval]);

  // Hàm hỗ trợ chuyển đổi dữ liệu WebSocket thành SeatReservation
  const createSeatReservation = useCallback((data: WebSocketSeatData): SeatReservation => {
    const now = new Date().toISOString();
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes from now

    return {
      reservation_id: data.reservation_id || 0, // Temporary ID for WebSocket
      seat_id: data.seat_id,
      showtime_id: data.showtime_id || showtimeId,
      user_id: data.user_id,
      session_id: data.user_session, 
      reserved_at: data.reserved_at || now,
      expires_at: data.expires_at || expires,
      status: data.status as 'pending' | 'confirmed' | 'cancelled',
      transaction_id: data.transaction_id
    };
  }, [showtimeId]);

  // Các hàm xử lý message từ WebSocket
  const handleSeatsReserved = useCallback((data: any) => {
    const { seat_ids: reservedSeatIds, user_session } = data;
    
    setReservedSeats(prev => {
      const updated = [...prev];
      reservedSeatIds.forEach((seatId: number) => {
        const existingIndex = updated.findIndex(seat => seat.seat_id === seatId);
        if (existingIndex >= 0) {
          // Cập nhật thông tin đặt ghế đã tồn tại
          updated[existingIndex] = {
            ...updated[existingIndex],
            status: 'pending',
            session_id: user_session
          };
        } else {
          // Tạo mới thông tin đặt ghế bằng hàm hỗ trợ
               const websocketData: WebSocketSeatData = {
          seat_id: seatId,
          showtime_id: showtimeId,
          reserved_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          status: 'pending',
          user_session: user_session
        };
        const newReservation = createSeatReservation(websocketData);
        updated.push(newReservation);
        }
      });
      return updated;
    });

    onSeatReserved?.(reservedSeatIds, user_session);
  }, [onSeatReserved, createSeatReservation]);

  const handleSeatsReleased = useCallback((data: any) => {
    const { seat_ids: releasedSeatIds } = data;
    
    console.log('🔄 WebSocket handleSeatsReleased:', releasedSeatIds);
    
    setReservedSeats(prev => {
      const filtered = prev.filter(seat => !releasedSeatIds.includes(seat.seat_id));
      console.log('🔄 Reserved seats after release:', filtered.length, 'before:', prev.length);
      return filtered;
    });

    // Gọi callback với delay nhỏ để đảm bảo state đã được update
    setTimeout(() => {
      onSeatReleased?.(releasedSeatIds);
    }, 100);
  }, [onSeatReleased]);

  const handleSeatUpdate = useCallback((data: WebSocketSeatData) => {
    console.log('🔄 WebSocket handleSeatUpdate:', data);
    
    setReservedSeats(prev => {
      const updated = [...prev];
      const existingIndex = updated.findIndex(seat => seat.seat_id === data.seat_id);
      
      if (data.status === 'cancelled') {
        console.log('🗑️ Removing seat from WebSocket:', data.seat_id);
        return updated.filter(seat => seat.seat_id !== data.seat_id);
      } else {
        // Chuyển đổi dữ liệu WebSocket sang định dạng SeatReservation chuẩn
        const seatReservation = createSeatReservation(data);

        if (existingIndex >= 0) {
          updated[existingIndex] = seatReservation;
        } else {
          updated.push(seatReservation);
        }
        return updated;
      }
    });
  }, [createSeatReservation]);

  const connectWebSocket = useCallback(() => {
  // Nếu component đã bị unmount thì không thực hiện kết nối
    if (!mountedRef.current) return;
    
  // Đóng kết nối WebSocket cũ nếu có
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      wsRef.current.close(1000, 'Reconnecting');
    }

  // Dọn dẹp các timeout cũ
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

  // Tạo URL cho WebSocket
    const wsUrl = createWebSocketUrl(showtimeId, sessionId);

  // Mở kết nối WebSocket mới
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) {
        ws.close(1000, 'Component unmounted');
        return;
      }
      
      setConnected(true);
      reconnectAttemptsRef.current = 0;
      setReconnectAttempts(0);
      onConnectionStatusChange?.(true);

  // Bắt đầu interval gửi ping để giữ kết nối sống
      clearPingInterval();
      pingIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping' }));
        }
      }, PING_INTERVAL);
    };

    ws.onclose = (event) => {
      if (!mountedRef.current) {
        return;
      }
      
      setConnected(false);
      onConnectionStatusChange?.(false);

  // Xóa interval ping
      clearPingInterval();

      // Thử kết nối lại nếu không phải đóng thủ công và component vẫn còn mounted
      if (event.code !== CLOSE_CODE_MANUAL && event.code !== CLOSE_CODE_GOING_AWAY && reconnectAttemptsRef.current < maxReconnectAttempts && mountedRef.current) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), MAX_RECONNECT_DELAY);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current && wsRef.current?.readyState === WebSocket.CLOSED) {
            reconnectAttemptsRef.current++;
            setReconnectAttempts(reconnectAttemptsRef.current);
            connectWebSocket();
          }
        }, delay);
      }
    };

    ws.onerror = () => {
      // WebSocket error - connection will be handled by onclose
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        switch (message.type) {
          case 'initial_data':
            if (Array.isArray(message.data.reserved_seats)) {
              // Map lại từng phần tử qua createSeatReservation để đảm bảo có session_id
              const mappedSeats = message.data.reserved_seats.map((seat: any) => createSeatReservation({
                ...seat,
                user_session: seat.session_id || seat.user_session || '',
              }));
              setReservedSeats(mappedSeats);
            } else {
              setReservedSeats([]);
            }
            break;

          case 'seats_reserved':
            handleSeatsReserved(message.data);
            break;

          case 'seats_released':
            handleSeatsReleased(message.data);
            break;

          case 'seat_update':
            handleSeatUpdate(message.data);
            break;

          case 'pong':
            // Phản hồi heartbeat - xác nhận kết nối còn sống
            break;
        }
      } catch (error) {
        // Error parsing WebSocket message - ignore
      }
    };
  }, [showtimeId, sessionId, onSeatReserved, onSeatReleased, onConnectionStatusChange, createWebSocketUrl, clearPingInterval, handleSeatsReserved, handleSeatsReleased, handleSeatUpdate]);

  useEffect(() => {
    mountedRef.current = true;
    
    // Chỉ kết nối khi có showtime hợp lệ - kết nối lại khi showtime/session/callbacks thay đổi
    if (showtimeId > 0) {
      connectWebSocket();
    }

    return () => {
      // Đánh dấu đã unmount
      mountedRef.current = false;
      
      // Dọn dẹp khi component bị hủy
      cleanupResources();
    };
  }, [showtimeId, sessionId, connectWebSocket]); // ✅ Thêm connectWebSocket để reconnect khi callbacks thay đổi

  const disconnect = useCallback(() => {
    mountedRef.current = false;
    cleanupResources();
  }, [cleanupResources]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  // Hàm hỗ trợ kiểm tra ghế đã bị người khác giữ chưa
  const isSeatReservedByOthers = useCallback((seatId: number) => {
    const reservation = reservedSeats.find(seat => seat.seat_id === seatId);
    return reservation && reservation.session_id !== sessionId;
  }, [reservedSeats, sessionId]);

  // Hàm hỗ trợ kiểm tra ghế đã được chính mình giữ chưa
  const isSeatReservedByMe = useCallback((seatId: number) => {
    const reservation = reservedSeats.find(seat => seat.seat_id === seatId);
    return reservation && reservation.session_id === sessionId;
  }, [reservedSeats, sessionId]);

  return {
    connected,
    reservedSeats,
    disconnect,
    sendMessage,
    isSeatReservedByOthers,
    isSeatReservedByMe,
    reconnectAttempts
  };
};