export interface MovieData {
  title: string;
  poster: string;
  duration: string;
}

export interface ScheduleData {
  date: string;
  time: string;
  theater: string;
  room: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  description: string;
  color: string;
  popular: boolean;
}

export interface CustomerData {
  fullName: string;
  phone: string;
  email: string;
  idNumber: string;
}

export interface BookingData {
  movie: MovieData;
  schedule: ScheduleData;
  selectedSeats: string[];
  ticketType: string;
  price: number;
  total: number;
}

export interface PaymentState {
  selectedPaymentMethod: string;
  isProcessing: boolean;
  isSuccess: boolean;
  customerData: CustomerData;
  bookingCode?: string;
}