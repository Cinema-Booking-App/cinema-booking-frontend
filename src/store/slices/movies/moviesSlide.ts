import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface MovieState {
    movieId: number | null
}
const initialState: MovieState = {
    movieId: null
}

const moviesSlide = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        setMovieId(state, action : PayloadAction<number>) {
            state.movieId = action.payload
        },
        cancelMovieId(state){
            state.movieId = null
        }

    }
})
export const { setMovieId, cancelMovieId } = moviesSlide.actions
export default moviesSlide.reducer;