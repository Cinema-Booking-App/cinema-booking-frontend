"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllMoviesQuery } from "@/store/slices/movies/moviesApi";
import MoviesTable from "@/components/admin/movies/movie-table";
import MovieForm from "@/components/admin/movies/movie-form";
import { useAppDispatch } from "@/store/store";
import { cancelMovieId } from "@/store/slices/movies/moviesSlide";

const GENRES = ["Tất cả", "Hành động", "Khoa học viễn tưởng", "Tâm lý, Kịch tính"];
const STATUS = ['all', 'upcoming', 'now_showing', 'ended'];
const ITEMS_PER_PAGE = 6; // <-- Thêm hằng số số lượng mục trên mỗi trang


export default function ManagementMovies() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [genre, setGenre] = useState("Tất cả");
  const [status, setStatus] = useState("Tất cả"); 

  const [open, setOpen] = useState(false);

  // Tính toán 'skip' dựa trên trang hiện tại
  const [currentPage, setCurrentPage] = useState(1); 
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const dispatch = useAppDispatch();

  // Cập nhật debouncedSearch sau 500ms kể từ khi người dùng ngừng gõ
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search); // <-- Cập nhật debouncedSearch
    }, 500);

    return () => {
      clearTimeout(handler); // Xóa timer cũ nếu 'search' thay đổi
    };
  }, [search]);

  // --- Reset trang về 1 khi các bộ lọc thay đổi ---
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, status, genre]); 

  // Lấy toàn bộ danh sách movie, + phân trang tìm kiếm và lọc
  const { data, isFetching, isError, error } = useGetAllMoviesQuery({
    skip: skip,
    limit: ITEMS_PER_PAGE,
    // Truyền giá trị đã debounce cho search_query
    search_query: debouncedSearch === "" ? undefined : debouncedSearch,
    // Truyền giá trị status, nếu là "Tất cả" thì truyền undefined cho API
    status: status === "Tất cả" ? undefined : status,
    // genre: genre === "Tất cả" ? undefined : genre, 
  });

  console.log(data);
  const movies = data?.items || [];
  const totalMovies = data?.total || 0;

  // Tính toán tổng số trang
  const totalPages = useMemo(() => {
    return Math.ceil(totalMovies / ITEMS_PER_PAGE);
  }, [totalMovies]);

  // Xử lý chuyển trang về trước
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Xử lý chuyển trang kế tiếp
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Xử lý chuyển đến một trang cụ thể
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Quản lý phim</h1>
        <Sheet open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) dispatch(cancelMovieId()); // Xóa movieId khi đóng Sheet
        }}>
          <SheetTrigger asChild>
            <Button className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 transition-colors duration-200">
              Thêm phim mới
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full max-w-full h-screen overflow-y-auto sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
          >
            <SheetHeader>
              <SheetTitle className="text-xl font-semibold">Thêm phim mới</SheetTitle>
            </SheetHeader>
            {/* Form thêm phim */}
            <MovieForm setOpen={setOpen} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm tên phim..."
          className="border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 flex-grow sm:flex-grow-0 sm:w-auto min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={genre} onValueChange={setGenre}>
          <SelectTrigger className="w-full sm:w-[200px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="Chọn thể loại" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700">
            {GENRES.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-[200px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent className="bg-background text-foreground">
            {STATUS.map((s) => (
              <SelectItem key={s} value={s}>
                {s === 'all'
                  ? 'Tất cả' // All
                  : s === 'now_showing'
                    ? 'Đang chiếu' // Now showing
                    : s === 'upcoming'
                      ? 'Sắp chiếu'    // Coming soon
                      : s === 'ended'
                        ? 'Ngừng chiếu' // Ended
                        : s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Movies Table Section */}
      <MoviesTable
        movies={movies}
        isFetching={isFetching}
        isError={isError}
        error={error}
        setOpen={setOpen}
        currentPage={currentPage}
        totalPages={totalPages}
        totalMovies={totalMovies}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        goToPage={goToPage}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </div>
  );
}