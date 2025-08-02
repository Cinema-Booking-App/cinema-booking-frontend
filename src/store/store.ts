import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import authReducer from '@/store/slices/auth/authSlide';
import moviesReducer from '@/store/slices/movies/moviesSlide';
import { authApi } from './slices/auth/authApi';
import { moviesApi } from './slices/movies/moviesApi';
import { combosApi } from './slices/combos/combosApi'; // Add combosApi
import combosReducer from './slices/combos/combosSlice'; // Add combosReducer
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    movies: moviesReducer,
    [moviesApi.reducerPath]: moviesApi.reducer,
    combos: combosReducer, // Add combos reducer
    [combosApi.reducerPath]: combosApi.reducer, // Add combosApi reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(moviesApi.middleware)
      .concat(combosApi.middleware), // Add combosApi middleware
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
