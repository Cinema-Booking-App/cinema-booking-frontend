import { User } from "./user";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    full_name: string;
    email: string;
    password: string;
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
export interface VerifyEmail {
    email: string,
    verification_code: string
}
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoadingAuth: boolean;
    registerEmail: string | null;
}

export interface GetCurrentUserResponse {
    user: User;
}