import { createClient } from "@supabase/supabase-js";
import { CLASSES, uid, type Format, type MoodId, type ThemeId } from "@/lib/constants";
import type { StudioState } from "@/context/AppContext";
import { getSupabase } from "@/lib/supabase/client";
import { uploadBlob } from "@/lib/supabase/pins";

export type SharedCard = {
  id: string;
  name: string;
  handle: string;
  stack: string;
  title: string;
  city: string;
  idNumber: string;
  mood: MoodId | string;
  format: Format;
  theme: ThemeId | string;
  cardUrl: string;
  featured: boolean;
  createdAt: string;
};

function normalize(row: Record<string, unknown>): SharedCard {
  return {
    id: String(row.id || ""),
    name: String(row.name || "Builder"),
    handle: String(row.handle || ""),
    stack: String(row.stack || ""),
    title: String(row.title || "Builder"),
    city: String(row.city || ""),
    idNumber: String(row.id_number || ""),
    mood: String(row.mood || "LOCKED IN"),
    format: (row.format as Format) || "pass",
    theme: String(row.theme || "official"),
    cardUrl: String(row.card_url || ""),
    featured: Boolean(row.featured),
    createdAt: String(row.created_at || new Date().toISOString()),
  };
}

export async function createSharedCard(blob: Blob, studio: StudioState): Promise<SharedCard | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const id = uid();
  const cardUrl = await uploadBlob(`shared/${id}.png`, blob, "image/png");
  if (!cardUrl) return null;
  const row = {
    id,
    name: studio.name.trim() || "Goa Builder",
    handle: studio.handle.trim(),
    stack: studio.stack.trim() || "Builder",
    title: CLASSES.find((item) => item.id === studio.titleId)?.label || "Builder",
    city: studio.city.trim() || studio.locationLabel || "Goa",
    id_number: studio.idNumber,
    mood: studio.mood,
    format: studio.format,
    theme: studio.theme,
    card_url: cardUrl,
    visible: true,
  };
  let result = await supabase.from("frames").insert(row).select("*").single();
  if (result.error && /column|schema cache/i.test(result.error.message)) {
    result = await supabase.from("frames").insert({
      id,
      name: row.name,
      handle: row.handle,
      format: row.format,
      theme: row.theme,
      card_url: row.card_url,
      visible: true,
    }).select("*").single();
  }
  if (result.error || !result.data) {
    console.warn("shared card insert failed", result.error?.message);
    return null;
  }
  return normalize(result.data as Record<string, unknown>);
}

export async function getSharedCardServer(id: string): Promise<SharedCard | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase
    .from("frames")
    .select("*")
    .eq("id", id)
    .eq("visible", true)
    .maybeSingle();
  if (error || !data) return null;
  return normalize(data as Record<string, unknown>);
}
