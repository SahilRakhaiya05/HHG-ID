import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type RequestBody = {
  password?: string;
  action?: "list" | "hide";
  id?: string;
};

function passwordMatches(received = "") {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected || !received) return false;
  const actualBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function POST(request: Request) {
  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!passwordMatches(body.password)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Admin Supabase environment is incomplete" }, { status: 503 });
  }

  if (body.action === "hide") {
    if (!body.id || !/^[0-9a-f-]{36}$/i.test(body.id)) {
      return NextResponse.json({ error: "Invalid pin ID" }, { status: 400 });
    }
    const { error } = await supabase.from("pins").update({ visible: false }).eq("id", body.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  const { data, error } = await supabase
    .from("pins")
    .select("id,name,stack,title,handle,city,id_number,format,theme,lat,lng,photo_url,card_url,visible,created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const pins = (data || []).map((pin) => ({
    id: pin.id,
    name: pin.name || "Builder",
    stack: pin.stack || "",
    title: pin.title || "",
    handle: pin.handle || "",
    city: pin.city || "",
    idNumber: pin.id_number || "",
    format: pin.format || "pass",
    theme: pin.theme || "official",
    lat: Number(pin.lat),
    lng: Number(pin.lng),
    photo: pin.photo_url || null,
    cardUrl: pin.card_url || null,
    sharedCardId: pin.card_url?.includes(`/shared/${pin.id}.png`) ? pin.id : null,
    kind: "builder",
    createdAt: pin.created_at,
  }));
  return NextResponse.json({ pins }, { headers: { "Cache-Control": "no-store" } });
}
