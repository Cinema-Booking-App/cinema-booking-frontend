import { baseQueryWithAuth } from '@/store/api';
import { ComboResponse, ComboCreate, ComboUpdate, ComboDishResponse, DishCreate } from '@/types/combos';
import { ApiResponse } from '@/types/type';
import { createApi } from '@reduxjs/toolkit/query/react';

export const combosApi = createApi({
  reducerPath: 'combosApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Combos', 'ComboDishes'],
  endpoints: (builder) => ({
    getAllCombos: builder.query<ComboResponse[], void>({
      query: () => ({
        url: '/combos',
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<ComboResponse[]>) => response.data,
      providesTags: (result: ComboResponse[] | undefined) =>
        result
          ? [
              ...result.map(({ combo_id }) => ({ type: 'Combos' as const, id: combo_id })),
              { type: 'Combos' as const, id: 'LIST' },
            ]
          : [{ type: 'Combos' as const, id: 'LIST' }],
    }),
    getComboById: builder.query<ComboResponse, number>({
      query: (combo_id) => ({
        url: `/combos/${combo_id}`,
        method: 'GET',
      }),
      transformResponse: (response: ComboResponse) => response,
      providesTags: (result: ComboResponse | undefined) =>
        result ? [{ type: 'Combos' as const, id: result.combo_id }] : [],
    }),
    getAllComboDishes: builder.query<ComboDishResponse[], void>({
      query: () => ({
        url: '/dishes',
        method: 'GET',
      }),
      transformResponse: (response: ComboDishResponse[]) => response,
      providesTags: (result: ComboDishResponse[] | undefined) =>
        result
          ? [
              ...result.map(({ dish_id }) => ({ type: 'ComboDishes' as const, id: dish_id })),
              { type: 'ComboDishes' as const, id: 'LIST' },
            ]
          : [{ type: 'ComboDishes' as const, id: 'LIST' }],
    }),
    addCombo: builder.mutation<ComboResponse, ComboCreate>({
      query: (body) => ({
        url: '/combos',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ComboResponse) => response,
      invalidatesTags: [{ type: 'Combos', id: 'LIST' }],
    }),
    updateCombo: builder.mutation<ComboResponse, { combo_id: number; body: ComboUpdate }>({
      query: (data) => ({
        url: `/combos/${data.combo_id}`,
        method: 'PUT',
        body: data.body,
      }),
      transformResponse: (response: ComboResponse) => response,
      invalidatesTags: (result, error, { combo_id }) => [{ type: 'Combos', id: combo_id }],
    }),
    deleteCombo: builder.mutation<boolean, number>({
      query: (combo_id) => ({
        url: `/combos/${combo_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, combo_id) => [{ type: 'Combos', id: 'LIST' }],
    }),
    addComboDish: builder.mutation<ComboDishResponse, DishCreate>({
      query: (body) => ({
        url: '/dishes',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ComboDishResponse) => response,
      invalidatesTags: [{ type: 'ComboDishes', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllCombosQuery,
  useGetComboByIdQuery,
  useGetAllComboDishesQuery,
  useAddComboMutation,
  useUpdateComboMutation,
  useDeleteComboMutation,
  useAddComboDishMutation,
} = combosApi;
