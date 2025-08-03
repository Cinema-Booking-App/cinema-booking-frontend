'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SeatLayoutDetail, SeatTemplates, SeatTemplateUpdate } from '@/types/layouts';
import { useUpdateSeatTemplatesMutation } from '@/store/slices/layouts/layoutApi';
import SeatLayoutForm from './seat-layout-form';
import SeatLayoutGrid from './seat-layout-grid';
import LoadingComponent from '@/components/ui/cinema-loading';


// Định nghĩa props cho component
interface SeatLayoutDialogProps {
  layoutDetail: SeatLayoutDetail | null | undefined;
  open: boolean;
  onClose: () => void;
}

// Component chính, quản lý trạng thái và logic chung
const SeatLayoutDialog: React.FC<SeatLayoutDialogProps> = ({
  layoutDetail,
  open,
  onClose,
}) => {
  const [editedLayout, setEditedLayout] = useState<SeatLayoutDetail | null>(null);
  const [changedSeats, setChangedSeats] = useState<Record<number, Partial<SeatTemplates>>>({});

  const [updateSeatTemplates, { isLoading, isSuccess, isError, error }] = useUpdateSeatTemplatesMutation();

  // Đồng bộ hóa trạng thái khi layoutDetail thay đổi
  useEffect(() => {
    if (layoutDetail) {
      setEditedLayout({ ...layoutDetail });
      setChangedSeats({});
    } else {
      setEditedLayout(null);
      setChangedSeats({});
    }
  }, [layoutDetail]);

  // Xử lý thông báo thành công/thất bại và đóng dialog
  useEffect(() => {
    if (isSuccess) {
      // toast.success('Cập nhật sơ đồ ghế thành công!');
      onClose();
    }
    if (isError) {
      console.error("Lỗi khi cập nhật sơ đồ ghế:", error);
      // toast.error('Có lỗi xảy ra khi lưu. Vui lòng thử lại.');
    }
  }, [isSuccess, isError, onClose, error]);

  // Xử lý thay đổi thông tin chung của layout
  const handleLayoutChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedLayout((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: name === 'total_rows' || name === 'total_columns' ? parseInt(value) || 0 : value,
      };
    });
  }, []);

  // Xử lý thay đổi loại ghế
  const handleSeatTemplateChange = useCallback((
    seatId: number,
    field: keyof SeatTemplates,
    value: any
  ) => {
    setEditedLayout((prev) => {
      if (!prev) return null;
      const updatedTemplates = prev.seat_templates.map((seat) => {
        if (seat.template_id === seatId) {
          return { ...seat, [field]: value };
        }
        return seat;
      });

      setChangedSeats(prevChanged => {
        const originalSeat = layoutDetail?.seat_templates.find(s => s.template_id === seatId);
        const originalValue = originalSeat ? originalSeat[field] : undefined;

        if (originalValue !== value) {
          const newChangedSeat = { ...prevChanged[seatId], [field]: value };
          return { ...prevChanged, [seatId]: newChangedSeat };
        } else {
          // Xóa trường nếu giá trị được khôi phục về ban đầu
          const { [field]: _, ...rest } = prevChanged[seatId] || {};
          if (Object.keys(rest).length === 0) {
            const { [seatId]: __, ...restChanged } = prevChanged;
            return restChanged;
          }
          return { ...prevChanged, [seatId]: rest };
        }
      });
      return { ...prev, seat_templates: updatedTemplates };
    });
  }, [layoutDetail]);

  const handleSave = async () => {
    if (!editedLayout) return;

    const updatesToSend: SeatTemplateUpdate[] = [];

    for (const templateId in changedSeats) {
      const changes = changedSeats[parseInt(templateId)];

      const payload: SeatTemplateUpdate = {
        template_id: parseInt(templateId),
        ...(changes.seat_type !== undefined && { seat_type: changes.seat_type }),
      };

      if (Object.keys(payload).length > 1) {
        updatesToSend.push(payload);
      }
    }

    if (updatesToSend.length > 0) {
      try {
        await updateSeatTemplates({ layout_id: editedLayout.layout_id, updates: updatesToSend }).unwrap();
      } catch (e) {
        // Lỗi đã được xử lý bởi useEffect ở trên
      }
    } else {
      // toast('Không có thay đổi nào để lưu.', { icon: 'ℹ️' });
      onClose();
    }
  };

  // Đảm bảo tất cả hooks được gọi trước khi có conditional return
  if (!editedLayout || !open) {
    return <LoadingComponent/>;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-[85vw] lg:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-lg sm:text-xl">
            {editedLayout.layout_name}
          </DialogTitle>
          <DialogDescription className="text-sm">
            Chỉnh sửa sơ đồ ghế và thông tin bố cục
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Component form */}
            <SeatLayoutForm
              editedLayout={editedLayout}
              onLayoutChange={handleLayoutChange}
            />
          </div>

          {/* Component hiển thị lưới ghế */}
          <SeatLayoutGrid
            editedLayout={editedLayout}
            onSeatChange={handleSeatTemplateChange}
          />

          {/* Component hiển thị chú thích */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
              <span>Thường</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
              <span>VIP</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-pink-500 rounded-sm"></div>
              <span>Ghế đôi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-dashed border-gray-400 bg-gray-100 rounded-sm"></div>
              <span>Lối đi</span>
            </div>
          </div>        </div>

        <DialogFooter className="pt-3 gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-sm py-2"
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            className="text-sm py-2"
            disabled={isLoading}
          >
            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SeatLayoutDialog;
