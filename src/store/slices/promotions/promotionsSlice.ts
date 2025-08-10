import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PromotionsState {
  search: string;
  typeFilter: string;
  statusFilter: string;
  dateFilter: string;
  selectedPromotionId: number | null;
}

const initialState: PromotionsState = {
  search: '',
  typeFilter: 'Tất cả',
  statusFilter: 'Tất cả',
  dateFilter: '',
  selectedPromotionId: null,
};

const promotionsSlice = createSlice({
  name: 'promotions',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setTypeFilter(state, action: PayloadAction<string>) {
      state.typeFilter = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<string>) {
      state.statusFilter = action.payload;
    },
    setDateFilter(state, action: PayloadAction<string>) {
      state.dateFilter = action.payload;
    },
    setSelectedPromotionId(state, action: PayloadAction<number | null>) {
      state.selectedPromotionId = action.payload;
    },
    resetFilters(state) {
      state.search = '';
      state.typeFilter = 'Tất cả';
      state.statusFilter = 'Tất cả';
      state.dateFilter = '';
    },
  },
});

export const {
  setSearch,
  setTypeFilter,
  setStatusFilter,
  setDateFilter,
  setSelectedPromotionId,
  resetFilters,
} = promotionsSlice.actions;

export default promotionsSlice.reducer;