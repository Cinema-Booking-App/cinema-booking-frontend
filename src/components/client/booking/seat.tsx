import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SeatProps {
  seatId: string;
  seatType: "available" | "selected" | "occupied" | "premium" | "vip" | "couple";
  onClick: (seatId: string) => void;
  isCouple?: boolean;
}

export const Seat: React.FC<SeatProps> = ({ seatId, seatType, onClick, isCouple = false }) => {
  // Xử lý hiển thị cho ghế đôi và ghế đơn
  const displayText = () => {
    if (isCouple) {
      // Với ghế đôi M1-2, hiển thị 1-2
      const parts = seatId.includes('-') ? seatId.split('-') : [seatId];
      if (parts.length === 2) {
        return parts[0].slice(1) + '-' + parts[1]; // M1-2 -> 1-2
      }
      return seatId.slice(1); // fallback
    } else {
      // Với ghế đơn A1, hiển thị 1
      return seatId.slice(1);
    }
  };
  
  let buttonVariant: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link" = "outline";
  let buttonClass = `p-0 text-[8px] xs:text-[10px] sm:text-xs font-medium ${
    isCouple 
      ? "w-10 h-5 xs:w-12 xs:h-6 sm:w-14 sm:h-7 md:w-16 md:h-8" // Ghế đôi rộng hơn
      : "w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"     // Ghế đơn
  } `;
  
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
    case "couple":
      buttonVariant = "secondary";
      buttonClass += "bg-pink-500 text-white hover:bg-pink-600";
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
        {displayText()}
      </Button>
    </Card>
  );
};