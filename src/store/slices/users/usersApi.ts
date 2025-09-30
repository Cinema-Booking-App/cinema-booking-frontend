import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '@/store/api';
import { User, CreateUser, UpdateUser, UserStatus } from '@/types/user';
import { ApiResponse, PaginatedResponse } from '@/types/type';

interface GetUserQueryParams {
  skip?: number;
  limit?: number;
  search_query?: string;
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getAllUsers: builder.query<PaginatedResponse<User>, GetUserQueryParams>({
      query: ({ skip, limit, search_query }) => ({
        url: '/users',
        method: 'GET',
        params: {
          limit,
          skip,
          ...(search_query && { search_query }),
        },
      }),
      transformResponse: (response: ApiResponse<PaginatedResponse<User>>) => response.data,
      providesTags(result: PaginatedResponse<User> | undefined) {
        if (result && result.items) {
          return [
            ...result.items.map(({ user_id }) => ({ type: 'Users' as const, id: user_id })),
            { type: 'Users' as const, id: 'LIST' },
          ];
        }
        return [{ type: 'Users' as const, id: 'LIST' }];
      },
    }),
    getUserById: builder.query<User, number | null>({
      query: (user_id) => `/users/${user_id}`,
      transformResponse: (response: ApiResponse<User>) => response.data,
      providesTags: (result) => (result ? [{ type: 'Users', id: result.user_id }] : []),
    }),
    addUser: builder.mutation<User, CreateUser>({
      query: (data) => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<User>) => response.data,
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    updateUser: builder.mutation<User, { user_id: number; data: UpdateUser }>({
      query: ({ user_id, data }) => ({
        url: `/users/${user_id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<User>) => response.data,
      invalidatesTags: (result) => [{ type: 'Users', id: result?.user_id }, { type: 'Users', id: 'LIST' }],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (user_id) => ({
        url: `/users/${user_id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: ApiResponse<void>) => response.data,
      invalidatesTags: (result, error, user_id) => [
        { type: 'Users', id: user_id },
        { type: 'Users', id: 'LIST' },
      ],
    }),
    updateUserStatus: builder.mutation<User, { user_id: number; status: UserStatus }>({
      query: ({ user_id, status }) => ({
        url: `/users/${user_id}/status`,
        method: 'PUT',
        body: { status },
      }),
      transformResponse: (response: ApiResponse<User>) => response.data,
      invalidatesTags: (result) => [{ type: 'Users', id: result?.user_id }, { type: 'Users', id: 'LIST' }],
    }),
    updateLoyaltyPoints: builder.mutation<User, { user_id: number; points: number }>({
      query: ({ user_id, points }) => ({
        url: `/users/${user_id}/loyalty-points`,
        method: 'PUT',
        body: { points },
      }),
      transformResponse: (response: ApiResponse<User>) => response.data,
      invalidatesTags: (result) => [{ type: 'Users', id: result?.user_id }],
    }),
    updateTotalSpent: builder.mutation<User, { user_id: number; amount: number }>({
      query: ({ user_id, amount }) => ({
        url: `/users/${user_id}/total-spent`,
        method: 'PUT',
        body: { amount },
      }),
      transformResponse: (response: ApiResponse<User>) => response.data,
      invalidatesTags: (result) => [{ type: 'Users', id: result?.user_id }],
    }),
    verifyUser: builder.mutation<User, number>({
      query: (user_id) => ({
        url: `/users/${user_id}/verify`,
        method: 'PUT',
      }),
      transformResponse: (response: ApiResponse<User>) => response.data,
      invalidatesTags: (result) => [{ type: 'Users', id: result?.user_id }],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
  useUpdateLoyaltyPointsMutation,
  useUpdateTotalSpentMutation,
  useVerifyUserMutation,
} = usersApi;