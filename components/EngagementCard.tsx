import { fetchEngagementData } from "@/app/actions";
import { SearchParams } from "@/app/dashboard/page";
import { Card } from "@tremor/react";
import { EngagementScatterChart } from "./charts/scatterChart";

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
    <Card>
      <p className="text-md text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
        Engagement Rate vs. Satisfaction
      </p>
      <EngagementScatterChart data={engagementData} />
    </Card>
  );
}
