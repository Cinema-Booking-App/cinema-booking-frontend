import { baseQueryWithAuth } from "@/store/api";
import { ApiResponse } from "@/types/type";
import { createApi } from "@reduxjs/toolkit/query/react";

export const tickerApi = createApi({
  reducerPath: 'tickerApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Tickets'],

  endpoints: (builder) => ({
    getAllTickers: builder.query<any[], void>({
      query: () => ({
        url: '/tickets',
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<any[]>) => response.data,
    }),

    // ✅ API lấy vé của chính user đang đăng nhập
    getMyTickets: builder.query<any[], void>({
      query: () => ({
        url: '/tickets/my',
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<any[]>) => response.data,
    }),
    getTicketDetail: builder.query<any, number>({
        query: (ticket_id) => `/tickets/${ticket_id}`,
        transformResponse: (res: ApiResponse<any>) => res.data,
    }),
    generateQr: builder.query({
        query: (id) => `/tickets/${id}/qr`,
        transformResponse: (res) => res.data,
    }),
    cancelTicket: builder.mutation({
        query: (ticketId) => ({
            url: `/tickets/${ticketId}/cancel`,
            method: "POST",
        }),
    }),

    
  }),
});

export const { 
  useGetAllTickersQuery,
  useGetMyTicketsQuery,
  useGetTicketDetailQuery, 
  useGenerateQrQuery,
  useCancelTicketMutation  // ✅ Hook bạn cần
} = tickerApi;
