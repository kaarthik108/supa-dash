// BarListChart.tsx
"use client";
import { BarList, EventProps } from "@tremor/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type BarListContentData = {
  name: string;
  value: number;
};

type BarListChartProps = {
  data: BarListContentData[];
  filterType: "audience" | "contentType";
};

export function BarListChart({ data, filterType }: BarListChartProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    const currentFilter = searchParams.get(filterType);
    if (currentFilter) {
      const filtered = data.filter((item) => item.name === currentFilter);
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchParams, data, filterType]);

  const handleBarClick = useCallback(
    (payload: BarListContentData) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentFilter = params.get(filterType);
      if (currentFilter === payload.name) {
        params.delete(filterType);
      } else {
        params.set(filterType, payload.name);
      }
      router.push(`/dashboard?${params.toString()}`);
    },
    [router, searchParams, filterType]
  );

  return (
    <div className="mt-2">
      <BarList data={filteredData} onValueChange={handleBarClick} />
    </div>
  );
}
