"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/client";
import type { MatchRecord } from "@/lib/types";

// Helper to check if credentials are valid
function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    url &&
    key &&
    url !== "your_supabase_project_url_here" &&
    key !== "your_supabase_anon_key_here"
  );
}

// Client IP detection (headers helper is dynamic, so must run in Next.js Server Component/Action context)
async function getClientIp(): Promise<string> {
  try {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(",")[0].trim();
    }
    const realIp = headersList.get("x-real-ip");
    if (realIp) return realIp;
  } catch (e) {
    console.error("Error reading client IP headers:", e);
  }
  return "unknown";
}

export async function saveMatch(record: MatchRecord): Promise<void> {
  const ip = await getClientIp();
  const payload = {
    ...record,
    ip_address: ip,
  };

  if (!isSupabaseConfigured()) {
    console.log("[saveMatch] Supabase not configured. Client IP:", ip, "Payload:", payload);
    return;
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from("matches").insert({
      card_id: record.card_id,
      card_title: record.card_title,
      category: record.category,
      selected_option: record.selected_option ?? null,
      ip_address: ip,
    });

    if (error) {
      console.error("[saveMatch] Error inserting match:", error.message);
    }
  } catch (err) {
    console.error("[saveMatch] Unexpected error:", err);
  }
}

export async function saveExtraSuggestion(suggestion: string): Promise<void> {
  const ip = await getClientIp();

  if (!isSupabaseConfigured()) {
    console.log("[saveExtraSuggestion] Supabase not configured. Client IP:", ip, "Suggestion:", suggestion);
    return;
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from("matches").insert({
      card_id: "extra_suggestion",
      card_title: "Sugerencia Extra",
      category: "feedback",
      selected_option: suggestion,
      ip_address: ip,
    });

    if (error) {
      console.error("[saveExtraSuggestion] Error inserting suggestion:", error.message);
    }
  } catch (err) {
    console.error("[saveExtraSuggestion] Unexpected error:", err);
  }
}
