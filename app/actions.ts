"use server";

import { supabaseServer } from "@/lib/supabase/server";
type RevenueData = {
  Revenue: number | null;
  StartDate: string | null;
};

export async function fetchRevenueData(): Promise<RevenueData[] | null> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("campaign")
    .select("Revenue, StartDate")
    .order("StartDate", { ascending: true });

  if (error) {
    console.error("Error fetching revenue data:", error);
    return null;
  } else {
    return data;
  }
}
