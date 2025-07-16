"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";
import { SeatLayoutDialog } from "@/components/admin/seats/seat-layout-viewer";

type Layout = {
  layout_id: number;
  layout_name: string;
  theater_type: string;
  total_rows: number;
  total_columns: number;
  aisle_positions: number[];
  normal_rows?: number;
  vip_rows?: number;
  couple_rows?: number;
};

const mockLayouts: Layout[] = [
  {
    layout_id: 1,
    layout_name: "IMAX Layout",
    theater_type: "IMAX",
    total_rows: 8,
    total_columns: 12,
    aisle_positions: [4, 6],
  },
  {
    layout_id: 2,
    layout_name: "Standard Layout",
    theater_type: "Standard",
    total_rows: 6,
    total_columns: 10,
    aisle_positions: [3],
  },
];

export default function SeatsPage() {
  const [layouts] = useState<Layout[]>(mockLayouts);
  const [selectedLayout, setSelectedLayout] = useState<Layout | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newLayout, setNewLayout] = useState({
    layout_name: "",
    seat_matrix: "",
    total_rows: 0,
    total_columns: 0,
    normal_rows: 0,
    vip_rows: 0,
    couple_rows: 0,
    description: "",
  });

  // Tự động cập nhật mô tả khi thay đổi các trường liên quan
  React.useEffect(() => {
    let desc = `Mẫu sơ đồ ghế ${newLayout.layout_name || ""}`;
    if (newLayout.normal_rows || newLayout.vip_rows || newLayout.couple_rows) {
      desc += ": ";
      if (newLayout.normal_rows) desc += `${newLayout.normal_rows} hàng ghế thường, `;
      if (newLayout.vip_rows) desc += `${newLayout.vip_rows} hàng ghế vip, `;
      if (newLayout.couple_rows) desc += `${newLayout.couple_rows} hàng ghế đôi, `;
      desc = desc.replace(/, $/, "");
    }
    setNewLayout((prev) => ({ ...prev, description: desc }));
    // eslint-disable-next-line
  }, [newLayout.layout_name, newLayout.normal_rows, newLayout.vip_rows, newLayout.couple_rows]);

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Quản lý sơ đồ ghế</CardTitle>
          <Button onClick={() => setShowAddDialog(true)}>Thêm Layout</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Layout</TableHead>
                <TableHead>Kiểu phòng</TableHead>
                <TableHead>Hàng</TableHead>
                <TableHead>Cột</TableHead>
                <TableHead>Lối đi</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {layouts.map((layout) => (
                <TableRow key={layout.layout_id}>
                  <TableCell>{layout.layout_name}</TableCell>
                  <TableCell>
                    <Badge>{layout.theater_type}</Badge>
                  </TableCell>
                  <TableCell>{layout.total_rows}</TableCell>
                  <TableCell>{layout.total_columns}</TableCell>
                  <TableCell>
                    {layout.aisle_positions.map((a) => (
                      <Badge key={a} variant="secondary" className="mr-1">
                        {a}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => setSelectedLayout(layout)}>
                      Xem sơ đồ
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedLayout && (
        <div className="mt-8">
          <SeatLayoutDialog layout={selectedLayout} onClose={() => setSelectedLayout(null)} />
        </div>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm mới mẫu sơ đồ ghế</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="Tiêu chuẩn"
              value={newLayout.layout_name}
              onChange={e => setNewLayout({ ...newLayout, layout_name: e.target.value })}
              required
            />
            <Select
              value={newLayout.seat_matrix}
              onValueChange={val => {
                const [rows, cols] = val.split("x").map(Number);
                setNewLayout({
                  ...newLayout,
                  seat_matrix: val,
                  total_rows: rows,
                  total_columns: cols,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn ma trận ghế" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12x12">12x12 - Sức chứa tối đa 144 chỗ ngồi.</SelectItem>
                <SelectItem value="10x10">10x10 - Sức chứa tối đa 100 chỗ ngồi.</SelectItem>
                <SelectItem value="14x14">14x14 - Sức chứa tối đa 196 chỗ ngồi.</SelectItem>
                <SelectItem value="16x20">16x20 - Sức chứa tối đa 320 chỗ ngồi.</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Hàng ghế thường"
                value={newLayout.normal_rows}
                onChange={e => setNewLayout({ ...newLayout, normal_rows: Number(e.target.value) })}
                required
              />
              <Input
                type="number"
                placeholder="Hàng ghế vip"
                value={newLayout.vip_rows}
                onChange={e => setNewLayout({ ...newLayout, vip_rows: Number(e.target.value) })}
                required
              />
              <Input
                type="number"
                placeholder="Hàng ghế đôi"
                value={newLayout.couple_rows}
                onChange={e => setNewLayout({ ...newLayout, couple_rows: Number(e.target.value) })}
                required
              />
            </div>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm"
              rows={2}
              placeholder="Mô tả"
              value={newLayout.description}
              readOnly
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Đóng
            </Button>
            <Button
              onClick={() => {
                // Xử lý thêm mới layout (cập nhật state hoặc gọi API)
                setShowAddDialog(false);
              }}
            >
              Thêm mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
