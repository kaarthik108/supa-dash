import { DollarSign } from "lucide-react";
import { RevenueOverTime } from "../charts/sparkChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export async function RevenueCard({
  rawData,
}: {
  rawData: { CampaignMonth: string; Revenue: string }[];
}) {
  const revenueData = rawData.map((item) => ({
    month: item.CampaignMonth || ("" as string),
    value: item.Revenue ? parseInt(item.Revenue, 10) : null,
  }));

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
