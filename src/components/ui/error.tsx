import { Button } from "./button";
import { Card, CardContent, CardHeader } from "./card";

interface ErrorComponentProps {
  error: any; // Sử dụng 'any' để linh hoạt hơn trong việc xử lý các đối tượng lỗi
}

export default function ErrorComponent({ error }: ErrorComponentProps) {
  let errorMessage = "Đã xảy ra lỗi không xác định.";

  // Log đối tượng lỗi ra console để xem cấu trúc
  console.log("Lỗi:", error);

  // Cố gắng trích xuất thông báo lỗi từ các cấu trúc phổ biến
  if (error) {
    // Trường hợp lỗi từ một phản hồi HTTP
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    } 
    // Trường hợp lỗi từ các đối tượng Error khác (ví dụ: từ fetch API)
    else if (error.message) {
      errorMessage = error.message;
    }
    // Trường hợp lỗi từ phản hồi của FastAPI (cấu trúc error.data.message)
    else if (error.data && error.data.message) {
        errorMessage = error.data.message;
    }
    // Trường hợp lỗi từ phản hồi của FastAPI (cấu trúc error.data.message)
    else if (error.data && error.data.detail) {
        errorMessage = error.data.detail;
    }
  }

  return (
    <div className="flex items-center justify-center ">
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
