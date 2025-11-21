export interface BookingTicketItem {
  ticket_id: number;
  seat: string;
  type?: string | null;
  price?: number | null;
}

export interface Booking {
  code: string;
  customer?: string | null;
  phone?: string | null;
  email?: string | null;
  movie?: string | null;
  showtime?: string | null;
  date?: string | null;
  seats?: string | null;
  status?: string | null;
  tickets: BookingTicketItem[];
  printed?: boolean;
  received?: boolean;
  refunded?: boolean;
  qr_code?: string | null;
}
