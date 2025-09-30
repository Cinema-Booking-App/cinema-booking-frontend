import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { Ellipsis } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Rank } from '@/types/ranks';
import { useAppDispatch } from '@/store/store';
import { setRankId } from '@/store/slices/ranks/ranksSlide';
import { useDeleteRankMutation } from '@/store/slices/ranks/ranksApi';
import { TableSkeletonLoader } from '@/components/ui/table-skeleton-loader';
import ErrorComponent from '@/components/ui/error';

interface RankTableProps {
    ranks: Rank[];
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

export default function RankTable({
    ranks,
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
}: RankTableProps) {
    const dispatch = useAppDispatch();
    const [deleteRank] = useDeleteRankMutation();

    const editRankId = (rank_id: number) => {
        dispatch(setRankId(rank_id));
        setOpen(true);
    };

    const handleDeleteRank = (rank_id: number) => {
        deleteRank(rank_id).unwrap();
    };

    return (
        <>
            <div className="w-full overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <Table className="bg-white dark:bg-gray-800">
                    <TableHeader className="bg-gray-50 dark:bg-gray-700">
                        <TableRow>
                            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Tên cấp bậc
                            </TableHead>
                            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Tổng chi tiêu (VND)
                            </TableHead>
                            <TableHead className="hidden md:table-cell py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                % Tích lũy vé
                            </TableHead>
                            <TableHead className="hidden md:table-cell py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                % Tích lũy combo
                            </TableHead>
                            <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Cấp mặc định
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
                            <TableSkeletonLoader
                                rowCount={itemsPerPage}
                                columns={[
                                    { width: 'w-48', height: 'h-6', shape: 'rounded-md', cellClassName: 'py-2 px-4' },
                                    { width: 'w-32', height: 'h-6', shape: 'rounded-md', cellClassName: 'py-2 px-4' },
                                    { width: 'w-24', height: 'h-6', shape: 'rounded-md', cellClassName: 'hidden md:table-cell py-2 px-4' },
                                    { width: 'w-24', height: 'h-6', shape: 'rounded-md', cellClassName: 'hidden md:table-cell py-2 px-4' },
                                    { width: 'w-24', height: 'h-6', shape: 'rounded-md', cellClassName: 'py-2 px-4' },
                                    { width: 'w-16', height: 'h-6', shape: 'rounded-md', cellClassName: 'py-6 px-4' },
                                ]}
                            />
                        ) : (
                            ranks.map((rank: Rank) => (
                                <TableRow
                                    key={rank.rank_id}
                                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                                >
                                    <TableCell className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                                        <div className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                                            {rank.rank_name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3 px-4 text-gray-700 dark:text-gray-300">
                                        {rank.spending_target.toLocaleString('vi-VN')}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell py-3 px-4 text-gray-700 dark:text-gray-300">
                                        {rank.ticket_percent.toFixed(2)}%
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell py-3 px-4 text-gray-700 dark:text-gray-300">
                                        {rank.combo_percent.toFixed(2)}%
                                    </TableCell>
                                    <TableCell className="py-3 px-4">
                                        <Badge
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${rank.is_default
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                                                }`}
                                        >
                                            {rank.is_default ? 'Có' : 'Không'}
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
                                                    onClick={() => editRankId(rank.rank_id)}
                                                >
                                                    Sửa
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteRank(rank.rank_id)}
                                                    className="cursor-pointer px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-md"
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
            </div>

            {/* Pagination Section */}
            {!isError && !isFetching && ranks.length > 0 && (
                <div className="flex justify-between items-center px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onPreviousPage();
                                    }}
                                    className={`text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ${currentPage === 1 || isFetching ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    aria-disabled={currentPage === 1 || isFetching}
                                />
                            </PaginationItem>

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
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    goToPage(pageNumber);
                                                }}
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

                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                <PaginationItem>
                                    <PaginationEllipsis className="text-gray-600 dark:text-gray-400" />
                                </PaginationItem>
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onNextPage();
                                    }}
                                    className={`text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ${currentPage === totalPages || isFetching ? 'opacity-50 cursor-not-allowed' : ''}`}
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