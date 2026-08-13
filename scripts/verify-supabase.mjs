import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

function readEnv(path) {
  const result = {};
  for (const rawLine of readFileSync(path, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const split = line.indexOf("=");
    if (split < 1) continue;
    const key = line.slice(0, split).trim();
    let value = line.slice(split + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    result[key] = value;
  }
  return result;
}

const env = readEnv(new URL("../.env.local", import.meta.url));
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key || !serviceKey) throw new Error("Supabase URL/public key/service key is missing from .env.local");

const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const adminClient = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const id = randomUUID();
const objectPath = `_health/${id}.txt`;
let inserted = false;
let frameInserted = false;
let uploaded = false;

try {
  const { data: existing, error: readError } = await client
    .from("pins")
    .select("id,name,lat,lng,photo_url,card_url,theme,filter,finish,likes,visible,created_at")
    .eq("visible", true)
    .limit(3);
  if (readError) throw new Error(`pins read failed: ${readError.message}`);
  console.log(`PASS database read (${existing.length} visible rows sampled)`);

  const { error: sharedColumnError } = await client.from("pins").select("shared_card_id").limit(1);
  if (sharedColumnError) console.warn("WARN pins.shared_card_id migration pending; URL inference fallback remains active");
  else console.log("PASS pins.shared_card_id column");

  const { error: framesError } = await client.from("frames").select("id,card_url,visible").limit(1);
  if (framesError) throw new Error(`frames read failed: ${framesError.message}`);
  console.log("PASS personalized card table read");

  const row = {
    id,
    name: "__HHGOA_DEPLOYMENT_CHECK__",
    stack: "automated health check",
    title: "Deployment Check",
    handle: "",
    city: "Goa",
    id_number: `CHECK-${id.slice(0, 8)}`,
    format: "pass",
    theme: "official",
    filter: "natural",
    finish: "goa",
    lat: 15.2993,
    lng: 74.124,
    visible: true,
  };
  const { data: created, error: insertError } = await client.from("pins").insert(row).select("id,name,visible").single();
  if (insertError || created?.id !== id) throw new Error(`pins insert/select failed: ${insertError?.message || "unexpected response"}`);
  inserted = true;
  console.log("PASS database insert + select policy");

  const { data: frame, error: frameError } = await client.from("frames").insert({
    id,
    name: "__HHGOA_SHARED_CARD_CHECK__",
    handle: "",
    format: "pass",
    theme: "official",
    card_url: `https://example.com/${id}.png`,
    visible: true,
  }).select("id,name,card_url,visible").single();
  if (frameError || frame?.id !== id) throw new Error(`frames insert/select failed: ${frameError?.message || "unexpected response"}`);
  frameInserted = true;
  console.log("PASS personalized card insert + public select policy");

  const payload = new Blob(["HH Goa storage health check"], { type: "text/plain" });
  const { error: uploadError } = await client.storage.from("pins").upload(objectPath, payload, { contentType: "text/plain", upsert: true });
  if (uploadError) throw new Error(`storage upload failed: ${uploadError.message}`);
  uploaded = true;
  const { data: publicData } = client.storage.from("pins").getPublicUrl(objectPath);
  const response = await fetch(publicData.publicUrl, { cache: "no-store" });
  if (!response.ok) throw new Error(`public storage read failed: HTTP ${response.status}`);
  console.log("PASS storage upload + public read");
} finally {
  if (uploaded) {
    const { error } = await adminClient.storage.from("pins").remove([objectPath]);
    if (error) console.warn(`WARN storage cleanup failed: ${error.message}`);
    else console.log("PASS storage cleanup");
  }
  if (frameInserted) {
    const { error } = await adminClient.from("frames").delete().eq("id", id);
    if (error) console.warn(`WARN frame cleanup failed: ${error.message}`);
    else console.log("PASS personalized card cleanup");
  }
  if (inserted) {
    const { error } = await adminClient.from("pins").delete().eq("id", id);
    if (error) console.warn(`WARN database cleanup failed: ${error.message}`);
    else console.log("PASS database cleanup");
  }
}

console.log("SUPABASE HEALTH CHECK COMPLETE");
