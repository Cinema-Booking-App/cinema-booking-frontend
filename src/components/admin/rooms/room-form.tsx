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

export interface RoomFormProps {
    showAddRoom: boolean;
    setShowAddRoom: (open: boolean) => void;
    theaterId: number;
}

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

    const roomStatuses = [
        { value: "Active", label: "Hoạt động" },
        { value: "Maintenance", label: "Bảo trì" },
        { value: "Inactive", label: "Không hoạt động" },
    ];

    const handleInputChange = (field: keyof CreateRooms, value: any) => {
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

                    {/* ID rạp chiếu */}
                    <div className="grid gap-2">
                        <Label htmlFor="theaterId" className="flex items-center text-sm font-medium text-foreground">
                            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                            ID Rạp Chiếu
                        </Label>
                        <Input
                            id="theaterId"
                            type="number"
                            value={formData.theater_id}
                            readOnly
                            className="w-full px-3 py-2 bg-muted border rounded-md text-foreground focus:outline-none cursor-not-allowed"
                        />
                        {errors.theater_id && <p className="text-sm text-destructive">{errors.theater_id}</p>}
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

                    {/* ID bố cục */}
                    <div className="grid gap-2">
                        <Label htmlFor="layoutId" className="flex items-center text-sm font-medium text-foreground">
                            <Settings className="w-4 h-4 mr-2 text-muted-foreground" />
                            ID Bố Cục
                        </Label>
                        <Input
                            id="layoutId"
                            type="number"
                            value={formData.layout_id}
                            onChange={(e) => handleInputChange("layout_id", Number(e.target.value))}
                            placeholder="Nhập ID bố cục (ví dụ: 5)"
                            min="1"
                            className={`w-full px-3 py-2 bg-background border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-destructive ${errors.layout_id ? "border-destructive" : "border-border"}`}
                        />
                        {errors.layout_id && <p className="text-sm text-destructive">{errors.layout_id}</p>}
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