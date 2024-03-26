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

  revalidatePath("/");
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

  revalidatePath("/");
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

  revalidatePath("/");

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

  revalidatePath("/");

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
};

export async function fetchPlatformData(month: string) {
  const supabase = supabaseServer();

  const [
    { data: revenueData, error: revenueError },
    { data: impressionsData, error: impressionsError },
    { data: subscriptionsData, error: subscriptionsError },
  ] = await Promise.all([
    supabase.from("campaign").select("Platform, Revenue, StartDate"),
    supabase.from("campaign").select("Platform, Impressions, StartDate"),
    supabase.from("campaign").select('Platform, "NewSubscriptions", StartDate'),
  ]);

  if (revenueError || impressionsError || subscriptionsError) {
    console.error(
      "Error fetching platform data:",
      revenueError,
      impressionsError,
      subscriptionsError
    );
    return [];
  }

  const platformData: PlatformData[] = [];

  revenueData?.forEach((item) => {
    const platform = item.Platform || "";
    const revenue = item.Revenue || 0;
    const impressions =
      impressionsData?.find(
        (i) => i.Platform === platform && i.StartDate === item.StartDate
      )?.Impressions || 0;
    const subscriptions =
      subscriptionsData?.find(
        (s) => s.Platform === platform && s.StartDate === item.StartDate
      )?.NewSubscriptions || 0;

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
      } else {
        platformData.push({ platform, revenue, impressions, subscriptions });
      }
    }
  });

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
  contentType?: string | null
) {
  const supabase = supabaseServer();
  const query = supabase
    .from("campaign")
    .select("AudienceType, ContentType, Revenue, StartDate")
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
    const audienceTypeValue = item.AudienceType || "";
    const revenue = item.Revenue || 0;

    if (
      month === "all" ||
      (item.StartDate &&
        new Date(item.StartDate).toLocaleString("default", {
          month: "short",
        }) === month)
    ) {
      const existingAudienceType = contentData.find(
        (c) => c.name === audienceTypeValue
      );

      if (existingAudienceType) {
        existingAudienceType.value += revenue;
      } else {
        contentData.push({ name: audienceTypeValue, value: revenue });
      }
    }
  });

  revalidatePath("/dashboard");
  return contentData;
}
