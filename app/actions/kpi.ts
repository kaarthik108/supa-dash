"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type CampaignData = {
  Revenue: number | null;
  Budget: number | null;
  Impressions: number | null;
  Clicks: number | null;
  StartDate: string | null;
  AudienceType: string | null;
  ContentType: string | null;
  CampaignID: number;
  Platform: string | null;
};

export type SubscriberData = {
  CampaignID: number;
  Satisfaction: string;
  SubscriptionDate: string;
};

function isCampaignInMonth(
  startDate: string | null,
  month: string | null
): boolean {
  if (!startDate || month === "all") return true;
  const [day, monthIndex, year] = startDate.split(".").map(Number);
  const campaignDate = new Date(year, monthIndex - 1, day);
  const desiredMonthIndex = new Date(`${month} 1, ${year}`).getMonth();
  return campaignDate.getMonth() === desiredMonthIndex;
}

export async function fetchCampaignData(
  audience: string | null,
  contentType: string | null,
  select: string,
  month: string | null = null
): Promise<CampaignData[]> {
  const supabase = supabaseServer();

  let query = supabase
    .from("campaign")
    .select(`${select}, CampaignID, StartDate`)
    .order("StartDate", { ascending: true });

  if (audience) query = query.eq("AudienceType", audience);
  if (contentType) query = query.eq("ContentType", contentType);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching campaign data:", error);
    return [];
  }

  const campaigns = data as unknown as CampaignData[];

  const filteredData = campaigns.filter((item) =>
    isCampaignInMonth(item.StartDate, month)
  );

  return filteredData;
}

export async function fetchSubscriberData(
  satisfaction: string | null
): Promise<SubscriberData[]> {
  const supabase = supabaseServer();

  let query = supabase
    .from("subscriber")
    .select("CampaignID, Satisfaction, SubscriptionDate");

  if (satisfaction !== null) {
    query = query.eq("Satisfaction", satisfaction);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching subscriber data:", error);
    throw error;
  }

  const subscribers = data as unknown as SubscriberData[];

  return subscribers;
}

export async function filterCampaignData(
  campaignData: CampaignData[],
  subscriberData: SubscriberData[],
  satisfaction: string | null,
  month: string | null = null
): Promise<CampaignData[]> {
  return campaignData.filter((campaign) => {
    if (!satisfaction) return true;
    return subscriberData.some(
      (subscriber) =>
        subscriber.CampaignID === campaign.CampaignID &&
        subscriber.Satisfaction === satisfaction
    );
  });
}

export async function filterSubscriberData(
  subscriberData: SubscriberData[],
  campaignData: CampaignData[],
  satisfaction: string | null,
  month: string | null,
  audience: string | null,
  contentType: string | null
): Promise<SubscriberData[]> {
  return subscriberData.filter((subscriber) => {
    const campaign = campaignData.find(
      (campaign) => campaign.CampaignID === subscriber.CampaignID
    );
    if (!campaign) return false;
    if (satisfaction && subscriber.Satisfaction !== satisfaction) return false;
    if (month && !isCampaignInMonth(subscriber.SubscriptionDate, month))
      return false;
    if (audience && campaign.AudienceType !== audience) return false;
    if (contentType && campaign.ContentType !== contentType) return false;
    return true;
  });
}
export async function fetchRevenueData(
  audience: string | null,
  contentType: string | null,
  satisfaction: string | null,
  month: string | null
): Promise<CampaignData[]> {
  const campaignData = await fetchCampaignData(
    audience,
    contentType,
    "Revenue, StartDate, AudienceType",
    month
  );
  const subscriberData = await fetchSubscriberData(satisfaction);
  const filteredData = await filterCampaignData(
    campaignData,
    subscriberData,
    satisfaction
  );

  revalidatePath("/dashboard");
  return filteredData;
}

export async function fetchBudgetData(
  audience: string | null,
  contentType: string | null,
  satisfaction: string | null,
  month: string | null
): Promise<CampaignData[]> {
  const campaignData = await fetchCampaignData(
    audience,
    contentType,
    "Budget, StartDate, AudienceType, ContentType",
    month
  );
  const subscriberData = await fetchSubscriberData(satisfaction);
  const filteredData = await filterCampaignData(
    campaignData,
    subscriberData,
    satisfaction
  );

  revalidatePath("/dashboard");
  return filteredData;
}

export async function fetchImpressionData(
  audience: string | null,
  contentType: string | null,
  satisfaction: string | null,
  month: string | null
): Promise<CampaignData[]> {
  const campaignData = await fetchCampaignData(
    audience,
    contentType,
    "Impressions, StartDate",
    month
  );
  const subscriberData = await fetchSubscriberData(satisfaction);
  const filteredData = await filterCampaignData(
    campaignData,
    subscriberData,
    satisfaction
  );

  revalidatePath("/dashboard");
  return filteredData;
}
export async function fetchClicksData(
  audience: string | null,
  contentType: string | null,
  satisfaction: string | null,
  month: string | null
): Promise<CampaignData[]> {
  const campaignData = await fetchCampaignData(
    audience,
    contentType,
    "Clicks, StartDate",
    month
  );
  const subscriberData = await fetchSubscriberData(satisfaction);
  const filteredData = await filterCampaignData(
    campaignData,
    subscriberData,
    satisfaction
  );

  revalidatePath("/dashboard");
  return filteredData;
}

export async function fetchSubscribersData(
  satisfaction: string | null,
  month: string | null = null,
  audience: string | null = null,
  contentType: string | null = null
): Promise<SubscriberData[]> {
  const subscriberData = await fetchSubscriberData(satisfaction);
  const campaignData = await fetchCampaignData(
    audience,
    contentType,
    "CampaignID, AudienceType, ContentType",
    month
  );
  const filteredData = await filterSubscriberData(
    subscriberData,
    campaignData,
    satisfaction,
    month,
    audience,
    contentType
  );
  revalidatePath("/dashboard");
  return filteredData;
}
