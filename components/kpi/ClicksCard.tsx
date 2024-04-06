import { fetchClicksData } from "@/app/actions/kpi";
import { SearchParams } from "@/app/dashboard/page";
import { groupByField } from "@/lib/utils";
import { DollarSign } from "lucide-react";
import { Suspense, cache } from "react";
import { RevenueOverTime } from "../charts/sparkChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const getClicksData = cache(
  async (
    audience: string | null,
    contentType: string | null,
    satisfaction: string | null,
    month: string | null
  ) => {
    const ClicksData = await fetchClicksData(
      audience,
      contentType,
      satisfaction,
      month
    );
    const formattedData = ClicksData
      ? groupByField(ClicksData, "StartDate", "Clicks")
      : [];
    return formattedData;
  }
);

export async function ClicksCard({
  month,
  audience,
  contentType,
  satisfaction,
}: SearchParams) {
  const formattedData = await getClicksData(
    audience || null,
    contentType || null,
    satisfaction || null,
    month
  );

  const totalRevenue = formattedData.reduce(
    (sum, item) => sum + item.value!,
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
        <RevenueOverTime chartData={formattedData} />
      </CardContent>
    </Card>
  );
}
