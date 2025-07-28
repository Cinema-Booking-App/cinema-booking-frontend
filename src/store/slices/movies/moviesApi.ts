import { baseQueryWithAuth } from "@/store/api";
import { Movies } from "@/types/movies";
import { createApi } from "@reduxjs/toolkit/query/react";


export const moviesApi = createApi({
    reducerPath: 'moviesApi',
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        getAllMovies: builder.query<Movies[], void>({
            query: () => ({
                url: 'movies',
                method: 'GET'
            }),
            transformResponse: (response: ApiResponse<Movies[]>) => response.data, // Lấy mảng data từ response
        })
    })
})

export const { useGetAllMoviesQuery } = moviesApi