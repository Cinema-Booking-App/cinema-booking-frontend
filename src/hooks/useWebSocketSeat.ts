import { SeatReservation } from '@/types/seat-reservation';
import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketSeatData extends Omit<SeatReservation, 'session_id' | 'reservation_id'> {
  reservation_id?: number;
  user_session: string;
}

interface WebSocketMessage {
  type: 'initial_data' | 'seat_update' | 'seats_reserved' | 'seat_released' | 'pong' | 'error' | 'heartbeat_ack';
  showtime_id: number;
  data?: any;
  seat_ids?: number[];
  timestamp?: string;
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
  const [connected, setConnected] = useState(false);
  const [reservedSeats, setReservedSeats] = useState<SeatReservation[]>([]);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const mountedRef = useRef(true);
  const isConnectingRef = useRef(false);
  
  // ✅ Luôn cập nhật callbacks ref để có phiên bản mới nhất
  const callbacksRef = useRef({
    onSeatReserved,
    onSeatReleased,
    onConnectionStatusChange
  });

  useEffect(() => {
    callbacksRef.current = {
      onSeatReserved,
      onSeatReleased,
      onConnectionStatusChange
    };
  }, [onSeatReserved, onSeatReleased, onConnectionStatusChange]);

  const PING_INTERVAL = 30000;
  const MAX_RECONNECT_DELAY = 10000;
  const MAX_RECONNECT_ATTEMPTS = 5;
  const CLOSE_CODE_MANUAL = 1000;

  const createWebSocketUrl = useCallback((showtimeId: number, sessionId: string): string => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const protocol = apiUrl.startsWith('https://') ? 'wss://' : 'ws://';
    const baseUrl = apiUrl.replace(/^https?:\/\//, '').replace('/api/v1', '');
    return `${protocol}${baseUrl}/api/v1/ws/seats/${showtimeId}?session_id=${sessionId}`;
  }, []);

