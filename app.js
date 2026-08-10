/**
 * HH Goa 2026 · Frame In Goa
 * Format A: PFP · Format B: Builder ID · Map pins · Supabase / localStorage
 */

const CFG = window.HHGOA_CONFIG || {};
const HQ = CFG.event?.hq || { lat: 15.5736, lng: 73.7419, label: "HH Goa HQ" };
const HASHTAG = CFG.event?.hashtag || "#FrameInGoa";
const LOCAL_KEY = "hhgoa_pins_v1";

const CLASSES = [
  { id: "terminal-surfer", label: "Terminal Surfer" },
  { id: "cache-raider", label: "Cache Raider" },
  { id: "wave-rider", label: "Wave Rider" },
  { id: "coconut-courier", label: "Coconut Courier" },
  { id: "harbor-hopper", label: "Harbor Hopper" },
  { id: "night-champion", label: "Night Champion" },
  { id: "comfort-coder", label: "Comfort Coder" },
];

const PASS = {
  W: 1536,
  H: 1024,
  photo: { cx: 340, cy: 520, r: 168 },
  name: { x: 580, y: 360, maxW: 860 },
  stack: { x: 580, y: 470, maxW: 860 },
  title: { x: 580, y: 600, maxW: 860 },
  id: { x: 580, y: 720 },
  meta: { x: 580, y: 770 },
};

const PFP = { W: 1080, H: 1080, r: 420 };

/** Collectible card themes — Pokémon / signed-foil energy */
const THEMES = {
  emerald: {
    bg0: "#052c17", bg1: "#0b6839", bg2: "#02140c",
    accent: "#FEE101", accent2: "#7DFFC8", text: "#FFF8EB", mute: "rgba(255,248,235,.72)",
    classCol: "#E52B50", foil: ["#fff8b0", "#fee101", "#c4a800", "#7dffc8", "#fee101"],
  },
  sunset: {
    bg0: "#2a1208", bg1: "#8b3a12", bg2: "#1a0a04",
    accent: "#FFB84D", accent2: "#FEE101", text: "#FFF5E6", mute: "rgba(255,245,230,.72)",
    classCol: "#FF6B35", foil: ["#fff0c0", "#ffb84d", "#ff6b35", "#fee101", "#ffb84d"],
  },
  ocean: {
    bg0: "#041828", bg1: "#0a4a62", bg2: "#021018",
    accent: "#56D8EF", accent2: "#7DFFC8", text: "#E8F8FF", mute: "rgba(232,248,255,.72)",
    classCol: "#FF9C58", foil: ["#b8f0ff", "#56d8ef", "#0b6839", "#7dffc8", "#56d8ef"],
  },
  neon: {
    bg0: "#0a0418", bg1: "#1a0a38", bg2: "#050210",
    accent: "#FF2D84", accent2: "#7DFFC8", text: "#F5EDFF", mute: "rgba(245,237,255,.72)",
    classCol: "#FEE101", foil: ["#ff9cdb", "#ff2d84", "#7dffc8", "#c080ff", "#ff2d84"],
  },
  holo: {
    bg0: "#0c1020", bg1: "#1a2848", bg2: "#060810",
    accent: "#FEE101", accent2: "#56D8EF", text: "#FFFFFF", mute: "rgba(255,255,255,.75)",
    classCol: "#FF6BCB", foil: ["#ff9cdb", "#56d8ef", "#fee101", "#7dffc8", "#c080ff", "#fee101"],
  },
};

const $ = (id) => document.getElementById(id);

const state = {
  view: "landing",
  format: "pass", // pass | pfp
  image: null,
  objectUrl: null,
  zoom: 1.15,
  panX: 0,
  panY: 0,
  name: "",
  stack: "",
  titleId: CLASSES[(Math.random() * CLASSES.length) | 0].id,
  theme: "emerald",
  handle: "",
  city: "",
  idNumber: "",
  passTpl: null,
  logoMark: null,
  goaMark: null,
  stickers: {},
  pins: [],
  map: null,
  mapReady: false,
  markers: new Map(),
  pickMode: false,
  pickLat: null,
  pickLng: null,
  pickLabel: "",
  locationSet: false,
  lat: null,
  lng: null,
  locationLabel: "",
  tempMark: null,
  sb: null,
  returnAfterPick: false,
  radarStop: null,
  soundOn: true,
};

/* ── Supabase ── */
function initSupabase() {
  const url = CFG.supabaseUrl;
  const key = CFG.supabaseAnonKey;
  if (!url || !key || !window.supabase) return null;
  try {
    return window.supabase.createClient(url, key);
  } catch {
    return null;
  }
}

function loadLocalPins() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocalPins(pins) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(pins));
}

async function fetchPins() {
  if (state.sb) {
    try {
      const { data, error } = await state.sb
        .from("pins")
        .select("*")
        .eq("visible", true)
        .order("created_at", { ascending: false })
        .limit(500);
      if (!error && data) {
        state.pins = data.map(normalizePin);
        return state.pins;
      }
    } catch (e) {
      console.warn("Supabase fetch failed, using local", e);
    }
  }
  state.pins = loadLocalPins();
  return state.pins;
}

function normalizePin(p) {
  return {
    id: p.id,
    name: p.name || "Builder",
    stack: p.stack || "",
    title: p.title || "",
    handle: p.handle || "",
    city: p.city || "",
    idNumber: p.id_number || p.idNumber || "",
    format: p.format || "pass",
    lat: +p.lat,
    lng: +p.lng,
    photo: p.photo_url || p.photo || null,
    cardUrl: p.card_url || p.cardUrl || null,
    kind: p.kind || "builder",
    createdAt: p.created_at || p.createdAt || new Date().toISOString(),
  };
}

async function uploadBlob(path, blob, contentType = "image/png") {
  if (!state.sb) return null;
  try {
    const { error } = await state.sb.storage.from("pins").upload(path, blob, {
      contentType,
      upsert: true,
    });
    if (error) throw error;
    const { data } = state.sb.storage.from("pins").getPublicUrl(path);
    return data?.publicUrl || null;
  } catch (e) {
    console.warn("upload failed", e);
    return null;
  }
}

