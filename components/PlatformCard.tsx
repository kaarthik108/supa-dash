import { fetchPlatformData } from "@/app/actions";
import React, { cache } from "react";
import { PlatformTable } from "./charts/TableChart";

// const getData = cache(async (month: string) => {
//   const data = await fetchPlatformData(month);
//   return data;
// });

export async function PlatformCard({ month }: { month: string }) {
  const platformData = await fetchPlatformData(month);

  return (
    <div className="h-full overflow-x-auto custom-scrollbar pt-2">
      <PlatformTable data={platformData} />
    </div>
  );
}
