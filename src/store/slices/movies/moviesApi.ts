import { baseQueryWithAuth } from '@/store/api';
import { CreateMovies, Movies, UpdateMovies } from '@/types/movies';
import { createApi } from '@reduxjs/toolkit/query/react';

export const moviesApi = createApi({
    reducerPath: 'moviesApi',

    // 'baseQuery' là hàm được sử dụng để fetch dữ liệu.
    baseQuery: baseQueryWithAuth,
    // Ở đây, chúng ta có một loại thẻ là 'Movies' để đại diện cho tất cả dữ liệu liên quan đến phim.
    tagTypes: ['Movies'],

    endpoints: (builder) => ({
        // endpoint để lấy tất cả dữ liệu phim
        getAllMovies: builder.query<Movies[], void>({
            query: () => ({
                url: '/movies',
                method: 'GET'
            }),
            //  API trả về { data: [...] },
            transformResponse: (response: ApiResponse<Movies[]>) => response.data,

            // Khi các mutation "invalidatesTags" các thẻ này, query sẽ tự động chạy lại.
            providesTags(result: Movies[] | undefined) {
                if (result) {
                    return [
                        // Tạo một tag duy nhất cho MỖI bộ phim dựa trên 'movie_id' của nó.
                        ...result.map(({ movie_id }) => ({ type: 'Movies' as const, movie_id: movie_id })),
                        { type: 'Movies' as const, movie_id: 'LIST' }
                    ];
                }
                // Nếu không có kết quả kích hoạt lại để lấy danh sách mới.
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
        updateMovie: builder.mutation<Movies, {movie_id : number, body: UpdateMovies}>({
            query: (data) => ({
                url: `/movies/${data.movie_id}`,
                method: 'PUT',
                body: data.body
            }),
            // Sau khi sửa một bộ phim, danh sách phim tổng thể phải được làm mới.
            invalidatesTags: (result, error, body) => [
                { type: 'Movies', movie_id: 'LIST' }
            ]
        })
        // endpoint để xóa một bộ phim
    })
});

export const { useGetAllMoviesQuery, useGetMovieByIdQuery, useAddMoviesMutation , useUpdateMovieMutation} = moviesApi;