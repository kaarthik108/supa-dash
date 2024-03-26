import { fetchContentData } from "@/app/actions";
import { SearchParams } from "@/app/dashboard/page";
import { Card } from "@tremor/react";
import { Suspense } from "react";
import { BarListChart } from "./charts/BarListChart";

type BarListContentData = {
  name: string;
  value: number;
};

export async function ContentCard({
  month,
  audience,
  contentType,
}: SearchParams) {
  const contentData = await fetchContentData(month, audience, contentType);
  contentData.sort((a, b) => b.value - a.value);

  return (
    <Card
      className="mx-auto h-full overflow-x-auto custom-scrollbar animate-fade-up"
      style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
    >
      <h3 className="text-tremor-title text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
        Content
      </h3>
      <p className="mt-4 text-tremor-default flex items-center justify-between text-tremor-content dark:text-dark-tremor-content">
        <span>Content Type</span>
        <span>Revenue</span>
      </p>
      <Suspense fallback={<div>Loading...</div>}>
        <BarListChart
          data={contentData as BarListContentData[]}
          filterType="contentType"
        />
      </Suspense>
    </Card>
  );
}
