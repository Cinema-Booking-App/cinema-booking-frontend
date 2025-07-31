export interface ApiResponse<T> {
    status: string;
    data: T;
}
// Định nghĩa interface tổng quát cho phân trang
export interface PaginatedResponse<T> {
  total: number;
  skip: number;
  limit: number;
  items: T[];
}