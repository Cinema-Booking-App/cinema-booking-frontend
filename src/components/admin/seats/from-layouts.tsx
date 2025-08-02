"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAddSeatLayoutMutation } from "@/store/slices/layouts/layoutApi";
import { CreateLayout } from "@/types/layouts";
import React, { useState } from "react"; // Import useState
import { SubmitHandler, useForm } from "react-hook-form"; // Không cần Controller nữa

interface AddLayoutDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AddLayoutDialog: React.FC<AddLayoutDialogProps> = ({ open, onOpenChange }) => {
    const [addSeatLayout, { isLoading }] = useAddSeatLayoutMutation();
    // State cục bộ để quản lý giá trị của Select ma trận ghế
    const [selectedSeatMatrix, setSelectedSeatMatrix] = useState<string | undefined>(undefined);

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<CreateLayout>({
        defaultValues: {
            layout_name: '',
            description: '',
            total_rows: undefined,
            total_columns: undefined,
            aisle_positions: '',
        }
    });

    const totalRows = watch("total_rows");
    const totalColumns = watch("total_columns");

    const onSubmit: SubmitHandler<CreateLayout> = async (data) => {
        try {
            await addSeatLayout(data).unwrap(); 
            reset(); 
            setSelectedSeatMatrix(undefined);
        } catch (err) {
            console.error("Lỗi khi thêm sơ đồ ghế:", err);
        }
    };

    const handleDialogClose = (open: boolean) => {
        if (!open) {
            reset(); // Reset form khi đóng
            setSelectedSeatMatrix(undefined);
        }
        onOpenChange(open);
    };

    const handleSeatMatrixChange = (val: string) => {
        setSelectedSeatMatrix(val); // Cập nhật state cục bộ
        const parts = val.split('x');
        if (parts.length === 2) {
            const rows = Number(parts[0]);
            const cols = Number(parts[1]);

            // Cập nhật giá trị vào total_rows và total_columns của form
            setValue('total_rows', rows, { shouldValidate: true, shouldDirty: true });
            setValue('total_columns', cols, { shouldValidate: true, shouldDirty: true });
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Thêm mới mẫu sơ đồ ghế</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-2">
                        {/* Tên Layout */}
                        <div>
                            <Input
                                placeholder="Tên layout (ví dụ: Tiêu chuẩn)"
                                {...register("layout_name", { required: "Tên layout không được để trống" })}
                            />
                            {errors.layout_name && <p className="text-red-500 text-sm mt-1">{errors.layout_name.message}</p>}
                        </div>

                        {/* Chọn Ma trận ghế - Sử dụng state cục bộ */}
                        <div>
                            <Select
                                onValueChange={handleSeatMatrixChange}
                                value={selectedSeatMatrix} // Bind với state cục bộ
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
                            {(errors.total_rows || errors.total_columns) && (selectedSeatMatrix === undefined || totalRows === undefined || totalColumns === undefined) &&
                                <p className="text-red-500 text-sm mt-1">Vui lòng chọn ma trận ghế để thiết lập số hàng và cột.</p>
                            }
                        </div>

                        {/* total_rows và total_columns hiển thị readOnly */}
                        <div className="flex gap-2">
                            <div>
                                <Input
                                    type="number"
                                    placeholder="Tổng số hàng"
                                    {...register("total_rows", {
                                        valueAsNumber: true,
                                        required: "Tổng số hàng không được để trống", // Thêm required validation
                                        min: { value: 1, message: "Số hàng phải lớn hơn 0" } // Đảm bảo số hàng > 0
                                    })}
                                    value={totalRows?.toString() ?? ''}
                                />
                                {errors.total_rows && <p className="text-red-500 text-sm mt-1">{errors.total_rows.message}</p>}
                            </div>
                            <div>
                                <Input
                                    type="number"
                                    placeholder="Tổng số cột"
                                    {...register("total_columns", {
                                        valueAsNumber: true,
                                        required: "Tổng số cột không được để trống", // Thêm required validation
                                        min: { value: 1, message: "Số cột phải lớn hơn 0" } // Đảm bảo số cột > 0
                                    })}

                                    value={totalColumns?.toString() ?? ''}
                                />
                                {errors.total_columns && <p className="text-red-500 text-sm mt-1">{errors.total_columns.message}</p>}
                            </div>
                        </div>

                        {/* Mô tả - Người dùng nhập thủ công */}
                        <div>
                            <textarea
                                className="w-full border rounded px-3 py-2 text-sm resize-y min-h-[60px]"
                                rows={2}
                                placeholder="Mô tả"
                                {...register("description")}
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                        </div>

                        {/* Vị trí lối đi - Gửi nguyên chuỗi */}
                        <div>
                            <Input
                                placeholder="Vị trí lối đi (ví dụ: 5,10 cho cột)"
                                {...register("aisle_positions")}
                            />
                            {errors.aisle_positions && <p className="text-red-500 text-sm mt-1">{errors.aisle_positions.message}</p>}
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => handleDialogClose(false)} type="button">
                            Đóng
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Đang thêm..." : "Thêm mới"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};