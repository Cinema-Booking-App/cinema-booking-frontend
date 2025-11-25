import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";

const QuickStatsCard: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Thống kê nhanh</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Tỷ lệ lấp đầy</span>
          <span className="font-medium">78%</span>
        </div>
        <Progress value={78} className="h-2" />
      </div>
      <Separator />
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Đánh giá trung bình</span>
          <span className="font-medium">4.6/5</span>
        </div>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">12</div>
          <div className="text-xs text-muted-foreground">Phim đang chiếu</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">8</div>
          <div className="text-xs text-muted-foreground">Suất chiếu hôm nay</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default QuickStatsCard;
