import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/client/layouts/footer";
import Header from "@/components/client/layouts/header";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4">
        <Card className="w-full max-w-sm sm:max-w-md text-center shadow-lg p-2 sm:p-6">
          <CardHeader className="space-y-3 sm:space-y-4">
            <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 sm:w-12 sm:h-12 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              404
            </CardTitle>
            <CardDescription className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              Trang bạn đang tìm kiếm không tồn tại
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Có vẻ như trang bạn đang tìm kiếm đã bị di chuyển, xóa hoặc không bao giờ tồn tại.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Về trang chủ
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/support">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Hỗ trợ
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
} 