import { baseQueryWithAuth } from '@/store/api';
import { Promotion, CreatePromotion, UpdatePromotion } from '@/types/promotions';
import { createApi } from '@reduxjs/toolkit/query/react';

interface GetPromotionsQueryParams {
  skip?: number;
  limit?: number;
  search_query?: string;
  status?: string;
}

export const promotionsApi = createApi({
  reducerPath: 'promotionsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Promotions'],
  endpoints: (builder) => ({
    getAllPromotions: builder.query<Promotion[], GetPromotionsQueryParams>({
      query: ({ skip, limit, search_query, status }) => ({
        url: '/promotions',
        method: 'GET',
        params: {
          limit, skip,
          ...(search_query && { search_query }),
          ...(status && status !== 'all' && { status }),
        },
      }),
      providesTags(result) {
        if (result) {
          return [
            ...result.map(({ promotion_id }) => ({ type: 'Promotions' as const, id: promotion_id })),
            { type: 'Promotions' as const, id: 'LIST' },
          ];
        }
        return [{ type: 'Promotions' as const, id: 'LIST' }];
      },
    }),
    getPromotionById: builder.query<Promotion, number | null>({
      query: (id) => ({
        url: `/promotions/${id}`,
        method: 'GET',
      }),
    }),
    addPromotion: builder.mutation<Promotion, CreatePromotion>({
      query: (data) => ({
        url: '/promotions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Promotions', id: 'LIST' }],
    }),
    updatePromotion: builder.mutation<Promotion, { id: number; body: UpdatePromotion }>({
      query: ({ id, body }) => ({
        url: `/promotions/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Promotions', id },
      ],
    }),
    deletePromotion: builder.mutation<void, number>({
      query: (id) => ({
        url: `/promotions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Promotions', id },
      ],
    }),
  }),
});

export const {
  useGetAllPromotionsQuery,
  useGetPromotionByIdQuery,
  useAddPromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
} = promotionsApi;