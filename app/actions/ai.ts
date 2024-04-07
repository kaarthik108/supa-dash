"use server";

import { runQuery } from "@/lib/db";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";
import {
  CampaignData,
  SubscriberData,
  fetchCampaignData,
  fetchSubscriberData,
} from "./kpi";
import { GoodOverBadquery } from "./query";

interface SubscriptionsOverTimeData {
  Month: string;
  NewSubscriptions: number;
}
function groupSubscribersByMonth(subscriberData: SubscriberData[]): {
  [month: string]: number;
} {
  const result: { [monthKey: string]: number } = {};

  subscriberData.forEach((subscriber) => {
    const subscriptionDate = new Date(subscriber.SubscriptionDate);
    const formattedMonth = format(subscriptionDate, "yyyy-MM");

    if (!result[formattedMonth]) {
      result[formattedMonth] = 0;
    }
    // Increment subscriber count for the month
    result[formattedMonth]++;
  });

  return result;
}

export async function fetchSubscriptionsOverTime(
  audience: string | null,
  contentType: string | null,
  month: string | null = "all",
  satisfaction: string | null
): Promise<SubscriptionsOverTimeData[]> {
  const subscriberData = await fetchSubscriberData(
    satisfaction || null,
    audience,
    null,
    null,
    month
  );

  const subscribersByMonth = groupSubscribersByMonth(subscriberData);

  // Get all unique months from the subscriber data
  const allMonths = Array.from(
    new Set(
      subscriberData.map((subscriber) =>
        format(new Date(subscriber.SubscriptionDate), "yyyy-MM")
      )
    )
  ).sort();

  // Calculate new subscriptions for each month
  const subscriptionsOverTime: SubscriptionsOverTimeData[] = allMonths.map(
    (month) => ({
      Month: month,
      NewSubscriptions: subscribersByMonth[month] || 0,
    })
  );

  return subscriptionsOverTime;
}

interface GrowthRateOverTimeData {
  Month: string;
  GrowthRate: number;
}

export async function calculateGrowthRateForChart(
  monthlySubscriptions: SubscriptionsOverTimeData[]
): Promise<GrowthRateOverTimeData[]> {
  let growthData: GrowthRateOverTimeData[] = monthlySubscriptions.map(
    (data, index) => {
      if (index === 0) {
        return { Month: data.Month, GrowthRate: 0 }; // Initial month has no growth rate
      }
      const prevSubscriptions =
        monthlySubscriptions[index - 1].NewSubscriptions;
      const currentSubscriptions = data.NewSubscriptions;
      const growthRate =
        prevSubscriptions === 0
          ? 0
          : ((currentSubscriptions - prevSubscriptions) / prevSubscriptions) *
            100;
      return {
        Month: data.Month,
        GrowthRate: parseFloat(growthRate.toFixed(2)),
      }; // Round to 2 decimal places
    }
  );
  return growthData;
}

export async function GoodOverBadCampaign() {
  const result = await runQuery(GoodOverBadquery);
  return result;
}
