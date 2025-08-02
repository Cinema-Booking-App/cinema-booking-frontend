"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllCombosQuery } from "@/store/slices/combos/combosApi";
import CombosTable from "@/components/admin/combos/combo-table";
import ComboForm from "@/components/admin/combos/combo-form";
import DishForm from "@/components/admin/combos/dish-form";
import { useAppDispatch } from "@/store/store";
import { cancelComboId } from "@/store/slices/combos/combosSlice";
import { ComboStatusEnum } from "@/types/combos";

const STATUS = ["Tất cả", "Đang hoạt động", "Không hoạt động", "Đã xóa"];

export default function ManagementCombos() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Tất cả");
  const [openCombo, setOpenCombo] = useState(false);
  const [openDish, setOpenDish] = useState(false);

  const { data, isFetching, isError, error } = useGetAllCombosQuery();
  const combos = data || [];

  const filteredCombos = combos.filter((combo) => {
    const matchesSearch = combo.combo_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      status === "Tất cả" ||
      (status === "Đang hoạt động" && combo.status === ComboStatusEnum.ACTIVE) ||
      (status === "Không hoạt động" && combo.status === ComboStatusEnum.INACTIVE) ||
      (status === "Đã xóa" && combo.status === ComboStatusEnum.DELETED);
    return matchesSearch && matchesStatus;
  });

  const dispatch = useAppDispatch();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Quản lý combo</h1>
        <div className="flex gap-2">
          <Sheet
            open={openCombo}
            onOpenChange={(isOpen) => {
              setOpenCombo(isOpen);
              if (!isOpen) dispatch(cancelComboId());
            }}
          >
            <SheetTrigger asChild>
              <Button className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 transition-colors duration-200">
                Thêm combo mới
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
          <Sheet
            open={openDish}
            onOpenChange={setOpenDish}
          >
            <SheetTrigger asChild>
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                Thêm món ăn mới
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-full h-screen overflow-y-auto sm:max-w-md md:max-w-lg"
            >
              <SheetHeader>
                <SheetTitle className="text-xl font-semibold">Thêm món ăn mới</SheetTitle>
              </SheetHeader>
              <DishForm setOpen={setOpenDish} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm tên combo..."
          className="border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 flex-grow sm:flex-grow-0 sm:w-auto min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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

      <CombosTable
        combos={filteredCombos}
        isFetching={isFetching}
        isError={isError}
        error={error}
        setOpen={setOpenCombo}
      />
    </div>
  );
}