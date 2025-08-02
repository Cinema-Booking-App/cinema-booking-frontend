import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CombosState {
  comboId: number | null;
}

const initialState: CombosState = {
  comboId: null,
};

const combosSlice = createSlice({
  name: "combos",
  initialState,
  reducers: {
    setComboId(state, action: PayloadAction<number>) {
      state.comboId = action.payload;
    },
    cancelComboId(state) {
      state.comboId = null;
    },
  },
});

export const { setComboId, cancelComboId } = combosSlice.actions;
export default combosSlice.reducer;
