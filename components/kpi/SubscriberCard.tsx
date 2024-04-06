import { fetchSubscribersData } from "@/app/actions/kpi";
import { SearchParams } from "@/app/dashboard/page";
import { Users } from "lucide-react";
import { Suspense, cache } from "react";
import { RevenueOverTime } from "../charts/sparkChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const SubscriberCache = cache(
  async (
    satisfaction: string | null,
    month: string,
    audience: string | null,
    contentType: string | null
  ) => {
    const subscribersData = await fetchSubscribersData(
      satisfaction,
      month,
      audience,
      contentType
    );
    return subscribersData;
  }
);

export async function SubscriberCard({
  month,
  satisfaction,
  audience,
  contentType,
}: SearchParams) {
  const subscribersData = await SubscriberCache(
    satisfaction || null,
    month,
    audience || null,
    contentType || null
  );
  const uniqueSubscribers = new Set(
    subscribersData.map((item) => item.SubscriberID)
  );
  const totalSubscribers = uniqueSubscribers.size;

  const formattedData = groupByField(subscribersData, "SubscriptionDate");

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
        <RevenueOverTime chartData={formattedData} />
      </CardContent>
    </Card>
  );
}

export function groupByField(
  data: any[],
  groupField: string
): { month: string; value: number | null }[] {
  const groupedData: { [key: string]: Set<string> } = {};

  data.forEach((item) => {
    const groupValue = item[groupField];
    const subscriberId = item["SubscriberID"];

    if (groupValue && typeof subscriberId === "string") {
      const formattedGroupValue = formatDate(groupValue.toString());

      if (formattedGroupValue !== "Invalid Date") {
        if (!groupedData[formattedGroupValue]) {
          groupedData[formattedGroupValue] = new Set();
        }
        groupedData[formattedGroupValue].add(subscriberId);
      }
    }
  });

  const result = Object.entries(groupedData).map(([month, subscribers]) => ({
    month,
    value: subscribers.size || null,
  }));

  result.sort((a, b) => {
    const monthA = new Date(a.month);
    const monthB = new Date(b.month);
    return monthA.getTime() - monthB.getTime();
  });

  return result;
}

function formatDate(dateString: string): string {
  const dateParts = dateString.split("-");
  if (dateParts.length !== 3) {
    return "Invalid Date";
  }

  const [year, month, day] = dateParts;
  const formattedDate = new Date(`${year}-${month}-${day}`);

  if (isNaN(formattedDate.getTime())) {
    return "Invalid Date";
  }

  const formattedMonth = formattedDate.toLocaleString("default", {
    month: "short",
  });
  const formattedYear = formattedDate.getFullYear().toString().slice(-2);
  return `${formattedMonth} ${formattedYear}`;
}
