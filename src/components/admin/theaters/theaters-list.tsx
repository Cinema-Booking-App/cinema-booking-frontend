
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card'; // Chỉ import những gì dùng
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, Trash2, Building } from 'lucide-react'; // Icon
import { Theaters } from '@/types/theaters'; // Kiểu dữ liệu
import ErrorComponent from '@/components/ui/error';
import { TableSkeletonLoader } from '@/components/ui/table-skeleton-loader';
import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TheaterForm from './theater-form';

interface TheatersOverviewListProps {
  theaters: Theaters[];
  onViewDetails: (theaterId: number) => void;
  onDeleteTheater: (theaterId: number) => void;
  isFetchingTheaters: boolean
  istheatersError: boolean
  theatersError: any
}

const TheatersOverviewList: React.FC<TheatersOverviewListProps> = ({
  theaters,
  onViewDetails,
  onDeleteTheater,
  isFetchingTheaters,
  istheatersError,
  theatersError
}) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        {/* Phần tiêu đề */}
        <div className="flex items-center flex-grow">
          <Building className="w-8 h-8 sm:w-10 sm:h-10 text-foreground mr-2 sm:mr-4 flex-shrink-0" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
            <span className="block sm:inline whitespace-nowrap overflow-hidden text-ellipsis max-w-full sm:max-w-none">
              Quản lý Rạp phim
            </span>
            <span className="block text-xl sm:text-2xl lg:text-3xl text-gray-600 dark:text-gray-400 font-normal sm:ml-2">
              (Admin Tổng)
            </span>
          </h1>
        </div>

        <div className="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
          {/* 2. Dialog được liên kết với state isFormOpen */}
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              {/* Nút này sẽ mở Dialog khi được click */}
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Thêm Rạp mới
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Thêm Rạp mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin chi tiết của rạp phim mới vào form dưới đây.
                </DialogDescription>
              </DialogHeader>
              <TheaterForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-full bg-white dark:bg-gray-800">
              <TableHeader className="bg-gray-50 dark:bg-gray-700">
                <TableRow>
                  <TableHead className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                    ID Rạp
                  </TableHead>
                  <TableHead className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                    Tên Rạp
                  </TableHead>
                  <TableHead className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                    Địa chỉ
                  </TableHead>
                  <TableHead className="text-right py-3 px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                    Hành động
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* Body của bảng */}
              <TableBody>
                {istheatersError ? (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <ErrorComponent error={theatersError} />
                    </TableCell>
                  </TableRow>
                ) : isFetchingTheaters ? (
                  <TableSkeletonLoader
                    rowCount={6}
                    columns={[
                      { width: 'w-12', height: 'h-12', shape: 'rounded-md', cellClassName: 'py-2 px-4' },
                      { width: 'w-48', height: 'h-6', shape: 'rounded-md', cellClassName: 'py-2 px-4' },
                      { width: 'w-48', height: 'h-6', shape: 'rounded-md', cellClassName: 'hidden md:table-cell py-2 px-4' },
                      { width: 'w-16', height: 'h-6', shape: 'rounded-md', cellClassName: 'py-6 px-4 flex justify-end' },
                    ]}
                  />) : (
                  theaters.length > 0 ? (
                    theaters.map((theater) => (
                      <TableRow key={theater.theater_id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <TableCell className="font-medium py-4 px-4 text-sm whitespace-nowrap">
                        THEATER00{theater.theater_id}
                        </TableCell>
                        <TableCell className="py-4 px-4 text-sm max-w-[150px] sm:max-w-[200px] truncate md:max-w-none whitespace-nowrap">
                          {theater.name}
                        </TableCell>
                        <TableCell className="py-4 px-4 text-sm max-w-[250px] truncate whitespace-nowrap hidden md:table-cell">
                          {theater.address}
                        </TableCell>
                        <TableCell className="text-right py-4 px-4 whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="mr-1 sm:mr-2 flex-shrink-0"
                            title="Xem chi tiết / Chỉnh sửa rạp"
                            onClick={() => onViewDetails(theater.theater_id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="flex-shrink-0"
                            title="Xóa rạp"
                            onClick={() => onDeleteTheater(theater.theater_id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8 text-sm">
                        Chưa có rạp phim nào được thêm vào hệ thống.
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TheatersOverviewList