import { fetchBudgetData } from "@/app/actions/kpi";
import { SearchParams } from "@/app/dashboard/page";
import { groupByField } from "@/lib/utils";
import { DollarSign } from "lucide-react";
import { Suspense, cache } from "react";
import { RevenueOverTime } from "../charts/sparkChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const getBudgetData = cache(
  async (
    audience: string | null,
    contentType: string | null,
    satisfaction: string | null,
    month: string | null
  ) => {
    const budgetData = await fetchBudgetData(
      audience,
      contentType,
      satisfaction,
      month
    );
    const formattedData = budgetData
      ? groupByField(budgetData, "StartDate", "Budget")
      : [];
    return formattedData;
  }
);

export async function BudgetCard({
  month,
  audience,
  contentType,
  satisfaction,
}: SearchParams) {
  const formattedData = await getBudgetData(
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
        <CardTitle className="text-xs font-medium">Total Budget</CardTitle>
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
