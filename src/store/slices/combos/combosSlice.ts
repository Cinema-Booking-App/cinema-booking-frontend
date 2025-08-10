import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ComboState {
    comboId: number | null;
}

const initialState: ComboState = {
    comboId: null,
};

const combosSlice = createSlice({
    name: 'combos',
    initialState,
    reducers: {
        setComboId(state, action: PayloadAction<number>) {
            state.comboId = action.payload;
        },
        cancelComboId(state) {
            state.comboId = null;
        },
        
    }
});

export const { setComboId, cancelComboId } = combosSlice.actions;
export default combosSlice.reducer;
