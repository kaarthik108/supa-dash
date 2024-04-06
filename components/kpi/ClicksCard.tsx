import { fetchClicksData } from "@/app/actions/kpi";
import { SearchParams } from "@/app/dashboard/page";
import { DollarSign } from "lucide-react";
import { Suspense, cache } from "react";
import { RevenueOverTime } from "../charts/sparkChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const getClicksData = cache(
  async (
    audience: string | null,
    contentType: string | null,
    satisfaction: string | null,
    location: string | null,
    age: string | null,
    month: string | null
  ) => {
    const rawData = (await fetchClicksData(
      audience,
      contentType,
      satisfaction,
      location,
      age,
      month
    )) as {
      CampaignMonth: string;
      Clicks: string;
    }[];

    const ClicksData = rawData.map((item) => ({
      month: item.CampaignMonth || ("" as string),
      value: item.Clicks ? parseInt(item.Clicks, 10) : null,
    }));

    return ClicksData;
  }
);

export async function ClicksCard({
  month,
  audience,
  contentType,
  satisfaction,
  location,
  age,
}: SearchParams) {
  const ClicksData = await getClicksData(
    audience || null,
    contentType || null,
    satisfaction || null,
    location || null,
    age || null,
    month || null
  );

  const totalRevenue = ClicksData.reduce(
    (sum, item) => sum + ((item.value as number) || 0),
    0
  );

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formattedTotalRevenue = formatter.format(totalRevenue);
  return (
    <Card
      className="animate-fade-up shadow-md"
      style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium">Total Clicks</CardTitle>
        <DollarSign className="h-3 w-3 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-md font-bold">{formattedTotalRevenue}</div>
        {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
        <RevenueOverTime chartData={ClicksData} />
      </CardContent>
    </Card>
  );
}
