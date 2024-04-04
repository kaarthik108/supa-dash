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
    <Card>
      <CardHeader>
        <CardTitle>Growth Rate Over Time</CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          The monthly percentage change in new subscriptions compared to the
          previous month.
        </p>
      </CardHeader>
      <CardContent>
        <LineChartHero chartData={chartData} title="Growth Rate" />
      </CardContent>
    </Card>
  );
}
