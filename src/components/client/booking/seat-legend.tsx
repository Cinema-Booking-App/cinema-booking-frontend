import React from "react";
import { Button } from "@/components/ui/button";

interface SeatLegendProps {
  className?: string;
}

export const SeatLegend: React.FC<SeatLegendProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-4 text-sm ${className}`}>
      <div className="flex items-center gap-2">
        <Button variant="default" size="sm" className="w-4 h-4 p-0 bg-gray-800"></Button>
        <span>Đã chọn</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="w-4 h-4 p-0 bg-gray-500"></Button>
        <span>Đã đặt</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="destructive" size="sm" className="w-4 h-4 p-0"></Button>
        <span>VIP</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" className="w-8 h-4 p-0 bg-pink-500"></Button>
        <span>Couple</span>
      </div>
    </div>
  );
};