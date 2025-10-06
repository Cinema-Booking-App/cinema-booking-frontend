import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SeatProps {
  seatId: string;
  seatType: "available" | "selected" | "occupied" | "premium" | "vip";
  onClick: (seatId: string) => void;
}

export const Seat: React.FC<SeatProps> = ({ seatId, seatType, onClick }) => {
  const seatNumber = seatId.slice(1); // Lấy số từ seatId (A1 -> 1)
  
  let buttonVariant: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link" = "outline";
  let buttonClass = "w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 p-0 text-[8px] xs:text-[10px] sm:text-xs font-medium ";
  
  switch (seatType) {
    case "occupied":
      buttonVariant = "ghost";
      buttonClass += "bg-gray-500 text-white cursor-not-allowed";
      break;
    case "selected":
      buttonVariant = "default";
      buttonClass += "bg-gray-800 text-white hover:bg-gray-900";
      break;
    case "premium":
      buttonVariant = "secondary";
      buttonClass += "bg-purple-500 text-white hover:bg-purple-600";
      break;
    case "vip":
      buttonVariant = "destructive";
      buttonClass += "bg-red-500 text-white hover:bg-red-600";
      break;
    default:
      buttonVariant = "outline";
      buttonClass += "hover:bg-accent hover:text-accent-foreground";
  }
  
  return (
    <Card className="shadow-none border-none p-0">
      <Button
        variant={buttonVariant}
        size="sm"
        onClick={() => onClick(seatId)}
        disabled={seatType === "occupied"}
        className={buttonClass}
        title={`Ghế ${seatId}`}
      >
        {seatNumber}
      </Button>
    </Card>
  );
};