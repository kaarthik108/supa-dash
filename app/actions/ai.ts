"use server";

import { format } from "date-fns";
import { revalidatePath } from "next/cache";
import {
  CampaignData,
  SubscriberData,
  fetchCampaignData,
  fetchSubscriberData,
} from "./kpi";

interface SubscriptionsOverTimeData {
  Month: string;
  NewSubscriptions: number;
}

function aggregateCampaignSubscriptions(campaignData: CampaignData[]): {
  [month: string]: number;
} {
  const subscriptionsByMonth: { [month: string]: number } = {};
  campaignData.forEach(({ StartDate, CampaignID }) => {
    if (StartDate) {
      const [day, month, year] = StartDate.split(".").map(Number);
      const date = new Date(year, month - 1, day);
      const monthKey = format(date, "yyyy-MM");
      if (!subscriptionsByMonth[monthKey]) {
        subscriptionsByMonth[monthKey] = 0;
      }
      subscriptionsByMonth[monthKey] += CampaignID;
    }
  });
  return subscriptionsByMonth;
}

function groupSubscribersByMonth(
  subscriberData: SubscriberData[],
  campaignSubscriptionsByMonth: { [month: string]: number }
) {
  const result: { [monthKey: string]: number } = {};
  const allMonths = new Set<string>();

  subscriberData.forEach((subscriber) => {
    const [day, monthNumber, year] =
      subscriber.SubscriptionDate.split(".").map(Number);
    const subscriptionDate = new Date(year, monthNumber - 1, day);
    const formattedMonth = format(subscriptionDate, "yyyy-MM");
    allMonths.add(formattedMonth);
    if (!result[formattedMonth]) {
      result[formattedMonth] = 0;
    }
    // Increment subscriber count for the month
    result[formattedMonth]++;
  });

  // Combine subscriber data with campaign data
  Object.keys(campaignSubscriptionsByMonth).forEach((month) => {
    allMonths.add(month);
    if (!result[month]) {
      result[month] = 0;
    }
    result[month] += campaignSubscriptionsByMonth[month];
  });

  return Array.from(allMonths)
    .sort()
    .map((month) => ({
      Month: month,
      NewSubscriptions: result[month],
      GrowthRate: 0, // Placeholder, will be calculated next
    }));
}

// function calculateGrowthRate(monthlySubscribers: SubscriberOverTimeData[]) {
//   for (let i = 1; i < monthlySubscribers.length; i++) {
//     const prevCount = monthlySubscribers[i - 1].NewSubscriptions;
//     const currCount = monthlySubscribers[i].NewSubscriptions;
//     const growthRate =
//       prevCount === 0 ? 0 : ((currCount - prevCount) / prevCount) * 100;
//     monthlySubscribers[i].GrowthRate = growthRate;
//   }
//   return monthlySubscribers;
// }

// export async function fetchSubscribersOverTime(
//   audience: string | null,
//   contentType: string | null,
//   month: string | null = null,
//   satisfaction: string | null
// ): Promise<SubscriberOverTimeData[]> {
//   const subscriberData = await fetchSubscriberData(satisfaction || null);
//   const campaignData = await fetchCampaignData(
//     audience,
//     contentType,
//     "Revenue, Budget, Impressions, Clicks",
//     month
//   );
//   const campaignSubscriptionsByMonth =
//     aggregateCampaignSubscriptions(campaignData);
//   const groupedByMonth = groupSubscribersByMonth(
//     subscriberData,
//     campaignSubscriptionsByMonth
//   );
//   const withGrowthRate = calculateGrowthRate(groupedByMonth);

//   revalidatePath("/dashboard");
//   return withGrowthRate;
// }
export async function fetchSubscriptionsOverTime(
  audience: string | null,
  contentType: string | null,
  month: string | null = null,
  satisfaction: string | null
): Promise<SubscriptionsOverTimeData[]> {
  const subscriberData = await fetchSubscriberData(satisfaction || null);
  const campaignData = await fetchCampaignData(
    audience,
    contentType,
    "Revenue, Budget, Impressions, Clicks",
    month
  );
  const campaignSubscriptionsByMonth =
    aggregateCampaignSubscriptions(campaignData);
  const groupedByMonth = groupSubscribersByMonth(
    subscriberData,
    campaignSubscriptionsByMonth
  );

  return groupedByMonth.map((data) => ({
    Month: data.Month,
    NewSubscriptions: data.NewSubscriptions,
  }));
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
      return { Month: data.Month, GrowthRate: growthRate };
    }
  );

  return growthData;
}
