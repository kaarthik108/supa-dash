import { fetchRevenueData } from "@/app/actions/kpi";
import { SearchParams } from "@/app/dashboard/page";
import { groupByField } from "@/lib/utils";
import { DollarSign } from "lucide-react";
import { Suspense, cache } from "react";
import { RevenueOverTime } from "../charts/sparkChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const getRevenueData = cache(
  async (
    audience: string | null,
    contentType: string | null,
    satisfaction: string | null,
    location: string | null,
    age: string | null
  ) => {
    const revenueData = await fetchRevenueData(
      audience,
      contentType,
      satisfaction,
      location,
      age
    );
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
  satisfaction,
  location,
  age,
}: SearchParams) {
  const formattedData = await getRevenueData(
    audience || null,
    contentType || null,
    satisfaction || null,
    location || null,
    age || null
  );

  const totalRevenue = formattedData.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );

  const filteredData =
    month === "all"
      ? formattedData
      : formattedData.filter((item) => item.month.slice(0, 3) === month);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedTotalRevenue = formatter.format(totalRevenue);

  return (
    <Card
      className="animate-fade-up shadow-md"
      style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium">Total Revenue</CardTitle>
        <DollarSign className="h-3 w-3 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pb-0">
        <div className="text-md font-bold pb-2">{formattedTotalRevenue}</div>
        {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
        <RevenueOverTime chartData={filteredData} />
      </CardContent>
    </Card>
  );
}
