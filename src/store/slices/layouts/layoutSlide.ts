import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface LayoutState {
    layoutId: number | null
}
const initialState: LayoutState = {
    layoutId: null
}

const layoutsSlide = createSlice({
    name: 'layouts',
    initialState,
    reducers: {
        setSeatLayoutId(state, action: PayloadAction<number>) {
            state.layoutId = action.payload
        },
        cancelSeatLayoutId(state) {
            state.layoutId = null
        }

    }
})
export const { setSeatLayoutId, cancelSeatLayoutId } = layoutsSlide.actions
export default layoutsSlide.reducer;