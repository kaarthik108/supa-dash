"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type RevenueData = {
  Revenue: number | null;
  StartDate: string | null;
};

type BudgetData = {
  Budget: number | null;
  StartDate: string | null;
};
type ImpressionData = {
  Impressions: number | null;
  StartDate: string | null;
};
type ClicksData = {
  Clicks: number | null;
  StartDate: string | null;
};

export async function fetchRevenueData(
  audience: string | null,
  contentType: string | null
): Promise<RevenueData[] | null> {
  const supabase = supabaseServer();
  const query = supabase
    .from("campaign")
    .select("Revenue, StartDate, AudienceType")
    .order("StartDate", { ascending: true });

  if (audience) {
    query.eq("AudienceType", audience);
  }
  if (contentType) {
    query.eq("ContentType", contentType);
  }
  const { data, error } = await query;

  revalidatePath("/dashboard");
  if (error) {
    console.error("Error fetching revenue data:", error);
    return null;
  } else {
    return data;
  }
}

export async function fetchBudgetData(
  audience: string | null,
  contentType: string | null
): Promise<BudgetData[] | null> {
  const supabase = supabaseServer();
  const query = supabase
    .from("campaign")
    .select("Budget, StartDate, AudienceType, ContentType")
    .order("StartDate", { ascending: true });

  if (audience) {
    query.eq("AudienceType", audience);
  }

  if (contentType) {
    query.eq("ContentType", contentType);
  }

  const { data, error } = await query;

  revalidatePath("/dashboard");
  if (error) {
    console.error("Error fetching budget data:", error);
    return null;
  } else {
    return data;
  }
}
export async function fetchImpressionData(
  audience: string | null,
  contentType: string | null
): Promise<ImpressionData[] | null> {
  const supabase = supabaseServer();
  const query = supabase
    .from("campaign")
    .select("Impressions, StartDate")
    .order("StartDate", { ascending: true });

  if (audience) {
    query.eq("AudienceType", audience);
  }

  if (contentType) {
    query.eq("ContentType", contentType);
  }

  const { data, error } = await query;

  revalidatePath("/dashboard");

  if (error) {
    console.error("Error fetching revenue data:", error);
    return null;
  } else {
    return data;
  }
}
export async function fetchClicksData(
  audience: string | null,
  contentType: string | null
): Promise<ClicksData[] | null> {
  const supabase = supabaseServer();
  const query = supabase
    .from("campaign")
    .select("Clicks, StartDate")
    .order("StartDate", { ascending: true });

  if (audience) {
    query.eq("AudienceType", audience);
  }

  if (contentType) {
    query.eq("ContentType", contentType);
  }

  const { data, error } = await query;

  revalidatePath("/dashboard");

  if (error) {
    console.error("Error fetching revenue data:", error);
    return null;
  } else {
    return data;
  }
}
type PlatformData = {
  platform: string;
  revenue: number;
  impressions: number;
  subscriptions: number;
  clicks: number;
};

