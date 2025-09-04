// src/store/slices/users/usersSlide.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/user';

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  selectedUser: User | null;
}

const initialState: UsersState = {
  users: [], // Khởi tạo là mảng rỗng
  loading: false,
  error: null,
  selectedUser: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: { 
    fetchUsersStart(state) {
      state.loading = true;
      state.error = null;
    },
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
      state.loading = false;
    },
    setSelectedUser(state, action: PayloadAction<User>) {
      state.selectedUser = action.payload;
    },
    clearSelectedUser(state) {
      state.selectedUser = null;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchUsersStart, setUsers, setSelectedUser, clearSelectedUser, setError } = usersSlice.actions;
export default usersSlice.reducer;