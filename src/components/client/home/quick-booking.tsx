"use client";
import { Button } from "@/components/ui/button";

export function QuickBooking() {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 justify-center items-stretch sm:items-center bg-muted p-4 sm:p-5 lg:p-6 rounded-lg shadow-lg max-w-5xl mx-auto">
      <select className="px-3 py-2 sm:px-4 sm:py-3 rounded-md sm:rounded-lg border-2 border-border bg-background text-foreground min-w-0 sm:min-w-[140px] h-10 sm:h-12 text-sm sm:text-base flex-1 sm:flex-none">
        <option>Chọn phim</option>
        <option>Avengers: Endgame</option>
        <option>Spider-Man</option>
      </select>
      <select className="px-3 py-2 sm:px-4 sm:py-3 rounded-md sm:rounded-lg border-2 border-border bg-background text-foreground min-w-0 sm:min-w-[120px] h-10 sm:h-12 text-sm sm:text-base flex-1 sm:flex-none">
        <option>Chọn rạp</option>
        <option>CGV Vincom</option>
        <option>Lotte Cinema</option>
      </select>
      <select className="px-3 py-2 sm:px-4 sm:py-3 rounded-md sm:rounded-lg border-2 border-border bg-background text-foreground min-w-0 sm:min-w-[110px] h-10 sm:h-12 text-sm sm:text-base flex-1 sm:flex-none">
        <option>Chọn ngày</option>
        <option>Hôm nay</option>
        <option>Mai</option>
      </select>
      <select className="px-3 py-2 sm:px-4 sm:py-3 rounded-md sm:rounded-lg border-2 border-border bg-background text-foreground min-w-0 sm:min-w-[110px] h-10 sm:h-12 text-sm sm:text-base flex-1 sm:flex-none">
        <option>Chọn suất</option>
        <option>9:00</option>
        <option>14:30</option>
        <option>19:00</option>
      </select>
      <Button variant="default" size="sm" className="min-w-0 sm:min-w-[110px] h-10 sm:h-12 sm:size-lg font-bold px-4 sm:px-6 text-sm sm:text-base">
        <span className="sm:hidden">ĐẶT</span>
        <span className="hidden sm:inline">ĐẶT NGAY</span>
      </Button>
    </div>
  );
}