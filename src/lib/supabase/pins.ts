import { LOCAL_KEY, type Pin, uid } from "@/lib/constants";
import { getSupabase } from "@/lib/supabase/client";

export function loadLocalPins(): Pin[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveLocalPins(pins: Pin[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(pins.slice(0, 200)));
}

function normalizePin(p: Record<string, unknown>): Pin {
  return {
    id: String(p.id || uid()),
    name: String(p.name || "Builder"),
    stack: String(p.stack || ""),
    title: String(p.title || ""),
    handle: String(p.handle || ""),
    city: String(p.city || ""),
    idNumber: String(p.id_number || p.idNumber || ""),
    format: (p.format as Pin["format"]) || "pass",
    lat: Number(p.lat),
    lng: Number(p.lng),
    photo: (p.photo_url as string) || (p.photo as string) || null,
    cardUrl: (p.card_url as string) || (p.cardUrl as string) || null,
    kind: (p.kind as Pin["kind"]) || "builder",
    isSelf: Boolean(p.isSelf),
    createdAt: String(p.created_at || p.createdAt || new Date().toISOString()),
    theme: (p.theme as Pin["theme"]) || "official",
  };
}

export async function fetchPins(): Promise<Pin[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from("pins")
        .select("*")
        .eq("visible", true)
        .order("created_at", { ascending: false })
        .limit(500);
      if (!error && data) {
        const local = loadLocalPins().filter((p) => p.isSelf);
        const localSelfIds = new Set(local.map((p) => p.id));
        const remote = data.map((row) => {
          const pin = normalizePin(row as Record<string, unknown>);
          if (localSelfIds.has(pin.id)) {
            pin.isSelf = true;
            pin.kind = "you";
          }
          return pin;
        });
        // Merge local self pins that may not have synced yet.
        const ids = new Set(remote.map((p) => p.id));
        const merged = [...local.filter((p) => !ids.has(p.id)), ...remote];
        return merged;
      }
    } catch (e) {
      console.warn("Supabase fetch failed", e);
    }
  }
  return loadLocalPins();
}

export async function uploadBlob(
  path: string,
  blob: Blob,
  contentType = "image/png"
): Promise<string | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { error } = await sb.storage.from("pins").upload(path, blob, {
      contentType,
      upsert: false,
    });
    if (error) throw error;
    const { data } = sb.storage.from("pins").getPublicUrl(path);
    return data?.publicUrl || null;
  } catch (e) {
    console.warn("upload failed", e);
    return null;
  }
}

export async function savePin(
  pin: Pin,
  meta?: { theme?: string; filter?: string; finish?: string }
): Promise<Pin> {
  const local = loadLocalPins().filter((p) => p.id !== pin.id && !p.isSelf);
  if (pin.isSelf) {
    // only one self pin
  }
  local.unshift(pin);
  saveLocalPins(local);

  const sb = getSupabase();
  if (sb) {
    try {
      const row: Record<string, unknown> = {
        name: pin.name,
        stack: pin.stack,
        title: pin.title,
        handle: pin.handle,
        city: pin.city,
        id_number: pin.idNumber,
        format: pin.format,
        theme: meta?.theme || pin.theme || "official",
        filter: meta?.filter || "natural",
        finish: meta?.finish || "goa",
        lat: pin.lat,
        lng: pin.lng,
        photo_url: pin.photo,
        card_url: pin.cardUrl,
        visible: true,
      };
      // only send uuid if valid
      if (pin.id && /^[0-9a-f-]{36}$/i.test(pin.id)) row.id = pin.id;

      const { data, error } = await sb.from("pins").insert(row).select().single();
      if (!error && data) {
        const saved = normalizePin(data as Record<string, unknown>);
        saved.isSelf = pin.isSelf;
        const updated = [saved, ...loadLocalPins().filter((p) => p.id !== saved.id && !p.isSelf)];
        saveLocalPins(updated);
        return saved;
      }
      if (error) console.warn("pin insert", error.message);
    } catch (e) {
      console.warn("Supabase insert failed", e);
    }
  }
  return pin;
}
