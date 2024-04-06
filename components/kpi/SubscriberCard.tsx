import { fetchSubsData } from "@/app/actions/kpi";
import { SearchParams } from "@/app/dashboard/page";
import { groupByField } from "@/lib/utils";
import { Users } from "lucide-react";
import { cache } from "react";
import { RevenueOverTime } from "../charts/sparkChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const SubscriberCache = cache(
  async (
    audience: string | null,
    contentType: string | null,
    satisfaction: string | null,
    location: string | null,
    age: string | null
  ) => {
    const subscribersData = await fetchSubsData(
      audience,
      contentType,
      satisfaction,
      location,
      age
    );
    const formattedData = subscribersData.reduce((acc, subscriber) => {
      const subscriptionDate = new Date(subscriber.SubscriptionDate);
      const month = subscriptionDate.toLocaleString("default", {
        month: "short",
      });
      const year = subscriptionDate.getFullYear().toString().slice(-2);
      const formattedMonth = `${month} ${year}`;

      const existingEntry = acc.find((entry) => entry.month === formattedMonth);

      if (existingEntry) {
        existingEntry.value++;
      } else {
        acc.push({ month: formattedMonth, value: 1 });
      }

      return acc;
    }, [] as { month: string; value: number }[]);

    return formattedData;
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
  const subscribersData = await SubscriberCache(
    audience || null,
    contentType || null,
    satisfaction || null,
    location || null,
    age || null
  );

  const filteredData =
    month === "all"
      ? subscribersData
      : subscribersData.filter((item) => item.month.slice(0, 3) === month);

  const uniqueSubscribers = filteredData.reduce((acc, item) => {
    return acc + (item.value ?? 0);
  }, 0);

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formattedTotalSubs = formatter.format(uniqueSubscribers);

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
        <RevenueOverTime chartData={filteredData} />
      </CardContent>
    </Card>
  );
}
