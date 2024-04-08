"use client";
import { AreaChart } from "@tremor/react";

type RevenueOverTimeProps = {
  chartData: { month: string; value: number | null }[];
};

export function RevenueOverTime({ chartData }: RevenueOverTimeProps) {
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
    }).format(value);
  };

  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  chartData.sort((a, b) => {
    const aIndex = monthOrder.indexOf(a.month);
    const bIndex = monthOrder.indexOf(b.month);
    return aIndex - bIndex;
  });

  return (
    <div className="flex justify-center">
      <AreaChart
        data={chartData}
        categories={["value"]}
        index="month"
        colors={["blue"]}
        className="h-20 w-72"
        showAnimation
        showXAxis={false}
        showYAxis={false}
        showLegend={false}
        showGridLines={false}
        valueFormatter={formatNumber}
      />
    </div>
  );
}
