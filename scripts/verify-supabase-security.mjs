import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const env = {};
for (const raw of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split(/\r?\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith("#")) continue;
  const index = line.indexOf("=");
  if (index < 1) continue;
  let value = line.slice(index + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
  env[line.slice(0, index).trim()] = value;
}
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const publicKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !publicKey || !serviceKey) throw new Error("Required Supabase environment is incomplete");

const publicClient = createClient(url, publicKey, { auth: { persistSession: false } });
const adminClient = createClient(url, serviceKey, { auth: { persistSession: false } });
const id = randomUUID();
const objectPath = `_health/security-${id}.txt`;
let objectExists = false;

try {
  const { error: insertError } = await publicClient.from("pins").insert({
    id,
    name: "__HHGOA_RLS_CHECK__",
    lat: 15.2993,
    lng: 74.124,
    visible: true,
  });
  if (insertError) throw new Error(`Unable to create security probe row: ${insertError.message}`);

  const { error: updateError } = await publicClient.from("pins").update({ visible: false }).eq("id", id);
  if (!updateError) throw new Error("SECURITY BLOCKER: anonymous users can still update arbitrary pins. Rerun supabase/schema.sql.");
  console.log("PASS anonymous pin updates are denied");

  const payload = new Blob(["HH Goa RLS probe"], { type: "text/plain" });
  const { error: uploadError } = await publicClient.storage.from("pins").upload(objectPath, payload);
  if (uploadError) throw new Error(`Public insert policy failed: ${uploadError.message}`);
  objectExists = true;

  const { error: removeError } = await publicClient.storage.from("pins").remove([objectPath]);
  if (!removeError) {
    objectExists = false;
    throw new Error("SECURITY BLOCKER: anonymous users can still delete storage objects. Rerun supabase/schema.sql.");
  }
  console.log("PASS anonymous storage deletes are denied");
} finally {
  if (objectExists) await adminClient.storage.from("pins").remove([objectPath]);
  await adminClient.from("pins").delete().eq("id", id);
  console.log("PASS security probe cleanup");
}

console.log("SUPABASE SECURITY CHECK COMPLETE");
