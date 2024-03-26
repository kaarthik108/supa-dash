import { fetchAudienceData } from "@/app/actions";
import { SearchParams } from "@/app/dashboard/page";
import { Card } from "@tremor/react";
import { Suspense } from "react";
import { BarListChart } from "./charts/BarListChart";

type BarListContentData = {
  name: string;
  value: number;
};

export async function AudienceCard({
  month,
  audience,
  contentType,
}: SearchParams) {
  const AudienceData = await fetchAudienceData(month, audience, contentType);
  AudienceData.sort((a, b) => b.value - a.value);

  return (
    <Card className="mx-auto h-full overflow-x-auto custom-scrollbar">
      <h3 className="text-tremor-title text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
        Audience
      </h3>
      <p className="mt-4 text-tremor-default flex items-center justify-between text-tremor-content dark:text-dark-tremor-content">
        <span>Audience Type</span>
        <span>Revenue</span>
      </p>
      <Suspense fallback={<div>Loading...</div>}>
        <BarListChart
          data={AudienceData as BarListContentData[]}
          filterType="audience"
        />
      </Suspense>
    </Card>
  );
}
