import { baseQueryWithAuth } from "@/store/api";
import { Theaters } from "@/types/theaters";
import { ApiResponse } from "@/types/type";
import { createApi } from "@reduxjs/toolkit/query/react";

export const theatersApi = createApi({
    reducerPath: 'theatersApi',
    baseQuery: baseQueryWithAuth,
    tagTypes: ['Theaters'],
    endpoints: (builder) => ({
        getListTheaters: builder.query<Theaters[], void>({
            query: () => ({
                url: '/theaters',
                method: 'GET',
            }),
            transformResponse: (response: ApiResponse<Theaters[]>) => response.data,
        }),
        getTheaterById: builder.query<Theaters, number>({
            query: (theater_id) => ({
                url: `/theaters/${theater_id}`,
                method: 'GET',

            }),
            transformResponse: (response: ApiResponse<Theaters>) => response.data,
        })
    })
})

export const { useGetListTheatersQuery, useGetTheaterByIdQuery } = theatersApi;