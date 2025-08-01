// store/api.ts
import { RootState } from '@/store/store';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'http://127.0.0.1:8000/api/v1/'; 

export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    let token = (getState() as RootState).auth.token; 
    if (!token) {
          token = localStorage.getItem('token'); 
    }
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});