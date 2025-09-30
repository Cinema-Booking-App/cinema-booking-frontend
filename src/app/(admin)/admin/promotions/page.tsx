"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, Plus, Filter } from "lucide-react";
import PromotionTable from "@/components/admin/promotions/promotion-table";
import PromotionForm from "@/components/admin/promotions/promotion-form";
import {
  useGetAllPromotionsQuery,
  useDeletePromotionMutation,
  useTogglePromotionStatusMutation,
} from "@/store/slices/promotions/promotionsApi";
import { toast } from "sonner";
import { Promotion } from "@/types/promotions";

export default function PromotionsPage() {
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editPromotion, setEditPromotion] = useState<Promotion | null>(null);
  
  const [deletePromotion] = useDeletePromotionMutation();
  const [toggleStatus] = useTogglePromotionStatusMutation();

  // API hooks
  const { data:promotions, isLoading, isError } = useGetAllPromotionsQuery({});
    
  // Filter data based on search
  const filteredPromotions = promotions?.filter((promo) => {
    const matchSearch =
      (promo.code && promo.code.toLowerCase().includes(search.toLowerCase())) ||
      (promo.description && promo.description.toLowerCase().includes(search.toLowerCase()));
    return matchSearch;
  });

  const handleDelete = async (id: number) => {
    try {
      await deletePromotion(id).unwrap();
      toast.success("Xóa khuyến mãi thành công!");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error ) {
      toast.error("Có lỗi xảy ra khi xóa khuyến mãi");
    }
  };

  const handleToggleStatus = async (id: number, is_active: boolean) => {
    try {
      await toggleStatus({ id, is_active }).unwrap();
      toast.success(`Khuyến mãi đã được ${is_active ? 'kích hoạt' : 'tắt'} thành công!`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thay đổi trạng thái khuyến mãi");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <div className="text-lg font-medium mb-2">Có lỗi xảy ra</div>
              <div className="text-sm">Không thể tải dữ liệu khuyến mãi</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý khuyến mãi</h1>
          <p className="text-gray-600 mt-1">Quản lý các chương trình khuyến mãi và mã giảm giá</p>
        </div>
        <Sheet open={openForm} onOpenChange={setOpenForm}>
          <SheetTrigger asChild>
            <Button 
              onClick={() => { setEditPromotion(null); setOpenForm(true); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm khuyến mãi
            </Button>
          </SheetTrigger>
          <PromotionForm onOpenChange={setOpenForm} editPromotion={editPromotion} />
        </Sheet>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng khuyến mãi</p>
                <p className="text-2xl font-bold text-gray-900">{promotions?.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600">
                  {promotions?.filter(p => p.is_active).length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="w-6 h-6 bg-green-600 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sắp diễn ra</p>
                <p className="text-2xl font-bold text-blue-600">
                  {promotions?.filter(p => {
                    const now = new Date();
                    const startDate = new Date(p.start_date);
                    return p.is_active && now < startDate;
                  }).length}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã hết hạn</p>
                <p className="text-2xl font-bold text-red-600">
                  {promotions?.filter(p => {
                    const now = new Date();
                    const endDate = new Date(p.end_date);
                    return now > endDate;
                  }).length}
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <div className="w-6 h-6 bg-red-600 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Tìm kiếm và lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[300px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm khuyến mãi
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm theo mã hoặc mô tả khuyến mãi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách khuyến mãi</CardTitle>
        </CardHeader>
        <CardContent>
          <PromotionTable
            promotions={filteredPromotions}
            onEdit={(promo) => {
              setEditPromotion(promo);
              setOpenForm(true);
            }}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        </CardContent>
      </Card>
    </div>
  );
}

