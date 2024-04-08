"use server";

import { runQuery } from "@/lib/db";

function helperAge(age: string) {
  const [startAge, endAge] = age.split("-").map(Number);
  if (!isNaN(startAge) && !isNaN(endAge)) {
    return { startAge, endAge };
  }
  return { startAge: 0, endAge: 100 };
}

export async function fetchContentData(
  month: string = "all",
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null,
  location?: string | null,
  age?: string | null,
  Platform?: string | null,
  campaignId?: string | null
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
  if (Platform) {
    conditions.push(`"Platform" = '${Platform}'`);
  }

  if (campaignId) {
    conditions.push(`"CampaignID" = '${campaignId}'`);
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
  month: string = "all",
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null,
  location?: string | null,
  age?: string | null,
  Platform?: string | null,
  campaignId?: string | null
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

  if (Platform) {
    conditions.push(`"Platform" = '${Platform}'`);
  }

  if (campaignId) {
    conditions.push(`"CampaignID" = '${campaignId}'`);
  }

  if (age) {
    const { startAge, endAge } = helperAge(age);
    conditions.push(`"Age" BETWEEN ${startAge} AND ${endAge}`);
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
  month: string = "all",
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null,
  Location?: string | null,
  age?: string | null,
  Platform?: string | null,
  campaignId?: string | null
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

  if (Platform) {
    conditions.push(`"Platform" = '${Platform}'`);
  }

  if (campaignId) {
    conditions.push(`"CampaignID" = '${campaignId}'`);
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
  month: string = "all",
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null,
  location?: string | null,
  age?: string | null,
  Platform?: string | null,
  campaignId?: string | null
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

  if (Platform) {
    conditions.push(`"Platform" = '${Platform}'`);
  }

  if (campaignId) {
    conditions.push(`"CampaignID" = '${campaignId}'`);
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
  month: string = "all",
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null,
  location?: string | null,
  age?: string | null,
  Platform?: string | null,
  campaignId?: string | null
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
  if (Platform) {
    conditions.push(`"Platform" = '${Platform}'`);
  }

  if (campaignId) {
    conditions.push(`"CampaignID" = '${campaignId}'`);
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
export type PlatformData = {
  platform: string;
  revenue: number;
  ROI: number;
  CPA: number;
  CTR: number;
  ConversionRate: number;
};

export async function fetchPlatformData(
  month: string = "all",
  audience?: string | null,
  contentType?: string | null,
  satisfaction?: string | null,
  location?: string | null,
  age?: string | null,
  Platform?: string | null,
  campaignId?: string | null
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
  if (Platform) {
    conditions.push(`"Platform" = '${Platform}'`);
  }

  if (campaignId) {
    conditions.push(`"CampaignID" = '${campaignId}'`);
  }

  if (month !== "all") {
    conditions.push(`"CampaignMonth" = '${month.slice(0, 3)}'`);
  }

  if (conditions.length > 0) {
    query += `
      AND ${conditions.join(" AND ")}
    `;
  }

  // df['ROI'] = (df['Revenue'] - df['Budget']) / df['Budget']

  // # Calculate CPA
  // df['CPA'] = df['Budget'] / df['NewSubscriptions']

  // # Calculate CTR (Click-Through Rate)
  // df['CTR'] = (df['Clicks'] / df['Impressions']) * 100

  // # Calculate Conversion Rate
  // df['ConversionRate'] = (df['NewSubscriptions'] / df['Clicks']) * 100

  query += `
  )
  SELECT
    "Platform",
    SUM("Revenue") AS revenue,
    ROUND((SUM("Revenue") - SUM("Budget")) / SUM("Budget") * 100)::numeric(10,2) AS ROI,
    ROUND(SUM("Budget") / SUM("NewSubscriptions"))::numeric(10,2) AS CPA,
    ROUND((SUM("Clicks") / SUM("Impressions")) * 100)::numeric(10,2) AS CTR,
    ROUND((SUM("NewSubscriptions") / SUM("Clicks")) * 100)::numeric(10,2) AS ConversionRate

  FROM campaign
  WHERE "CampaignID" IN (SELECT "CampaignID" FROM filtered_campaigns)
  GROUP BY "Platform";
  `;
  const result = await runQuery(query);

  // Convert the values from string to number
  const data = result.data.map((item: any) => ({
    platform: item.Platform,
    revenue: parseFloat(item.revenue),
    ROI: parseFloat(item.roi),
    CPA: parseFloat(item.cpa),
    CTR: parseFloat(item.ctr),
    ConversionRate: parseFloat(item.conversionrate),
  }));

  return data;
}

export async function fetchCampaignIds() {
  let query = `
  SELECT DISTINCT "CampaignID" FROM campaign;
  `;

  const result = await runQuery(query);

  return result.data;
}
