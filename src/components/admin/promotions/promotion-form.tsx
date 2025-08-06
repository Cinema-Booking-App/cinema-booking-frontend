import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Promotion } from '@/types/promotions';
import { useAddPromotionMutation, useUpdatePromotionMutation } from '@/store/slices/promotions/promotionsApi';
import { toast } from "sonner";

const PROMO_TYPE_OPTIONS = [
  { label: "Giảm giá phần trăm", value: "Giảm giá phần trăm" },
  { label: "Giảm giá cố định", value: "Giảm giá cố định" },
  { label: "Tặng combo", value: "Tặng combo" },
  { label: "Tặng vé", value: "Tặng vé" },
];

type PromotionFormProps = {
  onOpenChange?: (open: boolean) => void;
  editPromotion?: Promotion | null;
};

export default function PromotionForm({ onOpenChange, editPromotion }: PromotionFormProps) {
  const [addPromotion, { isLoading: isAdding }] = useAddPromotionMutation();
  const [updatePromotion, { isLoading: isUpdating }] = useUpdatePromotionMutation();

  const [form, setForm] = useState({
    name: "",
    code: "",
    type: PROMO_TYPE_OPTIONS[0].value,
    value: "",
    valueType: "%",
    startDate: "",
    endDate: "",
    status: "Sắp diễn ra",
    used: 0,
    usageLimit: "",
    enabled: true,
    description: "",
  });

  // Tự động fill dữ liệu khi sửa
  useEffect(() => {
    if (editPromotion) {
      setForm({
        name: editPromotion.description || "",
        code: editPromotion.code || "",
        type: "Giảm giá phần trăm", // Mặc định
        value: editPromotion.value?.toString() || "",
        valueType: editPromotion.valueType || "%",
        startDate: editPromotion.startDate || "",
        endDate: editPromotion.endDate || "",
        status: "Sắp diễn ra", // Mặc định
        used: editPromotion.used || 0,
        usageLimit: editPromotion.usageLimit?.toString() || "",
        enabled: editPromotion.enabled ?? true,
        description: editPromotion.description || "",
      });
    } else {
      setForm({
        name: "",
        code: "",
        type: PROMO_TYPE_OPTIONS[0].value,
        value: "",
        valueType: "%",
        startDate: "",
        endDate: "",
        status: "Sắp diễn ra",
        used: 0,
        usageLimit: "",
        enabled: true,
        description: "",
      });
    }
  }, [editPromotion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean = value;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    }
    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Map dữ liệu đúng schema backend
      const payload = {
        code: form.code,
        discount_percentage: Number(form.value),
        start_date: form.startDate,
        end_date: form.endDate,
        max_usage: Number(form.usageLimit),
        description: form.description,
      };

      if (editPromotion) {
        await updatePromotion({ 
          id: editPromotion.promotion_id, 
          body: payload 
        }).unwrap();
        toast.success("Cập nhật khuyến mãi thành công!");
      } else {
        await addPromotion(payload).unwrap();
        toast.success("Thêm khuyến mãi thành công!");
      }
      
      // Đóng form và tự động cập nhật danh sách
      onOpenChange?.(false);
    } catch (err: any) {
      const errorMessage = err?.data?.detail || "Có lỗi xảy ra khi lưu khuyến mãi";
      toast.error(errorMessage);
      console.error('Lỗi khi lưu khuyến mãi:', err);
    }
  };

  const isLoading = isAdding || isUpdating;

  return (
    <SheetContent side="right" className="w-[400px] sm:w-[500px]">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <SheetHeader className="pb-4">
          <SheetTitle>
            {editPromotion ? 'Sửa khuyến mãi' : 'Thêm khuyến mãi mới'}
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 space-y-3 overflow-y-auto">
          <div>
            <label className="text-sm font-medium">Mã khuyến mãi</label>
            <Input 
              name="code" 
              value={form.code} 
              onChange={handleChange} 
              required 
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Loại khuyến mãi</label>
            <Select value={form.type} onValueChange={val => setForm((f) => ({ ...f, type: val }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                {PROMO_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Giá trị</label>
            <Input 
              name="value" 
              value={form.value} 
              onChange={handleChange} 
              placeholder="VD: 20 hoặc 20000" 
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Đơn vị</label>
            <Select value={form.valueType} onValueChange={val => setForm((f) => ({ ...f, valueType: val }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chọn đơn vị" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="%">%</SelectItem>
                <SelectItem value="VNĐ">VNĐ</SelectItem>
                <SelectItem value="vé">vé</SelectItem>
                <SelectItem value="combo">combo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Ngày bắt đầu</label>
              <Input 
                type="date" 
                name="startDate" 
                value={form.startDate} 
                onChange={handleChange} 
                required 
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Ngày kết thúc</label>
              <Input 
                type="date" 
                name="endDate" 
                value={form.endDate} 
                onChange={handleChange} 
                required 
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Trạng thái</label>
            <Select value={form.status} onValueChange={val => setForm((f) => ({ ...f, status: val }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Đang hoạt động">Đang hoạt động</SelectItem>
                <SelectItem value="Sắp diễn ra">Sắp diễn ra</SelectItem>
                <SelectItem value="Đã hết hạn">Đã hết hạn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Số lượt đã dùng</label>
              <Input 
                name="used" 
                value={form.used} 
                onChange={handleChange} 
                type="number" 
                min={0} 
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Giới hạn lượt sử dụng</label>
              <Input 
                name="usageLimit" 
                value={form.usageLimit} 
                onChange={handleChange} 
                type="number" 
                min={0} 
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Mô tả</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              className="w-full border rounded-md px-3 py-2 mt-1 resize-none" 
              rows={3} 
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              name="enabled" 
              checked={form.enabled} 
              onChange={handleChange} 
            />
            <span className="text-sm">Kích hoạt</span>
          </div>
        </div>

        <SheetFooter className="pt-4 gap-2">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {editPromotion ? 'Đang cập nhật...' : 'Đang thêm...'}
              </>
            ) : (
              editPromotion ? 'Cập nhật' : 'Lưu'
            )}
          </Button>
          <SheetClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>
              Hủy bỏ
            </Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </SheetContent>
  );
} 