import { baseQueryWithAuth } from '@/store/api';
import {
  CreateCombo,
  UpdateCombo,
  ComboDish,
  Combo,
  UpdateComboDish,
  CreateComboDish
} from '@/types/combos';
import { ApiResponse, PaginatedResponse } from '@/types/type';
import { createApi } from '@reduxjs/toolkit/query/react';

interface GetComboQueryParams {
  skip?: number;
  limit?: number;
  search_query?: string;
  status?: string;
}

export const combosApi = createApi({
  reducerPath: 'combosApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Combos', 'Dishes'],
  endpoints: (builder) => ({
    getAllCombos: builder.query<PaginatedResponse<Combo>, GetComboQueryParams>({
      query: ({ skip, limit, search_query, status }) => ({
        url: '/combos',
        method: 'GET',
        params: {
          limit, skip,
          ...(search_query && { search_query }),
          ...(status && status !== "all" && { status }),
        },
      }),
      transformResponse: (response: ApiResponse<PaginatedResponse<Combo>>) => response.data,
      providesTags(result: PaginatedResponse<Combo> | undefined) {
        if (result && result.items) {
          return [
            ...result.items.map(({ combo_id }) => ({ type: 'Combos' as const, id: combo_id })),
            { type: 'Combos' as const, id: 'LIST' },
          ];
        }
        return [{ type: 'Combos' as const, id: 'LIST' }];
      },
    }),
    getComboById: builder.query<Combo, number| null>({
      query: (id) => `/combos/${id}`,
      transformResponse: (response: ApiResponse<Combo>) => response.data,
      providesTags: (result) => result ? [{ type: 'Combos', id: result.combo_id }] : [],
    }),
    addCombo: builder.mutation<Combo, CreateCombo>({
      query: (data) => ({
        url: '/combos',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Combos', id: 'LIST' }],
    }),
    updateCombo: builder.mutation<Combo, { combo_id: number; body: UpdateCombo }>({
      query: ({ combo_id, body }) => ({
        url: `/combos/${combo_id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result) => [{ type: 'Combos', id: result?.combo_id }],
    }),
    deleteCombo: builder.mutation<void, number>({
      query: (id) => ({
        url: `/combos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Combos', id }],
    }),
    getAllDishes: builder.query<ComboDish[], void>({
      query: () => '/dishes',
      transformResponse: (response: ApiResponse<ComboDish[]>) => response.data,
      providesTags: ['Dishes'],
    }),
    getDishById: builder.query<ComboDish, number | null>({
      query: (id) => `/dishes/${id}`,
      transformResponse: (response: ApiResponse<ComboDish>) => response.data,
      providesTags: (result) => result ? [{ type: 'Dishes', id: result.dish_id }] : [],
    }),
    addDish: builder.mutation<ComboDish, CreateComboDish>({
      query: (data) => ({
        url: '/dishes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Dishes'],
    }),
    updateDish: builder.mutation<ComboDish, { dish_id: number; body: UpdateComboDish }>({
      query: ({ dish_id, body }) => ({
        url: `/dishes/${dish_id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result) => [{ type: 'Dishes', id: result?.dish_id }],
    }),
    deleteDish: builder.mutation<void, number>({
      query: (id) => ({
        url: `/dishes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Dishes', id }],
    }),
  }),
});

export const {
  useGetAllCombosQuery,
  useGetComboByIdQuery,
  useAddComboMutation,
  useUpdateComboMutation,
  useDeleteComboMutation,
  useGetAllDishesQuery,
  useGetDishByIdQuery,
  useAddDishMutation,
  useUpdateDishMutation,
  useDeleteDishMutation,
} = combosApi;