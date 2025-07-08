import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React from "react";

type Promotion = {
  id: number;
  name: string;
  code: string;
  type: string;
  value: number | string | null;
  valueType: string | null;
  startDate: string;
  endDate: string;
  status: string;
  used: number;
  usageLimit: number | string | null;
  enabled?: boolean;
};

export default function PromotionTable({ promotions }: { promotions: Promotion[] }) {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[700px] md:min-w-0">
        <TableHeader>
          <TableRow>
            <TableHead>Tên khuyến mãi</TableHead>
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
              <TableRow key={promo.id}>
                <TableCell>{promo.name}</TableCell>
                <TableCell>{promo.code}</TableCell>
                <TableCell>
                  {promo.type}
                  {promo.value ? ` (${promo.value}${promo.valueType || ""})` : ""}
                </TableCell>
                <TableCell>
                  {promo.startDate} - {promo.endDate}
                </TableCell>
                <TableCell>{promo.status}</TableCell>
                <TableCell>
                  {promo.used}
                  {promo.usageLimit ? `/${promo.usageLimit}` : ""}
                </TableCell>
                <TableCell className="flex gap-2 flex-wrap md:flex-nowrap">
                  <Button size="sm" variant="outline" type="button">Sửa</Button>
                  <Button size="sm" variant="destructive" type="button">Xóa</Button>
                  <Button size="sm" variant="secondary" type="button">Kích hoạt</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 