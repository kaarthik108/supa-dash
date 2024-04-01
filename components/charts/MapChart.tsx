"use client";
import { ResponsiveChoropleth } from "@nivo/geo";
import countries from "./world_countries.json";

type MapChartProps = {
  data: { id: string; value: number }[];
};

export function MapChart({ data }: MapChartProps) {
  return (
    <ResponsiveChoropleth
      data={data}
      features={countries.features}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      colors="nivo"
      domain={[0, Math.max(...data.map((item) => item.value))]}
      unknownColor="#666666"
      label="properties.name"
      valueFormat=".2s"
      projectionScale={100}
      projectionTranslation={[0.5, 0.5]}
      projectionRotation={[0, 0, 0]}
      borderWidth={0.5}
      borderColor="#152538"
    />
  );
}
