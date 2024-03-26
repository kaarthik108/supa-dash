import { fetchRevenueData } from "@/app/actions";
import { groupByField } from "@/lib/utils";
import { DollarSign } from "lucide-react";
import { Suspense, cache } from "react";
import { RevenueOverTime } from "../charts/sparkChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const getRevenueData = cache(
  async (audience: string | null, contentType: string | null) => {
    const revenueData = await fetchRevenueData(audience, contentType);
    const formattedData = revenueData
      ? groupByField(revenueData, "StartDate", "Revenue")
      : [];
    return formattedData;
  }
);

export async function RevenueCard({
  month,
  audience,
  contentType,
}: {
  month: string;
  audience: string | null;
  contentType: string | null;
}) {
  const selectedMonth = month;
  const formattedData = await getRevenueData(
    audience || null,
    contentType || null
  );
  const filteredData =
    selectedMonth === "all"
      ? formattedData
      : formattedData.filter(
          (item) => item.month.slice(0, 3) === selectedMonth
        );

  console.log(filteredData);

  const totalRevenue = filteredData.reduce(
    (sum, item) => sum + item.revenue!,
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
