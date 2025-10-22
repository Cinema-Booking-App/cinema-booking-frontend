import { baseQueryWithAuth } from '@/store/api';
import { Booking } from '@/types/bookings';
import { ApiResponse } from '@/types/type';
import { createApi } from '@reduxjs/toolkit/query/react';

export const bookingsApi = createApi({
    reducerPath: 'bookingsApi',
    baseQuery: baseQueryWithAuth,
    tagTypes: ['Bookings'],
    endpoints: (builder) => ({
        getListBookings: builder.query<Booking[], void>({
            query: () => ({ url: '/bookings', method: 'GET' }),
            transformResponse: (response: ApiResponse<Booking[]>) => response.data,
            providesTags: (result) =>
                result
                    ? [
                          ...result.map((b) => ({ type: 'Bookings' as const, id: b.code })),
                          { type: 'Bookings' as const, id: 'LIST' },
                      ]
                    : [{ type: 'Bookings' as const, id: 'LIST' }],
        }),
        getBookingByCode: builder.query<Booking, string>({
            query: (code) => ({ url: `/bookings/${code}`, method: 'GET' }),
            transformResponse: (response: ApiResponse<Booking>) => response.data,
            providesTags: (result, error, code) => [{ type: 'Bookings', id: code }],
        }),
    }),
});

export const { useGetListBookingsQuery, useGetBookingByCodeQuery } = bookingsApi;
