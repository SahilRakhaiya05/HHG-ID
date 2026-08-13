import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getRuntimeConfig } from "@/lib/runtime-config";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  const runtime = getRuntimeConfig();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || runtime.supabaseUrl;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    runtime.supabaseAnonKey ||
    runtime.supabasePublishableKey;
  if (!url || !key) return null;
  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

export function supabaseConfigured() {
  return !!(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || getRuntimeConfig().supabaseUrl) &&
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      getRuntimeConfig().supabaseAnonKey ||
      getRuntimeConfig().supabasePublishableKey)
  );
}
