import {
  calculateGrowthRateForChart,
  fetchSubscriptionsOverTime,
} from "@/app/actions/ai";
import { SearchParams } from "@/app/dashboard/page";
import { LineChartHero } from "../charts/LineChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export async function GrowthRateChartCard({
  month = "all",
  audience = null,
  contentType = null,
  satisfaction = null,
}: SearchParams) {
  const subscriptionsData = await fetchSubscriptionsOverTime(
    audience || null,
    contentType || null,
    month || null,
    satisfaction || null
  );

  const growthRateData = await calculateGrowthRateForChart(subscriptionsData);
  const chartData = growthRateData.map((data) => ({
    Month: data.Month,
    Value: data.GrowthRate,
  }));

  return (
    <Card className="max-w-md sm:max-w-full w-full">
      <CardHeader>
        <CardTitle className="text-sm sm:text-xl">
          Growth Rate Over Time
        </CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          The monthly percentage change in new subscriptions compared to the
          previous month.
        </p>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <LineChartHero chartData={chartData} title="Growth Rate" />
        </div>
      </CardContent>
    </Card>
  );
}
