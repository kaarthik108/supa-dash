import { fetchRevenueData } from "@/app/actions/kpi";
import { SearchParams } from "@/app/dashboard/page";
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
    age: string | null,
    month: string | null
  ) => {
    const rawData = (await fetchRevenueData(
      audience,
      contentType,
      satisfaction,
      location,
      age,
      month
    )) as {
      CampaignMonth: string;
      Revenue: string;
    }[];
    const revenueData = rawData.map((item) => ({
      month: item.CampaignMonth || ("" as string),
      value: item.Revenue ? parseInt(item.Revenue, 10) : null,
    }));

    return revenueData;
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
  const revenueData = await getRevenueData(
    audience || null,
    contentType || null,
    satisfaction || null,
    location || null,
    age || null,
    month || null
  );

  const totalRevenue = revenueData.reduce(
    (sum, item) => sum + ((item.value as number) || 0),
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
        <RevenueOverTime chartData={revenueData} />
      </CardContent>
    </Card>
  );
}
