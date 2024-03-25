import { fetchContentData } from "@/app/actions";
import { Card } from "@tremor/react";
import { Suspense } from "react";
import { BarListChart } from "./charts/BarListChart";

type BarListContentData = {
  name: string;
  value: number;
};

export async function ContentCard({ month }: { month: string }) {
  const contentData = await fetchContentData(month);
  console.log(contentData);
  return (
    <Card className="mx-auto h-full overflow-x-auto custom-scrollbar">
      <h3 className="text-tremor-title text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
        Content Analytics
      </h3>
      <p className="mt-4 text-tremor-default flex items-center justify-between text-tremor-content dark:text-dark-tremor-content">
        <span>Audience Type</span>
        <span>Revenue</span>
      </p>
      <Suspense fallback={<div>Loading...</div>}>
        <BarListChart data={contentData as BarListContentData[]} />
      </Suspense>
    </Card>
  );
}
