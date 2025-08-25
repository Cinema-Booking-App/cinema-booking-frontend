import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { Promotion } from "@/types/promotions";

type PromotionTableProps = {
  promotions: Promotion[];
  onEdit?: (promo: Promotion) => void;
  onDelete?: (id: number) => void;
  onToggleStatus?: (id: number, is_active: boolean) => void;
};

export default function PromotionTable({ promotions, onEdit, onDelete, onToggleStatus }: PromotionTableProps) {
  // Function to calculate status based on dates and active state
  const getStatus = (promo: Promotion) => {
    if (!promo.is_active) {
      return { text: 'Không hoạt động', variant: 'secondary' as const, className: 'bg-gray-100 text-gray-700' };
    }
    
    const now = new Date();
    const startDate = new Date(promo.start_date);
    const endDate = new Date(promo.end_date);
    
    if (now < startDate) {
      return { text: 'Sắp diễn ra', variant: 'default' as const, className: 'bg-blue-100 text-blue-700' };
    } else if (now > endDate) {
      return { text: 'Đã hết hạn', variant: 'destructive' as const, className: 'bg-red-100 text-red-700' };
    } else {
      return { text: 'Đang hoạt động', variant: 'default' as const, className: 'bg-green-100 text-green-700' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (promotions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">Không có khuyến mãi nào</div>
        <div className="text-gray-400 text-sm">Hãy tạo khuyến mãi đầu tiên để bắt đầu</div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[1000px] md:min-w-0">
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="font-semibold text-gray-700 w-[120px]">Mã khuyến mãi</TableHead>
            <TableHead className="font-semibold text-gray-700 w-[300px]">Mô tả</TableHead>
            <TableHead className="font-semibold text-gray-700 w-[100px]">Giảm giá</TableHead>
            <TableHead className="font-semibold text-gray-700 w-[150px]">Thời gian áp dụng</TableHead>
            <TableHead className="font-semibold text-gray-700 w-[120px]">Trạng thái</TableHead>
            <TableHead className="font-semibold text-gray-700 w-[120px]">Số lần sử dụng</TableHead>
            <TableHead className="font-semibold text-gray-700 text-center w-[200px]">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((promo) => {
            const status = getStatus(promo);
            return (
              <TableRow key={promo.promotion_id} className="hover:bg-gray-50 border-b">
                <TableCell className="py-4">
                  <div className="font-mono font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-md inline-block">
                    {promo.code}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {promo.description ? (
                      <div className="break-words">
                        {promo.description}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Không có mô tả</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                      {promo.discount_percentage}%
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Từ:</span>
                      <span className="font-medium">{formatDate(promo.start_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Đến:</span>
                      <span className="font-medium">{formatDate(promo.end_date)}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge className={`${status.className} font-medium px-3 py-1`}>
                    {status.text}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Đã dùng:</span>
                      <span className="font-semibold text-blue-600">{promo.used_count}</span>
                    </div>
                    {promo.max_usage && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Giới hạn:</span>
                        <span className="font-semibold text-gray-700">{promo.max_usage}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex gap-2 justify-center">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onEdit?.(promo)}
                      className="h-8 px-3 text-xs"
                    >
                      Sửa
                    </Button>
                    <Button 
                      size="sm" 
                      variant={promo.is_active ? "secondary" : "default"}
                      onClick={() => onToggleStatus?.(promo.promotion_id, !promo.is_active)}
                      className="h-8 px-3 text-xs"
                    >
                      {promo.is_active ? 'Tắt' : 'Bật'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => onDelete?.(promo.promotion_id)}
                      className="h-8 px-3 text-xs"
                    >
                      Xóa
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
} 