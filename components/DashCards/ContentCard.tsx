import { fetchContentData } from "@/app/actions";
import { SearchParams } from "@/app/dashboard/page";
import { Suspense, cache } from "react";
import { BarListChart } from "../charts/BarListChart";
import { Card, CardContent, CardHeader } from "../ui/card";

type BarListContentData = {
  name: string;
  value: number;
};

const ContentCache = cache(
  async (
    month: string,
    audience: string | null,
    contentType: string | null,
    satisfaction: string | null
  ) => {
    const ContentData = await fetchContentData(
      month,
      audience,
      contentType,
      satisfaction
    );
    return ContentData;
  }
);

export async function ContentCard({
  month,
  audience,
  contentType,
  satisfaction,
}: SearchParams) {
  const contentData = await ContentCache(
    month,
    audience || null,
    contentType || null,
    satisfaction || null
  );
  contentData.sort((a, b) => b.value - a.value);

  return (
    <Card
      className="mx-auto overflow-x-auto animate-fade-up w-full h-72 shadow-md"
      style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
    >
      <CardHeader className="text-tremor-title text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
        Content
        <p className="mt-4 text-tremor-default flex items-center justify-between text-tremor-content dark:text-dark-tremor-content">
          <span>Content Type</span>
          <span>Revenue</span>
        </p>
      </CardHeader>
      <CardContent className="overflow-x-auto w-full">
        <BarListChart
          data={contentData as BarListContentData[]}
          filterType="contentType"
        />
      </CardContent>
    </Card>
  );
}
