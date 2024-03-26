import { fetchPlatformData } from "@/app/actions";
import { SearchParams } from "@/app/dashboard/page";
import React, { cache } from "react";
import { PlatformTable } from "./charts/TableChart";

// const getData = cache(async (month: string) => {
//   const data = await fetchPlatformData(month);
//   return data;
// });

export async function PlatformCard({
  month,
  audience,
  contentType,
}: SearchParams) {
  const platformData = await fetchPlatformData(month, audience, contentType);

  return (
    <div
      className="h-full overflow-x-auto custom-scrollbar pt-2 animate-fade-right"
      style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
    >
      <PlatformTable data={platformData} />
    </div>
  );
}
