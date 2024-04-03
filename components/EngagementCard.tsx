import { fetchEngagementData } from "@/app/actions";
import { SearchParams } from "@/app/dashboard/page";
import { EngagementScatterChart } from "./charts/scatterChart";
import { Card, CardContent, CardHeader } from "./ui/card";

export async function EngagementCard({
  month,
  audience,
  contentType,
}: SearchParams) {
  const engagementData = await fetchEngagementData(
    month,
    audience,
    contentType
  );

  return (
    <Card className="h-full">
      <CardHeader className="text-md text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
        Engagement Rate vs. Satisfaction
      </CardHeader>
      <CardContent>
        <EngagementScatterChart data={engagementData} />
      </CardContent>
    </Card>
  );
}
