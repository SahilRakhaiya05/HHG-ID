export type HHGoaRuntimeConfig = {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabasePublishableKey?: string;
  adminPassword?: string;
  event?: {
    name?: string;
    hashtag?: string;
    dates?: string;
    hq?: {
      lat?: number;
      lng?: number;
      label?: string;
    };
  };
};

export function getRuntimeConfig(): HHGoaRuntimeConfig {
  if (typeof window === "undefined") return {};
  return (window as Window & { HHGOA_CONFIG?: HHGoaRuntimeConfig }).HHGOA_CONFIG || {};
}