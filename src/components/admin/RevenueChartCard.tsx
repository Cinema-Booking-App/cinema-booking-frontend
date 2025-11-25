import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AreaChart } from "@tremor/react";

interface RevenueChartCardProps {
  data: any[];
}

const RevenueChartCard: React.FC<RevenueChartCardProps> = ({ data }) => (
  <Card className="lg:col-span-2">
    <CardHeader>
      <CardTitle>Doanh thu theo tháng</CardTitle>
      <CardDescription>Biểu đồ doanh thu và số vé bán trong năm 2024</CardDescription>
    </CardHeader>
    <CardContent>
      <AreaChart
        className="h-72 mt-4"
        data={data}
        index="month"
        categories={["Doanh thu", "Số vé"]}
        colors={["blue", "green"]}
        valueFormatter={(value) => {
          if (typeof value === "number") {
            if (value >= 1000000) {
              // Hiển thị theo triệu
              return `₫${(value / 1000000).toFixed(1).replace(/\.0$/, "")}tr`;
            }
            if (value >= 1000) {
              // Hiển thị theo nghìn
              return `₫${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
            }
            return `₫${value}`;
          }
          return value;
        }}
        yAxisWidth={56}
        curveType="natural" // hoặc "monotone"
      />
    </CardContent>
  </Card>
);

export default RevenueChartCard;
