"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import PromotionTable from "@/components/admin/promotions/promotion-table";
import PromotionForm from "@/components/admin/promotions/promotion-form";

// Mock data
const mockPromotions = [
  {
    id: 1,
    name: "Thứ 4 vui vẻ",
    code: "VE69K",
    type: "Giảm giá phần trăm",
    value: 20,
    valueType: "%",
    startDate: "2024-06-01",
    endDate: "2024-06-30",
    status: "Đang hoạt động",
    used: 120,
    usageLimit: 500,
    enabled: true,
  },
  {
    id: 2,
    name: "Combo bắp nước giảm 20%",
    code: "COMBO20",
    type: "Tặng combo",
    value: null,
    valueType: null,
    startDate: "2024-07-01",
    endDate: "2024-07-15",
    status: "Sắp diễn ra",
    used: 0,
    usageLimit: 200,
    enabled: false,
  },
  {
    id: 3,
    name: "Tặng vé miễn phí",
    code: "FREETICKET",
    type: "Tặng vé",
    value: 1,
    valueType: "vé",
    startDate: "2024-05-01",
    endDate: "2024-05-31",
    status: "Đã hết hạn",
    used: 50,
    usageLimit: 50,
    enabled: false,
  },
];

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

const PROMO_TYPE_OPTIONS = [
  { label: "Giảm giá phần trăm", value: "Giảm giá phần trăm" },
  { label: "Giảm giá cố định", value: "Giảm giá cố định" },
  { label: "Tặng combo", value: "Tặng combo" },
  { label: "Tặng vé", value: "Tặng vé" },
];

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState(mockPromotions);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [dateFilter, setDateFilter] = useState("");

  // Lọc dữ liệu
  const filteredPromotions = promotions.filter((promo) => {
    const matchSearch =
      promo.name.toLowerCase().includes(search.toLowerCase()) ||
      promo.code.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "Tất cả" || promo.type === typeFilter;
    const matchStatus = statusFilter === "Tất cả" || promo.status === statusFilter;
    const matchDate =
      !dateFilter ||
      (promo.startDate <= dateFilter && promo.endDate >= dateFilter);
    return matchSearch && matchType && matchStatus && matchDate;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý khuyến mãi</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button>+ Thêm khuyến mãi</Button>
          </SheetTrigger>
          <PromotionForm />
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
        <PromotionTable promotions={filteredPromotions} />
      </Card>
    </div>
  );
}
