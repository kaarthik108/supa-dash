import { fetchAudienceData } from "@/app/actions";
import { SearchParams } from "@/app/dashboard/page";
import { Suspense, cache } from "react";
import { BarListChart } from "../charts/BarListChart";
import { Card, CardContent, CardHeader } from "../ui/card";

type BarListContentData = {
  name: string;
  value: number;
};

const AudienceCache = cache(
  async (
    month: string,
    audience: string | null,
    contentType: string | null,
    satisfaction: string | null
  ) => {
    const AudienceData = await fetchAudienceData(
      month,
      audience,
      contentType,
      satisfaction
    );
    return AudienceData;
  }
);

export async function AudienceCard({
  month,
  audience,
  contentType,
  satisfaction,
}: SearchParams) {
  const AudienceData = await AudienceCache(
    month,
    audience || null,
    contentType || null,
    satisfaction || null
  );
  AudienceData.sort((a, b) => b.value - a.value);

  return (
    <Card
      className="mx-auto overflow-x-auto custom-scrollbar animate-fade-up w-full h-72 shadow-md"
      style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
    >
      <CardHeader className="text-tremor-title text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
        Audience
        <p className="mt-4 text-tremor-default flex items-center justify-between text-tremor-content dark:text-dark-tremor-content">
          <span>Audience Type</span>
          <span>Revenue</span>
        </p>
      </CardHeader>
      <CardContent className="overflow-x-auto w-full">
        <BarListChart
          data={AudienceData as BarListContentData[]}
          filterType="audience"
        />
      </CardContent>
    </Card>
  );
}
