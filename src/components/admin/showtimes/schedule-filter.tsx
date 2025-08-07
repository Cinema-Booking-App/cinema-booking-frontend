import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function ScheduleFilter() {
  return (
    <div className="flex gap-2 mb-4">
      <Input
        placeholder="Tìm kiếm theo mã lịch chiếu, tên phim..."
        className="w-64"
        
      />
      <Select >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Tất cả trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Đang hoạt động</SelectItem>
          <SelectItem value="ended">Đã kết thúc</SelectItem>
          <SelectItem value="canceled">Đã hủy</SelectItem>
          <SelectItem value="postponed">Hoãn chiếu</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
} 