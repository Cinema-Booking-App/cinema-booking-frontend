// store/api.ts
import { RootState } from '@/store/store';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Normalize BASE URL to always end with a trailing slash
const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = RAW_BASE_URL
  ? (RAW_BASE_URL.endsWith('/') ? RAW_BASE_URL : `${RAW_BASE_URL}/`)
  : undefined;

export const baseQueryWithAuth = fetchBaseQuery({
  // If BASE_URL is not defined, requests will be relative to current origin.
  // Make sure to set NEXT_PUBLIC_API_URL="https://<api-domain>/api/v1" in env.
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
