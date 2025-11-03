import { baseQueryWithAuth } from "@/store/api";
import { CreateTheaters, Theaters } from "@/types/theaters";
import { ApiResponse } from "@/types/type";
import { createApi, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

interface Province {
    code: number;
    name: string;
    codename: string;
}
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
            // Khi các mutation "invalidatesTags" các thẻ này, query sẽ tự động chạy lại.
            providesTags(result: Theaters[] | undefined) {
                if (result) {
                    return [
                        ...result.map(({ theater_id }) => ({ type: 'Theaters' as const, id: theater_id })),
                        { type: 'Theaters' as const, id: 'LIST' }
                    ];
                }
                return [{ type: 'Theaters', id: 'LIST' }];
            }
        }),
        getTheaterById: builder.query<Theaters, number>({
            query: (theater_id) => ({
                url: `/theaters/${theater_id}`,
                method: 'GET',

            }),
            transformResponse: (response: ApiResponse<Theaters>) => response.data,
        }),
        addTheater: builder.mutation<Theaters, CreateTheaters>({
            query: (data) => ({
                url: '/theaters',
                method: 'POST',
                body: data
            }),
            invalidatesTags: () => [
                { type: 'Theaters', id: 'LIST' }
            ]
        }),
        deleteTheater: builder.mutation<void, number>({
            query: (theater_id) => ({
                url: `/theaters/${theater_id}`,
                method: 'DELETE',
            }),
            invalidatesTags: () => [
                { type: 'Theaters', id: 'LIST' }
            ]
        }),
        getTheaterInCity: builder.query<string[], string>({
            query: () => ({
                url: `/theaters/cities`,
                method: 'GET',
            }),
            transformResponse: (response: ApiResponse<string[]>) => response.data,
        }),
        // Lấy danh sách rạp theo tỉnh/thành phố 
        getTheaterByCity: builder.query<Theaters[], string>({
            query: (city) => ({
                url: `/theaters/city/${city}`,
                method: 'GET',
            }),
            transformResponse: (response: ApiResponse<Theaters[]>) => response.data,
        }),
        // Thêm endpoint để lấy danh sách tỉnh/thành phố từ API công cộng
        getProvinceInApi: builder.query<Province[], void>({
            queryFn: async () => {
                try {
                    const response = await fetch("https://provinces.open-api.vn/api/?depth=1");
                    if (!response.ok) {
                        return { error: { status: response.status, data: 'Không thể lấy dữ liệu tỉnh/thành phố.' } as FetchBaseQueryError };
                    }
                    const data: Province[] = await response.json();
                    return { data };
                } catch {
                    const fetchError = {
                        status: 'FETCH_ERROR',
                        error: 'Lỗi kết nối khi lấy dữ liệu tỉnh/thành phố.'
                    };
                    return { error: fetchError } as { error: FetchBaseQueryError };
                }
            }
        }),
    })
})

export const { useGetListTheatersQuery, useGetTheaterByIdQuery, useGetProvinceInApiQuery, useAddTheaterMutation, useDeleteTheaterMutation, useGetTheaterInCityQuery } = theatersApi;