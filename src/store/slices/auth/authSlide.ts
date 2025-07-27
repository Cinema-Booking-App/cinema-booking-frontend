import { AuthState } from "@/types/auth";
import { User } from "@/types/user";
import { removeFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoadingAuth: false,
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

    // Action để lưu thông tin người dùng và token sau khi đăng nhập/đăng ký thành công
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoadingAuth = false;

      // Lưu token và user vào localStorage
      saveToLocalStorage(action.payload.token, action.payload.user);
      // Có thể lưu thêm user info nếu cần
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },

    // Action để set user info (dùng khi fetch từ API)
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      // Cập nhật user trong localStorage
      localStorage.setItem('user', JSON.stringify(action.payload));
    },

    // Action để xóa thông tin khi đăng xuất
    logout: (state) => {
      state.user = null;
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
  },
});

export const {
  setCredentials,
  logout,
  finishLoadingAuth,
  initializeAuth,
  setUser,
  startLoadingAuth
} = authSlice.actions;

export default authSlice.reducer;