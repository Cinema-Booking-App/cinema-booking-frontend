import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart } from "@tremor/react";

interface DailyBookingsChartCardProps {
  data: any[];
}

const DailyBookingsChartCard: React.FC<DailyBookingsChartCardProps> = ({ data }) => (
  <Card className="lg:col-span-3">
    <CardHeader>
      <CardTitle>Đặt vé theo ngày trong tuần</CardTitle>
      <CardDescription>Số lượng đặt vé và doanh thu theo từng ngày</CardDescription>
    </CardHeader>
    <CardContent>
      <BarChart
        className="h-72 mt-4"
        data={data}
        index="day"
        categories={["Số đặt vé", "Doanh thu"]}
        colors={["red-500", "green-500"]}
        valueFormatter={(value) => `${value}`}
        yAxisWidth={40}
      />
    </CardContent>
  </Card>
);

export default DailyBookingsChartCard;
