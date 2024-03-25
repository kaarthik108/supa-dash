import { fetchRevenueData } from "@/app/actions";
import { groupByMonth } from "@/lib/utils";
import { DollarSign } from "lucide-react";
import { Suspense, cache } from "react";
import { RevenueOverTime } from "./charts/sparkChart";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const getRevenueData = cache(async () => {
  const revenueData = await fetchRevenueData();
  const formattedData = revenueData ? groupByMonth(revenueData) : [];
  return formattedData;
});

export async function RevenueCard({ month }: { month: string }) {
  const selectedMonth = month;

  const formattedData = await getRevenueData();

  const filteredData =
    selectedMonth === "all"
      ? formattedData
      : formattedData.filter(
          (item) => item.month.slice(0, 3) === selectedMonth
        );

  const totalRevenue = filteredData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedTotalRevenue = formatter.format(totalRevenue);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedTotalRevenue}</div>
        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        <Suspense fallback={<div>Loading...</div>}>
          <RevenueOverTime chartData={filteredData} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
