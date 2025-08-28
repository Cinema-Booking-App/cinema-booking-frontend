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
        createShowtime: builder.mutation<Showtimes, CreateShowtime>({
            query: (showtime) => ({
                url: "/showtimes",
                method: "POST",
                body: showtime,
            }),
            transformResponse: (response: ApiResponse<Showtimes>) => response.data,
            invalidatesTags: [{ type: "Showtimes", id: "LIST" }],
        }),
    })
})
export const { useGetListShowtimesQuery,useCreateShowtimeMutation } = showtimesApi