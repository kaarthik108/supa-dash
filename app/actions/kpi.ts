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
  NewSubscriptions: number | null;
  SubscriberID: string;
};

export type SubscriberData = {
  CampaignID: number;
  SubscriberID: string;
  Satisfaction: string;
  SubscriptionDate: string;
  AudienceType: string;
  Location: string;
  Age: number;
};
const preprocessDate = (dateString: string): string => {
  const [day, month, year] = dateString.split(".");
  return `${year}-${month}-${day}`;
};
function helperAge(age: string) {
  const [startAge, endAge] = age.split("-").map(Number);
  if (!isNaN(startAge) && !isNaN(endAge)) {
    return { startAge, endAge };
  }
  return { startAge: 0, endAge: 100 };
}
const isCampaignInMonth = (
  dateString: string | null,
  month: string | null
): boolean => {
  if (!dateString || !month || month === "all") return true;

  const formattedDate = preprocessDate(dateString);
  const campaignMonth = new Date(formattedDate).getMonth();
  const targetMonth = new Date(`2000-${month}-01`).getMonth();

  return campaignMonth === targetMonth;
};

export async function fetchCampaignData(
  contentType: string | null,
  select: string
): Promise<CampaignData[]> {
  const supabase = supabaseServer();

  let query = supabase
    .from("campaign")
    .select(`${select}, CampaignID`)
    .order("StartDate", { ascending: true });

  // if (audience !== null) {
  //   query = query.eq("AudienceType", audience);
  // }

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

export async function fetchSubscriberData(
  satisfaction: string | null,
  audience: string | null,
  location: string | null,
  age: string | null,
  month?: string | null,
  campaignIds?: number[]
): Promise<SubscriberData[]> {
  const supabase = supabaseServer();

  let query = supabase.from("subscriber").select("*");

  if (satisfaction !== null) {
    query = query.eq("Satisfaction", satisfaction);
  }
  if (audience !== null) {
    query = query.eq("AudienceType", audience);
  }
  if (location !== null) {
    query = query.eq("Location", location);
  }
  if (campaignIds) {
    query.in("CampaignID", campaignIds);
  }

  if (age) {
    // Parse the age range
    const { startAge, endAge } = helperAge(age);
    query.gte("Age", startAge);
    query.lte("Age", endAge);
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
  satisfaction: string | null,
  audience: string | null,
  location: string | null,
  age: string | null
): Promise<CampaignData[]> {
  const { startAge, endAge } = helperAge(age || "");

  const filteredCampaignIds = new Set(
    subscriberData
      .filter((subscriber) => {
        return (
          (!satisfaction || subscriber.Satisfaction === satisfaction) &&
          (!audience || subscriber.AudienceType === audience) &&
          (!location || subscriber.Location === location) &&
          (!age || (subscriber.Age >= startAge && subscriber.Age <= endAge))
        );
      })
      .map((subscriber) => subscriber.CampaignID)
  );

  return campaignData.filter((campaign) => {
    return filteredCampaignIds.has(campaign.CampaignID);
  });
}

export async function fetchRevenueData(
  audience: string | null,
  contentType: string | null,
  satisfaction: string | null,
  location: string | null,
  age: string | null
): Promise<CampaignData[]> {
  const campaignData = await fetchCampaignData(
    contentType,
    "Revenue, StartDate, AudienceType, ContentType"
  );

  const subscriberData = await fetchSubscriberData(
    satisfaction,
    audience,
    location,
    age
  );

  const filteredData = await filterCampaignData(
    campaignData,
    subscriberData,
    satisfaction,
    audience,
    location,
    age
  );

  revalidatePath("/dashboard");
  return filteredData;
}

export async function fetchBudgetData(
  audience: string | null,
  contentType: string | null,
  satisfaction: string | null,
  location: string | null,
  age: string | null
): Promise<CampaignData[]> {
  const campaignData = await fetchCampaignData(
    contentType,
    "Budget, StartDate, AudienceType, ContentType"
  );
  const subscriberData = await fetchSubscriberData(
    satisfaction,
    audience,
    location,
    age
  );
  const filteredData = await filterCampaignData(
    campaignData,
    subscriberData,
    satisfaction,
    audience,
    location,
    age
  );

  revalidatePath("/dashboard");
  return filteredData;
}

export async function fetchImpressionData(
  audience: string | null,
  contentType: string | null,
  satisfaction: string | null,
  location: string | null,
  age: string | null
): Promise<CampaignData[]> {
  const campaignData = await fetchCampaignData(
    contentType,
    "Impressions, StartDate"
  );
  const subscriberData = await fetchSubscriberData(
    satisfaction,
    audience,
    location,
    age
  );
  const filteredData = await filterCampaignData(
    campaignData,
    subscriberData,
    satisfaction,
    audience,
    location,
    age
  );

  revalidatePath("/dashboard");
  return filteredData;
}

export async function fetchClicksData(
  audience: string | null,
  contentType: string | null,
  satisfaction: string | null,
  location: string | null,
  age: string | null
): Promise<CampaignData[]> {
  const campaignData = await fetchCampaignData(
    contentType,
    "Clicks, StartDate"
  );
  const subscriberData = await fetchSubscriberData(
    satisfaction,
    audience,
    location,
    age
  );
  const filteredData = await filterCampaignData(
    campaignData,
    subscriberData,
    satisfaction,
    audience,
    location,
    age
  );

  revalidatePath("/dashboard");
  return filteredData;
}

export async function fetchSubsData(
  audience: string | null,
  contentType: string | null,
  satisfaction: string | null,
  location: string | null,
  age: string | null
) {
  const campaignData = await fetchCampaignData(
    contentType,
    "NewSubscriptions, StartDate"
  );
  const campaignIds = campaignData.map((campaign) => campaign.CampaignID);
  const subscriberData = await fetchSubscriberData(
    satisfaction,
    audience,
    location,
    age,
    null,
    campaignIds
  );
  // const filteredData = await filterCampaignData(
  //   campaignData,
  //   subscriberData,
  //   satisfaction,
  //   audience,
  //   location,
  //   age
  // );

  revalidatePath("/dashboard");
  return subscriberData;
}
