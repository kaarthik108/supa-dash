import { EngagementData, EngagementScatterChart } from "../charts/scatterChart";
import { Card, CardContent, CardHeader } from "../ui/card";

export async function EngagementCard({
  rawData,
}: {
  rawData: EngagementData[];
}) {
  return (
    <Card className="h-full">
      <CardHeader className="text-md text-tremor-content-strong dark:text-dark-tremor-content-strong">
        Engagement Rate vs. Satisfaction
      </CardHeader>
      <CardContent>
        <EngagementScatterChart data={rawData} />
      </CardContent>
    </Card>
  );
}
