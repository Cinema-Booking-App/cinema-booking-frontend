// store/api.ts
import { RootState } from '@/store/store';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ;

export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    let token = (getState() as RootState).auth.token; 
    if (!token) {
      // localStorage is only available in the browser
      if (typeof window !== 'undefined' && window.localStorage) {
        token = localStorage.getItem('token');
      }
    }
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
