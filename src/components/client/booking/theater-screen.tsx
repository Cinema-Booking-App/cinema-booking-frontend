import React from "react";
import { Monitor } from "lucide-react";

export const TheaterScreen: React.FC = () => {
  return (
    <div className="flex justify-center">
      <div className="bg-gradient-to-r from-muted to-muted/50 text-muted-foreground text-center py-2 sm:py-3 px-4 sm:px-8 rounded-t-lg w-full sm:w-96 border">
        <Monitor className="w-6 h-6 mx-auto mb-1" />
        <span className="font-medium text-xs sm:text-base">MÀN HÌNH</span>
      </div>
    </div>
  );
};