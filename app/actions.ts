"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type PlatformData = {
  platform: string;
  revenue: number;
  impressions: number;
  subscriptions: number;
  clicks: number;
};
type BarListContentData = { name: string; value: number };

function preprocessDate(dateString: string): string {
  const [day, month, year] = dateString.split(".");
  return `${year}-${month}-${day}`;
}

export async function fetchCampaignData(contentType?: string | null) {
  const supabase = supabaseServer();

  const campaignQuery = supabase
    .from("campaign")
    .select(
      "Platform, Revenue, Impressions, NewSubscriptions, StartDate, AudienceType, ContentType, Clicks, CampaignID"
    );

  if (contentType) {
    campaignQuery.eq("ContentType", contentType);
  }

  const { data: campaignData, error: campaignError } = await campaignQuery;

  if (campaignError) {
    console.error("Error fetching campaign data:", campaignError);
    return [];
  }

  return campaignData;
}

export async function fetchSubscriberData(
  audience?: string | null,
  satisfaction?: string | null,
  campaignIds?: number[]
) {
  const supabase = supabaseServer();

  const subscriberQuery = supabase.from("subscriber").select("*");

  if (satisfaction) {
    subscriberQuery.eq("Satisfaction", satisfaction);
  }
  if (audience) {
    subscriberQuery.eq("AudienceType", audience);
  }
  if (campaignIds) {
    subscriberQuery.in("CampaignID", campaignIds);
  }

  const { data: subscriberData, error: subscriberError } =
    await subscriberQuery;

  if (subscriberError) {
    console.error("Error fetching subscriber data:", subscriberError);
    return [];
  }

  return subscriberData;
}

