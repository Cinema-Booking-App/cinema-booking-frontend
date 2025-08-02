"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

// Định nghĩa kiểu dữ liệu cho props của component mới
// Dùng Omit để bỏ đi 'layout_id' vì nó sẽ được tạo ở component cha
type NewLayout = {
    layout_name: string;
    seat_matrix: string;
    total_rows: number;
    total_columns: number;
    normal_rows: number;
    vip_rows: number;
    couple_rows: number;
    layout_description: string;
};

// Định nghĩa props cho component AddLayoutDialog
interface AddLayoutDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddLayout: (newLayout: NewLayout) => void;
}

export const AddLayoutDialog: React.FC<AddLayoutDialogProps> = ({ open, onOpenChange, onAddLayout }) => {
    const [newLayout, setNewLayout] = useState<NewLayout>({
        layout_name: "",
        seat_matrix: "",
        total_rows: 0,
        total_columns: 0,
        normal_rows: 0,
        vip_rows: 0,
        couple_rows: 0,
        layout_description: "",
    });

    // useEffect để tự động cập nhật mô tả khi các trường liên quan thay đổi
    useEffect(() => {
        let desc = `Mẫu sơ đồ ghế ${newLayout.layout_name || ""}`;
        if (newLayout.normal_rows || newLayout.vip_rows || newLayout.couple_rows) {
            desc += ": ";
            if (newLayout.normal_rows) desc += `${newLayout.normal_rows} hàng ghế thường, `;
            if (newLayout.vip_rows) desc += `${newLayout.vip_rows} hàng ghế vip, `;
            if (newLayout.couple_rows) desc += `${newLayout.couple_rows} hàng ghế đôi, `;
            desc = desc.replace(/, $/, "");
        }
        setNewLayout((prev) => ({ ...prev, layout_description: desc }));
    }, [newLayout.layout_name, newLayout.normal_rows, newLayout.vip_rows, newLayout.couple_rows]);

    const handleLocalAdd = () => {
        // Gọi hàm onAddLayout từ props để truyền dữ liệu lên component cha
        onAddLayout(newLayout);
        // Đóng dialog và reset form
        onOpenChange(false);
        setNewLayout({
            layout_name: "",
            seat_matrix: "",
            total_rows: 0,
            total_columns: 0,
            normal_rows: 0,
            vip_rows: 0,
            couple_rows: 0,
            layout_description: "",
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Đóng
                    </Button>
                    <Button onClick={handleLocalAdd}>
                        Thêm mới
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
