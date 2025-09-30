import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Promotion } from '@/types/promotions';
import { useAddPromotionMutation, useUpdatePromotionMutation } from '@/store/slices/promotions/promotionsApi';
import { toast } from "sonner";

type PromotionFormProps = {
  onOpenChange?: (open: boolean) => void;
  editPromotion?: Promotion | null;
};

export default function PromotionForm({ onOpenChange, editPromotion }: PromotionFormProps) {
  const [addPromotion, { isLoading: isAdding }] = useAddPromotionMutation();
  const [updatePromotion, { isLoading: isUpdating }] = useUpdatePromotionMutation();

  const [form, setForm] = useState({
    code: "",
    discount_percentage: "",
    start_date: "",
    end_date: "",
    max_usage: "",
    description: "",
    is_active: true,
  });

  // Auto-fill data when editing
  useEffect(() => {
    if (editPromotion) {
      setForm({
        code: editPromotion.code || "",
        discount_percentage: editPromotion.discount_percentage?.toString() || "",
        start_date: editPromotion.start_date || "",
        end_date: editPromotion.end_date || "",
        max_usage: editPromotion.max_usage?.toString() || "",
        description: editPromotion.description || "",
        is_active: editPromotion.is_active ?? true,
      });
    } else {
      setForm({
        code: "",
        discount_percentage: "",
        start_date: "",
        end_date: "",
        max_usage: "",
        description: "",
        is_active: true,
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

  const validateForm = () => {
    if (!form.code.trim()) {
      toast.error("Mã khuyến mãi không được để trống");
      return false;
    }
    
    if (!form.discount_percentage || Number(form.discount_percentage) <= 0 || Number(form.discount_percentage) > 100) {
      toast.error("Phần trăm giảm giá phải từ 1-100%");
      return false;
    }
    
    if (!form.start_date) {
      toast.error("Ngày bắt đầu không được để trống");
      return false;
    }
    
    if (!form.end_date) {
      toast.error("Ngày kết thúc không được để trống");
      return false;
    }
    
    if (new Date(form.start_date) >= new Date(form.end_date)) {
      toast.error("Ngày kết thúc phải sau ngày bắt đầu");
      return false;
    }
    
    if (form.max_usage && Number(form.max_usage) <= 0) {
      toast.error("Giới hạn sử dụng phải lớn hơn 0");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Map data to match backend schema exactly
      const payload = {
        code: form.code.trim(),
        discount_percentage: Number(form.discount_percentage),
        start_date: form.start_date,
        end_date: form.end_date,
        max_usage: form.max_usage ? Number(form.max_usage) : undefined,
        description: form.description.trim() || undefined,
        is_active: form.is_active,
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
      
      // Close form and auto-refresh list
      onOpenChange?.(false);
    } catch (err) {
      const errorMessage = (typeof err === 'object' && err !== null && 'message' in err)
        ? (err as { message?: string }).message
        : "Có lỗi xảy ra khi lưu khuyến mãi";
      toast.error(errorMessage);
      console.error('Lỗi khi lưu khuyến mãi:', err);
    }
  };

  const isLoading = isAdding || isUpdating;

  return (
    <SheetContent side="right" className="w-[500px] sm:w-[600px]">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <SheetHeader className="pb-6 border-b">
          <SheetTitle className="text-xl font-semibold">
            {editPromotion ? 'Sửa khuyến mãi' : 'Thêm khuyến mãi mới'}
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 space-y-5 overflow-y-auto py-6 px-4">
          {/* Mã khuyến mãi */}
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium">
              Mã khuyến mãi <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="code"
              name="code" 
              value={form.code} 
              onChange={handleChange} 
              placeholder="VD: SUMMER2024"
              required 
              className="h-10"
            />
            <p className="text-xs text-gray-500">Mã khuyến mãi phải là duy nhất</p>
          </div>

          {/* Phần trăm giảm giá */}
          <div className="space-y-2">
            <Label htmlFor="discount_percentage" className="text-sm font-medium">
              Phần trăm giảm giá <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input 
                id="discount_percentage"
                name="discount_percentage" 
                value={form.discount_percentage} 
                onChange={handleChange} 
                type="number"
                min="1"
                max="100"
                placeholder="VD: 20" 
                required
                className="h-10 pr-12"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                %
              </span>
            </div>
            <p className="text-xs text-gray-500">Phần trăm giảm giá từ 1-100%</p>
          </div>

          {/* Thời gian áp dụng */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Thời gian áp dụng <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date" className="text-xs text-gray-600">Từ ngày</Label>
                <Input 
                  id="start_date"
                  type="date" 
                  name="start_date" 
                  value={form.start_date} 
                  onChange={handleChange} 
                  required 
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date" className="text-xs text-gray-600">Đến ngày</Label>
                <Input 
                  id="end_date"
                  type="date" 
                  name="end_date" 
                  value={form.end_date} 
                  onChange={handleChange} 
                  required 
                  className="h-10"
                />
              </div>
            </div>
          </div>

          {/* Giới hạn sử dụng */}
          <div className="space-y-2">
            <Label htmlFor="max_usage" className="text-sm font-medium">
              Giới hạn lượt sử dụng
            </Label>
            <Input 
              id="max_usage"
              name="max_usage" 
              value={form.max_usage} 
              onChange={handleChange} 
              type="number" 
              min="1"
              placeholder="Để trống = không giới hạn"
              className="h-10"
            />
            <p className="text-xs text-gray-500">Để trống nếu không muốn giới hạn số lượt sử dụng</p>
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Mô tả
            </Label>
            <textarea 
              id="description"
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              placeholder="Mô tả chi tiết về khuyến mãi..."
              className="w-full border rounded-md px-3 py-2 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            />
          </div>

          {/* Trạng thái kích hoạt */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <input 
              type="checkbox" 
              name="is_active" 
              checked={form.is_active} 
              onChange={handleChange} 
              id="is_active"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <Label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
              Kích hoạt khuyến mãi
            </Label>
          </div>
        </div>

        <SheetFooter className="pt-6 border-t gap-3">
          <Button type="submit" disabled={isLoading} className="flex-1 h-10">
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
            <Button type="button" variant="outline" disabled={isLoading} className="h-10">
              Hủy bỏ
            </Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </SheetContent>
  );
} 