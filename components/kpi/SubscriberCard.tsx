import { Users } from "lucide-react";
import { RevenueOverTime } from "../charts/sparkChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

export async function SubscriberCard({
  rawData,
}: {
  rawData: { CampaignMonth: string; NewSubscriptions: string }[];
}) {
  const SubsData = rawData.map((item) => ({
    month: item.CampaignMonth || ("" as string),
    value: item.NewSubscriptions ? parseInt(item.NewSubscriptions, 10) : null,
  }));
  const totalRevenue = SubsData.reduce(
    (sum, item) => sum + ((item.value as number) || 0),
    0
  );

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formattedTotalSubs = formatter.format(totalRevenue);

  return (
    <Card
      className="animate-fade-up shadow-2xl border-none"
      style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium">
          Total Subscribers
          <Separator className="bg-slate-300" />
        </CardTitle>
        <Users className="h-3 w-3 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pb-0">
        <div className="text-md font-bold pb-2">{formattedTotalSubs}</div>
        <RevenueOverTime chartData={SubsData} />
      </CardContent>
    </Card>
  );
}
