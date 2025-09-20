import { baseQueryWithAuth } from "@/store/api";
import { CreateLayout, SeatLayoutDetail, SeatLayouts, SeatTemplateUpdate } from "@/types/layouts";
import { ApiResponse } from "@/types/type";
import { createApi } from "@reduxjs/toolkit/query/react";

export interface UpdateSeatLayoutPayload {
    layout_id: number;
    updates: SeatTemplateUpdate[];
}
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
        getSeatLayoutById: builder.query<SeatLayoutDetail, number | null | undefined>({
            query: (layout_id) => ({
                url: `seat_layout/${layout_id}`,
                method: 'GET'
            }),
            transformResponse: (response: ApiResponse<SeatLayoutDetail>) => response.data,
            providesTags: (_result, _error, layout_id) => [{ type: 'SeatLayouts', layout_id }]


        }),
        addSeatLayout: builder.mutation<SeatLayouts, CreateLayout>({
            query: (data) => ({
                url: 'seat_layout',
                method: 'POST',
                body: data
            }),
            invalidatesTags: () => [
                { type: 'SeatLayouts' as const, layout_id: 'LIST' }
            ],
        }),
        updateSeatTemplates: builder.mutation<void, UpdateSeatLayoutPayload>({
            query: (data) => ({
                url: `/seat_layout/${data.layout_id}/seats`,
                method: "PUT",
                body: data.updates,
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: 'SeatLayouts', layout_id: arg.layout_id }]

        }),
        deleteSeatLayout: builder.mutation<void, number>({
            query: (layout_id) => ({
                url: `seat_layout/${layout_id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (_result, _error, layout_id) => [
                { type: 'SeatLayouts' as const, layout_id: layout_id }
            ],
        })
    })
})

export const { useGetListSeatLayoutsQuery, useGetSeatLayoutByIdQuery, useAddSeatLayoutMutation, useUpdateSeatTemplatesMutation, useDeleteSeatLayoutMutation } = layoutApi