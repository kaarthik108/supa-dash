import { CreditCard } from "lucide-react";
import { RevenueOverTime } from "../charts/sparkChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

export async function BudgetCard({
  rawData,
}: {
  rawData: { CampaignMonth: string; Budget: string }[];
}) {
  const BudgetData = rawData.map((item) => ({
    month: item.CampaignMonth || ("" as string),
    value: item.Budget ? parseInt(item.Budget, 10) : null,
  }));

  const totalRevenue = BudgetData.reduce(
    (sum, item) => sum + ((item.value as number) || 0),
    0
  );

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formattedTotalRevenue = formatter.format(totalRevenue);
  return (
    <Card
      className="animate-fade-up shadow-2xl border-none "
      style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium">
          Total Budget
          <Separator className="bg-slate-300" />
        </CardTitle>
        <CreditCard className="h-3 w-3 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-md font-bold">{formattedTotalRevenue}</div>
        {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
        <RevenueOverTime chartData={BudgetData} />
      </CardContent>
    </Card>
  );
}
