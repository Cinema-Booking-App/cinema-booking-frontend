"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Giả sử có component Input
import { Label } from "@/components/ui/label"; // Giả sử có component Label
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Giả sử có component Select
import { Users, Settings, MapPin } from "lucide-react";
import { CreateRooms } from "@/types/rooms";
import { useCreateRoomMutation } from "@/store/slices/rooms/roomsApi";
import { useGetListSeatLayoutsQuery, useGetSeatLayoutByIdQuery } from '@/store/slices/layouts/layoutApi';
import { SeatLayouts, SeatLayoutDetail } from '@/types/layouts';

export interface RoomFormProps {
    showAddRoom: boolean;
    setShowAddRoom: (open: boolean) => void;
    theaterId: number;
}

interface LayoutSelectProps {
    value: number;
    onChange: (value: number) => void;
    error?: string;
}

const LayoutSelect: React.FC<LayoutSelectProps> = ({ value, onChange, error }) => {
    const { data: layouts, isLoading, error: fetchError } = useGetListSeatLayoutsQuery();
    // fetch details for preview when a layout is selected
    const selectedId = value && value > 0 ? value : undefined;
    const { data: layoutDetail, isLoading: isLoadingDetail } = useGetSeatLayoutByIdQuery(selectedId);

    return (
        <>
            <Select
                value={value && value > 0 ? String(value) : undefined}
                onValueChange={(v) => onChange(Number(v))}
            >
                <SelectTrigger
                    id="layoutId"
                    className={`w-full px-3 py-2 bg-background border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-destructive ${error ? "border-destructive" : "border-border"}`}
                >
                    <SelectValue placeholder={isLoading ? 'Đang tải bố cục...' : 'Chọn bố cục'} />
                </SelectTrigger>
                <SelectContent>
                    {isLoading && <SelectItem value="0">Đang tải...</SelectItem>}
                    {fetchError && <SelectItem value="0">Không tải được bố cục</SelectItem>}
                    {layouts && layouts.map((l: SeatLayouts) => (
                        <SelectItem key={l.layout_id} value={String(l.layout_id)}>
                            {l.layout_name} {`- ${l.total_rows}x${l.total_columns}`}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Inline preview of selected layout */}
            {selectedId ? (
                <div className="mt-3 p-3 border rounded bg-muted">
                    {isLoadingDetail ? (
                        <p className="text-sm text-muted-foreground">Đang tải chi tiết bố cục...</p>
                    ) : layoutDetail ? (
                        <div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{layoutDetail.layout_name}</p>
                                    <p className="text-sm text-muted-foreground">{layoutDetail.description}</p>
                                </div>
                                <div className="text-sm text-muted-foreground">{layoutDetail.total_rows} hàng × {layoutDetail.total_columns} cột</div>
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">Tổng ghế: {layoutDetail.seat_templates?.length ?? '—'}</div>
                        </div>
                    ) : (
                        <p className="text-sm text-destructive">Không tìm thấy chi tiết bố cục.</p>
                    )}
                </div>
            ) : (
                <p className="mt-2 text-sm text-muted-foreground">Chưa chọn bố cục</p>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
        </>
    );
};

const RoomForm: React.FC<RoomFormProps> = ({ showAddRoom, setShowAddRoom, theaterId }) => {
    const initialFormData: CreateRooms = {
        theater_id: theaterId,
        room_name: "",
        room_status: "Active",
        layout_id: 0,
    };

    const [formData, setFormData] = useState<CreateRooms>(initialFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [createRoom, { isLoading: isCreatingRoom, error: createRoomError }] = useCreateRoomMutation();
    // keep theater_id in sync when prop changes
    React.useEffect(() => {
        setFormData((prev) => ({ ...prev, theater_id: theaterId }));
    }, [theaterId]);

    const roomStatuses = [
        { value: "Active", label: "Hoạt động" },
        { value: "Maintenance", label: "Bảo trì" },
        { value: "Inactive", label: "Không hoạt động" },
    ];

    const handleInputChange = <K extends keyof CreateRooms>(field: K, value: CreateRooms[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.room_name.trim()) newErrors.room_name = "Vui lòng nhập tên phòng";
        if (!formData.theater_id) newErrors.theater_id = "Vui lòng cung cấp ID rạp chiếu";
        if (!formData.room_status) newErrors.room_status = "Vui lòng chọn trạng thái phòng";
        if (!formData.layout_id || formData.layout_id <= 0) newErrors.layout_id = "ID bố cục phải lớn hơn 0";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await createRoom(formData).unwrap();
                setFormData(initialFormData);
                setErrors({});
                setShowAddRoom(false);
            } catch {
                setErrors({ general: "Tạo phòng thất bại. Vui lòng thử lại." });
            }
        }
    };

    const handleCancel = () => {
        setFormData(initialFormData);
        setErrors({});
        setShowAddRoom(false);
    };

    return (
        <Dialog open={showAddRoom} onOpenChange={setShowAddRoom}>
            <DialogContent className="sm:max-w-md p-6 bg-background rounded-lg shadow-xl">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-bold text-foreground flex items-center">
                        <Users className="w-5 h-5 mr-2 text-destructive" />
                        Thêm Phòng Mới
                    </DialogTitle>
                </DialogHeader>

                {errors.general && <p className="text-sm text-destructive">{errors.general}</p>}
                {createRoomError && <p className="text-sm text-destructive">Tạo phòng thất bại. Vui lòng kiểm tra lại.</p>}

                <div className="grid gap-4 py-4">
                    {/* Tên phòng */}
                    <div className="grid gap-2">
                        <Label htmlFor="roomName" className="flex items-center text-sm font-medium text-foreground">
                            <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                            Tên Phòng
                        </Label>
                        <Input
                            id="roomName"
                            value={formData.room_name}
                            onChange={(e) => handleInputChange("room_name", e.target.value)}
                            placeholder="Nhập tên phòng (ví dụ: Phòng VIP 1)"
                            className={`w-full px-3 py-2 bg-background border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-destructive ${errors.room_name ? "border-destructive" : "border-border"}`}
                        />
                        {errors.room_name && <p className="text-sm text-destructive">{errors.room_name}</p>}
                    </div>
                    {/* Trạng thái phòng */}
                    <div className="grid gap-2">
                        <Label htmlFor="roomStatus" className="flex items-center text-sm font-medium text-foreground">
                            <Settings className="w-4 h-4 mr-2 text-muted-foreground" />
                            Trạng Thái Phòng
                        </Label>
                        <Select
                            value={formData.room_status}
                            onValueChange={(value) => handleInputChange("room_status", value)}
                        >
                            <SelectTrigger
                                id="roomStatus"
                                className={`w-full px-3 py-2 bg-background border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-destructive ${errors.room_status ? "border-destructive" : "border-border"}`}
                            >
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                {roomStatuses.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.room_status && <p className="text-sm text-destructive">{errors.room_status}</p>}
                    </div>

                    {/* Chọn bố cục (thay vì nhập ID) */}
                    <div className="grid gap-2">
                        <Label htmlFor="layoutId" className="flex items-center text-sm font-medium text-foreground">
                            <Settings className="w-4 h-4 mr-2 text-muted-foreground" />
                            Bố Cục Ghế
                        </Label>
                        {/* Fetch layouts and render a select */}
                        <LayoutSelect
                            value={formData.layout_id}
                            onChange={(value: number) => handleInputChange('layout_id', value)}
                            error={errors.layout_id}
                        />
                    </div>
                </div>

                <DialogFooter className="mt-6 flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isCreatingRoom}
                        className="px-6 py-2 rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isCreatingRoom}
                        className="px-6 py-2 rounded-md bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium shadow-sm transition-colors duration-200 disabled:opacity-50"
                    >
                        {isCreatingRoom ? "Đang tạo..." : "Thêm Phòng"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RoomForm;