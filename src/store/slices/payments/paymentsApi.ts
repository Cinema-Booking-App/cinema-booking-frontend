import { baseQueryWithAuth } from '@/store/api';
import { ApiResponse } from '@/types/type';
import { createApi } from '@reduxjs/toolkit/query/react';

// Payment Types
export interface CreatePaymentRequest {
  session_id: string;
  order_desc: string;
  payment_method: 'VNPAY' | 'MOMO' | 'ZALO_PAY' | 'BANK_TRANSFER' | 'CASH';
  language?: string;
  user_id?: number;
}

export interface PaymentResponse {
  payment_url: string | null;
  order_id: string;
  amount: number;
  payment_method: string;
  payment_status: string;
}

export interface PaymentStatusResponse {
  order_id: string;
  payment_status: string;
  amount: number;
  payment_method: string;
  transaction_id?: string;
  vnp_transaction_no?: string;
  status?: string;
  message?: string;
  booking_code?: string;
}

export const paymentsApi = createApi({
  reducerPath: 'paymentsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Payment'],

  endpoints: (builder) => ({
    // Tạo thanh toán mới
    createPayment: builder.mutation<PaymentResponse, CreatePaymentRequest>({
      query: (data) => ({
        url: '/payments/create',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<PaymentResponse>) => response.data,
      invalidatesTags: ['Payment'],
    }),

    // Lấy trạng thái thanh toán theo order_id
    getPaymentStatus: builder.query<PaymentStatusResponse, string>({
      query: (orderId) => ({
        url: `/payments/payment-status/${orderId}`,
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<PaymentStatusResponse>) => response.data,
      providesTags: (result, error, orderId) => [{ type: 'Payment', id: orderId }],
    }),

    // Xử lý VNPay return callback từ query params
    vnpReturn: builder.query<PaymentStatusResponse, string>({
      query: (queryString) => ({
        url: `/payments/vnpay/return?${queryString}`,
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<PaymentStatusResponse>) => response.data,
    }),
    
    // Lấy lịch sử VNPay (paginated)
    getVnPayHistory: builder.query<any, { page?: number; limit?: number; start_date?: string; end_date?: string; status?: string; user_id?: number; order_id?: string }>({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params.page) qs.append('page', String(params.page));
        if (params.limit) qs.append('limit', String(params.limit));
        if (params.start_date) qs.append('start_date', params.start_date);
        if (params.end_date) qs.append('end_date', params.end_date);
        if (params.status) qs.append('status', params.status);
        if (params.user_id) qs.append('user_id', String(params.user_id));
        if (params.order_id) qs.append('order_id', params.order_id);
        const queryString = qs.toString();
        return {
          url: `/payments/vnpay/history${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      transformResponse: (response: ApiResponse<any>) => response.data,
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useGetPaymentStatusQuery,
  useLazyGetPaymentStatusQuery,
  useVnpReturnQuery,        
  useLazyVnpReturnQuery,    
  useGetVnPayHistoryQuery,
} = paymentsApi;