async function savePin(pin) {
  // Always keep local copy
  const local = loadLocalPins().filter((p) => p.id !== pin.id);
  local.unshift(pin);
  saveLocalPins(local.slice(0, 200));

  if (state.sb) {
    try {
      const row = {
        id: pin.id?.length === 36 ? pin.id : undefined,
        name: pin.name,
        stack: pin.stack,
        title: pin.title,
        handle: pin.handle,
        city: pin.city,
        id_number: pin.idNumber,
        format: pin.format,
        lat: pin.lat,
        lng: pin.lng,
        photo_url: pin.photo,
        card_url: pin.cardUrl,
        visible: true,
      };
      const { data, error } = await state.sb.from("pins").insert(row).select().single();
      if (!error && data) return normalizePin(data);
    } catch (e) {
      console.warn("Supabase insert failed", e);
    }
  }
  return pin;
}

/* ── utils ── */
function loadImg(src) {
  return new Promise((res, rej) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

function isHeic(f) {
  const n = (f.name || "").toLowerCase();
  const t = (f.type || "").toLowerCase();
  return t.includes("heic") || t.includes("heif") || n.endsWith(".heic") || n.endsWith(".heif");
}

async function fileToImage(file) {
  let blob = file;
  if (isHeic(file)) {
    if (typeof heic2any !== "function") throw new Error("HEIC not supported — try JPG/PNG");
    const out = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
    blob = Array.isArray(out) ? out[0] : out;
  }
  if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
  state.objectUrl = URL.createObjectURL(blob);
  return loadImg(state.objectUrl);
}

function genIdNumber(seed) {
  let h = 2166136261;
  const s = String(seed || Date.now()) + Math.random().toString(36);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `HHG-2026-${(h >>> 0).toString(16).toUpperCase().padStart(8, "0").slice(0, 4)}`;
}

function uid() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function classLabel() {
  return CLASSES.find((c) => c.id === state.titleId)?.label || "Builder";
}

function toast(msg, ms = 2400) {
  const el = $("toast");
  if (!el) return;
  el.textContent = msg;
  el.hidden = false;
  requestAnimationFrame(() => el.classList.add("show"));
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => { el.hidden = true; }, 220);
  }, ms);
}

function show(view) {
  state.view = view;
  $("landing").hidden = view !== "landing";
  $("studio").hidden = view !== "studio";
  $("mapview").hidden = view !== "map";
  document.body.style.overflow = view === "landing" ? "" : "hidden";
  if (view === "studio") {
    $("id-display").textContent = state.idNumber;
    updatePinHint();
    renderCard();
  }
  if (view === "map") {
    ensureMap().then(() => {
      refreshMarkers();
      setTimeout(() => state.map?.invalidateSize(), 80);
      if (state.pickMode) enterPickUI();
    });
  }
}

/* ── canvas ── */
function drawCoverCircle(c, img, cx, cy, r) {
  if (!img) return;
  const size = r * 2;
  const scale = Math.max(size / img.width, size / img.height) * state.zoom;
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = cx - dw / 2 + (state.panX / 100) * size;
  const dy = cy - dh / 2 + (state.panY / 100) * size;
  c.save();
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.clip();
  c.drawImage(img, dx, dy, dw, dh);
  c.restore();
}

function fit(c, text, maxW, maxSize, min = 16, weight = "800") {
  let s = maxSize;
  c.font = `${weight} ${s}px Space Grotesk, sans-serif`;
  while (s > min && c.measureText(text).width > maxW) {
    s--;
    c.font = `${weight} ${s}px Space Grotesk, sans-serif`;
  }
  return s;
}

function setFormat(fmt) {
  state.format = fmt === "pfp" ? "pfp" : "pass";
  document.querySelectorAll(".seg-btn").forEach((b) => {
    b.classList.toggle("on", b.dataset.format === state.format);
  });
  $("fields-pass").hidden = state.format === "pfp";
  $("preview-label").textContent = state.format === "pfp" ? "PFP Frame" : "Builder ID";
  $("preview-size").textContent = state.format === "pfp" ? "1080 × 1080" : "1536 × 1024";
  const wrap = $("preview-wrap");
  wrap.classList.toggle("is-pfp", state.format === "pfp");
  wrap.classList.toggle("poke-frame", state.format === "pass");
  renderCard();
}

