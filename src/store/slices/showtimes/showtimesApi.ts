import { baseQueryWithAuth } from "@/store/api";
import { CreateShowtime, Showtimes } from "@/types/showtimes";
import { ApiResponse } from "@/types/type";
import { createApi } from "@reduxjs/toolkit/query/react";

export const showtimesApi = createApi({
    reducerPath: "showtimesApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Showtimes"],
    endpoints: (builder) => ({
        getListShowtimes: builder.query<Showtimes[], void>({
            query: () => ({
                url: "/showtimes",
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<Showtimes[]>) => response.data,
            providesTags(result: Showtimes[] | undefined) {
                if (result) {
                    return [
                        ...result.map(({ showtime_id }) => ({ type: 'Showtimes' as const, id: showtime_id })),
                        { type: 'Showtimes' as const, id: 'LIST' }
                    ];
                }
                return [{ type: 'Showtimes' as const, id: 'LIST' }];
            }
        }),
        getShowtimeById: builder.query<Showtimes, string>({
            query: (id) => ({
                url: `/showtimes/${id}`,
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<Showtimes>) => response.data,
            providesTags: (result, error, id) => [{ type: "Showtimes", id }],
            
        }),
        getShowtimesByMovie: builder.query<Showtimes[], { movieId: number; theaterId?: number; showDate?: string }>(
            {
                query: ({ movieId, theaterId, showDate }) => {
                    const params = new URLSearchParams();
                    if (theaterId) params.append('theater_id', theaterId.toString());
                    if (showDate) params.append('show_date', showDate);
                    
                    return {
                        url: `/movies/${movieId}/showtimes${params.toString() ? '?' + params.toString() : ''}`,
                        method: "GET",
                    };
                },
                transformResponse: (response: ApiResponse<Showtimes[]>) => response.data,
                providesTags: (result, error, { movieId }) => [
                    { type: "Showtimes", id: `MOVIE_${movieId}` },
                ],
            }
        ),
        getShowtimesByMovieAndTheater: builder.query<Showtimes[], { movieId: number; theaterId: number }>(
            {
                query: ({ movieId, theaterId }) => ({
                    url: `/movies/${movieId}/theaters/${theaterId}/showtimes`,
                    method: "GET",
                }),
                transformResponse: (response: ApiResponse<Showtimes[]>) => response.data,
                providesTags: (result, error, { movieId, theaterId }) => [
                    { type: "Showtimes", id: `MOVIE_${movieId}_THEATER_${theaterId}` },
                ],
            }
        ),
        createShowtime: builder.mutation<Showtimes, CreateShowtime>({
            query: (showtimes) => ({
                url: "/showtimes",
                method: "POST",
                body: showtimes,
            }),
            transformResponse: (response: ApiResponse<Showtimes>) => response.data,
            invalidatesTags: [{ type: "Showtimes", id: "LIST" }],
        }),
        bulkCreateShowtimes: builder.mutation<Showtimes[], CreateShowtime[]>({
            query: (showtimes) => ({
                url: "/showtimes/bulk",
                method: "POST",
                body: showtimes,
            }),
            transformResponse: (response: ApiResponse<Showtimes[]>) => response.data,
            invalidatesTags: [{ type: "Showtimes", id: "LIST" }],
        }),
    })
})
export const { 
    useGetListShowtimesQuery,
    useGetShowtimesByMovieQuery,
    useGetShowtimesByMovieAndTheaterQuery,
    useCreateShowtimeMutation,
    useBulkCreateShowtimesMutation
} = showtimesApi