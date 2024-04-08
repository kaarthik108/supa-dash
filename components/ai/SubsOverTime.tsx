import { fetchSubscriptionsOverTime } from "@/app/actions/ai";
import { SearchParams } from "@/app/dashboard/page";
import { LineChartHero } from "../charts/LineChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export async function SubsOverTimeCard({
  month,
  audience,
  contentType,
  satisfaction,
}: SearchParams) {
  const subscriptionsData = await fetchSubscriptionsOverTime(
    audience || null,
    contentType || null,
    month || null,
    satisfaction || null
  );
  const chartData = subscriptionsData.map((data) => ({
    Month: data.Month,
    Value: data.NewSubscriptions, // Map GrowthRate to Value for the chart
  }));

  return (
    <Card className="max-w-md sm:max-w-full w-full">
      <CardHeader>
        <CardTitle className="text-sm sm:text-xl">
          Subscribers Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <LineChartHero
            chartData={chartData}
            title="Subscriptions Over Time"
          />
        </div>
      </CardContent>
    </Card>
  );
}
