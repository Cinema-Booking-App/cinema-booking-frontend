import { User } from "./user";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    full_name: string;
    phone_number?: string;
}

// Type phải match chính xác với response từ backend
export interface LoginResponse {
    status: string;
    data: {
        access_token: string;
        refresh_token: string;
        token_type: string;
        user: {
            user_id: number;
            email: string;
            full_name: string;
            phone_number: string;
            status: string;
            role: string;
            created_at: string;
            updated_at: string;
        };
    };
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoadingAuth: boolean;
}

export interface GetCurrentUserResponse {
    user: User;
}