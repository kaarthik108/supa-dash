import { fetchSubscribersData } from "@/app/actions/kpi";
import { SearchParams } from "@/app/dashboard/page";
import { groupByField } from "@/lib/utils";
import { Users } from "lucide-react";
import { Suspense, cache } from "react";
import { RevenueOverTime } from "../charts/sparkChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const getSubscribersData = cache(
  async (
    satisfaction: string | null,
    month: string | null,
    audience: string | null,
    contentType: string | null
  ) => {
    const subscribersData = await fetchSubscribersData(
      satisfaction,
      month,
      audience,
      contentType
    );
    const formattedData = subscribersData
      ? groupByField(subscribersData, "SubscriptionDate", "CampaignID")
      : [];
    return formattedData;
  }
);

export async function SubscriberCard({
  month,
  satisfaction,
  audience,
  contentType,
}: SearchParams) {
  const formattedData = await getSubscribersData(
    satisfaction || null,
    month,
    audience || null,
    contentType || null
  );

  const totalSubscribers = formattedData.reduce(
    (sum, item) => sum + item.value!,
    0
  );
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formattedTotalSubs = formatter.format(totalSubscribers);
  return (
    <Card
      className="animate-fade-up shadow-md"
      style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium">Total Subscribers</CardTitle>
        <Users className="h-3 w-3 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pb-0">
        <div className="text-md font-bold pb-2">{formattedTotalSubs}</div>
        <Suspense fallback={<div>Loading...</div>}>
          <RevenueOverTime chartData={formattedData} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
