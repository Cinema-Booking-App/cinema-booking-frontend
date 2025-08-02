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
import {
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';


// Định nghĩa kiểu dữ liệu Layout
// Đã thêm lại theater_type để khớp với mã của bạn
type Layout = {
  layout_id: number;
  layout_name: string;
  theater_type: string; // Thêm lại trường này
  total_rows: number;
  total_columns: number;
  aisle_positions: number[];
  layout_description?: string;
  normal_rows?: number;
  vip_rows?: number;
  couple_rows?: number;
};

// Dữ liệu mẫu đã cập nhật, bao gồm theater_type
const mockLayouts: Layout[] = [
  {
    layout_id: 1,
    layout_name: "IMAX Layout",
    theater_type: "IMAX",
    total_rows: 8,
    total_columns: 12,
    aisle_positions: [4, 6],
    layout_description: "Sơ đồ cho phòng chiếu IMAX với hai lối đi",
    normal_rows: 3,
    vip_rows: 3,
    couple_rows: 2
  },
  {
    layout_id: 2,
    layout_name: "Standard Layout",
    theater_type: "Standard",
    total_rows: 6,
    total_columns: 10,
    aisle_positions: [3],
    layout_description: "Sơ đồ tiêu chuẩn với một lối đi chính giữa",
    normal_rows: 4,
    vip_rows: 2,
    couple_rows: 0
  },
  {
    layout_id: 3,
    layout_name: "Couple Layout",
    theater_type: "Couple",
    total_rows: 5,
    total_columns: 8,
    aisle_positions: [2],
    layout_description: "Sơ đồ chỉ gồm ghế đôi, phù hợp cho phòng chiếu nhỏ",
    normal_rows: 0,
    vip_rows: 0,
    couple_rows: 5
  },
];


// Đây là thành phần SeatLayoutDialog bạn đã cung cấp, đã được sửa lỗi
// Trong một ứng dụng thực tế, thành phần này sẽ được đặt trong một file riêng
export function SeatLayoutDialog({ layout, onClose }: { layout: Layout; onClose: () => void }) {
  const { total_rows, total_columns, normal_rows = 0, vip_rows = 0, couple_rows = 0 } = layout;

  // Tạo một mảng để xác định loại ghế cho từng hàng
  const rowTypes = Array.from({ length: total_rows }, (_, i) => {
    if (i < normal_rows) return "Standard";
    if (i < normal_rows + vip_rows) return "VIP";
    return "Couple";
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-fit">
        <DialogTitle className="sr-only">Sơ đồ ghế: {layout.layout_name}</DialogTitle>
        <Card className="shadow-none border-none">
          <CardHeader>
            <CardTitle>
              Sơ đồ ghế: {layout.layout_name}
              <Button variant="outline" size="sm" className="ml-4" onClick={onClose}>
                Đóng
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-sm text-muted-foreground">
              <span>Hàng: {layout.total_rows} | Cột: {layout.total_columns} | Lối đi: {layout.aisle_positions?.join(", ")}</span>
            </div>
            <Separator className="mb-4" />
            {/* Màn hình rạp */}
            <div className="flex justify-center mb-4">
              <div
                className="bg-gray-800 rounded-b-2xl rounded-t-lg text-white font-bold text-sm flex items-center justify-center shadow-lg"
                style={{ width: Math.max(180, total_columns * 32), height: 32, letterSpacing: 2 }}
              >
                MÀN HÌNH
              </div>
            </div>
            <div
              className="inline-block border rounded-lg p-4 bg-muted"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
            >
              <div
                className="grid gap-1"
                style={{
                  gridTemplateRows: `repeat(${total_rows}, 32px)`,
                  gridTemplateColumns: `repeat(${total_columns + layout.aisle_positions.length}, 32px)`
                }}
              >
                {Array.from({ length: total_rows }).map((_, rowIdx) => {
                  const row = rowIdx + 1;
                  const rowType = rowTypes[rowIdx];
                  
                  return Array.from({ length: total_columns }).map((_, colIdx) => {
                    const col = colIdx + 1;
                    
                    if (rowType === "Couple" && colIdx % 2 === 0 && colIdx < total_columns - 1) {
                      return (
                        <Button
                          key={`seat-couple-${row}-${col}`}
                          size="icon"
                          className="rounded bg-pink-400 text-white border shadow-sm"
                          style={{ width: 66, height: 32, fontSize: 12, padding: 0, gridColumn: 'span 2' }}
                        >
                          {String.fromCharCode(64 + row)}{col}-{col + 1}
                        </Button>
                      );
                    }
                    if (rowType === "Couple" && colIdx % 2 !== 0) {
                      return null; // Bỏ qua cột lẻ để tạo ghế đôi
                    }

                    if (layout.aisle_positions?.includes(col)) {
                       return (
                          <div
                            key={`aisle-${row}-${col}`}
                            className="bg-transparent"
                            style={{ width: 32, height: 32 }}
                          />
                        );
                    }
                    
                    if (rowType === "VIP") {
                      return (
                        <Button
                          key={`seat-vip-${row}-${col}`}
                          size="icon"
                          className="rounded bg-yellow-400 text-black border shadow-sm"
                          style={{ width: 32, height: 32, fontSize: 12, padding: 0 }}
                        >
                          {String.fromCharCode(64 + row)}{col}
                        </Button>
                      );
                    }
                    
                    return (
                      <Button
                        key={`seat-standard-${row}-${col}`}
                        size="icon"
                        className="rounded bg-white text-black border shadow-sm"
                        style={{ width: 32, height: 32, fontSize: 12, padding: 0 }}
                      >
                        {String.fromCharCode(64 + row)}{col}
                      </Button>
                    );
                  });
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default function SeatsPage() {
  const [layouts, setLayouts] = useState<Layout[]>(mockLayouts);
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
    layout_description: "",
    theater_type: "" // Đã thêm trường này
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
    setNewLayout((prev) => ({ ...prev, layout_description: desc }));
    // eslint-disable-next-line
  }, [newLayout.layout_name, newLayout.normal_rows, newLayout.vip_rows, newLayout.couple_rows]);

  const handleAddLayout = () => {
    // Logic thêm layout mới, có thể gọi API ở đây
    const newId = layouts.length > 0 ? Math.max(...layouts.map(l => l.layout_id)) + 1 : 1;
    const layoutToAdd = {
      ...newLayout,
      layout_id: newId,
      aisle_positions: [Math.floor(newLayout.total_columns / 2)], // Ví dụ: đặt lối đi ở giữa
    };
    setLayouts([...layouts, layoutToAdd]);
    setShowAddDialog(false);
    setNewLayout({
      layout_name: "",
      seat_matrix: "",
      total_rows: 0,
      total_columns: 0,
      normal_rows: 0,
      vip_rows: 0,
      couple_rows: 0,
      layout_description: "",
      theater_type: ""
    });
  };

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
                <TableHead>Mô tả</TableHead>
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
                  <TableCell>{layout.layout_description}</TableCell>
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
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setSelectedLayout(layout)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedLayout && (
        <SeatLayoutDialog layout={selectedLayout} onClose={() => setSelectedLayout(null)} />
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm mới mẫu sơ đồ ghế</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="Tên layout (ví dụ: Tiêu chuẩn)"
              value={newLayout.layout_name}
              onChange={e => setNewLayout({ ...newLayout, layout_name: e.target.value })}
              required
            />
             <Input
              placeholder="Loại rạp (ví dụ: IMAX, Standard)"
              value={newLayout.theater_type}
              onChange={e => setNewLayout({ ...newLayout, theater_type: e.target.value })}
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
              value={newLayout.layout_description}
              readOnly
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Đóng
            </Button>
            <Button onClick={handleAddLayout}>
              Thêm mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
