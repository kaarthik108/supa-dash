// BarListChart.tsx
"use client";
import { BarList } from "@tremor/react";

type BarListContentData = {
  name: string;
  value: number;
};

type BarListChartProps = {
  data: BarListContentData[];
};

export function BarListChart({ data }: BarListChartProps) {
  return (
    <div className="mt-2">
      <BarList data={data} />
    </div>
  );
}
