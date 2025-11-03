export interface Seats {
  seat_id: number;
  room_id: number;
  seat_type: string; // 'regular', 'premium', 'vip', 'couple'
  seat_code: string; // 'A1', 'B2', 'M1-2' (for couple seats)
  is_available: boolean;
  row_number: number;
  column_number: number;
  is_edge: boolean;
  created_at: string;
}

export type CreateSeats = Omit<Seats, 'seat_id' | 'created_at'>;
export type UpdateSeats = Partial<CreateSeats>;