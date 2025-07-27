import { baseApi } from "@/store/api";
import { LoginRequest, LoginResponse, RegisterRequest } from "@/types/auth";
import { logout, setCredentials } from "./authSlide";

// authApi quản lý các endpoint liên quan đến xác thực người dùng (login, register, logout)
export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Mutation đăng nhập, gửi thông tin đăng nhập lên server
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: 'login',
                method: 'POST',
                body: credentials,
            }),
            // Khi mutation login được gọi, nếu thành công sẽ lưu thông tin user và token vào store
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Lưu thông tin đăng nhập vào redux store
                    dispatch(setCredentials({
                        user: data.user,
                        token: data.accessToken,
                    }));
                } catch (error) {
                    // Nếu đăng nhập thất bại, log lỗi ra console
                    console.error('Login failed:', error);
                }
            }
        }),
        // Mutation đăng ký, gửi thông tin đăng ký lên server
        register: builder.mutation<LoginResponse, RegisterRequest>({
            query: (credentials) => ({
                url: 'register',
                method: 'POST',
                body: credentials,
            }),
            // Khi mutation register được gọi, nếu thành công sẽ lưu thông tin user và token vào store
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Lưu thông tin đăng ký vào redux store
                    dispatch(setCredentials({
                        user: data.user,
                        token: data.accessToken,
                    }));
                } catch (error) {
                    // Nếu đăng ký thất bại, log lỗi ra console
                    console.error('Registration failed:', error);
                }
            }
        }),
        // Mutation đăng xuất, gọi endpoint logout
        logout: builder.mutation<void, void>({
            query: () => ({
                url: 'logout',
                method: 'GET',
            }),
            // Khi mutation logout được gọi, sẽ xóa thông tin user khỏi store
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    // Xóa thông tin đăng nhập khỏi redux store
                    dispatch(logout());

                } catch (error) {
                    // Nếu logout thất bại, vẫn xóa thông tin đăng nhập khỏi store và log lỗi
                    dispatch(logout());
                    console.error('Logout failed:', error);
                }
            }
        }),
    }),
});
export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApi;