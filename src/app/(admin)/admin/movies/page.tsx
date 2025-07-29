"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllMoviesQuery } from "@/store/slices/movies/moviesApi";
import MoviesTable from "@/components/admin/movies/movie-table";
import MovieForm from "@/components/admin/movies/movie-form";

const GENRES = ["Tất cả", "Hành động", "Khoa học viễn tưởng", "Tâm lý, Kịch tính"];
const STATUS = ["Tất cả", "Đang chiếu", "Sắp chiếu", "Ngừng chiếu"];


export default function ManagementMovies() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("Tất cả");
  const [status, setStatus] = useState("Tất cả");
  const [open, setOpen] = useState(false);

  // Lấy toàn bộ danh sách movie, không xử lý tìm kiếm/phân trang
  const { data, isFetching, isError, error } = useGetAllMoviesQuery();
  console.log(data)
  const movies = data || [];


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Quản lý phim</h1>
        <Sheet open={open} onOpenChange={setOpen}>
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
            <MovieForm />
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
          <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700">
            {STATUS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
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
      />
    </div>
  );
}