import { baseQueryWithAuth } from '@/store/api';
import {
    CreateRank,
    UpdateRank,
    Rank
} from '@/types/ranks';
import { ApiResponse, PaginatedResponse } from '@/types/type';
import { createApi } from '@reduxjs/toolkit/query/react';

interface GetRankQueryParams {
    skip?: number;
    limit?: number;
    search_query?: string;
}

export const ranksApi = createApi({
    reducerPath: 'ranksApi',
    baseQuery: baseQueryWithAuth,
    tagTypes: ['Ranks'],
    endpoints: (builder) => ({
        getAllRanks: builder.query<PaginatedResponse<Rank>, GetRankQueryParams>({
            query: ({ skip, limit, search_query }) => ({
                url: '/ranks',
                method: 'GET',
                params: {
                    limit, skip,
                    ...(search_query && { search_query })
                },
            }),
            transformResponse: (response: ApiResponse<PaginatedResponse<Rank>>) => response.data,
            providesTags(result: PaginatedResponse<Rank> | undefined) {
                if (result && result.items) {
                    return [
                        ...result.items.map(({ rank_id }) => ({ type: 'Ranks' as const, id: rank_id })),
                        { type: 'Ranks' as const, id: 'LIST' },
                    ];
                }
                return [{ type: 'Ranks' as const, id: 'LIST' }];
            },
        }),
        getRankById: builder.query<Rank, number | null>({
              query: (id) => `/ranks/${id}`,
              transformResponse: (response: ApiResponse<Rank>) => response.data,
              providesTags: (result) => result ? [{ type: 'Ranks', id: result.rank_id }] : [],
            }),
        addRank: builder.mutation<Rank, CreateRank>({
            query: (data) => ({
                url: '/ranks',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Ranks', id: 'LIST' }],
        }),
        updateRank: builder.mutation<Rank, { rank_id: number; body: UpdateRank }>({
            query: ({ rank_id, body }) => ({
                url: `/ranks/${rank_id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result) => [{ type: 'Ranks', id: result?.rank_id }],
        }),
        deleteRank: builder.mutation<void, number>({
            query: (id) => ({
                url: `/ranks/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Ranks', id }],
        }),
    }),
})

export const {
    useGetAllRanksQuery,
    useGetRankByIdQuery,
    useAddRankMutation,
    useUpdateRankMutation,
    useDeleteRankMutation,
} = ranksApi;