  const clearPingInterval = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
  }, []);

  const cleanupResources = useCallback(() => {
    console.log('🧹 Cleaning up WebSocket resources');
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    clearPingInterval();
    
    if (wsRef.current) {
      const ws = wsRef.current;
      wsRef.current = null;
      
      ws.onopen = null;
      ws.onclose = null;
      ws.onerror = null;
      ws.onmessage = null;
      
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close(CLOSE_CODE_MANUAL, 'Cleanup');
      }
    }
    
    isConnectingRef.current = false;
  }, [clearPingInterval]);

  const createSeatReservation = useCallback((data: WebSocketSeatData): SeatReservation => {
    const now = new Date().toISOString();
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    return {
      reservation_id: data.reservation_id || 0,
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

  const connectWebSocket = useCallback(() => {
    if (!mountedRef.current) {
      console.log('⚠️ Component unmounted, skip connect');
      return;
    }

    // Ngăn multiple connections cùng lúc
    if (isConnectingRef.current) {
      console.log('⚠️ Already connecting, skip');
      return;
    }

    // Nếu đã connected và healthy, không cần reconnect
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('✅ WebSocket already open, skip reconnect');
      return;
    }

    isConnectingRef.current = true;

    // Dọn dẹp connection cũ nếu có
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      wsRef.current.close(CLOSE_CODE_MANUAL, 'Reconnecting');
      wsRef.current = null;
    }

    const wsUrl = createWebSocketUrl(showtimeId, sessionId);
    console.log('🔌 Connecting to:', wsUrl);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      isConnectingRef.current = false;
      
      if (!mountedRef.current) {
        ws.close(CLOSE_CODE_MANUAL, 'Component unmounted');
        return;
      }

      console.log('✅ WebSocket connected');
      setConnected(true);
      reconnectAttemptsRef.current = 0;
      setReconnectAttempts(0);
      
      // ✅ Gọi callback connection status
      callbacksRef.current.onConnectionStatusChange?.(true);

      clearPingInterval();
      pingIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
        }
      }, PING_INTERVAL);
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        switch (message.type) {
          case 'initial_data':
            if (Array.isArray(message.data?.reserved_seats)) {
              const mappedSeats = message.data.reserved_seats.map((seat: any) => 
                createSeatReservation({
                  ...seat,
                  user_session: seat.session_id || seat.user_session || '',
                })
              );
              setReservedSeats(mappedSeats);
              console.log('📥 Initial data loaded:', mappedSeats.length, 'seats');
            }
            break;

          case 'seats_reserved': {
            const { seat_ids: reservedSeatIds, user_session } = message.data;
            console.log('🔒 Seats reserved:', reservedSeatIds, 'by', user_session);
            
            setReservedSeats(prev => {
              const updated = [...prev];
              reservedSeatIds.forEach((seatId: number) => {
                const existingIndex = updated.findIndex(seat => seat.seat_id === seatId);
                if (existingIndex >= 0) {
                  updated[existingIndex] = {
                    ...updated[existingIndex],
                    status: 'pending',
                    session_id: user_session
                  };
                } else {
                  const websocketData: WebSocketSeatData = {
                    seat_id: seatId,
                    showtime_id: showtimeId,
                    reserved_at: new Date().toISOString(),
                    expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
                    status: 'pending',
                    user_session: user_session
                  };
                  updated.push(createSeatReservation(websocketData));
                }
              });
              return updated;
            });

            // ✅ CRITICAL: Luôn gọi callback từ ref (có version mới nhất)
            setTimeout(() => {
              callbacksRef.current.onSeatReserved?.(reservedSeatIds, user_session);
            }, 50);
            break;
          }

          case 'seat_released': {
            const releasedSeatIds = message.seat_ids || message.data?.seat_ids || [];
            console.log('🔓 Seats released from WS:', releasedSeatIds);
            
            setReservedSeats(prev => {
              const filtered = prev.filter(seat => !releasedSeatIds.includes(seat.seat_id));
              console.log('🔄 Reserved seats after release:', filtered.length, 'before:', prev.length);
              return filtered;
            });

            // ✅ CRITICAL: Luôn gọi callback để UI update
            setTimeout(() => {
              console.log('📢 Calling onSeatReleased callback for:', releasedSeatIds);
              callbacksRef.current.onSeatReleased?.(releasedSeatIds);
            }, 100);
            break;
          }

          case 'seat_update': {
            const seatData = message.data;
            console.log('🔄 Seat update:', seatData);
            
            setReservedSeats(prev => {
              const updated = [...prev];
              const existingIndex = updated.findIndex(seat => seat.seat_id === seatData.seat_id);
              
              if (seatData.status === 'cancelled') {
                console.log('🗑️ Removing cancelled seat:', seatData.seat_id);
                return updated.filter(seat => seat.seat_id !== seatData.seat_id);
              } else {
                const seatReservation = createSeatReservation(seatData);
                if (existingIndex >= 0) {
                  updated[existingIndex] = seatReservation;
                } else {
                  updated.push(seatReservation);
                }
                return updated;
              }
            });
            break;
          }

          case 'pong':
          case 'heartbeat_ack':
            // Heartbeat acknowledged
            break;

          case 'error':
            console.error('❌ WebSocket error message:', message.data);
            break;
        }
      } catch (error) {
        console.error('❌ Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      isConnectingRef.current = false;
    };

    ws.onclose = (event) => {
      isConnectingRef.current = false;
      
      if (!mountedRef.current) {
        console.log('🔌 Component unmounted, skip reconnect');
        return;
      }

      console.log('🔌 WebSocket closed:', event.code, event.reason);
      setConnected(false);
      callbacksRef.current.onConnectionStatusChange?.(false);
      clearPingInterval();

      // Chỉ reconnect nếu không phải manual close
      if (event.code !== CLOSE_CODE_MANUAL && 
          reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS &&
          mountedRef.current) {
        
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), MAX_RECONNECT_DELAY);
        console.log(`🔄 Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1}/${MAX_RECONNECT_ATTEMPTS})`);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            reconnectAttemptsRef.current++;
            setReconnectAttempts(reconnectAttemptsRef.current);
            connectWebSocket();
          }
        }, delay);
      }
    };
  }, [showtimeId, sessionId, createWebSocketUrl, clearPingInterval, createSeatReservation]);

  // ✅ Effect chỉ phụ thuộc vào showtime & session
  useEffect(() => {
    mountedRef.current = true;
    console.log('🚀 Mounting WebSocket for showtime:', showtimeId, 'session:', sessionId);

    if (showtimeId > 0 && sessionId) {
      connectWebSocket();
    }

    return () => {
      console.log('🛑 Unmounting WebSocket');
      mountedRef.current = false;
      cleanupResources();
    };
  }, [showtimeId, sessionId, connectWebSocket, cleanupResources]);

  const disconnect = useCallback(() => {
    console.log('🛑 Manual disconnect');
    mountedRef.current = false;
    cleanupResources();
  }, [cleanupResources]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ WebSocket not open, cannot send message');
    }
  }, []);

  const isSeatReservedByOthers = useCallback((seatId: number) => {
    const reservation = reservedSeats.find(seat => seat.seat_id === seatId);
    return reservation && reservation.session_id !== sessionId;
  }, [reservedSeats, sessionId]);

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