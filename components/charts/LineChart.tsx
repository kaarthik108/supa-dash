"use client";
import { LineChart } from "@tremor/react";
import React from "react";

interface ChartData {
  Month: string;
  Value: number;
}

interface LineChartHeroProps {
  chartData: ChartData[];
  title: string;
}

export function LineChartHero({ chartData, title }: LineChartHeroProps) {
  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
    }).format(value);

  if (title === "Subscriptions Over Time") {
    return (
      <LineChart
        className="h-80"
        data={chartData.map((item) => ({ ...item, [title]: item.Value }))}
        index="Month"
        categories={[title]}
        colors={["indigo"]}
        yAxisWidth={60}
        valueFormatter={(value) => formatNumber(value)}
      />
    );
  }

  return (
    <LineChart
      className="h-80"
      data={chartData.map((item) => ({ ...item, [title]: item.Value }))}
      index="Month"
      categories={[title]}
      colors={["indigo"]}
      yAxisWidth={60}
      valueFormatter={(value) => `${value.toFixed(2)}%`}
    />
  );
}
