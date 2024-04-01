"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type CampaignData = {
  Revenue: number | null;
  Budget: number | null;
  Impressions: number | null;
  Clicks: number | null;
  StartDate: string | null;
  AudienceType: string | null;
  ContentType: string | null;
  CampaignID: number;
};

type SubscriberData = {
  CampaignID: number;
  Satisfaction: string;
};

async function fetchCampaignData(
  audience: string | null,
  contentType: string | null,
  select: string
): Promise<CampaignData[]> {
  const supabase = supabaseServer();

  let query = supabase
    .from("campaign")
    .select(`${select}, CampaignID`)
    .order("StartDate", { ascending: true });

  if (audience !== null) {
    query = query.eq("AudienceType", audience);
  }

  if (contentType !== null) {
    query = query.eq("ContentType", contentType);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching campaign data:", error);
    throw error;
  }

  return data as unknown as CampaignData[];
}

async function fetchSubscriberData(
  satisfaction: string | null
): Promise<SubscriberData[]> {
  const supabase = supabaseServer();

  let query = supabase.from("subscriber").select("CampaignID, Satisfaction");

  if (satisfaction !== null) {
    query = query.eq("Satisfaction", satisfaction);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching subscriber data:", error);
    throw error;
  }

  return data as unknown as SubscriberData[];
}

async function filterCampaignData(
  campaignData: CampaignData[],
  subscriberData: SubscriberData[],
  satisfaction: string | null
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

export async function fetchRevenueData(
  audience: string | null,
  contentType: string | null,
  satisfaction: string | null
): Promise<CampaignData[]> {
  const campaignData = await fetchCampaignData(
    audience,
    contentType,
    "Revenue, StartDate, AudienceType"
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
  satisfaction: string | null
): Promise<CampaignData[]> {
  const campaignData = await fetchCampaignData(
    audience,
    contentType,
    "Budget, StartDate, AudienceType, ContentType"
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
  satisfaction: string | null
): Promise<CampaignData[]> {
  const campaignData = await fetchCampaignData(
    audience,
    contentType,
    "Impressions, StartDate"
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
  satisfaction: string | null
): Promise<CampaignData[]> {
  const campaignData = await fetchCampaignData(
    audience,
    contentType,
    "Clicks, StartDate"
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
