import { baseQueryWithAuth } from '@/store/api';
import { ApiResponse } from '@/types/type';
import { createApi } from '@reduxjs/toolkit/query/react';

// Payment Types
export interface CreatePaymentRequest {
  session_id: string;
  order_desc: string;
  payment_method: 'VNPAY' | 'MOMO' | 'ZALO_PAY' | 'BANK_TRANSFER' | 'CASH';
  language?: string;
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

    // Xử lý VNPay return callback (có thể dùng cho client-side nếu cần)
    // Thường thì endpoint này sẽ được gọi bởi VNPay redirect, không qua RTK Query
    // Nhưng để đồng nhất, có thể giữ nếu cần query từ client
  }),
});

export const {
  useCreatePaymentMutation,
  useGetPaymentStatusQuery,
  useLazyGetPaymentStatusQuery,
} = paymentsApi;
