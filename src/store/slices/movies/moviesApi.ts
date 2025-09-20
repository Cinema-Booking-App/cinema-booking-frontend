import { baseQueryWithAuth } from '@/store/api';
import { CreateMovies, Movies, UpdateMovies } from '@/types/movies';
import { ApiResponse, PaginatedResponse } from '@/types/type';
import { createApi } from '@reduxjs/toolkit/query/react';

interface GetMoviesQueryParams {
    skip?: number;
    limit?: number;
    search_query?: string;
    status?: string;
}
export const moviesApi = createApi({
    reducerPath: 'moviesApi',
    baseQuery: baseQueryWithAuth,
    // Ở đây, chúng ta có một loại thẻ là 'Movies' để đại diện cho tất cả dữ liệu liên quan đến phim.
    tagTypes: ['Movies'],

    endpoints: (builder) => ({
        // endpoint để lấy tất cả dữ liệu phim
        getListMovies: builder.query<PaginatedResponse<Movies>, GetMoviesQueryParams | void>({
            query: (params) => ({
                url: '/movies',
                method: 'GET',
                params: {
                    limit: params?.limit ?? 1000,
                    skip: params?.skip ?? 0,
                    ...(params?.search_query && { search_query: params.search_query }),
                    ...(params?.status && params.status !== "all" && { status: params.status }),
                }
            }),
            //  API trả về { data: [...] },
            transformResponse: (response: ApiResponse<PaginatedResponse<Movies>>) => response.data,
            // Khi các mutation "invalidatesTags" các thẻ này, query sẽ tự động chạy lại.
            providesTags(result: PaginatedResponse<Movies> | undefined) {
                if (result && result.items) {
                    return [
                        ...result.items.map(({ movie_id }) => ({ type: 'Movies' as const, id: movie_id })),
                        { type: 'Movies' as const, id: 'LIST' }
                    ];
                }
                return [{ type: 'Movies' as const, id: 'LIST' }];
            }
        }),
        // endpoint để lấy một bộ phim theo id
        getMovieById: builder.query<Movies, number | null>({
            query: (movie_id) => ({
                url: `/movies/${movie_id}`,
                method: 'GET'
            }),
            transformResponse: (response: ApiResponse<Movies>) => response.data,
        }),
        // endpoint để thêm mới một bộ phim
        addMovies: builder.mutation<Movies, CreateMovies>({
            query: (data) => ({
                url: '/movies',
                method: 'POST',
                body: data
            }),
            invalidatesTags: () => [
                // Sau khi thêm một bộ phim mới, danh sách phim tổng thể phải được làm mới.
                { type: 'Movies', id: 'LIST' }
            ]
        }),
        // endpoint để cập nhật một bộ phim
        updateMovie: builder.mutation<Movies, { movie_id: number, body: UpdateMovies }>({
            query: (data) => ({
                url: `/movies/${data.movie_id}`,
                method: 'PUT',
                body: data.body
            }),
            // Sau khi sửa một bộ phim, danh sách phim tổng thể phải được làm mới.
            invalidatesTags: (result) => [
                { type: 'Movies', id: result?.movie_id }
            ]
        }),
        // endpoint để xóa một bộ phim
        deleteMovie: builder.mutation<void, number | null>({
            query: (movie_id) => ({
                url: `/movies/${movie_id}`,
                method: 'DELETE'
            }),
            // Sau khi xóa một bộ phim, danh sách phim tổng thể phải được làm mới.
            invalidatesTags: () => [
                { type: 'Movies', id: 'LIST' }
            ]

        })
    })
});

export const { useGetListMoviesQuery, useGetMovieByIdQuery, useAddMoviesMutation, useUpdateMovieMutation, useDeleteMovieMutation } = moviesApi;