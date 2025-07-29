// app/admin/movies/MoviesTableWithPagination.tsx
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movies } from "@/types/movies";

interface MoviesTableProps {
    movies: Movies[];
    isFetching: boolean;
    isError: boolean;
    error: any;
}

export default function MoviesTable({ movies, isFetching, isError, error }: MoviesTableProps) {
    // Xử lý lỗi hiển thị
    if (isError) {
        const errorMessage = error?.message || (typeof error === 'string' ? error : "Lỗi không xác định khi tải dữ liệu.");
        return <div className="p-4 text-red-500">Lỗi: {errorMessage}</div>;
    }
    return (
        <>
            {/* Movies Table Section */}
            <div className="w-full overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <Table className="min-w-[800px] bg-white dark:bg-gray-800">
                    <TableHeader className="bg-gray-50 dark:bg-gray-700">
                        <TableRow>
                            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Poster
                            </TableHead>
                            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Tên phim
                            </TableHead>
                            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Thể loại
                            </TableHead>
                            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Diễn viên
                            </TableHead>
                            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Đạo diễn
                            </TableHead>
                            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Trạng thái
                            </TableHead>
                            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Ngày khởi chiếu
                            </TableHead>
                            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Định dạng
                            </TableHead>
                            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Hành động
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isFetching ? (
                            // Display skeleton when loading
                            Array(8)
                                .fill(0)
                                .map((_, index) => (
                                    <TableRow key={index} className="border-b border-gray-200 dark:border-gray-700">
                                        <TableCell className="py-3 px-4">
                                            <Skeleton className="h-12 w-12 rounded-md bg-gray-200 dark:bg-gray-700" />
                                        </TableCell>
                                        <TableCell className="py-3 px-4">
                                            <Skeleton className="h-6 w-48 rounded-md bg-gray-200 dark:bg-gray-700" />
                                        </TableCell>
                                        <TableCell className="py-3 px-4">
                                            <Skeleton className="h-6 w-32 rounded-md bg-gray-200 dark:bg-gray-700" />
                                        </TableCell>
                                        <TableCell className="py-3 px-4">
                                            <Skeleton className="h-6 w-48 rounded-md bg-gray-200 dark:bg-gray-700" />
                                        </TableCell>
                                        <TableCell className="py-3 px-4">
                                            <Skeleton className="h-6 w-32 rounded-md bg-gray-200 dark:bg-gray-700" />
                                        </TableCell>
                                        <TableCell className="py-3 px-4">
                                            <Skeleton className="h-6 w-24 rounded-md bg-gray-200 dark:bg-gray-700" />
                                        </TableCell>
                                        <TableCell className="py-3 px-4">
                                            <Skeleton className="h-6 w-32 rounded-md bg-gray-200 dark:bg-gray-700" />
                                        </TableCell>
                                        <TableCell className="py-3 px-4">
                                            <Skeleton className="h-6 w-24 rounded-md bg-gray-200 dark:bg-gray-700" />
                                        </TableCell>
                                        <TableCell className="py-3 px-4">
                                            <Skeleton className="h-6 w-16 rounded-md bg-gray-200 dark:bg-gray-700" />
                                        </TableCell>
                                    </TableRow>
                                ))
                        ) : (
                            // Display movie list
                            movies.map((movie: Movies) => (
                                <TableRow
                                    key={movie.movie_id}
                                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                                >
                                    <TableCell className="py-3 px-4">
                                        {movie.poster_url ? (
                                            <Image
                                                src={movie.poster_url}
                                                alt={movie.title}
                                                width={48}
                                                height={48}
                                                className="object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                                                N/A
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                                        {movie.title}
                                    </TableCell>
                                    <TableCell className="py-3 px-4 text-gray-700 dark:text-gray-300">
                                        {movie.genre}
                                    </TableCell>
                                    <TableCell className="py-3 px-4 text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                                        {movie.actors}
                                    </TableCell>
                                    <TableCell className="py-3 px-4 text-gray-700 dark:text-gray-300 max-w-[150px] truncate">
                                        {movie.director}
                                    </TableCell>
                                    <TableCell className="py-3 px-4">
                                        <Badge
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${movie.status === "now_showing"
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                : movie.status === "upcoming"
                                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                                    : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                                                }`}
                                        >
                                            {movie.status === "now_showing" ? "Đang chiếu" : movie.status === "upcoming" ? "Sắp chiếu" : "Ngừng chiếu"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-3 px-4 text-gray-700 dark:text-gray-300">
                                        {movie.release_date}
                                    </TableCell>
                                    <TableCell className="py-3 px-4 text-gray-700 dark:text-gray-300">
                                        {movie.age_rating || "N/A"}
                                    </TableCell>
                                    <TableCell className="py-3 px-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                                                    <Ellipsis className="h-5 w-5" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md">
                                                <DropdownMenuItem
                                                    className="cursor-pointer px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                                    onClick={() => {
                                                        /* handleEdit */
                                                    }}
                                                >
                                                    Sửa
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        /* handleDelete */
                                                    }}
                                                    className="cursor-pointer px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-md"
                                                >
                                                    Xóa
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="cursor-pointer px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                                    onClick={() => {
                                                        /* handleDetail */
                                                    }}
                                                >
                                                    Xem chi tiết
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Section */}
            <div className="flex justify-end items-center gap-2 mt-6">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink
                                href="#"
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1"
                            >
                                1
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis className="text-gray-600 dark:text-gray-400" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </>
    );
}