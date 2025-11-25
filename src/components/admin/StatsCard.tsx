import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ElementType;
  description: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, changeType, icon: Icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
        {changeType === "positive" ? (
          <ArrowUpRight className="h-3 w-3 text-green-600" />
        ) : (
          <ArrowDownRight className="h-3 w-3 text-red-600" />
        )}
        <span className={changeType === "positive" ? "text-green-600" : "text-red-600"}>{change}</span>
        <span>{description}</span>
      </div>
    </CardContent>
  </Card>
);

export default StatsCard;
