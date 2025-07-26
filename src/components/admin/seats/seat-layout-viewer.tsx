import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import React from "react";

type Layout = {
  layout_id: number;
  layout_name: string;
  theater_type: string;
  total_rows: number;
  total_columns: number;
  aisle_positions: number[];
  normal_rows?: number;
  vip_rows?: number;
  couple_rows?: number;
};

export function SeatLayoutDialog({ layout, onClose }: { layout: Layout; onClose: () => void }) {
  const { total_rows, total_columns } = layout;
  const normalRows = Math.floor(total_rows * 0.5);
  const vipRows = Math.floor(total_rows * 0.3);
  const coupleRows = total_rows - normalRows - vipRows;
  const rowTypes = Array.from({ length: total_rows }, (_, i) => {
    if (i < normalRows) return "Standard";
    if (i < normalRows + vipRows) return "VIP";
    return "Couple";
  });
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-fit">
        <DialogTitle className="sr-only">Sơ đồ ghế: {layout.layout_name}</DialogTitle>
        <Card className="shadow-none border-none">
          <CardHeader>
            <CardTitle>
              Sơ đồ ghế: {layout.layout_name}
              <Button variant="outline" size="sm" className="ml-4" onClick={onClose}>
                Đóng
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-sm text-muted-foreground">
              <span>Hàng: {layout.total_rows} | Cột: {layout.total_columns} | Lối đi: {layout.aisle_positions?.join(", ")}</span>
            </div>
            <Separator className="mb-4" />
            {/* Màn hình rạp */}
            <div className="flex justify-center mb-4">
              <div
                className="bg-gray-800 rounded-b-2xl rounded-t-lg text-white font-bold text-sm flex items-center justify-center shadow-lg"
                style={{ width: Math.max(180, total_columns * 32), height: 32, letterSpacing: 2 }}
              >
                MÀN HÌNH
              </div>
            </div>
            <div
              className="inline-block border rounded-lg p-4 bg-muted"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
            >
              <div
                className="grid gap-1"
                style={{
                  gridTemplateRows: `repeat(${total_rows}, 32px)`,
                  gridTemplateColumns: `repeat(${total_columns}, 32px)`
                }}
              >
                {Array.from({ length: total_rows }).map((_, rowIdx) => {
                  const rowType = rowTypes[rowIdx];
                  let skipCol = 0;
                  return Array.from({ length: total_columns }).map((_, colIdx) => {
                    if (skipCol > 0) {
                      skipCol--;
                      return null;
                    }
                    const row = rowIdx + 1;
                    const col = colIdx + 1;
                    if (layout.aisle_positions && layout.aisle_positions.includes(row)) {
                      return (
                        <div
                          key={`aisle-${row}-${col}`}
                          className="bg-transparent"
                          style={{ width: 32, height: 32 }}
                        />
                      );
                    }
                    if (rowType === "Couple" && colIdx < total_columns) {
                      if (colIdx === total_columns - 1) {
                        return (
                          <Button
                            key={`seat-couple-last-${row}-${col}`}
                            size="icon"
                            className="rounded bg-pink-400 text-white border shadow-sm"
                            style={{ width: 32, height: 32, fontSize: 12, padding: 0 }}
                          >
                            {String.fromCharCode(64 + row)}{col}
                          </Button>
                        );
                      }
                      skipCol = 1;
                      return (
                        <Button
                          key={`seat-couple-${row}-${col}`}
                          size="icon"
                          className="rounded bg-pink-400 text-white border shadow-sm"
                          style={{ width: 66, height: 32, fontSize: 12, padding: 0, gridColumn: 'span 2' }}
                        >
                          {String.fromCharCode(64 + row)}{col}-{col + 1}
                        </Button>
                      );
                    }
                    if (rowType === "VIP") {
                      return (
                        <Button
                          key={`seat-vip-${row}-${col}`}
                          size="icon"
                          className="rounded bg-yellow-400 text-black border shadow-sm"
                          style={{ width: 32, height: 32, fontSize: 12, padding: 0 }}
                        >
                          {String.fromCharCode(64 + row)}{col}
                        </Button>
                      );
                    }
                    return (
                      <Button
                        key={`seat-standard-${row}-${col}`}
                        size="icon"
                        className="rounded bg-white text-black border shadow-sm"
                        style={{ width: 32, height: 32, fontSize: 12, padding: 0 }}
                      >
                        {String.fromCharCode(64 + row)}{col}
                      </Button>
                    );
                  });
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
} 