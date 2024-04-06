import { fetchPlatformData } from "@/app/actions";
import { SearchParams } from "@/app/dashboard/page";
import React, { cache } from "react";
import { PlatformTable } from "../charts/TableChart";
import { Card, CardContent } from "../ui/card";

const PlatformCache = cache(
  async (
    month: string,
    audience: string | null,
    contentType: string | null,
    satisfaction: string | null,
    location: string | null,
    age: string | null
  ) => {
    const platformData = await fetchPlatformData(
      month,
      audience,
      contentType,
      satisfaction,
      location,
      age
    );
    return platformData;
  }
);

export async function PlatformCard({
  month,
  audience,
  contentType,
  satisfaction,
  location,
  age,
}: SearchParams) {
  const platformData = await PlatformCache(
    month,
    audience || null,
    contentType || null,
    satisfaction || null,
    location || null,
    age || null
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
