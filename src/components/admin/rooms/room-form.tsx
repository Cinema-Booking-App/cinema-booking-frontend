"use client";

import React from "react";
// Import các component Dialog từ thư viện UI của bạn
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // Giả sử bạn có component Button

// Định nghĩa interface Rooms
export interface Rooms {
    room_id: number;
    theater_id: number;
    room_name: string;
    room_status: string;
    layout_id: number;
    created_at: string;
    updated_at: string;
}

// Cập nhật interface AddNewRoomProps để nhận theaterId
export interface AddNewRoomProps {
    showAddRoom: boolean;
    setShowAddRoom: (open: boolean) => void;
    theaterId: number; // Thêm thuộc tính theaterId
}

export const AddNewRoom: React.FC<AddNewRoomProps> = ({ showAddRoom, setShowAddRoom, theaterId }) => {
    // Hàm xử lý khi Dialog đóng
    const handleDialogClose = (open: boolean) => {
        // Bạn có thể thêm logic reset form ở đây nếu cần
        setShowAddRoom(open);
    };

    return(
        // Bao bọc toàn bộ nội dung trong Dialog
        <Dialog open={showAddRoom} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-md p-6 bg-white rounded-lg shadow-xl"> {/* Điều chỉnh kích thước và thêm shadow, rounded */}
                <DialogHeader className="mb-6"> {/* Thêm margin-bottom cho header */}
                    <DialogTitle className="text-2xl font-bold text-gray-800">Thêm phòng mới</DialogTitle> {/* Tăng kích thước và độ đậm chữ */}
                </DialogHeader>
                {/* Đây là nơi bạn sẽ thêm các input hoặc form cho việc thêm phòng mới */}
                <div className="grid gap-4 py-4"> {/* Sử dụng grid để bố cục tốt hơn, thêm khoảng cách */}
                    {/* Ví dụ về một input cho tên phòng */}
                    <div className="grid gap-2"> {/* Thêm khoảng cách giữa label và input */}
                        <label htmlFor="roomName" className="text-sm font-medium text-gray-700">Tên phòng</label>
                        <input
                            type="text"
                            id="roomName"
                            placeholder="Nhập tên phòng (ví dụ: Phòng VIP 1)"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    {/* Input cho ID rạp chiếu - giờ lấy từ props và là readOnly */}
                    <div className="grid gap-2">
                        <label htmlFor="theaterId" className="text-sm font-medium text-gray-700">ID rạp chiếu</label>
                        <input
                            type="number"
                            id="theaterId"
                            value={theaterId} // Sử dụng giá trị từ props
                            readOnly // Đặt là chỉ đọc để người dùng không thay đổi
                            className="flex h-10 w-full rounded-md border border-input bg-gray-100 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    {/* Ví dụ về một select cho trạng thái phòng */}
                    <div className="grid gap-2">
                        <label htmlFor="roomStatus" className="text-sm font-medium text-gray-700">Trạng thái phòng</label>
                        <select
                            id="roomStatus"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Chọn trạng thái</option>
                            <option value="Active">Hoạt động</option>
                            <option value="Maintenance">Bảo trì</option>
                            <option value="Inactive">Không hoạt động</option>
                        </select>
                    </div>

                    {/* Ví dụ về một input cho ID bố cục */}
                    <div className="grid gap-2">
                        <label htmlFor="layoutId" className="text-sm font-medium text-gray-700">ID bố cục</label>
                        <input
                            type="number"
                            id="layoutId"
                            placeholder="Nhập ID bố cục (ví dụ: 5)"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>

                <DialogFooter className="mt-6 flex justify-end gap-3"> {/* Tăng margin-top và khoảng cách giữa các nút */}
                    <Button variant="outline" onClick={() => handleDialogClose(false)} type="button"
                        className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"> {/* Làm đẹp nút Đóng */}
                        Đóng
                    </Button>
                    <Button type="submit"
                        className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 shadow-md"> {/* Làm đẹp nút Thêm phòng */}
                        Thêm phòng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
