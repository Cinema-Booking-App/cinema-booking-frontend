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
        valueFormatter={(value) => `${value}`}
        yAxisWidth={40}
      />
    </CardContent>
  </Card>
);

export default RevenueChartCard;
