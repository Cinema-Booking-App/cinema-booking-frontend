import { baseQueryWithAuth } from "@/store/api";
import { CreateLayout, SeatLayouts } from "@/types/layouts";
import { ApiResponse } from "@/types/type";
import { createApi } from "@reduxjs/toolkit/query/react";

export const layoutApi = createApi({
    reducerPath: 'layoutApi',
    baseQuery: baseQueryWithAuth,
    tagTypes: ['SeatLayouts'],
    endpoints: (builder) => ({
        getListSeatLayouts: builder.query<SeatLayouts[], void>({
            query: () => ({
                url: 'seat_layout',
                method: 'GET'
            }),
            transformResponse: (response: ApiResponse<SeatLayouts[]>) => response.data,
            providesTags(result: SeatLayouts[] | undefined) {
                if (result) {
                    return [
                        ...result.map(({ layout_id }) => ({ type: 'SeatLayouts' as const, layout_id: layout_id })),
                        { type: 'SeatLayouts' as const, layout_id: 'LIST' }
                    ];
                }
                return [{ type: 'SeatLayouts' as const, layout_id: 'LIST' }];
            }
        }),
        addSeatLayout: builder.mutation<SeatLayouts, CreateLayout>({
            query: (data) => ({
                url: 'seat_layout',
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result, error, arg, meta) => [
                { type: 'SeatLayouts' as const, layout_id: 'LIST' }
            ],
        })
    })
})

export const { useGetListSeatLayoutsQuery,useAddSeatLayoutMutation } = layoutApi