/** Small octagon badge icon (HH form-field style) */
function drawOctIcon(c, x, y, s, kind) {
  const r = s / 2;
  c.save();
  c.translate(x + r, y + r);
  c.strokeStyle = "#FEE101";
  c.lineWidth = 2.5;
  c.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i - Math.PI / 8;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) c.moveTo(px, py);
    else c.lineTo(px, py);
  }
  c.closePath();
  c.stroke();
  c.fillStyle = "#FEE101";
  c.strokeStyle = "#FEE101";
  c.lineWidth = 2;
  if (kind === "user") {
    c.beginPath();
    c.arc(0, -r * 0.22, r * 0.28, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.arc(0, r * 0.55, r * 0.42, Math.PI * 1.1, Math.PI * 1.9);
    c.stroke();
  } else if (kind === "code") {
    c.font = `700 ${Math.round(s * 0.38)}px JetBrains Mono, monospace`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("</>", 0, 1);
  } else if (kind === "badge") {
    // calendar/ticket
    c.strokeRect(-r * 0.35, -r * 0.28, r * 0.7, r * 0.62);
    c.beginPath();
    c.moveTo(-r * 0.35, -r * 0.08);
    c.lineTo(r * 0.35, -r * 0.08);
    c.stroke();
  } else if (kind === "pin") {
    c.beginPath();
    c.arc(0, -r * 0.1, r * 0.22, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.moveTo(0, r * 0.12);
    c.lineTo(0, r * 0.42);
    c.stroke();
  }
  c.restore();
  c.textAlign = "left";
  c.textBaseline = "alphabetic";
}

function drawBarcode(c, x, y, w, h, seed) {
  let n = 0;
  for (let i = 0; i < seed.length; i++) n = (n * 31 + seed.charCodeAt(i)) >>> 0;
  c.fillStyle = theme().accent;
  let px = x;
  while (px < x + w - 2) {
    n = (n * 1103515245 + 12345) >>> 0;
    const bar = 1 + (n % 3);
    const gap = 1 + ((n >> 3) % 2);
    if ((n >> 5) % 3 !== 0) c.fillRect(px, y, bar, h);
    px += bar + gap;
  }
}

function theme() {
  return THEMES[state.theme] || THEMES.emerald;
}

function drawFoilBorder(c, x, y, w, h, t, r = 28) {
  const pad = 10;
  // outer black
  c.fillStyle = "#0a0a0a";
  roundRect(c, x, y, w, h, r);
  c.fill();
  // foil ring
  const g = c.createLinearGradient(x, y, x + w, y + h);
  t.foil.forEach((col, i) => g.addColorStop(i / (t.foil.length - 1), col));
  c.fillStyle = g;
  roundRect(c, x + 4, y + 4, w - 8, h - 8, r - 2);
  c.fill();
  // inner panel
  const ig = c.createLinearGradient(x, y, x + w * 0.3, y + h);
  ig.addColorStop(0, t.bg1);
  ig.addColorStop(0.45, t.bg0);
  ig.addColorStop(1, t.bg2);
  c.fillStyle = ig;
  roundRect(c, x + pad, y + pad, w - pad * 2, h - pad * 2, r - 6);
  c.fill();
}

function drawCornerOrnament(c, x, y, flipX, flipY, col) {
  c.save();
  c.translate(x, y);
  c.scale(flipX ? -1 : 1, flipY ? -1 : 1);
  c.strokeStyle = col;
  c.lineWidth = 4;
  c.lineCap = "square";
  c.beginPath();
  c.moveTo(0, 36);
  c.lineTo(0, 0);
  c.lineTo(36, 0);
  c.stroke();
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(0, 18);
  c.lineTo(14, 18);
  c.lineTo(14, 0);
  c.stroke();
  c.fillStyle = col;
  c.beginPath();
  c.arc(10, 10, 4, 0, Math.PI * 2);
  c.fill();
  c.restore();
}

function drawPass(c) {
  const { W, H, photo, name: nb, stack: sb, title: tb } = PASS;
  const t = theme();
  const id = state.idNumber || "HHG-2026-····";
  const name = (state.name || "BUILDER NAME").toUpperCase();
  const stack = (state.stack || "STACK & ROLE").toUpperCase();
  const title = classLabel().toUpperCase();

  // Canvas base
  c.fillStyle = "#050505";
  c.fillRect(0, 0, W, H);

  // Pokémon / signed foil card body
  drawFoilBorder(c, 28, 28, W - 56, H - 56, t, 32);

  // Circuit / noise texture
  c.save();
  c.globalAlpha = 0.07;
  c.strokeStyle = t.accent;
  c.lineWidth = 1;
  for (let i = 0; i < 18; i++) {
    const y = 80 + i * 48;
    c.beginPath();
    c.moveTo(80, y);
    c.lineTo(W - 80, y + ((i % 2) * 12 - 6));
    c.stroke();
  }
  c.restore();

  // Header bar
  const hg = c.createLinearGradient(60, 50, W - 60, 120);
  hg.addColorStop(0, "rgba(0,0,0,.45)");
  hg.addColorStop(1, "rgba(0,0,0,.15)");
  c.fillStyle = hg;
  roundRect(c, 56, 52, W - 112, 78, 14);
  c.fill();

  c.fillStyle = t.accent;
  c.font = "800 28px Space Grotesk, sans-serif";
  c.textAlign = "left";
  c.fillText("HACKER HOUSE GOA", 80, 90);
  c.fillStyle = t.mute;
  c.font = "600 16px JetBrains Mono, monospace";
  c.fillText("BUILDER ID  ·  COLLECTIBLE PASS  ·  2026", 80, 114);

  // HP-style class chip
  c.fillStyle = t.accent;
  roundRect(c, W - 280, 64, 200, 48, 10);
  c.fill();
  c.fillStyle = "#02140c";
  c.font = "800 18px Space Grotesk, sans-serif";
  c.textAlign = "center";
  c.fillText("★ BUILDER", W - 180, 95);
  c.textAlign = "left";

  if (state.logoMark) {
    c.drawImage(state.logoMark, W - 100, 58, 52, 52);
  }

  // Photo plate (signed border)
  const pr = photo.r + 18;
  c.save();
  const pg = c.createLinearGradient(photo.cx - pr, photo.cy - pr, photo.cx + pr, photo.cy + pr);
  t.foil.forEach((col, i) => pg.addColorStop(i / (t.foil.length - 1), col));
  c.fillStyle = pg;
  c.beginPath();
  c.arc(photo.cx, photo.cy, pr, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = t.bg2;
  c.beginPath();
  c.arc(photo.cx, photo.cy, photo.r + 6, 0, Math.PI * 2);
  c.fill();
  c.restore();

  if (state.image) drawCoverCircle(c, state.image, photo.cx, photo.cy, photo.r);
  else {
    c.fillStyle = "rgba(254,225,1,.08)";
    c.beginPath();
    c.arc(photo.cx, photo.cy, photo.r, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = t.accent;
    c.font = "700 18px JetBrains Mono, monospace";
    c.textAlign = "center";
    c.fillText("PHOTO", photo.cx, photo.cy + 6);
    c.textAlign = "left";
  }

  // Outer photo ring
  c.strokeStyle = t.accent;
  c.lineWidth = 5;
  c.beginPath();
  c.arc(photo.cx, photo.cy, photo.r + 2, 0, Math.PI * 2);
  c.stroke();

  // Field labels + values
  const drawField = (label, value, x, y, maxW, maxSize, col, weight = "800") => {
    c.fillStyle = t.accent;
    c.font = "700 13px JetBrains Mono, monospace";
    c.fillText(label, x, y - 22);
    c.fillStyle = col;
    const s = fit(c, value, maxW, maxSize, 18, weight);
    c.font = `${weight} ${s}px Space Grotesk, sans-serif`;
    c.fillText(value, x, y);
  };

  drawField("NAME", name, nb.x, nb.y, nb.maxW, 48, t.text);
  drawField("STACK / ROLE", stack, sb.x, sb.y, sb.maxW, 32, t.accent, "700");
  drawField("CLASS", title, tb.x, tb.y, tb.maxW, 34, t.classCol);

  // ID chip
  c.fillStyle = "rgba(0,0,0,.35)";
  roundRect(c, PASS.id.x - 8, PASS.id.y - 28, 420, 44, 10);
  c.fill();
  c.strokeStyle = t.accent;
  c.lineWidth = 2;
  roundRect(c, PASS.id.x - 8, PASS.id.y - 28, 420, 44, 10);
  c.stroke();
  c.fillStyle = t.accent;
  c.font = "700 18px JetBrains Mono, monospace";
  c.fillText(id, PASS.id.x + 8, PASS.id.y);

  const handle = state.handle
    ? state.handle.startsWith("@")
      ? state.handle
      : `@${state.handle}`
    : "";
  const meta = [handle, state.city].filter(Boolean).join("  ·  ").toUpperCase();
  if (meta) {
    c.fillStyle = t.mute;
    c.font = "600 16px Space Grotesk, sans-serif";
    c.fillText(meta.slice(0, 48), PASS.meta.x, PASS.meta.y);
  }

  // Class sticker
  const sticker = state.stickers[state.titleId];
  if (sticker) {
    c.drawImage(sticker, photo.cx - photo.r - 16, photo.cy + photo.r - 36, 130, 130);
  }

  // Signed strip
  const stripY = H - 150;
  const sg = c.createLinearGradient(60, stripY, W - 60, stripY + 60);
  t.foil.forEach((col, i) => sg.addColorStop(i / (t.foil.length - 1), col));
  c.fillStyle = sg;
  roundRect(c, 60, stripY, W - 120, 70, 12);
  c.fill();
  c.fillStyle = "rgba(2,20,12,.88)";
  roundRect(c, 66, stripY + 6, W - 132, 58, 10);
  c.fill();
  c.fillStyle = t.accent;
  c.font = "700 14px JetBrains Mono, monospace";
  c.fillText("SIGNED  ·  HH GOA RELAY  ·  AUTHENTIC BUILDER", 90, stripY + 30);
  c.fillStyle = t.mute;
  c.font = "600 13px Space Grotesk, sans-serif";
  c.fillText("Verified collectible · Not transferable · #FrameInGoa", 90, stripY + 52);

  // Barcode
  drawBarcode(c, W - 420, stripY + 16, 280, 40, id + name);

  // Corner ornaments
  const o = t.accent;
  drawCornerOrnament(c, 52, 52, false, false, o);
  drawCornerOrnament(c, W - 52, 52, true, false, o);
  drawCornerOrnament(c, 52, H - 52, false, true, o);
  drawCornerOrnament(c, W - 52, H - 52, true, true, o);

  // Footer
  c.fillStyle = t.accent;
  c.font = "700 14px JetBrains Mono, monospace";
  c.textAlign = "left";
  c.fillText("28–31 OCT 2026 · GOA · INDIA", 70, H - 48);
  c.textAlign = "right";
  c.fillText(HASHTAG + "  ·  LESS NOISE. MORE SIGNAL.", W - 70, H - 48);
  c.textAlign = "left";
}

function drawPfp(c) {
  const { W, H, r } = PFP;
  const cx = W / 2;
  const cy = H / 2 - 20;

  c.fillStyle = "#02140C";
  c.fillRect(0, 0, W, H);

  // yellow paint splash vibe
  c.fillStyle = "rgba(254,225,1,.12)";
  c.beginPath();
  c.ellipse(cx - 80, cy + 40, 520, 480, -0.3, 0, Math.PI * 2);
  c.fill();

  if (typeof c.createConicGradient === "function") {
    const ring = c.createConicGradient(0, cx, cy);
    ring.addColorStop(0, "#FEE101");
    ring.addColorStop(0.2, "#0B6839");
    ring.addColorStop(0.45, "#7DFFC8");
    ring.addColorStop(0.7, "#0B6839");
    ring.addColorStop(1, "#FEE101");
    c.fillStyle = ring;
  } else {
    c.fillStyle = "#FEE101";
  }
  c.beginPath();
  c.arc(cx, cy, r + 88, 0, Math.PI * 2);
  c.fill();

  c.fillStyle = "#02140C";
  c.beginPath();
  c.arc(cx, cy, r + 50, 0, Math.PI * 2);
  c.fill();

  c.strokeStyle = "#FEE101";
  c.lineWidth = 16;
  c.beginPath();
  c.arc(cx, cy, r + 26, 0, Math.PI * 2);
  c.stroke();

  c.strokeStyle = "#0B6839";
  c.lineWidth = 20;
  c.beginPath();
  c.arc(cx, cy, r + 6, 0, Math.PI * 2);
  c.stroke();

  if (state.image) drawCoverCircle(c, state.image, cx, cy, r);
  else {
    c.fillStyle = "#0B6839";
    c.beginPath();
    c.arc(cx, cy, r, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#FEE101";
    c.font = "700 36px Space Grotesk, sans-serif";
    c.textAlign = "center";
    c.fillText("UPLOAD", cx, cy + 12);
  }

  // top badge
  c.fillStyle = "#FEE101";
  roundRect(c, cx - 160, 48, 320, 52, 12);
  c.fill();
  c.fillStyle = "#02140C";
  c.font = "800 22px Space Grotesk, sans-serif";
  c.textAlign = "center";
  c.fillText("HACKER HOUSE GOA", cx, 82);

  if (state.logoMark) {
    c.drawImage(state.logoMark, cx - 28, cy + r + 20, 56, 56);
  }

  // bottom ribbon
  c.fillStyle = "rgba(2,20,12,.92)";
  roundRect(c, 140, H - 170, W - 280, 90, 16);
  c.fill();
  c.strokeStyle = "#FEE101";
  c.lineWidth = 3;
  roundRect(c, 140, H - 170, W - 280, 90, 16);
  c.stroke();

  c.fillStyle = "#FEE101";
  c.font = "800 26px Space Grotesk, sans-serif";
  c.fillText("28–31 OCT 2026", cx, H - 125);
  c.fillStyle = "#F5EDD6";
  c.font = "700 16px JetBrains Mono, monospace";
  c.fillText(`${HASHTAG}  ·  LESS NOISE. MORE SIGNAL.`, cx, H - 95);
  c.textAlign = "left";
}

function roundRect(c, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + rr, y);
  c.arcTo(x + w, y, x + w, y + h, rr);
  c.arcTo(x + w, y + h, x, y + h, rr);
  c.arcTo(x, y + h, x, y, rr);
  c.arcTo(x, y, x + w, y, rr);
  c.closePath();
}

function renderCard() {
  const canvas = $("canvas");
  if (!canvas) return;
  const c = canvas.getContext("2d");
  if (state.format === "pfp") {
    canvas.width = PFP.W;
    canvas.height = PFP.H;
    c.clearRect(0, 0, PFP.W, PFP.H);
    drawPfp(c);
  } else {
    canvas.width = PASS.W;
    canvas.height = PASS.H;
    c.clearRect(0, 0, PASS.W, PASS.H);
    drawPass(c);
  }
  const ready = !!state.image;
  ["btn-dl", "btn-share"].forEach((id) => {
    const el = $(id);
    if (el) el.disabled = !ready;
  });
  updatePinBtn();
}

/* ── export / share ── */
function blobPng() {
  return new Promise((res) => $("canvas").toBlob((b) => res(b), "image/png"));
}

function fname() {
  const slug = (state.name || "builder").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 18);
  const kind = state.format === "pfp" ? "pfp" : "builder-id";
  return `hhgoa-${kind}-${slug || "frame"}.png`;
}

function tweetText() {
  if (state.format === "pfp") {
    return `Locked in for Hacker House Goa 2026 🌴\nNew PFP frame ready.\n\n${HASHTAG} #HHGoa #HackerHouseGoa`;
  }
  const n = state.name.trim() ? `${state.name.trim()} · ` : "";
  return `${n}Builder ID locked for Hacker House Goa 2026\n${state.idNumber} · ${classLabel()}\n28–31 Oct · Goa\n\n${HASHTAG} #HHGoa #HackerHouseGoa`;
}

async function download() {
  if (!state.image) return toast("Upload a photo first");
  renderCard();
  const b = await blobPng();
  const u = URL.createObjectURL(b);
  const a = document.createElement("a");
  a.href = u;
  a.download = fname();
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1500);
  toast("Downloaded · share with " + HASHTAG);
}

async function shareX() {
  if (!state.image) return toast("Upload a photo first");
  renderCard();
  const b = await blobPng();
  const file = new File([b], fname(), { type: "image/png" });
  const text = tweetText();

  // Mobile / supporting browsers: attach image directly
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text, title: "HH Goa 2026" });
      return;
    } catch (e) {
      if (e?.name === "AbortError") return;
    }
  }

  // Try copy image + open tweet intent
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": b })]);
      toast("Image copied — paste into X");
    }
  } catch { /* */ }

  // If Supabase: upload card for link preview in tweet
  let link = "";
  if (state.sb) {
    const path = `cards/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.png`;
    const url = await uploadBlob(path, b);
    if (url) link = `\n${url}`;
  }

  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + link)}`,
    "_blank",
    "noopener"
  );
}

/* ── map ── */
function fmtCoords(lat, lng, precise = false) {
  const n = precise ? 4 : 2;
  const la = Number(lat).toFixed(n);
  const ln = Number(lng).toFixed(n);
  const ns = lat >= 0 ? "N" : "S";
  const ew = lng >= 0 ? "E" : "W";
  return `${Math.abs(la)}° ${ns} · ${Math.abs(ln)}° ${ew}`;
}

async function ensureMap() {
  if (state.mapReady && state.map) return;
  const map = L.map("map", {
    zoomControl: false,
    worldCopyJump: true,
    preferCanvas: true,
  }).setView([20, 40], 2);

  // Dark base + light labels for console CRT look
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    attribution: "&copy; OSM &copy; CARTO",
  }).addTo(map);

  // HQ pulse zone
  L.circle([HQ.lat, HQ.lng], {
    radius: 2800,
    color: "#FEE101",
    weight: 2,
    fillColor: "#FEE101",
    fillOpacity: 0.12,
    className: "hq-zone",
  }).addTo(map);
  L.circle([HQ.lat, HQ.lng], {
    radius: 900,
    color: "#FEE101",
    weight: 1,
    fillColor: "#FEE101",
    fillOpacity: 0.08,
    dashArray: "4 6",
  }).addTo(map);

  state.map = map;
  state.mapReady = true;

  map.on("click", async (e) => {
    const lat = +e.latlng.lat.toFixed(5);
    const lng = +e.latlng.lng.toFixed(5);
    $("chip-coords").textContent = fmtCoords(lat, lng, true);
    if (!state.pickMode) return;
    let label = "Selected";
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        { headers: { Accept: "application/json" } }
      );
      const data = await res.json();
      label =
        data?.address?.city ||
        data?.address?.town ||
        data?.address?.village ||
        data?.address?.state ||
        data?.address?.country ||
        "Selected";
    } catch { /* */ }
    setPickMarker(lat, lng, label);
  });

  map.on("mousemove", (e) => {
    if (!state.pickMode) {
      $("chip-coords").textContent = fmtCoords(e.latlng.lat, e.latlng.lng);
    }
  });
  map.on("moveend", () => {
    const c = map.getCenter();
    if (!state.pickMode) $("chip-coords").textContent = fmtCoords(c.lat, c.lng);
  });

  let st;
  $("loc-search").oninput = () => {
    clearTimeout(st);
    const q = $("loc-search").value.trim();
    if (q.length < 2) return;
    st = setTimeout(() => searchPlace(q), 400);
  };

  // ticker
  const items = [
    "SEARCHING FOR BUILDERS…",
    "HH GOA HQ · 28–31 OCT 2026 · GOA",
    "MINT BUILDER ID · DROP YOUR PIN",
    "LESS NOISE · MORE SIGNAL",
    HASHTAG + " · FRAME IN GOA",
    "247 BUILDERS · PRIVATE BEACH RESIDENCY",
  ];
  if ($("ticker")) {
    $("ticker").innerHTML = [...items, ...items].map((t) => `<span>${t}</span>`).join("");
  }

  spinMiniRadar();
  if ($("chip-status")) $("chip-status").textContent = "LIVE";
  $("chip-coords").textContent = fmtCoords(HQ.lat, HQ.lng, true);
}

function markerIcon(pin) {
  if (pin.kind === "hq") {
    return L.divIcon({
      className: "",
      html: `<div class="mk-wrap hq"><div class="mk-ring"></div><div class="mk-ring delay"></div><div class="mk hq">⌂</div></div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });
  }
  const cls = pin.kind === "you" || pin.isSelf ? "you" : pin.kind === "pick" ? "pick" : "builder";
  const bg = pin.photo ? `background-image:url('${String(pin.photo).replace(/'/g, "%27")}')` : "";
  const glyph = cls === "builder" && !pin.photo ? `<span class="mk-glyph">◆</span>` : "";
  return L.divIcon({
    className: "",
    html: `<div class="mk-wrap ${cls}"><div class="mk-ring"></div><div class="mk ${cls}" style="${bg}">${glyph}</div></div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

function allMapPins() {
  const hq = {
    id: "hq",
    kind: "hq",
    name: "HACKER HOUSE GOA HQ",
    stack: "Private beach residency",
    title: "MAIN LOCATION · 28–31 OCT",
    idNumber: "HHG-2026-HQ00",
    lat: HQ.lat,
    lng: HQ.lng,
    city: "Goa, India",
  };
  return [hq, ...state.pins];
}

function refreshMarkers() {
  if (!state.map) return;
  for (const m of state.markers.values()) m.remove();
  state.markers.clear();
  for (const pin of allMapPins()) {
    if (pin.lat == null || pin.lng == null) continue;
    const m = L.marker([pin.lat, pin.lng], { icon: markerIcon(pin) })
      .addTo(state.map)
      .on("click", () => openPinPopup(pin));
    state.markers.set(pin.id, m);
  }
  const n = state.pins.length + 1;
  $("pin-count").textContent = String(n);
  if ($("chip-count-hud")) $("chip-count-hud").textContent = `${n} ON MAP`;
  renderLog();
}

function spinMiniRadar() {
  const canvas = $("mini-radar");
  if (!canvas) return;
  if (state.radarStop) state.radarStop();
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) / 2 - 4;
  let a = 0;
  let raf;
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
    g.addColorStop(0, "rgba(11,104,57,.95)");
    g.addColorStop(1, "rgba(2,20,12,.98)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#FEE101";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = "rgba(254,225,1,.25)";
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, (r * i) / 3, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(cx - r, cy);
    ctx.lineTo(cx + r, cy);
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx, cy + r);
    ctx.stroke();
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(a);
    const sg = ctx.createLinearGradient(0, 0, r, 0);
    sg.addColorStop(0, "rgba(254,225,1,.55)");
    sg.addColorStop(1, "rgba(254,225,1,0)");
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r - 2, -0.45, 0.05);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    // blips
    [
      { a: 0.4, d: 0.55, col: "#FEE101" },
      { a: 2.2, d: 0.7, col: "#ff4d7a" },
      { a: 4.1, d: 0.4, col: "#7DFFC8" },
    ].forEach((d) => {
      ctx.fillStyle = d.col;
      ctx.beginPath();
      ctx.arc(
        cx + Math.cos(d.a + a * 0.1) * r * d.d,
        cy + Math.sin(d.a + a * 0.1) * r * d.d,
        3,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
    a += 0.04;
    raf = requestAnimationFrame(draw);
  };
  draw();
  state.radarStop = () => cancelAnimationFrame(raf);
}

function openPinPopup(pin) {
  $("pin-popup-name").textContent = pin.name || "—";
  $("pin-popup-meta").textContent = [pin.stack, pin.city].filter(Boolean).join(" · ") || "—";
  $("pin-popup-title").textContent = pin.title || "";
  $("pin-popup-id").textContent = pin.idNumber || "";
  $("pin-popup-badge").textContent = pin.kind === "hq" ? "HQ" : pin.isSelf || pin.kind === "you" ? "YOU" : "BUILDER";
  const img = $("pin-popup-img");
  if (pin.photo) {
    img.src = pin.photo;
    img.style.background = "";
  } else {
    img.removeAttribute("src");
    img.style.background = pin.kind === "hq" ? "#FEE101" : "#0B6839";
  }
  $("pin-popup").hidden = false;
}

function setPickMarker(lat, lng, label) {
  state.pickLat = lat;
  state.pickLng = lng;
  state.pickLabel = label || "Selected";
  if (state.tempMark) state.tempMark.remove();
  if (!state.map) return;
  state.tempMark = L.marker([lat, lng], {
    icon: markerIcon({ kind: "pick" }),
    zIndexOffset: 1000,
  }).addTo(state.map);
  $("pick-label").textContent = `${state.pickLabel} · ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  $("pick-ok").disabled = false;
  $("chip-coords").textContent = `${lat}, ${lng}`;
}

function enterPickUI() {
  state.pickMode = true;
  document.body.classList.add("is-picking");
  $("pick-bar").hidden = false;
  $("chip-status").textContent = "PICK LOCATION";
  $("pick-ok").disabled = state.pickLat == null;
  if (state.pickLat != null) {
    $("pick-label").textContent = `${state.pickLabel} · ${state.pickLat.toFixed(4)}, ${state.pickLng.toFixed(4)}`;
  }
}

function exitPickUI() {
  state.pickMode = false;
  document.body.classList.remove("is-picking");
  $("pick-bar").hidden = true;
  $("chip-status").textContent = "LIVE";
}

function updatePinHint() {
  const el = $("pin-hint");
  if (!el) return;
  if (state.locationSet && state.lat != null) {
    el.textContent = `📍 ${state.locationLabel || "Locked"} · ${Number(state.lat).toFixed(3)}, ${Number(state.lng).toFixed(3)}`;
    el.classList.add("set");
  } else {
    el.textContent = "Pick a spot on the map, then confirm pin.";
    el.classList.remove("set");
  }
}

function updatePinBtn() {
  const btn = $("btn-pin");
  if (btn) btn.disabled = !(state.image && state.locationSet);
}

async function openPicker() {
  state.returnAfterPick = true;
  state.pickMode = true;
  show("map");
  await ensureMap();
  enterPickUI();
  toast("Tap the map to set your location");
}

function confirmPick() {
  if (state.pickLat == null) return toast("Tap the map first");
  state.lat = state.pickLat;
  state.lng = state.pickLng;
  state.locationSet = true;
  state.locationLabel = state.pickLabel || "Custom";
  if (state.locationLabel && state.locationLabel !== "Selected" && !$("f-city").value) {
    state.city = state.locationLabel;
    $("f-city").value = state.city;
  }
  exitPickUI();
  if (state.tempMark) {
    state.tempMark.remove();
    state.tempMark = null;
  }
  updatePinHint();
  updatePinBtn();
  toast("Location locked");
  if (state.returnAfterPick) {
    state.returnAfterPick = false;
    show("studio");
  }
}

async function searchPlace(q) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`,
      { headers: { Accept: "application/json" } }
    );
    const data = await res.json();
    if (!data?.[0]) return toast("Place not found");
    const lat = +data[0].lat;
    const lng = +data[0].lon;
    const label = data[0].display_name?.split(",")[0] || q;
    state.map.flyTo([lat, lng], 10, { duration: 1 });
    if (!state.pickMode) enterPickUI();
    setPickMarker(lat, lng, label);
    toast(`Found: ${label}`);
  } catch {
    toast("Search failed");
  }
}

async function dropPin() {
  if (!state.image) return toast("Upload a photo first");
  if (!state.locationSet) {
    toast("Pick a location first");
    return openPicker();
  }
  renderCard();
  toast("Pinning…");

  // thumb for marker
  const thumb = document.createElement("canvas");
  thumb.width = 160;
  thumb.height = 160;
  const tc = thumb.getContext("2d");
  drawCoverCircle(tc, state.image, 80, 80, 80);
  const thumbBlob = await new Promise((r) => thumb.toBlob(r, "image/jpeg", 0.8));
  let photoUrl = thumb.toDataURL("image/jpeg", 0.8);

  const cardBlob = await blobPng();
  let cardUrl = null;

  if (state.sb) {
    const id = uid();
    const pUrl = await uploadBlob(`thumbs/${id}.jpg`, thumbBlob, "image/jpeg");
    const cUrl = await uploadBlob(`cards/${id}.png`, cardBlob, "image/png");
    if (pUrl) photoUrl = pUrl;
    if (cUrl) cardUrl = cUrl;
  }

  const pin = {
    id: uid(),
    kind: "you",
    isSelf: true,
    name: state.name.trim() || "Anonymous Builder",
    stack: state.stack.trim() || (state.format === "pfp" ? "PFP Frame" : "Builder"),
    title: state.format === "pfp" ? "PFP Frame" : classLabel(),
    handle: state.handle.trim(),
    city: state.city.trim() || state.locationLabel || "",
    idNumber: state.idNumber,
    format: state.format,
    lat: state.lat,
    lng: state.lng,
    photo: photoUrl,
    cardUrl,
    createdAt: new Date().toISOString(),
  };

  // replace previous self pin locally
  state.pins = state.pins.filter((p) => !p.isSelf);
  const saved = await savePin(pin);
  state.pins = [saved, ...state.pins.filter((p) => p.id !== saved.id)];

  show("map");
  await ensureMap();
  await fetchPins();
  // ensure local self is visible even if supabase lag
  if (!state.pins.find((p) => p.id === saved.id || p.isSelf)) {
    state.pins.unshift(saved);
  }
  refreshMarkers();
  state.map.flyTo([pin.lat, pin.lng], 5, { duration: 1.1 });
  openPinPopup(saved);
  toast("Pinned on the map · " + HASHTAG);
}

function renderLog() {
  const list = $("log-list");
  if (!list) return;
  const items = allMapPins()
    .filter((p) => p.kind !== "hq")
    .slice(0, 80);
  list.innerHTML = items
    .map((p) => {
      const img = p.photo
        ? `<img src="${esc(p.photo)}" alt="" />`
        : `<img alt="" style="background:#0B6839" />`;
      return `<li data-id="${esc(p.id)}">${img}<div><strong>${esc(p.name)}</strong><small>${esc(p.city || p.title || p.idNumber || "")}</small></div></li>`;
    })
    .join("");
  list.querySelectorAll("li").forEach((li) => {
    li.onclick = () => {
      const pin = allMapPins().find((p) => p.id === li.dataset.id);
      if (!pin || !state.map) return;
      state.map.flyTo([pin.lat, pin.lng], 6, { duration: 1 });
      openPinPopup(pin);
      closeDrawer();
    };
  });
}

function esc(s) {
  return String(s || "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

function closeDrawer() {
  $("drawer-log").hidden = true;
  $("backdrop").hidden = true;
}

/* ── form ── */
function sync() {
  state.name = $("f-name").value;
  state.stack = $("f-stack").value;
  state.titleId = $("f-title")?.value || state.titleId;
  state.theme = $("f-theme")?.value || state.theme || "emerald";
  state.handle = $("f-handle").value;
  state.city = $("f-city").value;
  $("id-display").textContent = state.idNumber;
  renderCard();
}

async function onFile(file) {
  if (!file) return;
  try {
    state.image = await fileToImage(file);
    $("thumb").src = state.objectUrl;
    $("drop-empty").hidden = true;
    $("drop-has").hidden = false;
    renderCard();
  } catch (e) {
    alert(e.message || "Could not load image");
  }
}

function bind() {
  const goStudio = (fmt) => {
    if (fmt) setFormat(fmt);
    show("studio");
  };

  $("nav-create").onclick = () => goStudio();
  $("hero-create").onclick = () => goStudio();
  $("nav-map").onclick = () => show("map");
  $("hero-map").onclick = () => show("map");
  $("studio-home").onclick = () => show("landing");
  $("studio-map").onclick = () => show("map");
  $("map-back").onclick = () => show(state.image ? "studio" : "landing");
  $("map-create").onclick = () => show("studio");

  document.querySelectorAll(".format-card[data-format]").forEach((el) => {
    el.addEventListener("click", () => goStudio(el.dataset.format));
  });
  $("tab-pass").onclick = () => setFormat("pass");
  $("tab-pfp").onclick = () => setFormat("pfp");

  const drop = $("drop");
  const file = $("file");
  drop.onclick = () => file.click();
  $("rephoto").onclick = (e) => {
    e.stopPropagation();
    file.click();
  };
  file.onchange = () => onFile(file.files?.[0]);
  drop.ondragover = (e) => {
    e.preventDefault();
    drop.classList.add("drag");
  };
  drop.ondragleave = () => drop.classList.remove("drag");
  drop.ondrop = (e) => {
    e.preventDefault();
    drop.classList.remove("drag");
    onFile(e.dataTransfer.files?.[0]);
  };

  ["f-name", "f-stack", "f-title", "f-theme", "f-handle", "f-city"].forEach((id) => {
    const el = $(id);
    if (!el) return;
    el.addEventListener("input", sync);
    el.addEventListener("change", sync);
  });

  // Console chrome · Spidey-style side tools
  $("chrome-home")?.addEventListener("click", () => show("landing"));
  $("chrome-settings")?.addEventListener("click", () => {
    if (state.view === "map") {
      $("drawer-log").hidden = false;
      $("backdrop").hidden = false;
      renderLog();
    } else show("map");
  });
  $("tool-builders")?.addEventListener("click", () => show("map"));
  $("tool-hq")?.addEventListener("click", async () => {
    show("map");
    await ensureMap();
    state.map?.flyTo([HQ.lat, HQ.lng], 12, { duration: 1.1 });
  });
  $("tool-log")?.addEventListener("click", () => {
    renderLog();
    $("drawer-log").hidden = false;
    $("backdrop").hidden = false;
  });
  $("sound-btn")?.addEventListener("click", () => {
    state.soundOn = !state.soundOn;
    const btn = $("sound-btn");
    if (btn) btn.textContent = state.soundOn ? "🔊" : "🔇";
    toast(state.soundOn ? "Sound on" : "Sound off");
  });

  const titleSel = $("f-title");
  titleSel.innerHTML = CLASSES.map(
    (c) => `<option value="${c.id}" ${c.id === state.titleId ? "selected" : ""}>${c.label}</option>`
  ).join("");

  $("reroll").onclick = () => {
    state.titleId = CLASSES[(Math.random() * CLASSES.length) | 0].id;
    titleSel.value = state.titleId;
    renderCard();
  };
  $("regen-id").onclick = () => {
    state.idNumber = genIdNumber(state.name + Date.now());
    $("id-display").textContent = state.idNumber;
    renderCard();
  };

  $("zoom").oninput = () => {
    state.zoom = +$("zoom").value;
    renderCard();
  };
  $("panx").oninput = () => {
    state.panX = +$("panx").value;
    renderCard();
  };
  $("pany").oninput = () => {
    state.panY = +$("pany").value;
    renderCard();
  };

  $("btn-dl").onclick = download;
  $("btn-share").onclick = shareX;
  $("btn-pick").onclick = openPicker;
  $("btn-pin").onclick = dropPin;
  $("btn-gps").onclick = () => {
    if (!navigator.geolocation) return toast("GPS unavailable");
    toast("Reading GPS…");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        state.returnAfterPick = true;
        show("map");
        await ensureMap();
        enterPickUI();
        setPickMarker(pos.coords.latitude, pos.coords.longitude, "Your GPS");
        state.map.flyTo([pos.coords.latitude, pos.coords.longitude], 11, { duration: 1 });
        toast("GPS locked · Confirm");
      },
      () => toast("GPS denied")
    );
  };

  $("pick-cancel").onclick = () => {
    exitPickUI();
    state.returnAfterPick = false;
    if (state.tempMark) {
      state.tempMark.remove();
      state.tempMark = null;
    }
    show("studio");
  };
  $("pick-ok").onclick = confirmPick;
  const flyWorld = () => state.map?.flyTo([20, 40], 2, { duration: 1.1 });
  const flyHq = () => state.map?.flyTo([HQ.lat, HQ.lng], 12, { duration: 1.1 });
  const openLog = () => {
    renderLog();
    $("drawer-log").hidden = false;
    $("backdrop").hidden = false;
  };
  $("btn-world").onclick = flyWorld;
  $("btn-hq").onclick = flyHq;
  $("btn-log").onclick = openLog;
  $("btn-zoom-in")?.addEventListener("click", () => state.map?.zoomIn());
  $("btn-zoom-out")?.addEventListener("click", () => state.map?.zoomOut());
  $("dock-world")?.addEventListener("click", flyWorld);
  $("dock-hq")?.addEventListener("click", flyHq);
  $("dock-log")?.addEventListener("click", openLog);
  $("dock-pin")?.addEventListener("click", () => {
    state.returnAfterPick = true;
    enterPickUI();
    toast("Tap the map to set pin");
  });
  $("drawer-close").onclick = closeDrawer;
  $("backdrop").onclick = closeDrawer;
  $("pin-popup-x").onclick = () => {
    $("pin-popup").hidden = true;
  };
}

async function main() {
  state.sb = initSupabase();
  state.idNumber = genIdNumber("boot");
  bind();
  setFormat("pass");

  try {
    state.passTpl = await loadImg("./public/assets/BuilderPass.png");
  } catch {
    console.warn("BuilderPass missing");
  }
  try {
    state.logoMark = await loadImg("./public/assets/2-47.svg");
  } catch { /* */ }
  try {
    state.goaMark = await loadImg("./public/assets/goa_hindi.svg");
  } catch { /* */ }
  await Promise.all(
    CLASSES.map(async (cl) => {
      try {
        state.stickers[cl.id] = await loadImg(`./public/assets/stickers/${cl.id}.png`);
      } catch { /* sticker optional */ }
    })
  );

  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch { /* */ }
  }

  $("id-display").textContent = state.idNumber;
  renderCard();
  await fetchPins();

  const q = new URLSearchParams(location.search);
  if (q.get("map") === "1") show("map");
  else if (q.get("studio") === "1") {
    if (q.get("format") === "pfp") setFormat("pfp");
    show("studio");
  } else show("landing");
}

function finishBoot() {
  const boot = $("boot-sequence");
  if (!boot) return;
  boot.classList.add("is-done");
  window.setTimeout(() => boot.remove(), 520);
}

window.addEventListener("keydown", finishBoot, { once: true });
window.addEventListener("pointerdown", finishBoot, { once: true });
window.setTimeout(finishBoot, 2350);

main();
