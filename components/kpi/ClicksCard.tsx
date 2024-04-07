import { DollarSign } from "lucide-react";
import { RevenueOverTime } from "../charts/sparkChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export async function ClicksCard({
  rawData,
}: {
  rawData: { CampaignMonth: string; Clicks: string }[];
}) {
  const ClicksData = rawData.map((item) => ({
    month: item.CampaignMonth || ("" as string),
    value: item.Clicks ? parseInt(item.Clicks, 10) : null,
  }));
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
