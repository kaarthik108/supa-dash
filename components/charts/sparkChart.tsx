"use client";
import { SparkAreaChart } from "@tremor/react";

type RevenueOverTimeProps = {
  chartData: { month: string; revenue: number | null }[];
};

export function RevenueOverTime({ chartData }: RevenueOverTimeProps) {
  return (
    <div className="flex justify-center">
      <SparkAreaChart
        data={chartData}
        categories={["revenue"]}
        index="month"
        colors={["#f0652f"]}
        className="h-24 w-80"
      />
    </div>
  );
}
