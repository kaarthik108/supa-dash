"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BarList } from "./rawBarList";

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
      router.push(`/dashboard?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, filterType]
  );
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
    }).format(value);
  };
  return (
    <div className="mt-2">
      <BarList
        data={filteredData}
        // color="blue"
        showAnimation
        onValueChange={handleBarClick}
        valueFormatter={formatNumber}
      />
    </div>
  );
}
