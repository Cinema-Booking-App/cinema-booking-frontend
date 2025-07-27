import { AuthState } from "@/types/auth";
import { User } from "@/types/user";
import { removeFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoadingAuth: true, // Bắt đầu với loading = true
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action để khởi tạo auth state từ localStorage
    initializeAuth: (state, action: PayloadAction<{ token: string | null }>) => {
      if (action.payload.token) {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        // Note: User sẽ được load từ API call khác hoặc từ token decode
      }
      state.isLoadingAuth = false;
    },
    
    // Action để lưu thông tin người dùng và token sau khi đăng nhập/đăng ký thành công
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoadingAuth = false;
      saveToLocalStorage(action.payload.token); // Lưu token vào localStorage
    },
    
    // Action để xóa thông tin khi đăng xuất
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoadingAuth = false;
      removeFromLocalStorage(); // Xóa token khỏi localStorage
    },
    
    finishLoadingAuth: (state) => {
      state.isLoadingAuth = false;
    },
  },
});

export const { setCredentials, logout, finishLoadingAuth, initializeAuth } = authSlice.actions;
export default authSlice.reducer;