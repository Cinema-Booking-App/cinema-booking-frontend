import { useEffect, useRef, useState, useCallback } from 'react';

interface SeatReservation {
  seat_id: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  expires_at?: string;
  user_session?: string;
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
  const [connected, setConnected] = useState(false);
  const [reservedSeats, setReservedSeats] = useState<SeatReservation[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;
  const mountedRef = useRef(true);

  const connectWebSocket = useCallback(() => {
    // Don't connect if component is unmounted
    if (!mountedRef.current) return;
    
    // Close existing connection first
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      wsRef.current.close(1000, 'Reconnecting');
    }

    // Clear any existing timeouts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Tạo WebSocket URL đơn giản và đáng tin cậy
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    
    // Chuyển đổi HTTP URL thành WebSocket URL
    let wsUrl: string;
    if (apiUrl.startsWith('https://')) {
      // HTTPS → WSS
      wsUrl = apiUrl.replace('https://', 'wss://').replace('/api/v1', '') + `/api/v1/ws/seats/${showtimeId}?session_id=${sessionId}`;
    } else {
      // HTTP → WS  
      wsUrl = apiUrl.replace('http://', 'ws://').replace('/api/v1', '') + `/api/v1/ws/seats/${showtimeId}?session_id=${sessionId}`;
    }
    console.log('🔌 Connecting to WebSocket:', wsUrl);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) {
        ws.close(1000, 'Component unmounted');
        return;
      }
      
      console.log('✅ WebSocket connected');
      setConnected(true);
      reconnectAttemptsRef.current = 0;
      setReconnectAttempts(0);
      onConnectionStatusChange?.(true);

      // Start ping interval
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      pingIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping' }));
        }
      }, 30000); // Ping every 30 seconds
    };

    ws.onclose = (event) => {
      console.log('❌ WebSocket disconnected:', event.code, event.reason);
      
      if (!mountedRef.current) {
        console.log('🚫 Component unmounted, skipping reconnection');
        return;
      }
      
      setConnected(false);
      onConnectionStatusChange?.(false);

      // Clear ping interval
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }

      // Attempt to reconnect if not a manual close and component is still mounted
      if (event.code !== 1000 && event.code !== 1001 && reconnectAttemptsRef.current < maxReconnectAttempts && mountedRef.current) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
        console.log(`🔄 Attempting to reconnect in ${delay}ms... (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current && wsRef.current?.readyState === WebSocket.CLOSED) {
            reconnectAttemptsRef.current++;
            setReconnectAttempts(reconnectAttemptsRef.current);
            connectWebSocket();
          }
        }, delay);
      } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
        console.log('❌ Max reconnection attempts reached, giving up');
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        console.log('WebSocket message received:', message);

        switch (message.type) {
          case 'initial_data':
            setReservedSeats(message.data.reserved_seats || []);
            if (message.data.error) {
              console.warn('WebSocket initial data error:', message.data.error);
            }
            break;

          case 'error':
            console.error('WebSocket error:', message.data);
            break;

          case 'seats_reserved':
            const { seat_ids: reservedSeatIds, user_session } = message.data;
            
            // Update reserved seats
            setReservedSeats(prev => {
              const updated = [...prev];
              reservedSeatIds.forEach((seatId: number) => {
                const existingIndex = updated.findIndex(seat => seat.seat_id === seatId);
                if (existingIndex >= 0) {
                  updated[existingIndex] = {
                    ...updated[existingIndex],
                    status: 'pending',
                    user_session
                  };
                } else {
                  updated.push({
                    seat_id: seatId,
                    status: 'pending',
                    user_session
                  });
                }
              });
              return updated;
            });

            onSeatReserved?.(reservedSeatIds, user_session);
            break;

          case 'seats_released':
            const { seat_ids: releasedSeatIds } = message.data;
            
            // Remove released seats
            setReservedSeats(prev => 
              prev.filter(seat => !releasedSeatIds.includes(seat.seat_id))
            );

            onSeatReleased?.(releasedSeatIds);
            break;

          case 'seat_update':
            // Handle individual seat updates
            const seatData = message.data;
            setReservedSeats(prev => {
              const updated = [...prev];
              const existingIndex = updated.findIndex(seat => seat.seat_id === seatData.seat_id);
              
              if (seatData.status === 'cancelled' || seatData.status === 'released') {
                // Remove from reserved seats
                return updated.filter(seat => seat.seat_id !== seatData.seat_id);
              } else {
                // Add or update seat
                if (existingIndex >= 0) {
                  updated[existingIndex] = seatData;
                } else {
                  updated.push(seatData);
                }
                return updated;
              }
            });
            break;

          case 'pong':
            // Heartbeat response - connection is alive
            break;

          default:
            console.log('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  }, [showtimeId, sessionId, onSeatReserved, onSeatReleased, onConnectionStatusChange]);

  useEffect(() => {
    mountedRef.current = true;
    
    // Only connect if we have valid showtime - connect only once per showtime/session change
    if (showtimeId > 0) {
      connectWebSocket();
    }

    return () => {
      // Mark as unmounted
      mountedRef.current = false;
      
      // Cleanup on unmount
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting');
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
    };
  }, [showtimeId, sessionId]); // Only depend on showtimeId and sessionId, not connectWebSocket

  const disconnect = useCallback(() => {
    mountedRef.current = false;
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  // Helper function to check if a seat is reserved by others
  const isSeatReservedByOthers = useCallback((seatId: number) => {
    const reservation = reservedSeats.find(seat => seat.seat_id === seatId);
    return reservation && reservation.user_session !== sessionId;
  }, [reservedSeats, sessionId]);

  // Helper function to check if a seat is reserved by current user
  const isSeatReservedByMe = useCallback((seatId: number) => {
    const reservation = reservedSeats.find(seat => seat.seat_id === seatId);
    return reservation && reservation.user_session === sessionId;
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