import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import authReducer from '@/store/slices/auth/authSlide';
import moviesReducer from '@/store/slices/movies/moviesSlide';
import { authApi } from './slices/auth/authApi';
import { moviesApi } from './slices/movies/moviesApi';
import { combosApi } from './slices/combos/combosApi'; 
import combosReducer from './slices/combos/combosSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import { theatersApi } from './slices/theaters/theatersApi';
import { roomsApi } from './slices/rooms/roomsApi';
import { layoutApi } from './slices/layouts/layoutApi';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    movies: moviesReducer,
    [moviesApi.reducerPath]: moviesApi.reducer,
    [theatersApi.reducerPath]: theatersApi.reducer,
    [roomsApi.reducerPath]: roomsApi.reducer,
    [layoutApi.reducerPath]: layoutApi.reducer,
    combos: combosReducer, // Add combos reducer
    [combosApi.reducerPath]: combosApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(moviesApi.middleware)
      .concat(theatersApi.middleware)
      .concat(roomsApi.middleware)
      .concat(layoutApi.middleware)
      .concat(combosApi.middleware)
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
