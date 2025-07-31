import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movies } from "@/types/movies";
import ErrorComponent from "@/components/ui/error";
import { useAppDispatch } from "@/store/store";
import { setMovieId } from "@/store/slices/movies/moviesSlide";
import { useDeleteMovieMutation } from "@/store/slices/movies/moviesApi";

interface MoviesTableProps {
    movies: Movies[];
    isFetching: boolean;
    isError: boolean;
    error: any;
    setOpen: (open: boolean) => void;
    // Props phân trang
    currentPage: number;
    totalPages: number;
    totalMovies: number;
    onPreviousPage: () => void;
    onNextPage: () => void;
    goToPage: (pageNumber: number) => void;
    itemsPerPage: number;
}

export default function MoviesTable({ movies, isFetching, isError, error, setOpen, currentPage, totalPages, totalMovies, onPreviousPage, onNextPage, goToPage, itemsPerPage, }: MoviesTableProps) {
    console.log(movies)
    const dispatch = useAppDispatch()
    const editMovieId = (movie_id: number) => {
        dispatch(setMovieId(movie_id))
    }
    // Gọi API để xóa phim
    const [deleteMovie] = useDeleteMovieMutation()
    // Hàm xóa phim
    const handleDeleteMovie = (movie_id: number) => {
        deleteMovie(movie_id).unwrap()
    }
    return (
        <>
            {/* Movies Table Section */}
            <div className="w-full overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                {/* Đã xóa min-w-[800px] khỏi Table */}
                <Table className="bg-white dark:bg-gray-800">
                    <TableHeader className="bg-gray-50 dark:bg-gray-700">
                        <TableRow>
                            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Poster
                            </TableHead>
                            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Tên phim
                            </TableHead>
                            {/* Ẩn cột "Thể loại" trên màn hình nhỏ */}
                            <TableHead className="hidden sm:table-cell py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Thể loại
                            </TableHead>
                            {/* Ẩn cột "Diễn viên" trên màn hình rất nhỏ (vd: sm) và hiện từ md trở lên */}
                            <TableHead className="hidden md:table-cell py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Diễn viên
                            </TableHead>
                            {/* Ẩn cột "Đạo diễn" trên màn hình rất nhỏ (vd: sm) và hiện từ lg trở lên */}
                            <TableHead className="hidden lg:table-cell py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Đạo diễn
                            </TableHead>
                            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Trạng thái
                            </TableHead>
                            {/* Ẩn cột "Ngày khởi chiếu" trên màn hình nhỏ */}
                            <TableHead className="hidden sm:table-cell py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Ngày khởi chiếu
                            </TableHead>
                            {/* Ẩn cột "Định dạng" trên màn hình nhỏ */}
                            <TableHead className="hidden md:table-cell py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Định dạng
                            </TableHead>
                            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Hành động
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isError ? (
                            <TableRow>
                                <TableCell colSpan={9}>
                                    <ErrorComponent error={error} />
                                </TableCell>
                            </TableRow>
                        ) : isFetching ? (
                            Array(itemsPerPage) // Hiển thị số lượng skeleton bằng itemsPerPage
                                .fill(0)
                                .map((_, index) => (
                                    <TableRow key={index} className="border-b border-gray-200 dark:border-gray-700">
                                        <TableCell className="py-6 px-4">
                                            <Skeleton className="h-12 w-12 rounded-md bg-gray-200 dark:bg-gray-700" />
                                        </TableCell>
                                        <TableCell className="py-6 px-4">
                                            <Skeleton className="h-6 w-48 rounded-md bg-gray-200 dark:bg-gray-700" />
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell py-6 px-4"> {/* Ẩn theo cài đặt Header */}
                                            <Skeleton className="h-6 w-32 rounded-md bg-gray-200 dark:bg-gray-700" />
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell py-6 px-4"> {/* Ẩn theo cài đặt Header */}
                                            <Skeleton className="h-6 w-48 rounded-md bg-gray-200 dark:bg-gray-700" />
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell py-6 px-4"> {/* Ẩn theo cài đặt Header */}
                                            <Skeleton className="h-6 w-32 rounded-md bg-gray-200 dark:bg-gray-700" />
                                        </TableCell>
                                        <TableCell className="py-6 px-4">
                                            <Skeleton className="h-6 w-24 rounded-md bg-gray-200 dark:bg-gray-700" />
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell py-6 px-4"> {/* Ẩn theo cài đặt Header */}
                                            <Skeleton className="h-6 w-32 rounded-md bg-gray-200 dark:bg-gray-700" />
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell py-6 px-4"> {/* Ẩn theo cài đặt Header */}
                                            <Skeleton className="h-6 w-24 rounded-md bg-gray-200 dark:bg-gray-700" />
                                        </TableCell>
                                        <TableCell className="py-6 px-4">
                                            <Skeleton className="h-6 w-16 rounded-md bg-gray-200 dark:bg-gray-700" />
                                        </TableCell>
                                    </TableRow>
                                ))
                        ) : (
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
                                                loading="eager"
                                                priority={true}
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
                                    {/* Ẩn theo cài đặt Header */}
                                    <TableCell className="hidden sm:table-cell py-3 px-4 text-gray-700 dark:text-gray-300">
                                        {movie.genre}
                                    </TableCell>
                                    {/* Ẩn theo cài đặt Header */}
                                    <TableCell className="hidden md:table-cell py-3 px-4 text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                                        {movie.actors}
                                    </TableCell>
                                    {/* Ẩn theo cài đặt Header */}
                                    <TableCell className="hidden lg:table-cell py-3 px-4 text-gray-700 dark:text-gray-300 max-w-[150px] truncate">
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
                                    {/* Ẩn theo cài đặt Header */}
                                    <TableCell className="hidden sm:table-cell py-3 px-4 text-gray-700 dark:text-gray-300">
                                        {movie.release_date}
                                    </TableCell>
                                    {/* Ẩn theo cài đặt Header */}
                                    <TableCell className="hidden md:table-cell py-3 px-4 text-gray-700 dark:text-gray-300">
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
                                                        editMovieId(movie.movie_id),
                                                            setOpen(true)
                                                    }}
                                                >
                                                    Sửa
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        handleDeleteMovie(movie.movie_id)
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
            {!isError && !isFetching && movies.length > 0 && (
                <div className="flex justify-between items-center px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); onPreviousPage(); }}
                                    className={`text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ${currentPage === 1 || isFetching ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    aria-disabled={currentPage === 1 || isFetching}
                                />
                            </PaginationItem>

                            {/* Hiển thị các nút số trang */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                                const isFirstPage = pageNumber === 1;
                                const isLastPage = pageNumber === totalPages;
                                const isCurrentPage = pageNumber === currentPage;
                                const isNeighborPage = Math.abs(pageNumber - currentPage) <= 1;

                                if (isFirstPage || isLastPage || isCurrentPage || isNeighborPage) {
                                    return (
                                        <PaginationItem key={pageNumber}>
                                            <PaginationLink
                                                href="#"
                                                onClick={(e) => { e.preventDefault(); goToPage(pageNumber); }}
                                                isActive={isCurrentPage}
                                                className={`
                                        border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1
                                        ${isFetching ? 'opacity-50 cursor-not-allowed' : ''}
                                        ${isCurrentPage ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'}
                                    `}
                                                aria-disabled={isFetching}
                                            >
                                                {pageNumber}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                }
                                return null;
                            })}

                            {/* Ellipsis nếu cần */}
                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                <PaginationItem>
                                    <PaginationEllipsis className="text-gray-600 dark:text-gray-400" />
                                </PaginationItem>
                            )}


                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); onNextPage(); }}
                                    className={`text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ${currentPage === totalPages || isFetching ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    aria-disabled={currentPage === totalPages || isFetching}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </>
    );
}