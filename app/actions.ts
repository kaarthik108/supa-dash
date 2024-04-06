"use server";

import { runQuery } from "@/lib/db";
import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type PlatformData = {
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

function helperAge(age: string) {
  const [startAge, endAge] = age.split("-").map(Number);
  if (!isNaN(startAge) && !isNaN(endAge)) {
    return { startAge, endAge };
  }
  return { startAge: 0, endAge: 100 };
}

export async function fetchCampaignData(
  contentType?: string | null,
  campaignID?: number | null
) {
  const supabase = supabaseServer();

  const campaignQuery = supabase
    .from("campaign")
    .select(
      "Platform, Revenue, Impressions, NewSubscriptions, StartDate, AudienceType, ContentType, Clicks, CampaignID"
    );

  if (contentType) {
    campaignQuery.eq("ContentType", contentType);
  }

  if (campaignID) {
    campaignQuery.eq("CampaignID", campaignID);
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
  campaignIds?: number[],
  Location?: string | null,
  Age?: string | null
) {
  const supabase = supabaseServer();

  const { startAge, endAge } = helperAge(Age || "");

  const { data: subscriberData, error: subscriberError } = await supabase
    .from("subscriber_aggregated_data")
    .select("*")
    .eq(audience ? '"AudienceType"' : "", audience || "")
    .eq(satisfaction ? '"Satisfaction"' : "", satisfaction || "")
    .in(campaignIds ? '"CampaignID"' : "", campaignIds || [])
    .eq(Location ? '"Location"' : "", Location || "")
    .gte(Age ? '"Age"' : "", startAge)
    .lte(Age ? '"Age"' : "", endAge);

  if (subscriberError) {
    console.error("Error fetching subscriber data:", subscriberError);
    return [];
  }

  revalidatePath("/dashboard");
  return subscriberData;
}

export async function fetchPlatformData(
  month: string,
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null,
  location?: string | null,
  age?: string | null
) {
  const campaignData = await fetchCampaignData(contentType);
  const campaignIds = campaignData.map((campaign) => campaign.CampaignID);
  const subscriberData = await fetchSubscriberData(
    audience,
    satisfaction,
    campaignIds,
    location,
    age
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
  satisfaction?: string | null,
  location?: string | null,
  age?: string | null
) {
  let query = `
    WITH filtered_campaigns AS (
      SELECT DISTINCT "CampaignID"
      FROM subscriber_aggregated_data
      WHERE 1 = 1
  `;

  const conditions = [];

  if (satisfaction) {
    conditions.push(`"Satisfaction" = '${satisfaction}'`);
  }

  if (location) {
    conditions.push(`"Location" = '${location}'`);
  }

  if (age) {
    const { startAge, endAge } = helperAge(age);
    conditions.push(`"Age" BETWEEN ${startAge} AND ${endAge}`);
  }

  if (month !== "all") {
    conditions.push(`"CampaignMonth" = '${month.slice(0, 3)}'`);
  }

  if (conditions.length > 0) {
    query += `
      AND ${conditions.join(" AND ")}
    `;
  }

  query += `
    )
    SELECT
      "ContentType",
      SUM("Revenue") AS value
    FROM campaign
    WHERE "CampaignID" IN (SELECT "CampaignID" FROM filtered_campaigns)
  `;

  if (audience) {
    query += `
      AND "AudienceType" = '${audience}'
    `;
  }

  if (contentType) {
    query += `
      AND "ContentType" = '${contentType}'
    `;
  }

  query += `
    GROUP BY "ContentType";
  `;

  const result = await runQuery(query);

  // Convert the value from string to number
  const data = result.data.map((item: any) => ({
    name: item.ContentType,
    value: parseFloat(item.value),
  }));

  return data;
}

export async function fetchAudienceData(
  month: string,
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null,
  location?: string | null
) {
  let query = `
    WITH filtered_campaigns AS (
      SELECT DISTINCT "CampaignID"
      FROM subscriber_aggregated_data
      WHERE 1 = 1
  `;

  const conditions = [];

  if (satisfaction) {
    conditions.push(`"Satisfaction" = '${satisfaction}'`);
  }

  if (location) {
    conditions.push(`"Location" = '${location}'`);
  }

  if (month !== "all") {
    conditions.push(`"CampaignMonth" = '${month.slice(0, 3)}'`);
  }

  if (conditions.length > 0) {
    query += `
      AND ${conditions.join(" AND ")}
    `;
  }

  query += `
    )
    SELECT
      "AudienceType",
      SUM("Revenue") AS value
    FROM campaign
    WHERE "CampaignID" IN (SELECT "CampaignID" FROM filtered_campaigns)
  `;

  if (audience) {
    query += `
      AND "AudienceType" = '${audience}'
    `;
  }

  if (contentType) {
    query += `
      AND "ContentType" = '${contentType}'
    `;
  }

  query += `
    GROUP BY "AudienceType";
  `;

  const result = await runQuery(query);

  // Convert the value from string to number
  const data = result.data.map((item: any) => ({
    name: item.AudienceType,
    value: parseFloat(item.value),
  }));

  return data;
}

export async function fetchEngagementData(
  month: string,
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null,
  Location?: string | null,
  age?: string | null
) {
  let query = `
    WITH filtered_campaigns AS (
      SELECT DISTINCT "CampaignID"
      FROM subscriber_aggregated_data
      WHERE 1 = 1
  `;

  const conditions = [];

  if (audience) {
    conditions.push(`"AudienceType" = '${audience}'`);
  }

  if (contentType) {
    conditions.push(`"ContentType" = '${contentType}'`);
  }

  if (satisfaction) {
    conditions.push(`"Satisfaction" = '${satisfaction}'`);
  }

  if (Location) {
    conditions.push(`"Location" = '${Location}'`);
  }

  if (age) {
    const { startAge, endAge } = helperAge(age);
    conditions.push(`"Age" BETWEEN ${startAge} AND ${endAge}`);
  }

  if (month !== "all") {
    conditions.push(`"CampaignMonth" = '${month.slice(0, 3)}'`);
  }

  if (conditions.length > 0) {
    query += `
      AND ${conditions.join(" AND ")}
    `;
  }

  query += `
    )
    SELECT
      "Satisfaction" AS satisfaction,
      AVG("EngagementRate") AS engagementRate,
      COUNT(*) AS subscribers,
      AVG("ViewingTime") AS viewingTime
    FROM subscriber_aggregated_data
    WHERE "CampaignID" IN (SELECT "CampaignID" FROM filtered_campaigns)
    GROUP BY "Satisfaction";
  `;

  const result = await runQuery(query);

  // Convert the values from string to number
  const data = result.data.map((item: any) => ({
    satisfaction: item.satisfaction,
    engagementRate: parseFloat(item.engagementrate),
    subscribers: parseInt(item.subscribers, 10),
    viewingTime: parseFloat(item.viewingtime),
  }));

  return data;
}

export async function fetchSubscribersByLocation(
  month: string,
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null,
  location?: string | null,
  age?: string | null
) {
  let query = `
    WITH filtered_campaigns AS (
      SELECT DISTINCT "CampaignID"
      FROM subscriber_aggregated_data
      WHERE 1 = 1
  `;

  const conditions = [];

  if (audience) {
    conditions.push(`"AudienceType" = '${audience}'`);
  }

  if (contentType) {
    conditions.push(`"ContentType" = '${contentType}'`);
  }

  if (satisfaction) {
    conditions.push(`"Satisfaction" = '${satisfaction}'`);
  }

  if (location) {
    conditions.push(`"Location" = '${location}'`);
  }

  if (age) {
    const { startAge, endAge } = helperAge(age);
    conditions.push(`"Age" BETWEEN ${startAge} AND ${endAge}`);
  }

  if (month !== "all") {
    conditions.push(`"CampaignMonth" = '${month.slice(0, 3)}'`);
  }

  if (conditions.length > 0) {
    query += `
      AND ${conditions.join(" AND ")}
    `;
  }

  query += `
    )
    SELECT
      "Location",
      COUNT(*) AS subscribers
    FROM subscriber_aggregated_data
    WHERE "CampaignID" IN (SELECT "CampaignID" FROM filtered_campaigns)
    GROUP BY "Location";
  `;

  const result = await runQuery(query);

  const subscribersByLocation: { [key: string]: number } = {};
  result.data.forEach((item: any) => {
    subscribersByLocation[item.Location] = parseInt(item.subscribers, 10);
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
  let query = `
    WITH filtered_campaigns AS (
      SELECT DISTINCT "CampaignID"
      FROM subscriber_aggregated_data
      WHERE 1 = 1
  `;

  const conditions = [];

  if (audience) {
    conditions.push(`"AudienceType" = '${audience}'`);
  }

  if (contentType) {
    conditions.push(`"ContentType" = '${contentType}'`);
  }

  if (satisfaction) {
    conditions.push(`"Satisfaction" = '${satisfaction}'`);
  }

  if (location) {
    conditions.push(`"Location" = '${location}'`);
  }

  if (month !== "all") {
    conditions.push(`"CampaignMonth" = '${month.slice(0, 3)}'`);
  }

  if (conditions.length > 0) {
    query += `
      AND ${conditions.join(" AND ")}
    `;
  }

  query += `
    )
    SELECT
      "Age"
    FROM subscriber_aggregated_data
    WHERE "CampaignID" IN (SELECT "CampaignID" FROM filtered_campaigns);
  `;

  const result = await runQuery(query);

  const ageDistribution: { [key: string]: number } = {};

  result.data.forEach((item: any) => {
    const age = item.Age;
    if (age !== null) {
      const ageGroup = `${Math.floor(age / 10) * 10}-${
        Math.floor(age / 10) * 10 + 9
      }`;
      ageDistribution[ageGroup] = (ageDistribution[ageGroup] || 0) + 1;
    }
  });

  return ageDistribution;
}
