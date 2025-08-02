import { baseQueryWithAuth } from "@/store/api";
import { Rooms } from "@/types/rooms";
import { ApiResponse } from "@/types/type";
import { createApi } from "@reduxjs/toolkit/query/react";


export const roomsApi = createApi({
    reducerPath: 'roomsApi',
    baseQuery: baseQueryWithAuth,
    tagTypes: ['Rooms'],
    endpoints: (builder) => ({
        getRoomsByTheaterId: builder.query<Rooms[], number>({
            query: (theater_id) => ({
                url: `/theaters/${theater_id}/rooms`,
            }),
            transformResponse: (response: ApiResponse<Rooms[]>) => response.data,
        })
    })
})

export const { useGetRoomsByTheaterIdQuery } = roomsApi