export async function fetchPlatformData(
  month: string,
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null
) {
  const campaignData = await fetchCampaignData(contentType);
  const campaignIds = campaignData.map((campaign) => campaign.CampaignID);
  const subscriberData = await fetchSubscriberData(
    audience,
    satisfaction,
    campaignIds
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

  // revalidatePath("/dashboard");
  return platformData;
}

export async function fetchContentData(
  month: string,
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null
) {
  const campaignData = await fetchCampaignData(contentType);
  const campaignIds = campaignData.map((campaign) => campaign.CampaignID);
  const subscriberData = await fetchSubscriberData(
    audience,
    satisfaction,
    campaignIds
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

  // revalidatePath("/dashboard");
  return contentData;
}

export async function fetchAudienceData(
  month: string,
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null
) {
  const campaignData = await fetchCampaignData(contentType);
  const campaignIds = campaignData.map((campaign) => campaign.CampaignID);
  const subscriberData = await fetchSubscriberData(
    audience,
    satisfaction,
    campaignIds
  );

  const contentData: BarListContentData[] = [];

  campaignData.forEach((campaign) => {
    const audienceTypeValue = campaign.AudienceType || "";
    const revenue = campaign.Revenue || 0;
    const startDate = preprocessDate(campaign.StartDate || "");
    const formattedMonth = new Date(startDate).toLocaleString("default", {
      month: "short",
    });

    if (month === "all" || (campaign.StartDate && formattedMonth === month)) {
      const hasMatchingSubscribers = subscriberData.some(
        (subscriber) =>
          subscriber.CampaignID === campaign.CampaignID &&
          subscriber.Satisfaction === satisfaction
      );

      if (!satisfaction || hasMatchingSubscribers) {
        const existingAudienceType = contentData.find(
          (c) => c.name === audienceTypeValue
        );

        if (existingAudienceType) {
          existingAudienceType.value += revenue;
        } else {
          contentData.push({ name: audienceTypeValue, value: revenue });
        }
      }
    }
  });

  // revalidatePath("/dashboard");
  return contentData;
}

export async function fetchEngagementData(
  month: string,
  audience?: string | null,
  contentType?: string | null
) {
  const campaignData = await fetchCampaignData(contentType);
  const campaignIds = campaignData.map((campaign) => campaign.CampaignID);
  const subscriberData = await fetchSubscriberData(audience, null, campaignIds);

  const engagementData: {
    satisfaction: string;
    engagementRate: number;
    subscribers: number;
    viewingTime: number;
  }[] = [];

  subscriberData.forEach((item) => {
    const satisfaction = item.Satisfaction || "";
    const engagementRate = item.EngagementRate || 0;
    const viewingTime = item.ViewingTime || 0;
    const subscriptionDate = item.SubscriptionDate;
    const formattedMonth = new Date(subscriptionDate!).toLocaleString(
      "default",
      {
        month: "short",
      }
    );

    if (
      month === "all" ||
      (item.SubscriptionDate && formattedMonth === month)
    ) {
      const existingData = engagementData.find(
        (d) => d.satisfaction === satisfaction
      );

      if (existingData) {
        existingData.engagementRate =
          (existingData.engagementRate * existingData.subscribers +
            engagementRate) /
          (existingData.subscribers + 1);
        existingData.subscribers++;
        existingData.viewingTime =
          (existingData.viewingTime * (existingData.subscribers - 1) +
            viewingTime) /
          existingData.subscribers;
      } else {
        engagementData.push({
          satisfaction,
          engagementRate,
          subscribers: 1,
          viewingTime,
        });
      }
    }
  });

  // revalidatePath("/dashboard");
  return engagementData;
}

export async function fetchSubscribersByLocation(
  month: string,
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null
) {
  const campaignData = await fetchCampaignData(contentType);
  const campaignIds = campaignData.map((campaign) => campaign.CampaignID);
  const subscriberData = await fetchSubscriberData(
    audience,
    satisfaction,
    campaignIds
  );

  const subscribersByLocation: { [key: string]: number } = {
    Asia: 0,
    "North America": 0,
    "South America": 0,
    Europe: 0,
    Australia: 0,
    Africa: 0,
  };

  const regionMapping: { [key: string]: string } = {
    Asia: "Asia",
    "North America": "North America",
    "South America": "South America",
    Europe: "Europe",
    Australia: "Australia",
    Africa: "Africa",
  };

  subscriberData.forEach((item) => {
    const location = item.Location;
    const subscriptionDate = item.SubscriptionDate!;
    const formattedmonth = new Date(subscriptionDate).toLocaleString(
      "default",
      {
        month: "short",
      }
    );

    if (
      location &&
      (month === "all" || (subscriptionDate && formattedmonth === month))
    ) {
      const region = regionMapping[location] || "unknown";
      subscribersByLocation[region]++;
    }
  });

  return subscribersByLocation;
}

export async function fetchAgeDistributionByLocation(
  month: string,
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null,
  location?: string | null
): Promise<{ [key: string]: number }> {
  const campaignData = await fetchCampaignData(contentType);
  const campaignIds = campaignData.map((campaign) => campaign.CampaignID);
  const subscriberData = await fetchSubscriberData(
    audience,
    satisfaction,
    campaignIds
  );

  const ageDistribution: { [key: string]: number } = {};

  subscriberData.forEach((subscriber) => {
    const age = subscriber.Age;
    const locationKey = subscriber.Location || "Unknown";
    const subscriptionDate = subscriber.SubscriptionDate;
    const formattedMonth = new Date(subscriptionDate!).toLocaleString(
      "default",
      {
        month: "short",
      }
    );

    if (
      age !== null &&
      (month === "all" || (subscriptionDate && formattedMonth === month)) &&
      (!location || locationKey === location)
    ) {
      const ageGroup = `${Math.floor(age / 10) * 10}-${
        Math.floor(age / 10) * 10 + 9
      }`;
      ageDistribution[ageGroup] = (ageDistribution[ageGroup] || 0) + 1;
    }
  });

  // revalidatePath("/dashboard");
  return ageDistribution;
}
