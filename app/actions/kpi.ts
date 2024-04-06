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
};

export type SubscriberData = {
  CampaignID: number;
  SubscriberID: string;
  Satisfaction: string;
  SubscriptionDate: string;
};

const preprocessDate = (dateString: string): string => {
  const [day, month, year] = dateString.split(".");
  return `${year}-${month}-${day}`;
};

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

const fetchData = async <T>(
  table: "campaign" | "subscriber",
  filters: Record<string, any>,
  select: string,
  month?: string | null
): Promise<T[]> => {
  const supabase = supabaseServer();

  let query = supabase.from(table).select(select);
  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  const { data, error } = await query;

  if (error) {
    console.error(`Error fetching ${table} data:`, error);
    return [];
  }

  const filteredData = month
    ? data.filter((item: any) =>
        isCampaignInMonth(item.StartDate || item.SubscriptionDate, month)
      )
    : data;

  return filteredData as T[];
};

const fetchCampaignData = async (
  contentType: string | null,
  audienceType: string | null,
  select: string,
  month: string | null = null
): Promise<CampaignData[]> => {
  const filters: Record<string, string> = {};

  if (contentType !== null) {
    filters.ContentType = contentType;
  }

  if (audienceType !== null) {
    filters.AudienceType = audienceType;
  }

  return fetchData<CampaignData>("campaign", filters, select, month);
};

const fetchSubscriberData = async (
  satisfaction: string | null,
  audience: string | null,
  month?: string | null
): Promise<SubscriberData[]> => {
  const filters: Record<string, any> = {};

  if (satisfaction) {
    filters.Satisfaction = satisfaction;
  }

  if (audience) {
    filters.AudienceType = audience;
  }

  return fetchData<SubscriberData>("subscriber", filters, "*", month);
};

// Revalidate path once per request, regardless of how many times it's called.
let pathRevalidated = false;
const revalidateDashboardPath = () => {
  if (!pathRevalidated) {
    revalidatePath("/dashboard");
    pathRevalidated = true;
  }
};

const fetchFilteredData = async <T extends CampaignData>(
  getData: (
    contentType: string | null,
    AudienceType: string | null,
    select: string,
    month: string | null
  ) => Promise<T[]>,
  audience: string | null,
  contentType: string | null,
  satisfaction: string | null,
  month: string | null,
  select: string
): Promise<T[]> => {
  const campaignData = await getData(contentType, audience, select, month);
  const subscriberData = await fetchSubscriberData(
    satisfaction,
    audience,
    month
  );

  const filteredData = campaignData.filter((campaign) => {
    if (!satisfaction) return true;
    return subscriberData.some(
      (subscriber) =>
        subscriber.CampaignID === campaign.CampaignID &&
        subscriber.Satisfaction === satisfaction
    );
  });

  revalidateDashboardPath();
  return filteredData;
};

const fetchRevenueData = async (
  audience: string | null,
  contentType: string | null,
  satisfaction: string | null,
  month: string | null
): Promise<CampaignData[]> => {
  return fetchFilteredData(
    fetchCampaignData,
    audience,
    contentType,
    satisfaction,
    month,
    "Revenue, StartDate, AudienceType"
  );
};

const fetchBudgetData = async (
  audience: string | null,
  contentType: string | null,
  satisfaction: string | null,
  month: string | null
): Promise<CampaignData[]> => {
  return fetchFilteredData(
    fetchCampaignData,
    audience,
    contentType,
    satisfaction,
    month,
    "Budget, StartDate, AudienceType, ContentType"
  );
};

const fetchImpressionData = async (
  audience: string | null,
  contentType: string | null,
  satisfaction: string | null,
  month: string | null
): Promise<CampaignData[]> => {
  return fetchFilteredData(
    fetchCampaignData,
    audience,
    contentType,
    satisfaction,
    month,
    "Impressions, StartDate"
  );
};

const fetchClicksData = async (
  audience: string | null,
  contentType: string | null,
  satisfaction: string | null,
  month: string | null
): Promise<CampaignData[]> => {
  return fetchFilteredData(
    fetchCampaignData,
    audience,
    contentType,
    satisfaction,
    month,
    "Clicks, StartDate"
  );
};

