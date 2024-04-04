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
