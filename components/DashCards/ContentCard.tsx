import { BarListChart } from "../charts/BarListChart";
import { Card, CardContent, CardHeader } from "../ui/card";

type BarListContentData = {
  name: string;
  value: number;
};

export async function ContentCard({
  ContentData,
}: {
  ContentData: BarListContentData[];
}) {
  ContentData.sort((a, b) => b.value - a.value);

  return (
    <Card
      className="mx-auto overflow-x-auto animate-fade-up w-full  h-[355px] shadow-2xl"
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
          data={ContentData as BarListContentData[]}
          filterType="contentType"
        />
      </CardContent>
    </Card>
  );
}
