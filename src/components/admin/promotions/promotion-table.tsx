import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React from "react";

// Sử dụng type Promotion từ backend
interface Promotion {
  promotion_id: number;
  code: string;
  discount_percentage?: number;
  start_date?: string;
  end_date?: string;
  max_usage?: number;
  used_count?: number;
  description?: string;
  // ... các trường khác nếu có
}

type PromotionTableProps = {
  promotions: Promotion[];
  onEdit?: (promo: Promotion) => void;
  onDelete?: (id: number) => void;
  onActivate?: (id: number) => void;
};

export default function PromotionTable({ promotions, onEdit, onDelete, onActivate }: PromotionTableProps) {
  // Hàm tính trạng thái dựa vào ngày
  const getStatus = (promo: Promotion) => {
    const now = new Date();
    if (promo.start_date && now < new Date(promo.start_date)) return 'Sắp diễn ra';
    if (promo.end_date && now > new Date(promo.end_date)) return 'Đã hết hạn';
    return 'Đang hoạt động';
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[700px] md:min-w-0">
        <TableHeader>
          <TableRow>
            <TableHead>Mô Tả</TableHead>
            <TableHead>Mã khuyến mãi</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Thời gian áp dụng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Số lần sử dụng</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">Không có khuyến mãi phù hợp.</TableCell>
            </TableRow>
          ) : (
            promotions.map((promo) => (
              <TableRow key={promo.promotion_id}>
                <TableCell>{promo.description || '-'}</TableCell>
                <TableCell>{promo.code || '-'}</TableCell>
                <TableCell>
                  {promo.discount_percentage ? `Giảm ${promo.discount_percentage}%` : '-'}
                </TableCell>
                <TableCell>
                  {promo.start_date && promo.end_date ? `${promo.start_date} - ${promo.end_date}` : '-'}
                </TableCell>
                <TableCell>{getStatus(promo)}</TableCell>
                <TableCell>
                  {promo.used_count ?? 0}/{promo.max_usage ?? '-'}
                </TableCell>
                <TableCell className="flex gap-2 flex-wrap md:flex-nowrap">
                  <Button size="sm" variant="outline" type="button" onClick={() => onEdit?.(promo)}>Sửa</Button>
                  <Button size="sm" variant="destructive" type="button" onClick={() => onDelete?.(promo.promotion_id)}>Xóa</Button>
                  <Button size="sm" variant="secondary" type="button" onClick={() => onActivate?.(promo.promotion_id)}>Kích hoạt</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 