// store/auth/authApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { LoginRequest, LoginResponse, RegisterRequest, VerifyEmail } from '@/types/auth'; // Đảm bảo đường dẫn đúng
import { baseQueryWithAuth } from '@/store/api';
import { logout, setCredentials } from './authSlide';
import {  UserCurrent } from '@/types/user';
import { ApiResponse } from '@/types/type';

// authApi quản lý các endpoint liên quan đến xác thực người dùng (login, register, logout)
export const authApi = createApi({
  reducerPath: 'authApi', // <-- Đây là reducerPath riêng cho authApi
  baseQuery: baseQueryWithAuth, // Sử dụng baseQuery dùng chung
  tagTypes: ['Auth'], // Có thể thêm tagTypes nếu cần invalidate cache liên quan đến Auth
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({
            user: data.data.user,
            token: data.data.access_token,
          }));
        } catch (error) {
          console.error('Login failed:', error);
        }
      }
    }),
    register: builder.mutation<void, RegisterRequest>({
      query: (credentials) => ({
        url: 'register',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'logout',
        method: 'GET',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch (error) {
          dispatch(logout());
          console.error('Logout failed:', error);
        }
      }
    }),
    getCurrentUser: builder.query<UserCurrent, void>({
      query: () => ({
        url: 'me',
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<UserCurrent>) => response.data
    }),
    verifyEmail: builder.mutation<LoginResponse, VerifyEmail>({
      query: (body) => ({
        url: 'verify-email',
        method: 'POST',
        body: body
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({
            user: data.data.user,
            token: data.data.access_token,
          }));
        } catch (error) {
          console.error('Login failed:', error);
        }
      }
    }),
    resendVerification: builder.mutation<void, { email: string }>({
      query: (body) => ({
        url: 'resend-verification',
        method: 'POST',
        body: body
      })
    })
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useVerifyEmailMutation,
  useResendVerificationMutation
} = authApi;