const fetchSubscribersData = async (
  satisfaction: string | null,
  month: string | null,
  audience: string | null,
  contentType: string | null
): Promise<SubscriberData[]> => {
  const campaignData = await fetchCampaignData(
    contentType,
    null,
    "CampaignID, AudienceType, ContentType",
    month
  );

  const validCampaignIds = campaignData.map((campaign) => campaign.CampaignID);

  let subscriberData = await fetchSubscriberData(satisfaction, audience, month);

  subscriberData = subscriberData.filter((subscriber) =>
    validCampaignIds.includes(subscriber.CampaignID)
  );

  return subscriberData;
};

type PlatformData = {
  platform: string;
  revenue: number;
  impressions: number;
  subscriptions: number;
  clicks: number;
};

const fetchPlatformData = async (
  month: string,
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null
) => {
  const campaignData = await fetchCampaignData(
    contentType || null,
    null,
    "Platform, Revenue, Impressions, NewSubscriptions, StartDate, AudienceType, ContentType, Clicks, CampaignID",
    month
  );
  const subscriberData = await fetchSubscriberData(
    satisfaction || null,
    audience || null,
    month
  );

  const platformData: PlatformData[] = [];

  campaignData.forEach((item) => {
    const platform = item.Platform || "";
    const revenue = item.Revenue || 0;
    const impressions = item.Impressions || 0;
    const subscriptions = item.NewSubscriptions || 0;
    const clicks = item.Clicks || 0;
    const startDate = preprocessDate(item.StartDate || "");
    const formattedMonth = new Date(startDate).toLocaleString("default", {
      month: "short",
    });

    if (
      (month === "all" || (item.StartDate && formattedMonth === month)) &&
      (!satisfaction ||
        subscriberData.some(
          (subscriber) =>
            subscriber.CampaignID === item.CampaignID &&
            subscriber.Satisfaction === satisfaction
        ))
    ) {
      const existingPlatform = platformData.find(
        (p) => p.platform === platform
      );

      if (existingPlatform) {
        existingPlatform.revenue += revenue;
        existingPlatform.impressions += impressions;
        existingPlatform.subscriptions += subscriptions;
        existingPlatform.clicks += clicks;
      } else {
        platformData.push({
          platform,
          revenue,
          impressions,
          subscriptions,
          clicks,
        });
      }
    }
  });

  revalidatePath("/dashboard");
  return platformData;
};

type BarListContentData = { name: string; value: number };

const fetchContentData = async (
  month: string,
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null
) => {
  const campaignData = await fetchCampaignData(
    contentType || null,
    null,
    "ContentType, AudienceType, Revenue, StartDate, CampaignID",
    month
  );
  const subscriberData = await fetchSubscriberData(
    satisfaction || null,
    audience || null,
    month
  );

  const contentData: BarListContentData[] = [];

  campaignData.forEach((item) => {
    const contentTypeValue = item.ContentType || "";
    const revenue = item.Revenue || 0;
    const startDate = preprocessDate(item.StartDate || "");
    const formattedMonth = new Date(startDate).toLocaleString("default", {
      month: "short",
    });

    if (
      (month === "all" || (item.StartDate && formattedMonth === month)) &&
      (!satisfaction ||
        subscriberData.some(
          (subscriber) =>
            subscriber.CampaignID === item.CampaignID &&
            subscriber.Satisfaction === satisfaction
        ))
    ) {
      const existingContentType = contentData.find(
        (c) => c.name === contentTypeValue
      );

      if (existingContentType) {
        existingContentType.value += revenue;
      } else {
        contentData.push({ name: contentTypeValue, value: revenue });
      }
    }
  });

  revalidatePath("/dashboard");
  return contentData;
};

export {
  fetchBudgetData,
  fetchCampaignData,
  fetchClicksData,
  fetchContentData,
  fetchImpressionData,
  fetchPlatformData,
  fetchRevenueData,
  fetchSubscriberData,
  fetchSubscribersData,
};
