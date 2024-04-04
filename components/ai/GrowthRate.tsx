import {
  calculateGrowthRateForChart,
  fetchSubscriptionsOverTime,
} from "@/app/actions/ai";
import { SearchParams } from "@/app/dashboard/page";
import { LineChartHero } from "../charts/LineChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export async function GrowthRateChartCard({
  month,
  audience,
  contentType,
  satisfaction,
}: SearchParams) {
  // Fetch subscriptions data first
  const subscriptionsData = await fetchSubscriptionsOverTime(
    audience || null,
    contentType || null,
    month || null,
    satisfaction || null
  );

  // Calculate growth rate based on that data
  const growthRateData = await calculateGrowthRateForChart(subscriptionsData);
  const chartData = growthRateData.map((data) => ({
    Month: data.Month,
    Value: data.GrowthRate, // Map GrowthRate to Value for the chart
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Growth Rate Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChartHero chartData={chartData} title="Growth Rate" />
      </CardContent>
    </Card>
  );
}
