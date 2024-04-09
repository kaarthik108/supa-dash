"use client";

import { DonutChart, Legend } from "@tremor/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type DonutChartComponentProps = {
  data: {
    name: string;
    value: number;
  }[];
  variant: "donut" | "pie";
  filterType?: "location" | "age";
  selectedFilter?: string | null;
};

const dataFormatter = (number: number) =>
  `${Intl.NumberFormat("us").format(number)}`;

export const DonutChartComponent = ({
  data,
  variant,
  filterType,
  selectedFilter,
}: DonutChartComponentProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clickedData, setClickedData] = useState<{
    name: string;
    value: number;
  } | null>(null);
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  useEffect(() => {
    const currentFilter = searchParams.get(filterType || "");
    if (currentFilter) {
      const clicked = data.find((item) => item.name === currentFilter);
      setClickedData(clicked || null);
    } else {
      setClickedData(null);
    }
  }, [searchParams, data, filterType]);

  const handleClick = useCallback(
    (payload: { name: string; value: number } | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (payload) {
        if (clickedData && clickedData.name === payload.name) {
          params.delete(filterType || "");
          setClickedData(null);
        } else {
          params.set(filterType || "", payload.name);
          setClickedData(payload);
        }
      } else {
        params.delete(filterType || "");
        setClickedData(null);
      }
      router.push(`/dashboard?${params.toString()}`, { scroll: false });
      router.refresh();
    },
    [router, searchParams, clickedData, filterType]
  );

  return (
    <div className="flex flex-col items-center justify-between w-full h-full">
      <DonutChart
        data={data}
        variant={variant}
        valueFormatter={dataFormatter}
        label={variant === "donut" ? `${totalValue} subs` : undefined}
        className="text-tremor-content dark:text-dark-tremor-content mt-4 h-48"
        onValueChange={handleClick}
        colors={[
          "teal-700",
          "teal-600",
          "teal-500",
          "teal-400",
          "teal-300",
          "teal-200",
          "teal-100",
        ]}
        showAnimation
      />
      <Legend
        categories={data.map((d) => d.name)}
        className="text-tremor-content dark:text-dark-tremor-content text-xs mt-6 w-full"
        color="text-tremor-content"
        colors={[
          "teal-700",
          "teal-600",
          "teal-500",
          "teal-400",
          "teal-300",
          "teal-200",
          "teal-100",
        ]}
      />
    </div>
  );
};
