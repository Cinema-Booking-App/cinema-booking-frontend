import { AuthState } from "@/types/auth";
import { User, UserCurrent, UserStatus } from "@/types/user";
import { removeFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoadingAuth: false,
  registerEmail: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action để khởi tạo auth state từ localStorage
    initializeAuth: (state, action: PayloadAction<{ token: string | null; user?: User | null }>) => {
      if (action.payload.token) {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        // Nếu có user data từ localStorage/decoded token thì set luôn
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      } else {
        // Không có token thì clear state
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      }
      state.isLoadingAuth = false;
    },

    // Action để lưu token sau khi đăng nhập/đăng ký thành công
    setCredentials: (state, action: PayloadAction<{ access_token: string, refresh_token: string }>) => {
      state.token = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
      state.isAuthenticated = true;
      state.isLoadingAuth = false;
      localStorage.setItem('access_token', action.payload.access_token);
      localStorage.setItem('refresh_token', action.payload.refresh_token);
    },

    // Action để set user info (dùng khi fetch từ API)
    setUser: (state, action: PayloadAction<UserCurrent>) => {
      state.user = {
        ...action.payload,
        is_verified: false,
        loyalty_points: 0,
        total_spent: 0,
        status: action.payload.status as UserStatus,
      };
    },

    // Action để xóa thông tin khi đăng xuất
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.isLoadingAuth = false;

      // Xóar khỏi localStorage
      removeFromLocalStorage();
    },

    // Action để kết thúc loading (dùng khi không cần khôi phục state)
    finishLoadingAuth: (state) => {
      state.isLoadingAuth = false;
    },

    // Action để bắt đầu loading (dùng khi cần refresh token)
    startLoadingAuth: (state) => {
      state.isLoadingAuth = true;
    },

    setRegisterEmail: (state, action: PayloadAction<string | null>) => {
      state.registerEmail = action.payload;
    }
  }
});

export const {
  setCredentials,
  logout,
  finishLoadingAuth,
  initializeAuth,
  setUser,
  startLoadingAuth,
  setRegisterEmail
} = authSlice.actions;

export default authSlice.reducer;