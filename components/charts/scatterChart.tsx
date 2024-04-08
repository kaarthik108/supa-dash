"use client";
import { ScatterChart } from "@tremor/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export type EngagementData = {
  satisfaction: string;
  engagementRate: number;
  subscribers: number;
  viewingTime: number;
};

type EngagementScatterChartProps = {
  data: EngagementData[];
};

const satisfactionColors: Record<string, string> = {
  "Very Unsatisfied": "teal-800",
  Unsatisfied: "teal-600",
  Satisfied: "teal-400",
  Neutral: "teal-200",
  "Very Satisfied": "teal-100",
};

export function EngagementScatterChart({ data }: EngagementScatterChartProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clickedData, setClickedData] = useState<EngagementData | null>(null);
  useEffect(() => {
    const currentFilter = searchParams.get("satisfaction");
    if (currentFilter) {
      const clicked = data.find((item) => item.satisfaction === currentFilter);
      setClickedData(clicked || null);
    } else {
      setClickedData(null);
    }
  }, [searchParams, data]);

  const handleClick = useCallback(
    (payload: EngagementData | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (payload) {
        if (clickedData && clickedData.satisfaction === payload.satisfaction) {
          params.delete("satisfaction");
          setClickedData(null);
        } else {
          params.set("satisfaction", payload.satisfaction);
          setClickedData(payload);
        }
      } else {
        params.delete("satisfaction");
        setClickedData(null);
      }
      router.push(`/dashboard?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, clickedData]
  );

  return (
    <ScatterChart
      className="mt-6 h-96"
      yAxisWidth={30}
      data={data}
      category="satisfaction"
      x="engagementRate"
      y="subscribers"
      size="viewingTime"
      autoMinXValue
      autoMinYValue
      showAnimation
      showOpacity={true}
      valueFormatter={{
        x: (rate) => `${rate.toFixed(2)}%`,
        y: (count) => `${count} subs`,
        size: (time) => `${time.toFixed(2)} secs`,
      }}
      enableLegendSlider
      onValueChange={(payload) => handleClick(payload as EngagementData | null)}
      colors={data.map((item) => satisfactionColors[item.satisfaction])}
    />
  );
}
