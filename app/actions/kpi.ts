"use server";

import { runQuery } from "@/lib/db";
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
function helperAge(age: string) {
  const [startAge, endAge] = age.split("-").map(Number);
  if (!isNaN(startAge) && !isNaN(endAge)) {
    return { startAge, endAge };
  }
  return { startAge: 0, endAge: 100 };
}

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
  campaignId?: number[]
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
  if (campaignId) {
    query = query.in("CampaignID", campaignId);
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

export async function fetchRevenueData(
  month: string = "all",
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null,
  location?: string | null,
  age?: string | null,
  platform?: string | null,
  campaignId?: string | null
): Promise<{ CampaignMonth: string; Revenue: string }[]> {
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

  if (platform) {
    conditions.push(`"Platform" = '${platform}'`);
  }

  if (campaignId) {
    conditions.push(`"CampaignID" = '${campaignId}'`);
  }

  if (age) {
    const { startAge, endAge } = helperAge(age);
    conditions.push(`"Age" BETWEEN ${startAge} AND ${endAge}`);
  }

  if (month && month !== "all") {
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
      TO_CHAR(DATE_TRUNC('month', TO_DATE("StartDate", 'DD.MM.YYYY')), 'Mon') AS "CampaignMonth",
      SUM("Revenue") AS "Revenue"
    FROM campaign
    WHERE "CampaignID" IN (SELECT "CampaignID" FROM filtered_campaigns)
    group by "CampaignMonth";
  `;
  const result = await runQuery(query);

  revalidatePath("/dashboard");
  return result.data as { CampaignMonth: string; Revenue: string }[];
}

export async function fetchBudgetData(
  month: string = "all",
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null,
  location?: string | null,
  age?: string | null,
  platform?: string | null,
  campaignId?: string | null
): Promise<{ CampaignMonth: string; Budget: string }[]> {
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
  if (platform) {
    conditions.push(`"Platform" = '${platform}'`);
  }
  if (campaignId) {
    conditions.push(`"CampaignID" = '${campaignId}'`);
  }

  if (month && month !== "all") {
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
      TO_CHAR(DATE_TRUNC('month', TO_DATE("StartDate", 'DD.MM.YYYY')), 'Mon') AS "CampaignMonth",
      SUM("Budget") AS "Budget"
    FROM campaign
    WHERE "CampaignID" IN (SELECT "CampaignID" FROM filtered_campaigns)
    group by "CampaignMonth";
  `;

  const result = await runQuery(query);

  revalidatePath("/dashboard");
  return result.data as { CampaignMonth: string; Budget: string }[];
}

export async function fetchImpressionData(
  month: string = "all",
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null,
  location?: string | null,
  age?: string | null,
  platform?: string | null,
  campaignId?: string | null
): Promise<{ CampaignMonth: string; Impressions: string }[]> {
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
  if (platform) {
    conditions.push(`"Platform" = '${platform}'`);
  }
  if (campaignId) {
    conditions.push(`"CampaignID" = '${campaignId}'`);
  }

  if (month && month !== "all") {
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
      TO_CHAR(DATE_TRUNC('month', TO_DATE("StartDate", 'DD.MM.YYYY')), 'Mon') AS "CampaignMonth",
      SUM("Impressions") AS "Impressions"
    FROM campaign
    WHERE "CampaignID" IN (SELECT "CampaignID" FROM filtered_campaigns)
    group by "CampaignMonth";
  `;

  const result = await runQuery(query);

  revalidatePath("/dashboard");
  return result.data as { CampaignMonth: string; Impressions: string }[];
}

export async function fetchClicksData(
  month: string = "all",
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null,
  location?: string | null,
  age?: string | null,
  platform?: string | null,
  campaignId?: string | null
): Promise<{ CampaignMonth: string; Clicks: string }[]> {
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
  if (platform) {
    conditions.push(`"Platform" = '${platform}'`);
  }
  if (campaignId) {
    conditions.push(`"CampaignID" = '${campaignId}'`);
  }

  if (month && month !== "all") {
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
      TO_CHAR(DATE_TRUNC('month', TO_DATE("StartDate", 'DD.MM.YYYY')), 'Mon') AS "CampaignMonth",
      SUM("Clicks") AS "Clicks"
    FROM campaign
    WHERE "CampaignID" IN (SELECT "CampaignID" FROM filtered_campaigns)
    group by "CampaignMonth";
  `;

  const result = await runQuery(query);

  revalidatePath("/dashboard");
  return result.data as { CampaignMonth: string; Clicks: string }[];
}

export async function fetchSubsData(
  month: string = "all",
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null,
  location?: string | null,
  age?: string | null,
  platform?: string | null,
  campaignId?: string | null
): Promise<{ CampaignMonth: string; NewSubscriptions: string }[]> {
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
  if (platform) {
    conditions.push(`"Platform" = '${platform}'`);
  }
  if (campaignId) {
    conditions.push(`"CampaignID" = '${campaignId}'`);
  }

  if (month && month !== "all") {
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
      TO_CHAR(DATE_TRUNC('month', TO_DATE("StartDate", 'DD.MM.YYYY')), 'Mon') AS "CampaignMonth",
      SUM("NewSubscriptions") AS "NewSubscriptions"
    FROM campaign
    WHERE "CampaignID" IN (SELECT "CampaignID" FROM filtered_campaigns)
    group by "CampaignMonth";
  `;

  const result = await runQuery(query);

  revalidatePath("/dashboard");
  return result.data as { CampaignMonth: string; NewSubscriptions: string }[];
}
