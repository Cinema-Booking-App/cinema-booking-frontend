"use client";

import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import {  Trash2, Eye } from 'lucide-react';
import { useDeleteSeatLayoutMutation, useGetListSeatLayoutsQuery, useGetSeatLayoutByIdQuery } from "@/store/slices/layouts/layoutApi";
import { Badge } from "@/components/ui/badge";
import { TableSkeletonLoader } from "@/components/ui/table-skeleton-loader";
import { AddLayoutDialog } from "@/components/admin/seats/from-layouts";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { cancelSeatLayoutId, setSeatLayoutId } from "@/store/slices/layouts/layoutSlide";
import SeatLayoutDialog from "@/components/admin/seats/seat-layout-viewer"; // Đảm bảo đường dẫn này đúng


export default function SeatsPage() {
  const dispatch = useAppDispatch();
  const layoutSelectId = useAppSelector(state => state.layouts.layoutId);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showLayoutDetailDialog, setShowLayoutDetailDialog] = useState(false); // Thêm trạng thái này

  const { data: layouts, isFetching: isFetchingSeatLayout, isError: isErrorLayouts } = useGetListSeatLayoutsQuery();
  
  // Lấy chi tiết layout
  const { data: layoutDetail, isFetching: isFetchingLayoutDetail } = useGetSeatLayoutByIdQuery(layoutSelectId,
    { skip: layoutSelectId === null || layoutSelectId === undefined }
  );


  const [deleteLayout] = useDeleteSeatLayoutMutation();

  const handleOpenLayoutDetailDialog = (layoutId: number) => {
    dispatch(setSeatLayoutId(layoutId)); // Set ID để query chi tiết
    setShowLayoutDetailDialog(true); // Mở dialog
  };

  const handleCloseLayoutDetailDialog = () => {
    setShowLayoutDetailDialog(false); // Đóng dialog
    dispatch(cancelSeatLayoutId()); 
  };
  
  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Quản lý sơ đồ ghế</CardTitle>
          <Button onClick={() => setShowAddDialog(true)}>Thêm Layout</Button>
        </CardHeader>
        <CardContent>
          <Table className="bg-white dark:bg-gray-800">
            <TableHeader className="bg-gray-50 dark:bg-gray-700">
              <TableRow>
                <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tên Layout
                </TableHead>
                <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Mô tả
                </TableHead>
                <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ma trận ghế
                </TableHead>
                <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Lối đi
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
              {isErrorLayouts ? (
                <TableRow>
                  <TableCell colSpan={9}>
                    {/* <ErrorComponent error={getErrorMessage(errorLayouts)} /> */}
                  </TableCell>
                </TableRow>
              ) : isFetchingSeatLayout ? (
                <TableSkeletonLoader
                  rowCount={5}
                  columns={[
                    { width: 'w-12', height: 'h-12', shape: 'rounded-md', cellClassName: 'py-2 px-4' },
                    { width: 'w-32', height: 'h-6', shape: 'rounded-md', cellClassName: 'hidden sm:table-cell py-2 px-4' },
                    { width: 'w-48', height: 'h-6', shape: 'rounded-md', cellClassName: 'hidden md:table-cell py-2 px-4' },
                    { width: 'w-24', height: 'h-6', shape: 'rounded-md', cellClassName: 'py-2 px-4' },
                    { width: 'w-32', height: 'h-6', shape: 'rounded-md', cellClassName: 'hidden sm:table-cell py-2 px-4' },
                    { width: 'w-16', height: 'h-6', shape: 'rounded-md', cellClassName: 'py-6 px-4' },
                  ]}
                />
              ) : (layouts && layouts.length > 0) ? (
                layouts.map((layout) => (
                  <TableRow key={layout.layout_id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{layout.layout_name}</TableCell>
                    <TableCell>{layout.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{layout.total_rows}x{layout.total_columns}</Badge>
                    </TableCell>
                    <TableCell>
                      {layout.aisle_positions.length > 0 ? (
                        <Badge variant="secondary" className="mr-1">
                          Cột
                        </Badge>
                      ) : (
                        "Không có"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">Hoạt động</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleOpenLayoutDetailDialog(layout.layout_id)}> {/* Mở dialog xem chi tiết */}
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteLayout(layout.layout_id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : ( // Trường hợp layouts là rỗng sau khi tải xong và không có lỗi
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Không có sơ đồ ghế nào được tìm thấy.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Hiển thị component chỉnh sửa ghế */}
      {showLayoutDetailDialog && (isFetchingLayoutDetail ? ( 
         null
      ) : (
        <SeatLayoutDialog
          layoutDetail={layoutDetail} // Chuyển undefined thành null ở đây
          open={showLayoutDetailDialog} // Truyền trạng thái mở/đóng
          onClose={handleCloseLayoutDetailDialog} // Truyền hàm đóng
        />
      ))}
      <AddLayoutDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
}