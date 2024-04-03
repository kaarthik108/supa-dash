import { fetchPlatformData } from "@/app/actions";
import { SearchParams } from "@/app/dashboard/page";
import React, { cache } from "react";
import { PlatformTable } from "./charts/TableChart";
import { Card, CardContent } from "./ui/card";

// const getData = cache(async (month: string) => {
//   const data = await fetchPlatformData(month);
//   return data;
// });

export async function PlatformCard({
  month,
  audience,
  contentType,
  satisfaction,
}: SearchParams) {
  const platformData = await fetchPlatformData(
    month,
    audience,
    contentType,
    satisfaction
  );
  return (
    <Card
      className="h-72 overflow-x-auto custom-scrollbar pt-2 animate-fade-right"
      style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
    >
      <CardContent className="h-full overflow-x-auto custom-scrollbar pl-0">
        <PlatformTable data={platformData} />
      </CardContent>
    </Card>
  );
}
