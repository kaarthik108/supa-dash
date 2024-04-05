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
  SubscriberID: string;
  Satisfaction: string;
  SubscriptionDate: string;
};

function preprocessDate(dateString: string): string {
  const [day, month, year] = dateString.split(".");
  return `${year}-${month}-${day}`;
}

function isCampaignInMonth(
  dateString: string | null,
  month: string | null
): boolean {
  if (!dateString || month === null || month === "all") return true;

  const formattedDate = preprocessDate(dateString);
  const campaignMonth = new Date(formattedDate).toLocaleString("default", {
    month: "short",
  });

  return campaignMonth === month;
}

export async function fetchCampaignData(
  contentType: string | null,
  select: string,
  month: string | null = null
): Promise<CampaignData[]> {
  const supabase = supabaseServer();

  let query = supabase.from("campaign").select(select);

  // if (audience) {
  //   query = query.eq("AudienceType", audience);
  // }

  if (contentType) {
    query = query.eq("ContentType", contentType);
  }

  const { data: campaignData, error: campaignError } = await query;

  if (campaignError) {
    console.error("Error fetching campaign data:", campaignError);
    return [];
  }

  const filteredData = campaignData.filter((item: any) =>
    isCampaignInMonth(item.StartDate, month)
  );

  return filteredData as unknown as CampaignData[];
}

export async function fetchSubscriberData(
  satisfaction: string | null,
  audience: string | null,
  month?: string | null
): Promise<SubscriberData[]> {
  const supabase = supabaseServer();

  let query = supabase
    .from("subscriber")
    .select("SubscriberID, CampaignID, Satisfaction, SubscriptionDate");

  if (satisfaction) {
    query = query.eq("Satisfaction", satisfaction);
  }

  if (audience) {
    query = query.eq("AudienceType", audience);
  }

  const { data: subscriberData, error: subscriberError } = await query;

  if (subscriberError) {
    console.error("Error fetching subscriber data:", subscriberError);
    return [];
  }

  if (month) {
    const filteredData = subscriberData.filter((item) =>
      isCampaignInMonth(item.SubscriptionDate, month)
    );
    return filteredData as unknown as SubscriberData[];
  } else {
    return subscriberData as unknown as SubscriberData[];
  }
}

export async function fetchRevenueData(
  audience: string | null,
  contentType: string | null,
  satisfaction: string | null,
  month: string | null
): Promise<CampaignData[]> {
  const campaignData = await fetchCampaignData(
    contentType,
    "Revenue, StartDate, AudienceType",
    month
  );
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
    contentType,
    "Budget, StartDate, AudienceType, ContentType",
    month
  );
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
    contentType,
    "Impressions, StartDate",
    month
  );
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
    contentType,
    "Clicks, StartDate",
    month
  );
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

  revalidatePath("/dashboard");
  return filteredData;
}

export async function fetchSubscribersData(
  satisfaction: string | null,
  month: string | null,
  audience: string | null,
  contentType: string | null
): Promise<SubscriberData[]> {
  // First, fetch and filter campaign data based on audience and contentType.
  const campaignData = await fetchCampaignData(
    contentType,
    "CampaignID, AudienceType, ContentType",
    month
  );

  // Extract CampaignIDs from the filtered campaign data.
  const validCampaignIds = campaignData.map((campaign) => campaign.CampaignID);

  // Fetch subscriber data potentially for all campaigns.
  let subscriberData = await fetchSubscriberData(satisfaction, audience, month);

  // Filter subscribers by CampaignID to include only those in validCampaignIds.
  subscriberData = subscriberData.filter((subscriber) =>
    validCampaignIds.includes(subscriber.CampaignID)
  );

  return subscriberData;
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
  contentType?: string | null,
  satisfaction?: string | null
) {
  const supabase = supabaseServer();

  let campaignQuery = supabase
    .from("campaign")
    .select(
      "Platform, Revenue, Impressions, NewSubscriptions, StartDate, AudienceType, ContentType, Clicks, CampaignID"
    );

  // if (audience) {
  //   campaignQuery = campaignQuery.eq("AudienceType", audience);
  // }

  if (contentType) {
    campaignQuery = campaignQuery.eq("ContentType", contentType);
  }

  const { data: campaignData, error: campaignError } = await campaignQuery;

  if (campaignError) {
    console.error("Error fetching campaign data:", campaignError);
    return [];
  }

  let subscriberQuery = supabase.from("subscriber").select("*");

  if (satisfaction) {
    subscriberQuery = subscriberQuery.eq("Satisfaction", satisfaction);
  }
  if (audience) {
    subscriberQuery = subscriberQuery.eq("AudienceType", audience);
  }
  const { data: subscriberData, error: subscriberError } =
    await subscriberQuery;

  if (subscriberError) {
    console.error("Error fetching subscriber data:", subscriberError);
    return [];
  }

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
}

type BarListContentData = { name: string; value: number };

export async function fetchContentData(
  month: string,
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null
) {
  const supabase = supabaseServer();

  let campaignQuery = supabase
    .from("campaign")
    .select("ContentType, AudienceType, Revenue, StartDate, CampaignID")
    .order("Revenue", { ascending: false });

  // if (audience) {
  //   campaignQuery = campaignQuery.eq("AudienceType", audience);
  // }

  if (contentType) {
    campaignQuery = campaignQuery.eq("ContentType", contentType);
  }

  const { data: campaignData, error: campaignError } = await campaignQuery;

  if (campaignError) {
    console.error("Error fetching campaign data:", campaignError);
    return [];
  }

  let subscriberQuery = supabase.from("subscriber").select("*");

  if (satisfaction) {
    subscriberQuery = subscriberQuery.eq("Satisfaction", satisfaction);
  }
  if (audience) {
    subscriberQuery = subscriberQuery.eq("AudienceType", audience);
  }
  const { data: subscriberData, error: subscriberError } =
    await subscriberQuery;

  if (subscriberError) {
    console.error("Error fetching subscriber data:", subscriberError);
    return [];
  }

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
}
