import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const PROMO_TYPE_OPTIONS = [
  { label: "Giảm giá phần trăm", value: "Giảm giá phần trăm" },
  { label: "Giảm giá cố định", value: "Giảm giá cố định" },
  { label: "Tặng combo", value: "Tặng combo" },
  { label: "Tặng vé", value: "Tặng vé" },
];

export default function PromotionForm({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    }
    setForm((prev: any) => ({ ...prev, [name]: newValue }));
  };
  return (
    <SheetContent side="right">
      <form className="flex flex-col gap-4 h-full" onSubmit={e => { e.preventDefault(); onOpenChange?.(false); }}>
        <SheetHeader>
          <SheetTitle>Thêm khuyến mãi mới</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 px-4">
          <label className="text-sm">Tên khuyến mãi</label>
          <Input name="name" value={form.name} onChange={handleChange} required />
          <label className="text-sm mt-2">Mã khuyến mãi</label>
          <Input name="code" value={form.code} onChange={handleChange} required />
          <label className="text-sm mt-2">Loại khuyến mãi</label>
          <Select value={form.type} onValueChange={val => setForm((f: any) => ({ ...f, type: val }))}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại" />
            </SelectTrigger>
            <SelectContent>
              {PROMO_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <label className="text-sm mt-2">Giá trị</label>
          <Input name="value" value={form.value} onChange={handleChange} placeholder="VD: 20 hoặc 20000" />
          <label className="text-sm mt-2">Đơn vị</label>
          <Select value={form.valueType} onValueChange={val => setForm((f: any) => ({ ...f, valueType: val }))}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn đơn vị" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="%">%</SelectItem>
              <SelectItem value="VNĐ">VNĐ</SelectItem>
              <SelectItem value="vé">vé</SelectItem>
              <SelectItem value="combo">combo</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2 mt-2 flex-col sm:flex-row">
            <div className="flex-1">
              <label className="text-sm">Ngày bắt đầu</label>
              <Input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
            </div>
            <div className="flex-1">
              <label className="text-sm">Ngày kết thúc</label>
              <Input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
            </div>
          </div>
          <label className="text-sm mt-2">Trạng thái</label>
          <Select value={form.status} onValueChange={val => setForm((f: any) => ({ ...f, status: val }))}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Đang hoạt động">Đang hoạt động</SelectItem>
              <SelectItem value="Sắp diễn ra">Sắp diễn ra</SelectItem>
              <SelectItem value="Đã hết hạn">Đã hết hạn</SelectItem>
            </SelectContent>
          </Select>
          <label className="text-sm mt-2">Số lượt đã dùng</label>
          <Input name="used" value={form.used} onChange={handleChange} type="number" min={0} />
          <label className="text-sm mt-2">Giới hạn lượt sử dụng</label>
          <Input name="usageLimit" value={form.usageLimit} onChange={handleChange} type="number" min={0} />
          <label className="text-sm mt-2">Mô tả</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="border rounded px-2 py-1" rows={3} />
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" name="enabled" checked={form.enabled} onChange={handleChange} />
            <span>Kích hoạt</span>
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Lưu</Button>
          <SheetClose asChild>
            <Button type="button" variant="outline">Hủy</Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </SheetContent>
  );
} 