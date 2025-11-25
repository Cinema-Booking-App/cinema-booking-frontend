import { baseQueryWithAuth } from '@/store/api';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getDashboardStats: builder.query<{
      user_count: number;
      ticket_count: number;
      total_revenue: number;
    }, void>({
      query: () => 'dashboard/stats',
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
