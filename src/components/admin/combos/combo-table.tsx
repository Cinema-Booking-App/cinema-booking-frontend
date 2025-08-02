"use client";

import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import ErrorComponent from "@/components/ui/error";
import { useAppDispatch } from "@/store/store";
import { setComboId } from "@/store/slices/combos/combosSlice";
import { useDeleteComboMutation } from "@/store/slices/combos/combosApi";
import { ComboResponse, ComboStatusEnum } from "@/types/combos";

interface CombosTableProps {
  combos: ComboResponse[] | undefined;
  isFetching: boolean;
  isError: boolean;
  error: any;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CombosTable({ combos, isFetching, isError, error, setOpen }: CombosTableProps) {
  const dispatch = useAppDispatch();
  const [deleteCombo] = useDeleteComboMutation();

  const editComboId = (combo_id: number) => {
    dispatch(setComboId(combo_id));
    setOpen(true);
  };

  const handleDeleteCombo = async (combo_id: number) => {
    try {
      await deleteCombo(combo_id).unwrap();
    } catch (err) {
      console.error("Lỗi khi xóa combo:", err);
    }
  };

  const isValidUrl = (url: string | null | undefined): boolean => {
    try {
      new URL(url || "");
      return url?.startsWith("http://") || url?.startsWith("https://") || false;
    } catch {
      return false;
    }
  };

  return (
    <>
      <div className="w-full overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <Table className="min-w-[800px] bg-white dark:bg-gray-800">
          <TableHeader className="bg-gray-50 dark:bg-gray-700">
            <TableRow>
              <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Hình ảnh
              </TableHead>
              <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tên combo
              </TableHead>
              <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Giá (VND)
              </TableHead>
              <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Món trong combo
              </TableHead>
              <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Trạng thái
              </TableHead>
              <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isError ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <ErrorComponent error={error} />
                </TableCell>
              </TableRow>
            ) : isFetching ? (
              Array(6)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index} className="border-b border-gray-200 dark:border-gray-700">
                    <TableCell className="py-6 px-4">
                      <Skeleton className="h-12 w-12 rounded-md bg-gray-200 dark:bg-gray-700" />
                    </TableCell>
                    <TableCell className="py-6 px-4">
                      <Skeleton className="h-6 w-48 rounded-md bg-gray-200 dark:bg-gray-700" />
                    </TableCell>
                    <TableCell className="py-6 px-4">
                      <Skeleton className="h-6 w-32 rounded-md bg-gray-200 dark:bg-gray-700" />
                    </TableCell>
                    <TableCell className="py-6 px-4">
                      <Skeleton className="h-6 w-48 rounded-md bg-gray-200 dark:bg-gray-700" />
                    </TableCell>
                    <TableCell className="py-6 px-4">
                      <Skeleton className="h-6 w-24 rounded-md bg-gray-200 dark:bg-gray-700" />
                    </TableCell>
                    <TableCell className="py-6 px-4">
                      <Skeleton className="h-6 w-16 rounded-md bg-gray-200 dark:bg-gray-700" />
                    </TableCell>
                  </TableRow>
                ))
            ) : combos && combos.length > 0 ? (
              combos.map((combo) => (
                <TableRow
                  key={combo.combo_id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <TableCell className="py-3 px-4">
                    {combo.image_url && isValidUrl(combo.image_url) ? (
                      <Image
                        src={combo.image_url}
                        alt={combo.combo_name}
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
                    {combo.combo_name}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {combo.price.toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                    {combo.items && combo.items.length > 0
                      ? combo.items.map((item) => `${item.dish_name} (${item.quantity})`).join(", ")
                      : "Không có món"}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <Badge
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        combo.status === ComboStatusEnum.ACTIVE
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : combo.status === ComboStatusEnum.INACTIVE
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                      }`}
                    >
                      {combo.status === ComboStatusEnum.ACTIVE
                        ? "Đang hoạt động"
                        : combo.status === ComboStatusEnum.INACTIVE
                        ? "Không hoạt động"
                        : "Đã xóa"}
                    </Badge>
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
                            editComboId(combo.combo_id);
                            setOpen(true);
                          }}
                        >
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteCombo(combo.combo_id)}
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
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-4 text-center text-gray-500 dark:text-gray-400">
                  Không có combo nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!isError && !isFetching && combos && combos.length > 0 && (
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
      )}
    </>
  );
}
