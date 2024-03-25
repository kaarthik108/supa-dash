// components/RevenueCard.tsx
import { fetchRevenueData } from "@/app/actions";
import { groupByMonth } from "@/lib/utils";
import { DollarSign } from "lucide-react";
import { RevenueOverTime } from "./charts/sparkChart";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export async function RevenueCard() {
  const revenueData = await fetchRevenueData();
  const formattedData = revenueData ? groupByMonth(revenueData) : [];

  const totalRevenue = formattedData.reduce(
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
        <RevenueOverTime chartData={formattedData} />
      </CardContent>
    </Card>
  );
}
