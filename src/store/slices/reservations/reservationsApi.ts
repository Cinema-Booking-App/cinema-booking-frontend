import { baseQueryWithAuth } from "@/store/api";
import { ApiResponse } from "@/types/type";
import { createApi } from "@reduxjs/toolkit/query/react";

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

export const reservationsApi = createApi({
  reducerPath: 'reservationsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Reservations'],
  endpoints: (builder) => ({
    // Lấy danh sách ghế đã đặt cho showtime
    getReservedSeats: builder.query<SeatReservation[], number>({
      query: (showtimeId) => ({
        url: `/reservations/${showtimeId}`,
      }),
      transformResponse: (response: ApiResponse<SeatReservation[]>) => response.data,
      providesTags: (result, error, showtimeId) => [
        { type: 'Reservations', id: showtimeId },
        { type: 'Reservations', id: 'LIST' }
      ],
    }),

    // Tạo reservation đơn lẻ
    createReservation: builder.mutation<SeatReservation, CreateSeatReservation>({
      query: (reservation) => ({
        url: '/reservations',
        method: 'POST',
        body: reservation,
      }),
      transformResponse: (response: ApiResponse<SeatReservation>) => response.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'Reservations', id: arg.showtime_id },
        { type: 'Reservations', id: 'LIST' }
      ],
    }),

    // Tạo nhiều reservations cùng lúc (realtime)
    createMultipleReservations: builder.mutation<SeatReservation[], CreateSeatReservation[]>({
      query: (reservations) => ({
        url: '/reservations/multiple',
        method: 'POST',
        body: reservations,
      }),
      transformResponse: (response: ApiResponse<SeatReservation[]>) => response.data,
      invalidatesTags: (result, error, arg) => {
        const showtimeIds = [...new Set(arg.map(r => r.showtime_id))];
        return [
          ...showtimeIds.map(id => ({ type: 'Reservations' as const, id })),
          { type: 'Reservations', id: 'LIST' }
        ];
      },
    }),

    // Hủy reservations
    cancelReservations: builder.mutation<{ cancelled_seats: number[], room_id?: string }, CancelReservationRequest>({
      query: ({ showtime_id, seat_ids, session_id }) => ({
        url: `/reservations/cancel`,
        method: 'POST',
        body: {
          showtime_id,
          seat_ids,
          session_id
        }
      }),
      transformResponse: (response: ApiResponse<{ cancelled_seats: number[], room_id?: string }>) => response.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'Reservations', id: arg.showtime_id },
        { type: 'Reservations', id: 'LIST' }
      ],
    }),
  }),
});

export const {
  useGetReservedSeatsQuery,
  useCreateReservationMutation,
  useCreateMultipleReservationsMutation,
  useCancelReservationsMutation,
} = reservationsApi;