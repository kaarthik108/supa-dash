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

export async function fetchRevenueData(): Promise<RevenueData[] | null> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("campaign")
    .select("Revenue, StartDate")
    .order("StartDate", { ascending: true });

  revalidatePath("/");

  if (error) {
    console.error("Error fetching revenue data:", error);
    return null;
  } else {
    return data;
  }
}
export async function fetchBudgeteData(): Promise<BudgetData[] | null> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("campaign")
    .select("Budget, StartDate")
    .order("StartDate", { ascending: true });

  revalidatePath("/");

  if (error) {
    console.error("Error fetching revenue data:", error);
    return null;
  } else {
    return data;
  }
}
export async function fetchImpressionData(): Promise<ImpressionData[] | null> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("campaign")
    .select("Impressions, StartDate")
    .order("StartDate", { ascending: true });

  revalidatePath("/");

  if (error) {
    console.error("Error fetching revenue data:", error);
    return null;
  } else {
    return data;
  }
}
export async function fetchClicksData(): Promise<ClicksData[] | null> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("campaign")
    .select("Clicks, StartDate")
    .order("StartDate", { ascending: true });

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

export async function fetchPlatformData() {
  const supabase = supabaseServer();

  const { data: revenueData, error: revenueError } = await supabase
    .from("campaign")
    .select("Platform, Revenue");

  const { data: impressionsData, error: impressionsError } = await supabase
    .from("campaign")
    .select("Platform, Impressions");

  const { data: subscriptionsData, error: subscriptionsError } = await supabase
    .from("campaign")
    .select('Platform, "NewSubscriptions"');

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
      impressionsData?.find((i) => i.Platform === platform)?.Impressions || 0;
    const subscriptions =
      subscriptionsData?.find((s) => s.Platform === platform)
        ?.NewSubscriptions || 0;

    const existingPlatform = platformData.find((p) => p.platform === platform);

    if (existingPlatform) {
      existingPlatform.revenue += revenue;
      existingPlatform.impressions += impressions;
      existingPlatform.subscriptions += subscriptions;
    } else {
      platformData.push({ platform, revenue, impressions, subscriptions });
    }
  });

  return platformData;
}
