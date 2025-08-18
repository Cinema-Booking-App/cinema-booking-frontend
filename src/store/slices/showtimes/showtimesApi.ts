import { baseQueryWithAuth } from "@/store/api";
import { Showtimes } from "@/types/showtimes";
import { ApiResponse } from "@/types/type";
import { createApi } from "@reduxjs/toolkit/query/react";

export const showtimesApi = createApi({
    reducerPath: "showtimesApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Showtimes"],
    endpoints: (builder) => ({
        getListShowtimes: builder.query<Showtimes[],void>({
            query: () => ({
                url: "/showtimes",
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<Showtimes[]>) => response.data,
        })
    })
})
export const {useGetListShowtimesQuery} = showtimesApi