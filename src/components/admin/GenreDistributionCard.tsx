import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DonutChart } from "@tremor/react";

interface GenreDistributionCardProps {
  data: any[];
}

const GenreDistributionCard: React.FC<GenreDistributionCardProps> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Phân bố thể loại</CardTitle>
      <CardDescription>Tỷ lệ các thể loại phim được yêu thích</CardDescription>
    </CardHeader>
    <CardContent>
      <DonutChart
        className="h-72 mt-4"
        data={data}
        category="value"
        index="name"
        valueFormatter={(value) => `${value}%`}
        colors={["red", "pink", "yellow", "purple", "cyan"]}
      />
    </CardContent>
  </Card>
);

export default GenreDistributionCard;
