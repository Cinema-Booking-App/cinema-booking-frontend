"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useGetAllRanksQuery } from "@/store/slices/ranks/ranksApi";
import RankTable from "@/components/admin/ranks/rank-table";
import RankForm from "@/components/admin/ranks/rank-form";
import { useAppDispatch } from "@/store/store";
import { cancelRankId } from "@/store/slices/ranks/ranksSlide";

const ITEMS_PER_PAGE = 6;

export default function ManagementRanks() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [open, setOpen] = useState(false);
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
  }, [debouncedSearch]);

  const { data, isFetching, isError, error } = useGetAllRanksQuery({
    skip: skip,
    limit: ITEMS_PER_PAGE,
    search_query: debouncedSearch === "" ? undefined : debouncedSearch,
  });

  const ranks = data?.items || [];
  const totalRanks = data?.total || 0;

  const totalPages = useMemo(() => {
    return Math.ceil(totalRanks / ITEMS_PER_PAGE);
  }, [totalRanks]);

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Quản lý cấp bậc</h1>
        <Sheet open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) dispatch(cancelRankId());
        }}>
          <SheetTrigger asChild>
            <Button className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 transition-colors duration-200">
              Thêm cấp bậc mới
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full max-w-full h-screen overflow-y-auto sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
          >
            <SheetHeader>
              <SheetTitle className="text-xl font-semibold">Thêm cấp bậc mới</SheetTitle>
            </SheetHeader>
            <RankForm setOpen={setOpen} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm tên cấp bậc..."
          className="border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 flex-grow sm:flex-grow-0 sm:w-auto min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <RankTable
        ranks={ranks}
        isFetching={isFetching}
        isError={isError}
        error={error}
        setOpen={setOpen}
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