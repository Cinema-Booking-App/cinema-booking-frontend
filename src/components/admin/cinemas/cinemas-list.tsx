// src/app/(admin)/admin/cinemas/components/CinemaOverviewList.tsx

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, Trash2, Building } from 'lucide-react';
import { Theaters } from '@/types/theaters';


// Props cho component CinemaOverviewList
interface CinemaOverviewListProps {
  theaters: Theaters[];
  onViewDetails: (cinemaId: number) => void;
  onDeleteCinema: (cinemaId: number) => void;
  onAddCinema: () => void; // Thêm prop cho việc thêm rạp mới
}

const CinemaOverviewList: React.FC<CinemaOverviewListProps> = ({
  theaters,
  onViewDetails,
  onDeleteCinema,
  onAddCinema,
}) => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Building className="w-10 h-10 text-foreground" />
        <h1 className="text-4xl font-bold ">Quản lý Rạp phim (Admin Tổng)</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            Danh sách các Rạp phim
          </CardTitle>
          <CardDescription>Xem, chỉnh sửa hoặc thêm các rạp phim trong hệ thống.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button onClick={onAddCinema}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm Rạp mới
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">ID Rạp</TableHead>
                <TableHead>Tên Rạp</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {theaters.length > 0 ? (
                theaters.map((cinema) => (
                  <TableRow key={cinema.theater_id}>
                    <TableCell className="font-medium">{cinema.theater_id}</TableCell>
                    <TableCell>{cinema.name}</TableCell>
                    <TableCell>{cinema.address}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mr-2"
                        title="Xem chi tiết / Chỉnh sửa rạp"
                        onClick={() => onViewDetails(cinema.theater_id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        title="Xóa rạp"
                        onClick={() => onDeleteCinema(cinema.theater_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    Chưa có rạp phim nào được thêm vào hệ thống.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CinemaOverviewList;