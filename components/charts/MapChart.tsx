"use client";
import { ResponsiveChoropleth } from "@nivo/geo";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import countries from "./world_countries.json";

type MapChartProps = {
  data: { id: string; value: number }[];
};

export function MapChart({ data }: MapChartProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = useCallback(
    (feature: any) => {
      const location = feature.id;
      const params = new URLSearchParams(searchParams.toString());
      const currentLocation = params.get("location");

      if (currentLocation === location) {
        params.delete("location");
      } else {
        params.set("location", location);
      }

      router.push(`/dashboard?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <ResponsiveChoropleth
      data={data}
      features={countries.features}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      colors="nivo"
      domain={[0, Math.max(...data.map((item) => item.value))]}
      unknownColor="#ffffff"
      label="properties.name"
      valueFormat=".2s"
      projectionScale={147}
      projectionTranslation={[0.5, 0.6]}
      projectionRotation={[0, 0, 0]}
      borderWidth={0.5}
      borderColor="#fff"
      onClick={handleClick}
    />
  );
}
