
import { Button } from "./button";
import { Card, CardContent, CardHeader } from "./card";
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

// Định nghĩa kiểu ErrorLayouts
type ErrorLayouts = string | FetchBaseQueryError | null;

// Hàm xử lý thông báo lỗi
export function getErrorMessage(errorLayouts: ErrorLayouts): string {
  if (typeof errorLayouts === "string") return errorLayouts;
  if (errorLayouts && typeof errorLayouts === "object") {
    if ("error" in errorLayouts && errorLayouts.error) return errorLayouts.error;
    if ("status" in errorLayouts) return `Lỗi: ${errorLayouts.status}`;
  }
  return "Đã xảy ra lỗi";
}

// Giao diện cho ErrorComponent
interface ErrorComponentProps {
   error: string | null | undefined;
}

// Component ErrorComponent
export default function ErrorComponent({ error }: ErrorComponentProps) {
  const errorMessage = error || "Đã xảy ra lỗi không xác định.";

  console.log("Lỗi:", error);

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

