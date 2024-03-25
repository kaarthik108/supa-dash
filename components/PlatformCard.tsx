import { fetchPlatformData } from "@/app/actions";
import React, { cache } from "react";
import { PlatformTable } from "./charts/TableChart";

const getData = cache(async () => {
  const data = await fetchPlatformData();
  return data;
});

export async function PlatformCard() {
  const platformData = await getData();
  console.log(platformData);

  return (
    <div className="h-full overflow-x-auto custom-scrollbar pt-2">
      <PlatformTable data={platformData} />
    </div>
  );
}
