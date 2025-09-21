// src/components/ui/error.tsx
import React from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader } from './card';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

interface ErrorComponentProps {
  error: FetchBaseQueryError | SerializedError | Error | { message?: string; data?: { message?: string; detail?: string }; response?: { data?: { message?: string } } } | string | null;
}

export default function ErrorComponent({ error }: ErrorComponentProps) {
  let errorMessage = 'Đã xảy ra lỗi không xác định.';

  // Log đối tượng lỗi ra console để kiểm tra cấu trúc
  console.log('Lỗi:', error);

  // Xử lý các kiểu lỗi
  if (error) {
    // Nếu error là string
    if (typeof error === 'string') {
      errorMessage = error;
    }
    // Nếu error là FetchBaseQueryError
    else if ('status' in error) {
      const fetchError = error as FetchBaseQueryError;
      if (fetchError.status === 'FETCH_ERROR') {
        errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối của bạn.';
      } else if (typeof fetchError.status === 'number') {
        errorMessage = `Lỗi ${fetchError.status}: ${
          fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data
            ? (fetchError.data as { message?: string }).message
            : JSON.stringify(fetchError.data) || 'Không thể tải dữ liệu'
        }`;
      } else {
        errorMessage = 'Lỗi không xác định từ máy chủ.';
      }
    }
    // Nếu error là SerializedError
    else if ('message' in error && !('data' in error) && !('response' in error)) {
      const serializedError = error as SerializedError;
      errorMessage = serializedError.message || 'Lỗi không xác định';
    }
    // Nếu error là Error hoặc các kiểu khác
    else if (typeof error === 'object') {
      // Trường hợp lỗi từ phản hồi HTTP (FastAPI hoặc tương tự)
      if ('response' in error && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      // Trường hợp lỗi từ FastAPI (cấu trúc error.data.message)
      else if ('data' in error && error.data?.message) {
        errorMessage = error.data.message;
      }
      // Trường hợp lỗi từ FastAPI (cấu trúc error.data.detail)
      else if ('data' in error && error.data?.detail) {
        errorMessage = error.data.detail;
      }
      // Trường hợp lỗi là Error thông thường
      else if ('message' in error && error.message) {
        errorMessage = error.message;
      }
    }
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="max-w-[90%] w-1/2 text-center shadow-none border-none bg-background my-20">
        <CardHeader>
          <svg
            className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 text-red-500 mx-auto mb-2 xs:mb-3 sm:mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-lg xs:text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
            Lỗi Kết Nối
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {errorMessage}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="w-1/2 bg-red-500"
          >
            Thử Lại
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}