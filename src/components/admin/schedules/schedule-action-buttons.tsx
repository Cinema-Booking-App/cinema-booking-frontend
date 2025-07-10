import { Button } from "@/components/ui/button";

type ScheduleActionButtonsProps = {
  onEdit: () => void;
  onCancel: () => void;
  onDetail: () => void;
};

export default function ScheduleActionButtons({ onEdit, onCancel, onDetail }: ScheduleActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="secondary" onClick={onEdit}>Sửa</Button>
      <Button variant="destructive" onClick={onCancel}>Hủy</Button>
      <Button variant="outline" onClick={onDetail}>Chi tiết</Button>
    </div>
  );
} 