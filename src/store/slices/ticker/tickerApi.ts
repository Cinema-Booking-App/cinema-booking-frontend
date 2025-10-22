import { baseQueryWithAuth } from "@/store/api";
import { ApiResponse } from "@/types/type";
import { createApi } from "@reduxjs/toolkit/query/react";

export const tickerApi = createApi({
    reducerPath: 'tickerApi',
    baseQuery: baseQueryWithAuth,
    tagTypes: ['Tickers'],
    endpoints: (builder) => ({
        getAllTickers: builder.query<any[], void>({
            query: () => ({
                url: '/tickets',
                method: 'GET',
            }),
            transformResponse: (response: ApiResponse<any[]>) => response.data,
        }),
    }),
});
export const { useGetAllTickersQuery } = tickerApi;