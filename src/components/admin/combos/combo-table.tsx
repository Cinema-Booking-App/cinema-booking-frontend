"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Combo } from "@/types/combos";
import ErrorComponent from "@/components/ui/error";
import { useAppDispatch } from "@/store/store";
import { setComboId } from "@/store/slices/combos/combosSlice";
import { useDeleteComboMutation } from "@/store/slices/combos/combosApi";
import { TableSkeletonLoader } from "@/components/ui/table-skeleton-loader";
import Image from "next/image";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";

interface ComboTableProps {
  combos: Combo[];
  isFetching: boolean;
  isError: boolean;
  error: string | null | undefined;
  setOpen: (open: boolean) => void;
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  goToPage: (pageNumber: number) => void;
  itemsPerPage: number;
}

export default function ComboTable({
  combos,
  isFetching,
  isError,
  error,
  setOpen,
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
  goToPage,
  itemsPerPage,
}: ComboTableProps) {
  const dispatch = useAppDispatch();
  const [deleteCombo] = useDeleteComboMutation();

  const editComboId = (combo_id: number) => {
    dispatch(setComboId(combo_id));
    setOpen(true);
  };

  const handleDeleteCombo = (combo_id: number) => {
    deleteCombo(combo_id).unwrap();
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <Table className="bg-white dark:bg-gray-800">
        <TableHeader className="bg-gray-50 dark:bg-gray-700">
          <TableRow>
            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Hình ảnh
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Tên combo
            </TableHead>
            <TableHead className="hidden md:table-cell py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Mô tả
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Giá
            </TableHead>
            <TableHead className="hidden sm:table-cell py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Món ăn
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
              <TableCell colSpan={7}>
                <ErrorComponent error={error ?? null} />
              </TableCell>
            </TableRow>
          ) : isFetching ? (
            <TableSkeletonLoader
              rowCount={itemsPerPage}
              columns={[
                { width: 'w-12', height: 'h-12', shape: 'rounded-md', cellClassName: 'py-2 px-4' },
                { width: 'w-48', height: 'h-6', shape: 'rounded-md', cellClassName: 'py-2 px-4' },
                { width: 'w-48', height: 'h-6', shape: 'rounded-md', cellClassName: 'hidden md:table-cell py-2 px-4' },
                { width: 'w-24', height: 'h-6', shape: 'rounded-md', cellClassName: 'py-2 px-4' },
                { width: 'w-32', height: 'h-6', shape: 'rounded-md', cellClassName: 'hidden sm:table-cell py-2 px-4' },
                { width: 'w-24', height: 'h-6', shape: 'rounded-md', cellClassName: 'py-2 px-4' },
                { width: 'w-16', height: 'h-6', shape: 'rounded-md', cellClassName: 'py-6 px-4' },
              ]}
            />
          ) : combos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">
                Không có dữ liệu combo
              </TableCell>
            </TableRow>
          ) : (
            combos.map((combo: Combo) => (
              <TableRow
                key={combo.combo_id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <TableCell className="py-3 px-4">
                  {combo.image_url ? (
                    <Image
                      src={"/placeholder.png"}
                      alt={combo.combo_name}
                      width={48}
                      height={48}
                      className="object-cover rounded-md"
                    // loading="eager"
                    // priority={true}
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                      N/A
                    </div>
                  )}
                </TableCell>
                <TableCell className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                  <div className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {combo.combo_name}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell py-3 px-4 text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                  {combo.description || 'N/A'}
                </TableCell>
                <TableCell className="py-3 px-4 text-gray-700 dark:text-gray-300">
                  {combo.price.toLocaleString('vi-VN')} VND
                </TableCell>
                <TableCell className="hidden sm:table-cell py-3 px-4 text-gray-700 dark:text-gray-300">
                  {combo.combo_items.length > 0 ? (
                    combo.combo_items.map((item) => (
                      `${item.quantity}x ${item.quantity || 'N/A'}` // Updated to use dish_name
                    )).join(', ')
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell className="py-3 px-4">
                  <Badge
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${combo.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                      }`}
                  >
                    {combo.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
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
                        onClick={() => editComboId(combo.combo_id)}
                      >
                        Sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-md"
                        onClick={() => handleDeleteCombo(combo.combo_id)}
                      >
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Section */}
      {!isError && !isFetching && combos.length > 0 && (
        <div className="flex justify-between items-center px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); onPreviousPage(); }}
                  className={`text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ${currentPage === 1 || isFetching ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                  className={`text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ${currentPage === totalPages || isFetching ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-disabled={currentPage === totalPages || isFetching}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}