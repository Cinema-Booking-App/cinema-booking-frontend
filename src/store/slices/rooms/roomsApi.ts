import { baseQueryWithAuth } from "@/store/api";
import { CreateRooms, Rooms } from "@/types/rooms";
import { Seats } from "@/types/seats";
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
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ room_id }) => ({ type: 'Rooms' as const, id: room_id })),
                        { type: 'Rooms', id: 'LIST' }
                    ]
                    : [{ type: 'Rooms', id: 'LIST' }]
        }),
        createRoom: builder.mutation<Rooms, CreateRooms>({
            query: (newRoom) => ({
                url: `/theaters/${newRoom.theater_id}/rooms`,
                method: 'POST',
                body: newRoom,  
            }),
            invalidatesTags: [{ type: 'Rooms', id: 'LIST' }],
        }),
        // Danh sách các ghế trong phòng chiếu
        getSeatsByRoomId: builder.query<Seats[], string>({
            query: (room_id) => ({
                url: `/rooms/${room_id}/seats`,
            }),
            transformResponse: (response: ApiResponse<Seats[]>) => response.data,
        }),
    })
})

export const { useGetRoomsByTheaterIdQuery, useCreateRoomMutation,useGetSeatsByRoomIdQuery } = roomsApi