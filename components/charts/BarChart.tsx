"use client";
import { BarChart } from "@tremor/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const dataFormatter = (number: number) =>
  Intl.NumberFormat("us").format(number).toString();

export function BarChartComponent({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clickedData, setClickedData] = useState<{
    name: string;
    value: number;
  } | null>(null);

  const transformedData = data.map((item) => ({
    name: item.name,
    Subscribers: item.value,
  }));

  useEffect(() => {
    const currentFilter = searchParams.get("location");
    if (currentFilter) {
      const clicked = data.find((item) => item.name === currentFilter);
      setClickedData(clicked || null);
    } else {
      setClickedData(null);
    }
  }, [searchParams, data]);

  const handleClick = useCallback(
    (payload: { name: string; Subscribers: number } | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (payload) {
        if (clickedData && clickedData.name === payload.name) {
          params.delete("location");
          setClickedData(null);
        } else {
          params.set("location", payload.name);
          setClickedData({ name: payload.name, value: payload.Subscribers });
        }
      } else {
        params.delete("location");
        setClickedData(null);
      }
      router.push(`/dashboard?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, clickedData]
  );

  return (
    <BarChart
      data={transformedData}
      index="name"
      categories={["Subscribers"]}
      colors={["teal-700"]}
      valueFormatter={dataFormatter}
      yAxisWidth={40}
      onValueChange={(payload) =>
        handleClick(
          payload as { name: string; Subscribers: number } | undefined
        )
      }
      autoMinValue
      showAnimation
      showTooltip
      barCategoryGap={20}
    />
  );
}
