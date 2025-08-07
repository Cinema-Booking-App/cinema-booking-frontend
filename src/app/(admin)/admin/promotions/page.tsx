"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetTrigger,
} from "@/components/ui/sheet";
import PromotionTable from "@/components/admin/promotions/promotion-table";
import PromotionForm from "@/components/admin/promotions/promotion-form";
import {
  useGetAllPromotionsQuery,
  useAddPromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
} from "@/store/slices/promotions/promotionsApi";

const PROMO_TYPES = [
  "Tất cả",
  "Giảm giá phần trăm",
  "Giảm giá cố định",
  "Tặng combo",
  "Tặng vé",
];
const PROMO_STATUSES = [
  "Tất cả",
  "Đang hoạt động",
  "Sắp diễn ra",
  "Đã hết hạn",
];

export default function PromotionsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [dateFilter, setDateFilter] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editPromotion, setEditPromotion] = useState(null);
  const [deletePromotion] = useDeletePromotionMutation();

  // API hooks
  const { data, isLoading, isError } = useGetAllPromotionsQuery({});
  console.log('Promotions API data:', data);
  const promotions = Array.isArray(data) ? data : [];

  // Lọc dữ liệu
  const filteredPromotions = promotions.filter((promo) => {
    const matchSearch =
      (promo.code && promo.code.toLowerCase().includes(search.toLowerCase())) ||
      (promo.description && promo.description.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === "Tất cả" || promo.type === typeFilter;
    const matchStatus = statusFilter === "Tất cả" || promo.status === statusFilter;
    const matchDate =
      !dateFilter ||
      ((promo.start_date || promo.startDate) <= dateFilter && (promo.end_date || promo.endDate) >= dateFilter);
    return matchSearch && matchType && matchStatus && matchDate;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý khuyến mãi</h1>
        <Sheet open={openForm} onOpenChange={setOpenForm}>
          <SheetTrigger asChild>
            <Button onClick={() => { setEditPromotion(null); setOpenForm(true); }}>+ Thêm khuyến mãi</Button>
          </SheetTrigger>
          <PromotionForm onOpenChange={setOpenForm} editPromotion={editPromotion} />
        </Sheet>
      </div>
      {/* Bộ lọc và tìm kiếm */}
      <Card className="mb-4 p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm mb-1">Tìm kiếm</label>
            <Input
              placeholder="Tên hoặc mã khuyến mãi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Loại khuyến mãi</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                {PROMO_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm mb-1">Trạng thái</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {PROMO_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm mb-1">Ngày áp dụng</label>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-40"
            />
          </div>
        </div>
      </Card>
      <Separator className="mb-4" />
      <Card>
        <PromotionTable
          promotions={filteredPromotions}
          onEdit={(promo) => { setEditPromotion(promo); setOpenForm(true); }}
          onDelete={async (id) => { await deletePromotion(id); }}
        />
      </Card>
    </div>
  );
}
