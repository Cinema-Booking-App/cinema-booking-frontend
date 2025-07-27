import { User } from "./user";

export type RegisterRequest = Omit<
    User,
    'id' | 'status' | 'role' | 'createdAt' | 'updatedAt'>
    & {
        password: string;
    };

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoadingAuth: boolean;
}