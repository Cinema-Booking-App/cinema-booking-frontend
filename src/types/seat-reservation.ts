export interface SeatReservation {
  reservation_id: number;
  seat_id: number;
  showtime_id: number;
  user_id?: number;
  session_id?: string;
  reserved_at: string;
  expires_at: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  transaction_id?: number;
}

export interface CreateSeatReservation {
  seat_id: number;
  showtime_id: number;
  user_id?: number;
  session_id?: string;
  status?: string;
}

export interface CancelReservationRequest {
  showtime_id: number;
  seat_ids: number[];
  session_id: string;
}