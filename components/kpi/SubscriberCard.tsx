import { fetchSubsData } from "@/app/actions/kpi";
import { SearchParams } from "@/app/dashboard/page";
import { groupByField } from "@/lib/utils";
import { Users } from "lucide-react";
import { cache } from "react";
import { RevenueOverTime } from "../charts/sparkChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const getSubsData = cache(
  async (
    audience: string | null,
    contentType: string | null,
    satisfaction: string | null,
    location: string | null,
    age: string | null,
    month: string | null
  ) => {
    const rawData = (await fetchSubsData(
      audience,
      contentType,
      satisfaction,
      location,
      age,
      month
    )) as {
      CampaignMonth: string;
      NewSubscriptions: string;
    }[];

    const SubsData = rawData.map((item) => ({
      month: item.CampaignMonth || ("" as string),
      value: item.NewSubscriptions ? parseInt(item.NewSubscriptions, 10) : null,
    }));

    return SubsData;
  }
);

export async function SubscriberCard({
  month,
  satisfaction,
  audience,
  contentType,
  location,
  age,
}: SearchParams) {
  const SubsData = await getSubsData(
    audience || null,
    contentType || null,
    satisfaction || null,
    location || null,
    age || null,
    month || null
  );

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
      className="animate-fade-up shadow-md"
      style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium">Total Subscribers</CardTitle>
        <Users className="h-3 w-3 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pb-0">
        <div className="text-md font-bold pb-2">{formattedTotalSubs}</div>
        <RevenueOverTime chartData={SubsData} />
      </CardContent>
    </Card>
  );
}
