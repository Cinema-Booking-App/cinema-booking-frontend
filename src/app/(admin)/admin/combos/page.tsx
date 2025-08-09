"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllCombosQuery } from "@/store/slices/combos/combosApi";
import ComboTable from "@/components/admin/combos/combo-table";
import ComboForm from "@/components/admin/combos/combo-form";
import DishForm from "@/components/admin/combos/dish-form"; // Đảm bảo import DishForm
import { useAppDispatch } from "@/store/store";
import { cancelComboId } from "@/store/slices/combos/combosSlice";

const STATUS = ['all', 'active', 'inactive'];
const ITEMS_PER_PAGE = 6;

export default function ManagementCombos() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [openCombo, setOpenCombo] = useState(false); // State riêng cho combo
  const [openDish, setOpenDish] = useState(false);   // State riêng cho món ăn
  const [currentPage, setCurrentPage] = useState(1);
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const dispatch = useAppDispatch();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, status]);

  const { data, isFetching, isError, error } = useGetAllCombosQuery({
    skip,
    limit: ITEMS_PER_PAGE,
    search_query: debouncedSearch === "" ? undefined : debouncedSearch,
    status: status === "all" ? undefined : status,
  });

  const combos = data?.items || [];
  const totalCombos = data?.total || 0;

  const totalPages = useMemo(() => {
    return Math.ceil(totalCombos / ITEMS_PER_PAGE);
  }, [totalCombos]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center mb-6 w-full">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mr-auto">Quản lý combo</h1>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Sheet cho Thêm combo mới */}
          <Sheet open={openCombo} onOpenChange={(isOpen) => {
            setOpenCombo(isOpen);
            if (!isOpen) dispatch(cancelComboId());
          }}>
            <SheetTrigger asChild>
              <Button className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 transition-colors duration-200 flex flex-col items-center justify-center text-center">
                <span className="block">Thêm combo mới</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-full h-screen overflow-y-auto sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
            >
              <SheetHeader>
                <SheetTitle className="text-xl font-semibold">Thêm combo mới</SheetTitle>
              </SheetHeader>
              <ComboForm setOpen={setOpenCombo} />
            </SheetContent>
          </Sheet>
          {/* Sheet cho Thêm món ăn */}
          <Sheet open={openDish} onOpenChange={(isOpen) => {
            setOpenDish(isOpen);
            if (!isOpen) dispatch(cancelComboId());
          }}>
            <SheetTrigger asChild>
              <Button className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 transition-colors duration-200 flex flex-col items-center justify-center text-center">
                <span className="block">Thêm món ăn</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-full h-screen overflow-y-auto sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
            >
              <SheetHeader>
                <SheetTitle className="text-xl font-semibold">Thêm món ăn</SheetTitle>
              </SheetHeader>
              <DishForm setOpen={setOpenDish} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm combo..."
          className="border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 flex-grow sm:flex-grow-0 sm:w-auto min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-[200px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent className="bg-background text-foreground">
            {STATUS.map((s) => (
              <SelectItem key={s} value={s}>
                {s === 'all' ? 'Tất cả' : s === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ComboTable
        combos={combos}
        isFetching={isFetching}
        isError={isError}
        error={error}
        setOpen={setOpenCombo}
        currentPage={currentPage}
        totalPages={totalPages}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        goToPage={goToPage}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </div>
  );
}