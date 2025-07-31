import { baseQueryWithAuth } from '@/store/api';
import { CreateMovies, Movies, UpdateMovies } from '@/types/movies';
import { ApiResponse, PaginatedResponse } from '@/types/type';
import { createApi } from '@reduxjs/toolkit/query/react';

interface GetMoviesQueryParams {
    skip?: number;
    limit?: number
}
export const moviesApi = createApi({
    reducerPath: 'moviesApi',

    // 'baseQuery' là hàm được sử dụng để fetch dữ liệu.
    baseQuery: baseQueryWithAuth,
    // Ở đây, chúng ta có một loại thẻ là 'Movies' để đại diện cho tất cả dữ liệu liên quan đến phim.
    tagTypes: ['Movies'],

    endpoints: (builder) => ({
        // endpoint để lấy tất cả dữ liệu phim
        getAllMovies: builder.query<PaginatedResponse<Movies>, GetMoviesQueryParams>({
            query: ({ skip, limit }) => ({
                url: '/movies',
                method: 'GET',
                params: { limit, skip }
            }),
            //  API trả về { data: [...] },
            transformResponse: (response: ApiResponse<PaginatedResponse<Movies>>) => response.data,
            // Khi các mutation "invalidatesTags" các thẻ này, query sẽ tự động chạy lại.
            providesTags(result: PaginatedResponse<Movies> | undefined) {
                if (result && result.items) {
                    return [
                        ...result.items.map(({ movie_id }) => ({ type: 'Movies' as const, movie_id: movie_id })),
                        { type: 'Movies' as const, movie_id: 'LIST' }
                    ];
                }
                return [{ type: 'Movies' as const, movie_id: 'LIST' }];
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
            query: (body) => ({
                url: '/movies',
                method: 'POST',
                body
            }),
            invalidatesTags: (result, error, body) => [
                // Sau khi thêm một bộ phim mới, danh sách phim tổng thể phải được làm mới.
                { type: 'Movies', movie_id: 'LIST' }
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
            invalidatesTags: (result, error, data) => [
                { type: 'Movies', movie_id: result?.movie_id }
            ]
        }),
        // endpoint để xóa một bộ phim
        deleteMovie: builder.mutation<void, number | null>({
            query: (movie_id) => ({
                url: `/movies/${movie_id}`,
                method: 'DELETE'
            }),
            // Sau khi xóa một bộ phim, danh sách phim tổng thể phải được làm mới.
            invalidatesTags: (result, error, movie_id) => [
                { type: 'Movies', movie_id }
            ]
        })
    })
});

export const { useGetAllMoviesQuery, useGetMovieByIdQuery, useAddMoviesMutation, useUpdateMovieMutation, useDeleteMovieMutation } = moviesApi;