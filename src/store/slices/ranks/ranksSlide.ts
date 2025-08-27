import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RankState {
    rankId: number | null;
}

const initialState: RankState = {
    rankId: null,
};

const ranksSlice = createSlice({
    name: 'ranks',
    initialState,
    reducers: {
        setRankId(state, action: PayloadAction<number>) {
            state.rankId = action.payload;
        },
        cancelRankId(state) {
            state.rankId = null;
        },
        
    }
});

export const { setRankId, cancelRankId } = ranksSlice.actions;
export default ranksSlice.reducer;