export async function fetchPlatformData(
  month: string,
  audience?: string | null,
  contentType?: string | null
) {
  const supabase = supabaseServer();
  const query = supabase
    .from("campaign")
    .select(
      "Platform, Revenue, Impressions, NewSubscriptions, StartDate, AudienceType, ContentType, Clicks"
    );

  if (audience) {
    query.eq("AudienceType", audience);
  }

  if (contentType) {
    query.eq("ContentType", contentType);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching platform data:", error);
    return [];
  }

  const platformData: PlatformData[] = [];

  data?.forEach((item) => {
    const platform = item.Platform || "";
    const revenue = item.Revenue || 0;
    const impressions = item.Impressions || 0;
    const subscriptions = item.NewSubscriptions || 0;
    const clicks = item.Clicks || 0;

    if (
      month === "all" ||
      (item.StartDate &&
        new Date(item.StartDate).toLocaleString("default", {
          month: "short",
        }) === month)
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
}
type BarListContentData = { name: string; value: number };

export async function fetchContentData(
  month: string,
  audience?: string | null,
  contentType?: string | null
) {
  const supabase = supabaseServer();
  const query = supabase
    .from("campaign")
    .select("ContentType, AudienceType, Revenue, StartDate")
    .order("Revenue", { ascending: false });

  if (audience) {
    query.eq("AudienceType", audience);
  }

  if (contentType) {
    query.eq("ContentType", contentType);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching content data:", error);
    return [];
  }

  const contentData: BarListContentData[] = [];

  data.forEach((item) => {
    const contentTypeValue = item.ContentType || "";
    const revenue = item.Revenue || 0;

    if (
      month === "all" ||
      (item.StartDate &&
        new Date(item.StartDate).toLocaleString("default", {
          month: "short",
        }) === month)
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
}
export async function fetchAudienceData(
  month: string,
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null
) {
  const supabase = supabaseServer();

  // Fetch campaign data
  const campaignQuery = supabase
    .from("campaign")
    .select("AudienceType, ContentType, Revenue, StartDate, CampaignID")
    .order("Revenue", { ascending: false });

  if (audience) {
    campaignQuery.eq("AudienceType", audience);
  }

  if (contentType) {
    campaignQuery.eq("ContentType", contentType);
  }

  const { data: campaignData, error: campaignError } = await campaignQuery;

  if (campaignError) {
    console.error("Error fetching campaign data:", campaignError);
    return [];
  }

  // Fetch subscriber data
  const subscriberQuery = supabase.from("subscriber").select("*");

  if (satisfaction) {
    subscriberQuery.eq("Satisfaction", satisfaction);
  }

  const { data: subscriberData, error: subscriberError } =
    await subscriberQuery;

  if (subscriberError) {
    console.error("Error fetching subscriber data:", subscriberError);
    return [];
  }

  const contentData: BarListContentData[] = [];

  campaignData.forEach((campaign) => {
    const audienceTypeValue = campaign.AudienceType || "";
    const revenue = campaign.Revenue || 0;

    if (
      month === "all" ||
      (campaign.StartDate &&
        new Date(campaign.StartDate).toLocaleString("default", {
          month: "short",
        }) === month)
    ) {
      // Check if the campaign has subscribers with the specified satisfaction level
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

  revalidatePath("/dashboard");
  return contentData;
}

export async function fetchEngagementData(
  month: string,
  audience?: string | null,
  contentType?: string | null
) {
  const supabase = supabaseServer();
  const query = supabase
    .from("subscriber")
    .select("Satisfaction, EngagementRate, SubscriptionDate, ViewingTime");

  if (audience) {
    query.eq("AudienceType", audience);
  }

  if (contentType) {
    query.eq("ContentType", contentType);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching engagement data:", error);
    return [];
  }

  const engagementData: {
    satisfaction: string;
    engagementRate: number;
    subscribers: number;
    viewingTime: number;
  }[] = [];

  data.forEach((item) => {
    const satisfaction = item.Satisfaction || "";
    const engagementRate = item.EngagementRate || 0;
    const viewingTime = item.ViewingTime || 0;

    if (
      month === "all" ||
      (item.SubscriptionDate &&
        new Date(item.SubscriptionDate).toLocaleString("default", {
          month: "short",
        }) === month)
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

  revalidatePath("/dashboard");
  return engagementData;
}

export async function fetchSubscribersByLocation() {
  const supabase = supabaseServer();
  const query = supabase.from("subscriber").select("Location");

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching subscribers by location:", error);
    return {};
  }

  const subscribersByLocation: { [key: string]: number } = {
    asia: 0,
    north_america: 0,
    south_america: 0,
    europe: 0,
    oceania: 0,
    africa: 0,
  };

  const regionMapping: { [key: string]: string } = {
    Asia: "asia",
    "North America": "north_america",
    "South America": "south_america",
    Europe: "europe",
    Oceania: "oceania",
    Africa: "africa",
  };

  data.forEach((item) => {
    const location = item.Location;
    if (location) {
      const region = regionMapping[location] || "unknown";
      subscribersByLocation[region]++;
    }
  });

  return subscribersByLocation;
}
