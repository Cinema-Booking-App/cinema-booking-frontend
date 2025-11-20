import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Ticket, CheckCircle, Printer, User, Undo2 } from "lucide-react";

interface StatsCardsProps {
  stats: {
    total: number;
    paid: number;
    printed: number;
    received: number;
    refunded: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-6">
    <Card className="bg-blue-50 dark:bg-blue-900/30">
      <CardContent className="p-3 flex flex-col items-center">
        <Ticket className="w-6 h-6 text-blue-500 mb-1" />
        <span className="font-bold text-lg">{stats.total}</span>
        <span className="text-xs text-muted-foreground">Tổng vé hôm nay</span>
      </CardContent>
    </Card>
    <Card className="bg-green-50 dark:bg-green-900/30">
      <CardContent className="p-3 flex flex-col items-center">
        <CheckCircle className="w-6 h-6 text-green-500 mb-1" />
        <span className="font-bold text-lg">{stats.paid}</span>
        <span className="text-xs text-muted-foreground">Đã thanh toán</span>
      </CardContent>
    </Card>
    <Card className="bg-yellow-50 dark:bg-yellow-900/30">
      <CardContent className="p-3 flex flex-col items-center">
        <Printer className="w-6 h-6 text-yellow-500 mb-1" />
        <span className="font-bold text-lg">{stats.printed}</span>
        <span className="text-xs text-muted-foreground">Đã in vé</span>
      </CardContent>
    </Card>
    <Card className="bg-purple-50 dark:bg-purple-900/30">
      <CardContent className="p-3 flex flex-col items-center">
        <User className="w-6 h-6 text-purple-500 mb-1" />
        <span className="font-bold text-lg">{stats.received}</span>
        <span className="text-xs text-muted-foreground">Đã nhận vé</span>
      </CardContent>
    </Card>
    <Card className="bg-red-50 dark:bg-red-900/30">
      <CardContent className="p-3 flex flex-col items-center">
        <Undo2 className="w-6 h-6 text-red-500 mb-1" />
        <span className="font-bold text-lg">{stats.refunded}</span>
        <span className="text-xs text-muted-foreground">Đã hoàn/hủy</span>
      </CardContent>
    </Card>
  </div>
);

export default StatsCards;
