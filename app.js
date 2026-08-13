/**
 * HH Goa 2026 · Frame In Goa
 * Formats: PFP · Builder ID · Team · Map pins · filters · finishes · Supabase
 * Reverse-engineered patterns from hhg-t1, hhg-id-card, frame-in-goa-theta
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
  { id: "latency-shaman", label: "Latency Shaman" },
  { id: "regex-monk", label: "Regex Monk" },
  { id: "null-whisperer", label: "Null Whisperer" },
  { id: "edge-case", label: "Edge Case Diplomat" },
  { id: "async-nav", label: "Async Navigator" },
];

/** Photo treatment — from frame-in-goa-theta */
const FILTERS = {
  natural: { label: "Natural" },
  cel: { label: "Cel" },
  riso: { label: "Riso" },
};

/** Color finish themes — Goa / Night / Sand */
const FINISHES = {
  goa: {
    bg: "#02140C",
    ring: ["#FEE101", "#0B6839", "#FF0080", "#FEE101"],
    badge: "#FEE101",
    badgeInk: "#02140C",
    ink: "#FEE101",
  },
  night: {
    bg: "#050510",
    ring: ["#7DFFC8", "#1a2848", "#FF0080", "#56D8EF"],
    badge: "#1a2848",
    badgeInk: "#7DFFC8",
    ink: "#7DFFC8",
  },
  sand: {
    bg: "#1a1208",
    ring: ["#F5EDD6", "#C4A800", "#8B5A2B", "#FEE101"],
    badge: "#F5EDD6",
    badgeInk: "#1a1208",
    ink: "#F5EDD6",
  },
};

const TEAM = { W: 1200, H: 630 };

/**
 * Official BuilderPass.png is exactly 1536×1024.
 * Coordinates measured against the printed yellow ring + field baselines.
 */
const PASS = {
  W: 1536,
  H: 1024,
  photo: { cx: 345, cy: 588, r: 146 },
  name: { x: 708, y: 488, maxW: 640 },
  stack: { x: 708, y: 585, maxW: 640 },
  title: { x: 708, y: 685, maxW: 640 },
  id: { x: 708, y: 748 },
  meta: { x: 708, y: 780 },
};

/** Portrait Signal Card (creative vertical badge) */
const SIGNAL = { W: 1080, H: 1512 };

const PFP = { W: 1080, H: 1080, r: 420 };

/**
 * Card themes — HH Goa only (no third-party names)
 * official = BuilderPass.png · others = creative Signal frames
 */
const THEMES = {
  /** New default — Spidey-tracker HUD · landscape Builder ID */
  relay: {
    kind: "relay",
    label: "Relay ID",
    accent: "#FEE101", accent2: "#FF0080", text: "#FFFFFF", mute: "rgba(255,255,255,.75)",
    classCol: "#FF0080", foil: ["#fee101", "#56d8ef", "#fee101", "#0b6839"],
  },
  official: {
    kind: "official",
    label: "Official Pass",
    accent: "#FEE101", accent2: "#FFF8EB", text: "#FFF8EB", mute: "rgba(255,248,235,.8)",
    classCol: "#FF0080", foil: ["#fee101", "#ff0080", "#fee101", "#c4a800"],
  },
  signal: {
    kind: "collectible",
    label: "Signal Card",
    bg0: "#052c17", bg1: "#0b6839", bg2: "#02140c",
    accent: "#FEE101", accent2: "#FF0080", text: "#FFFFFF", mute: "rgba(255,255,255,.78)",
    classCol: "#FF0080",
    foil: ["#fff8b0", "#fee101", "#ff0080", "#7dffc8", "#fee101", "#c4a800"],
  },
  wave: {
    kind: "collectible",
    bg0: "#041828", bg1: "#0a4a62", bg2: "#021018",
    accent: "#7DFFC8", accent2: "#FEE101", text: "#E8F8FF", mute: "rgba(232,248,255,.75)",
    classCol: "#FEE101", foil: ["#b8f0ff", "#7dffc8", "#0b6839", "#fee101", "#7dffc8"],
  },
  sand: {
    kind: "collectible",
    bg0: "#2a1208", bg1: "#8b3a12", bg2: "#1a0a04",
    accent: "#FEE101", accent2: "#F5EDD6", text: "#FFF5E6", mute: "rgba(255,245,230,.72)",
    classCol: "#FF0080", foil: ["#fff0c0", "#fee101", "#c4a800", "#f5edd6", "#fee101"],
  },
  neon: {
    kind: "collectible",
    bg0: "#120018", bg1: "#2a0840", bg2: "#050210",
    accent: "#FEE101", accent2: "#FF0080", text: "#FFFFFF", mute: "rgba(255,255,255,.75)",
    classCol: "#FF0080", foil: ["#ff9cdb", "#ff0080", "#fee101", "#7dffc8", "#ff0080"],
  },
};

const $ = (id) => document.getElementById(id);

const state = {
  view: "landing",
  format: "pass", // pass | pfp | team
  image: null,
  objectUrl: null,
  zoom: 1.15,
  panX: 0,
  panY: 0,
  name: "",
  stack: "",
  titleId: CLASSES[(Math.random() * CLASSES.length) | 0].id,
  theme: "official",
  filter: "natural", // natural | cel | riso
  finish: "goa", // goa | night | sand
  handle: "",
  city: "",
  idNumber: "",
  teamSlots: [
    { name: "", stack: "", image: null, objectUrl: null },
    { name: "", stack: "", image: null, objectUrl: null },
    { name: "", stack: "", image: null, objectUrl: null },
  ],
  teamCount: 1,
  passTpl: null,
  logoMark: null,
  goaMark: null,
  sealMark: null,
  houseMark: null,
  hackerMan: null,
  energyBadge: null,
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
        theme: state.theme || "official",
        filter: state.filter || "natural",
        finish: state.finish || "goa",
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
  document.body.dataset.view = view;
  document.querySelectorAll(".mdock-btn").forEach((b) => {
    b.classList.toggle("on", b.dataset.view === view);
  });
  if (view === "studio") {
    $("id-display").textContent = state.idNumber;
    updatePinHint();
    refreshPreviewChrome();
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
/** Apply Natural / Cel / Riso photo treatment (frame-in-goa-theta style) */
function filteredPhoto(img) {
  if (!img || state.filter === "natural") return img;
  const w = Math.min(img.width, 900);
  const h = Math.round((img.height / img.width) * w);
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const ox = off.getContext("2d");
  ox.drawImage(img, 0, 0, w, h);
  const data = ox.getImageData(0, 0, w, h);
  const d = data.data;
  if (state.filter === "cel") {
    for (let i = 0; i < d.length; i += 4) {
      // posterize into bands
      d[i] = Math.round(d[i] / 48) * 48;
      d[i + 1] = Math.round(d[i + 1] / 48) * 48;
      d[i + 2] = Math.round(d[i + 2] / 48) * 48;
      // slight contrast boost
      d[i] = Math.min(255, d[i] * 1.08);
      d[i + 1] = Math.min(255, d[i + 1] * 1.08);
      d[i + 2] = Math.min(255, d[i + 2] * 1.05);
    }
  } else if (state.filter === "riso") {
    // dual-ink split: yellow + green brand inks, slight misregister feel
    for (let i = 0; i < d.length; i += 4) {
      const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      if (g > 140) {
        d[i] = 254;
        d[i + 1] = 225;
        d[i + 2] = 1;
      } else if (g > 70) {
        d[i] = 11;
        d[i + 1] = 104;
        d[i + 2] = 57;
      } else {
        d[i] = 2;
        d[i + 1] = 20;
        d[i + 2] = 12;
      }
    }
  }
  ox.putImageData(data, 0, 0);
  const out = new Image();
  out.src = off.toDataURL("image/png");
  // sync draw path uses canvas as image source via off canvas return
  off._isCanvas = true;
  return off;
}

function drawCoverCircle(c, img, cx, cy, r) {
  if (!img) return;
  const src = filteredPhoto(img);
  const iw = src.width || img.width;
  const ih = src.height || img.height;
  const size = r * 2;
  const scale = Math.max(size / iw, size / ih) * state.zoom;
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = cx - dw / 2 + (state.panX / 100) * size;
  const dy = cy - dh / 2 + (state.panY / 100) * size;
  c.save();
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.clip();
  c.drawImage(src, dx, dy, dw, dh);
  c.restore();
}

function drawCoverRect(c, img, x, y, w, h) {
  if (!img) return;
  const src = filteredPhoto(img);
  const iw = src.width || img.width;
  const ih = src.height || img.height;
  const scale = Math.max(w / iw, h / ih) * state.zoom;
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = x + w / 2 - dw / 2 + (state.panX / 100) * w;
  const dy = y + h / 2 - dh / 2 + (state.panY / 100) * h;
  c.save();
  c.beginPath();
  c.rect(x, y, w, h);
  c.clip();
  c.drawImage(src, dx, dy, dw, dh);
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

function cardSizeLabel() {
  if (state.format === "pfp") return "1080 × 1080";
  if (state.format === "team") return `${TEAM.W} × ${TEAM.H}`;
  if (isCollectibleCard()) return `${SIGNAL.W} × ${SIGNAL.H}`;
  return "1536 × 1024"; // official + relay landscape
}

function setFormat(fmt) {
  if (fmt === "pfp") state.format = "pfp";
  else if (fmt === "team") state.format = "team";
  else state.format = "pass";
  document.querySelectorAll(".seg-btn, .pill[data-format]").forEach((b) => {
    const on = b.dataset.format === state.format;
    b.classList.toggle("on", on);
    if (b.hasAttribute("aria-pressed")) b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  if ($("fields-pass")) $("fields-pass").hidden = state.format === "pfp";
  if ($("fields-team")) $("fields-team").hidden = state.format !== "team";
  if ($("fields-style")) $("fields-style").hidden = state.format === "team" || state.format === "pfp";
  syncPreviewLabel();
  if ($("preview-size")) $("preview-size").textContent = cardSizeLabel();
  refreshPreviewChrome();
  renderCard();
}

function syncPreviewLabel() {
  const el = $("preview-label");
  if (!el) return;
  if (state.format === "pfp") el.textContent = "PFP frame";
  else if (state.format === "team") el.textContent = "Team frame";
  else if (state.theme === "official") el.textContent = "Builder Pass";
  else if (state.theme === "signal") el.textContent = "Signal card";
  else el.textContent = "Builder ID";
}

function setTheme(theme) {
  if (!theme) return;
  state.theme = theme;
  const sel = $("f-theme");
  if (sel) sel.value = theme;
  document.querySelectorAll("#theme-pills .pill, .pill[data-theme]").forEach((b) => {
    if (!b.dataset.theme) return;
    const on = b.dataset.theme === theme;
    b.classList.toggle("on", on);
    if (b.hasAttribute("aria-pressed")) b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  syncPreviewLabel();
  refreshPreviewChrome();
  renderCard();
}

function setFilter(filter) {
  if (!filter) return;
  const sel = $("f-filter");
  if (sel) sel.value = filter;
  document.querySelectorAll("#filter-pills .pill").forEach((b) => {
    const on = b.dataset.filter === filter;
    b.classList.toggle("on", on);
    if (b.hasAttribute("aria-pressed")) b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  sync();
}

function setFinish(finish) {
  if (!finish) return;
  const sel = $("f-finish");
  if (sel) sel.value = finish;
  document.querySelectorAll("#finish-pills .pill").forEach((b) => {
    const on = b.dataset.finish === finish;
    b.classList.toggle("on", on);
    if (b.hasAttribute("aria-pressed")) b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  sync();
}

function refreshPreviewChrome() {
  const wrap = $("preview-wrap");
  if (!wrap) return;
  const portrait = state.format === "pass" && isCollectibleCard();
  const landscapePass = state.format === "pass" && !portrait;
  wrap.classList.toggle("is-pfp", state.format === "pfp");
  wrap.classList.toggle("is-team", state.format === "team");
  wrap.classList.toggle("signal-frame", portrait);
  wrap.classList.toggle("poke-frame", portrait);
  wrap.classList.toggle("official-frame", landscapePass || state.format === "team");
  wrap.classList.toggle("is-portrait", portrait);
  if ($("preview-size")) $("preview-size").textContent = cardSizeLabel();
}

/** Small octagon badge icon (HH form-field style) */
function drawOctIcon(c, x, y, s, kind) {
  const r = s / 2;
  const col = theme().accent || "#FEE101";
  c.save();
  c.translate(x + r, y + r);
  c.strokeStyle = col;
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
  c.fillStyle = col;
  c.strokeStyle = col;
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

function drawBarcode(c, x, y, w, h, seed, color) {
  let n = 0;
  for (let i = 0; i < seed.length; i++) n = (n * 31 + seed.charCodeAt(i)) >>> 0;
  c.fillStyle = color || theme().accent;
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
  return THEMES[state.theme] || THEMES.relay;
}

function isOfficialCard() {
  return (theme().kind || "") === "official";
}

function isRelayCard() {
  return (theme().kind || "") === "relay";
}

function isCollectibleCard() {
  return (theme().kind || "") === "collectible";
}

function cardMetaLine() {
  const handle = state.handle
    ? state.handle.startsWith("@")
      ? state.handle
      : `@${state.handle}`
    : "";
  return [handle, state.city].filter(Boolean).join("  ·  ").toUpperCase();
}

function drawFoilBorder(c, x, y, w, h, t, r = 28) {
  const pad = 10;
  c.fillStyle = "#0a0a0a";
  roundRect(c, x, y, w, h, r);
  c.fill();
  const g = c.createLinearGradient(x, y, x + w, y + h);
  t.foil.forEach((col, i) => g.addColorStop(i / Math.max(1, t.foil.length - 1), col));
  c.fillStyle = g;
  roundRect(c, x + 4, y + 4, w - 8, h - 8, r - 2);
  c.fill();
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

/** Soft text with depth — stays readable on dark green fields */
function drawFieldValue(c, text, x, y, maxW, maxSize, color, weight = "800") {
  const s = fit(c, text, maxW, maxSize, 18, weight);
  c.font = `${weight} ${s}px Space Grotesk, sans-serif`;
  c.textAlign = "left";
  c.textBaseline = "alphabetic";
  // subtle shadow for print polish
  c.fillStyle = "rgba(0,0,0,.45)";
  c.fillText(text, x + 1.5, y + 1.5);
  c.fillStyle = color;
  c.fillText(text, x, y);
  return s;
}

/**
 * NEW Builder ID · Relay — Spidey-tracker HUD style, HH Goa palette
 * Landscape 1536×1024 creative frame (not the official template)
 */
function drawPassRelay(c) {
  const W = PASS.W;
  const H = PASS.H;
  const t = theme();
  const id = state.idNumber || "HHG-2026-····";
  const name = (state.name || "YOUR NAME").toUpperCase();
  const stack = (state.stack || "YOUR STACK").toUpperCase();
  const title = classLabel().toUpperCase();
  const meta = cardMetaLine();
  const f = finish();

  // Deep console stage
  c.fillStyle = f.bg || "#02140c";
  c.fillRect(0, 0, W, H);

  // Outer bezel (tracker device)
  const bezel = c.createLinearGradient(0, 0, W, H);
  bezel.addColorStop(0, "#129a52");
  bezel.addColorStop(0.4, "#0b6839");
  bezel.addColorStop(1, "#052c17");
  c.fillStyle = bezel;
  roundRect(c, 24, 24, W - 48, H - 48, 28);
  c.fill();
  c.strokeStyle = "#FEE101";
  c.lineWidth = 4;
  roundRect(c, 24, 24, W - 48, H - 48, 28);
  c.stroke();

  // Inner screen
  c.fillStyle = "#061820";
  roundRect(c, 48, 48, W - 96, H - 96, 18);
  c.fill();

  // Scan grid
  c.save();
  c.globalAlpha = 0.12;
  c.strokeStyle = "#7DFFC8";
  c.lineWidth = 1;
  for (let x = 64; x < W - 64; x += 36) {
    c.beginPath();
    c.moveTo(x, 64);
    c.lineTo(x, H - 64);
    c.stroke();
  }
  for (let y = 64; y < H - 64; y += 36) {
    c.beginPath();
    c.moveTo(64, y);
    c.lineTo(W - 64, y);
    c.stroke();
  }
  c.restore();

  // Top HUD bar
  c.fillStyle = "rgba(0,0,0,.55)";
  roundRect(c, 64, 64, W - 128, 56, 10);
  c.fill();
  c.fillStyle = "#7DFFC8";
  c.beginPath();
  c.arc(88, 92, 7, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#FEE101";
  c.font = "800 16px JetBrains Mono, monospace";
  c.textAlign = "left";
  c.fillText("HACKER TRACKER  ·  BUILDER ID  ·  LIVE", 108, 98);
  c.textAlign = "right";
  c.fillStyle = "rgba(254,225,1,.85)";
  c.font = "700 14px JetBrains Mono, monospace";
  c.fillText("28–31 OCT 2026  ·  GOA", W - 80, 98);
  c.textAlign = "left";

  // Photo circle + radar rings
  const pcx = 320;
  const pcy = 520;
  const pr = 168;
  c.strokeStyle = "rgba(125,255,200,.35)";
  c.lineWidth = 2;
  for (let i = 1; i <= 3; i++) {
    c.beginPath();
    c.arc(pcx, pcy, pr + i * 28, 0, Math.PI * 2);
    c.stroke();
  }
  // foil ring
  const rg = c.createLinearGradient(pcx - pr, pcy - pr, pcx + pr, pcy + pr);
  t.foil.forEach((col, i) => rg.addColorStop(i / Math.max(1, t.foil.length - 1), col));
  c.fillStyle = rg;
  c.beginPath();
  c.arc(pcx, pcy, pr + 14, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#02140c";
  c.beginPath();
  c.arc(pcx, pcy, pr + 4, 0, Math.PI * 2);
  c.fill();
  if (state.image) drawCoverCircle(c, state.image, pcx, pcy, pr);
  else {
    c.fillStyle = "#0b6839";
    c.beginPath();
    c.arc(pcx, pcy, pr, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#FEE101";
    c.font = "700 18px JetBrains Mono, monospace";
    c.textAlign = "center";
    c.fillText("PHOTO", pcx, pcy + 6);
    c.textAlign = "left";
  }
  c.strokeStyle = "#FEE101";
  c.lineWidth = 5;
  c.beginPath();
  c.arc(pcx, pcy, pr + 2, 0, Math.PI * 2);
  c.stroke();

  // Class sticker
  const sticker = state.stickers[state.titleId];
  if (sticker) c.drawImage(sticker, pcx + pr - 40, pcy + pr - 50, 100, 100);

  // Right identity panel
  const px = 560;
  let py = 160;
  c.fillStyle = "rgba(0,0,0,.45)";
  roundRect(c, px, py, 900, 620, 16);
  c.fill();
  c.strokeStyle = "rgba(254,225,1,.4)";
  c.lineWidth = 2;
  roundRect(c, px, py, 900, 620, 16);
  c.stroke();

  // Corner ticks (HUD)
  const tick = (x, y, fx, fy) => {
    c.strokeStyle = "#FEE101";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(x, y + fy * 22);
    c.lineTo(x, y);
    c.lineTo(x + fx * 22, y);
    c.stroke();
  };
  tick(px + 12, py + 12, 1, 1);
  tick(px + 888, py + 12, -1, 1);
  tick(px + 12, py + 608, 1, -1);
  tick(px + 888, py + 608, -1, -1);

  c.fillStyle = "#7DFFC8";
  c.font = "700 12px JetBrains Mono, monospace";
  c.fillText("IDENTITY MODULE", px + 36, py + 40);

  const row = (label, value, y, col, maxS = 36) => {
    c.fillStyle = "rgba(254,225,1,.12)";
    roundRect(c, px + 28, y, 844, 88, 12);
    c.fill();
    c.fillStyle = "#FEE101";
    c.font = "700 11px JetBrains Mono, monospace";
    c.fillText(label, px + 48, y + 28);
    c.fillStyle = col;
    const sz = fit(c, value, 780, maxS, 18, "800");
    c.font = `800 ${sz}px Space Grotesk, sans-serif`;
    c.fillText(value, px + 48, y + 64);
  };
  row("NAME", name, py + 60, "#fff", 38);
  row("STACK / ROLE", stack, py + 168, "#FEE101", 30);
  row("BUILDER CLASS", title, py + 276, "#FF0080", 30);
  row("ID", id, py + 384, "#7DFFC8", 28);

  if (meta) {
    c.fillStyle = "rgba(255,255,255,.7)";
    c.font = "600 16px Space Grotesk, sans-serif";
    c.fillText(meta.slice(0, 48), px + 48, py + 520);
  }

  c.fillStyle = "rgba(255,255,255,.45)";
  c.font = "600 13px JetBrains Mono, monospace";
  c.fillText(HASHTAG + "  ·  LESS NOISE. MORE SIGNAL.", px + 48, py + 570);

  if (state.logoMark) c.drawImage(state.logoMark, px + 820, py + 520, 48, 48);
  if (state.sealMark) c.drawImage(state.sealMark, 80, H - 200, 80, 80);

  // Bottom signed bar
  drawSignatureStrip(c, 64, H - 100, W - 128, 36, id, t);
}

/**
 * Official Builder Pass — clean full-bleed template.
 */
function drawPassOfficial(c) {
  const { W, H, photo, name: nb, stack: sb, title: tb } = PASS;
  const id = state.idNumber || "HHG-2026-····";
  const name = (state.name || "YOUR NAME").toUpperCase();
  const stack = (state.stack || "YOUR STACK").toUpperCase();
  const title = classLabel().toUpperCase();
  const meta = cardMetaLine();

  c.fillStyle = "#000";
  c.fillRect(0, 0, W, H);

  if (state.passTpl) {
    c.drawImage(state.passTpl, 0, 0, W, H);
  } else {
    c.fillStyle = "#0B6839";
    roundRect(c, 128, 136, 1276, 740, 48);
    c.fill();
  }

  // Photo in the printed yellow ring
  const rPhoto = photo.r - 6;
  if (state.image) {
    drawCoverCircle(c, state.image, photo.cx, photo.cy, rPhoto);
  } else {
    c.fillStyle = "rgba(5,44,23,.45)";
    c.beginPath();
    c.arc(photo.cx, photo.cy, rPhoto, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#FEE101";
    c.font = "700 15px JetBrains Mono, monospace";
    c.textAlign = "center";
    c.fillText("ADD PHOTO", photo.cx, photo.cy + 5);
    c.textAlign = "left";
  }

  // Soft inner highlight under ring
  c.beginPath();
  c.arc(photo.cx, photo.cy, rPhoto - 1, 0, Math.PI * 2);
  c.strokeStyle = "rgba(254,225,1,.35)";
  c.lineWidth = 3;
  c.stroke();

  // Values on the three form lines
  drawFieldValue(c, name, nb.x, nb.y, nb.maxW, 38, "#FFF8EB", "800");
  drawFieldValue(c, stack, sb.x, sb.y, sb.maxW, 30, "#FEE101", "700");
  drawFieldValue(c, title, tb.x, tb.y, tb.maxW, 30, "#FEE101", "800");

  // Compact ID under fields (doesn't cover bottom tagline)
  c.fillStyle = "rgba(2,20,12,.55)";
  roundRect(c, PASS.id.x - 8, PASS.id.y - 20, 340, 30, 6);
  c.fill();
  c.fillStyle = "#FEE101";
  c.font = "700 14px JetBrains Mono, monospace";
  c.textAlign = "left";
  c.fillText(id, PASS.id.x, PASS.id.y);

  if (meta) {
    c.fillStyle = "rgba(255,248,235,.8)";
    c.font = "600 13px Space Grotesk, sans-serif";
    c.fillText(meta.slice(0, 40), PASS.meta.x, PASS.meta.y);
  }

  // Class sticker tucked by photo
  const sticker = state.stickers[state.titleId];
  if (sticker) {
    c.drawImage(sticker, photo.cx + photo.r - 22, photo.cy + photo.r - 48, 88, 88);
  }
}

function drawSignatureStrip(c, x, y, w, h, id, t) {
  const g = c.createLinearGradient(x, y, x + w, y);
  t.foil.forEach((col, i) => g.addColorStop(i / Math.max(1, t.foil.length - 1), col));
  c.fillStyle = g;
  roundRect(c, x, y, w, h, 8);
  c.fill();
  c.fillStyle = "rgba(10,10,10,.9)";
  roundRect(c, x + 3, y + 3, w - 6, h - 6, 6);
  c.fill();
  c.fillStyle = "#FEE101";
  c.font = "700 12px JetBrains Mono, monospace";
  c.textAlign = "left";
  c.fillText("SIGNED · HH GOA RELAY · " + id, x + 14, y + h / 2 + 4);
  c.textAlign = "right";
  c.fillStyle = "#FF0080";
  c.fillText("★ AUTHENTIC", x + w - 14, y + h / 2 + 4);
  c.textAlign = "left";
}

/**
 * Signal Card — creative vertical HH Goa badge (no third-party theme names)
 * Clean layout: photo · identity · signed strip
 */
function drawPassCollectible(c) {
  const W = SIGNAL.W;
  const H = SIGNAL.H;
  const t = theme();
  const id = state.idNumber || "HHG-2026-····";
  const name = (state.name || "BUILDER NAME").toUpperCase();
  const stack = (state.stack || "STACK & ROLE").toUpperCase();
  const title = classLabel().toUpperCase();
  const meta = cardMetaLine();

  c.fillStyle = "#0a0a0a";
  c.fillRect(0, 0, W, H);
  drawFoilBorder(c, 14, 14, W - 28, H - 28, t, 20);

  // Face
  const face = c.createLinearGradient(40, 40, W - 40, H - 40);
  face.addColorStop(0, t.bg1 || "#0b6839");
  face.addColorStop(0.55, t.bg0 || "#052c17");
  face.addColorStop(1, t.bg2 || "#02140c");
  c.fillStyle = face;
  roundRect(c, 32, 32, W - 64, H - 64, 14);
  c.fill();

  // Soft sheen
  c.save();
  c.globalAlpha = 0.1;
  const sheen = c.createLinearGradient(0, 0, W, H);
  sheen.addColorStop(0, "transparent");
  sheen.addColorStop(0.45, t.accent);
  sheen.addColorStop(0.55, t.accent2 || "#FF0080");
  sheen.addColorStop(1, "transparent");
  c.fillStyle = sheen;
  c.fillRect(32, 32, W - 64, H - 64);
  c.restore();

  // Header bar
  c.fillStyle = "rgba(0,0,0,.4)";
  roundRect(c, 48, 48, W - 96, 100, 12);
  c.fill();
  c.fillStyle = t.accent;
  c.font = "700 12px JetBrains Mono, monospace";
  c.textAlign = "left";
  c.fillText("HH GOA 2026  ·  BUILDER SIGNAL", 64, 76);
  const ns = fit(c, name, 900, 36, 18, "800");
  c.font = `800 ${ns}px Space Grotesk, sans-serif`;
  c.fillStyle = "#fff";
  c.fillText(name, 64, 120);

  // Class chip
  c.fillStyle = t.accent2 || "#FF0080";
  roundRect(c, W - 280, 60, 200, 40, 10);
  c.fill();
  c.fillStyle = "#fff";
  c.font = "800 13px Space Grotesk, sans-serif";
  c.textAlign = "center";
  c.fillText(title.slice(0, 16), W - 180, 86);
  c.textAlign = "left";

  // Photo window
  const ax = 52;
  const ay = 168;
  const aw = W - 104;
  const ah = 680;
  const foilG = c.createLinearGradient(ax, ay, ax + aw, ay + ah);
  t.foil.forEach((col, i) => foilG.addColorStop(i / Math.max(1, t.foil.length - 1), col));
  c.fillStyle = foilG;
  roundRect(c, ax, ay, aw, ah, 16);
  c.fill();
  c.fillStyle = "#0a0a0a";
  roundRect(c, ax + 8, ay + 8, aw - 16, ah - 16, 12);
  c.fill();

  c.save();
  roundRect(c, ax + 14, ay + 14, aw - 28, ah - 28, 10);
  c.clip();
  if (state.image) {
    const img = filteredPhoto(state.image);
    const iw = aw - 28;
    const ih = ah - 28;
    const sw = img.width || state.image.width;
    const sh = img.height || state.image.height;
    const scale = Math.max(iw / sw, ih / sh) * state.zoom;
    const dw = sw * scale;
    const dh = sh * scale;
    const dx = ax + 14 + iw / 2 - dw / 2 + (state.panX / 100) * iw;
    const dy = ay + 14 + ih / 2 - dh / 2 + (state.panY / 100) * ih;
    c.drawImage(img, dx, dy, dw, dh);
  } else if (state.hackerMan) {
    c.fillStyle = "#111";
    c.fillRect(ax + 14, ay + 14, aw - 28, ah - 28);
    // 2D character · portrait aspect (240×320)
    const ch = Math.min(ah * 0.88, aw * 1.05);
    const cw = ch * (240 / 320);
    c.drawImage(state.hackerMan, ax + (aw - cw) / 2, ay + (ah - ch) / 2 + 6, cw, ch);
  } else {
    c.fillStyle = "#111";
    c.fillRect(ax + 14, ay + 14, aw - 28, ah - 28);
    c.fillStyle = t.accent;
    c.font = "700 22px JetBrains Mono, monospace";
    c.textAlign = "center";
    c.fillText("Drop a photo", ax + aw / 2, ay + ah / 2);
    c.textAlign = "left";
  }
  c.restore();

  const sticker = state.stickers[state.titleId];
  if (sticker) c.drawImage(sticker, ax + aw - 118, ay + ah - 118, 96, 96);

  // Identity rows
  let sy = ay + ah + 28;
  const row = (label, value, col) => {
    c.fillStyle = "rgba(0,0,0,.4)";
    roundRect(c, 52, sy, W - 104, 72, 12);
    c.fill();
    c.strokeStyle = "rgba(254,225,1,.3)";
    c.lineWidth = 1.5;
    roundRect(c, 52, sy, W - 104, 72, 12);
    c.stroke();
    c.fillStyle = t.accent;
    c.font = "700 11px JetBrains Mono, monospace";
    c.fillText(label, 72, sy + 26);
    c.fillStyle = col;
    const sz = fit(c, value, W - 160, 26, 16, "800");
    c.font = `800 ${sz}px Space Grotesk, sans-serif`;
    c.fillText(value, 72, sy + 54);
    sy += 84;
  };
  row("STACK / ROLE", stack, t.accent);
  row("BUILDER ID", id, "#fff");
  if (meta) row("HANDLE · CITY", meta, "rgba(255,255,255,.85)");

  // Tagline box
  c.fillStyle = "rgba(0,0,0,.45)";
  roundRect(c, 52, sy, W - 104, 88, 12);
  c.fill();
  c.fillStyle = t.accent2 || "#FF0080";
  c.font = "800 12px JetBrains Mono, monospace";
  c.fillText("FRAME IN GOA", 72, sy + 28);
  c.fillStyle = "#fff";
  c.font = "600 18px Space Grotesk, sans-serif";
  c.fillText("Less noise. More signal.", 72, sy + 56);
  c.fillStyle = "rgba(255,255,255,.5)";
  c.font = "600 12px JetBrains Mono, monospace";
  c.fillText(HASHTAG + "  ·  28–31 OCT 2026  ·  247 BUILDERS", 72, sy + 78);

  drawSignatureStrip(c, 52, H - 92, W - 190, 38, id, t);
  drawBarcode(c, W - 120, H - 88, 60, 30, id + name, t.accent);

  c.fillStyle = "rgba(255,255,255,.4)";
  c.font = "600 12px JetBrains Mono, monospace";
  c.textAlign = "center";
  c.fillText("HHG · 2026  ·  GOA RELAY", W / 2, H - 36);
  c.textAlign = "left";

  drawCornerOrnament(c, 28, 28, false, false, t.accent);
  drawCornerOrnament(c, W - 28, 28, true, false, t.accent);
  drawCornerOrnament(c, 28, H - 28, false, true, t.accent2 || "#FF0080");
  drawCornerOrnament(c, W - 28, H - 28, true, true, t.accent2 || "#FF0080");
}

function drawPass(c) {
  if (isRelayCard()) drawPassRelay(c);
  else if (isOfficialCard()) drawPassOfficial(c);
  else drawPassCollectible(c);
}

function finish() {
  return FINISHES[state.finish] || FINISHES.goa;
}

function drawPfp(c) {
  const { W, H, r } = PFP;
  const cx = W / 2;
  const cy = H / 2 - 20;
  const f = finish();

  c.fillStyle = f.bg;
  c.fillRect(0, 0, W, H);

  c.fillStyle = "rgba(254,225,1,.1)";
  c.beginPath();
  c.ellipse(cx - 80, cy + 40, 520, 480, -0.3, 0, Math.PI * 2);
  c.fill();

  if (typeof c.createConicGradient === "function") {
    const ring = c.createConicGradient(0, cx, cy);
    f.ring.forEach((col, i) => ring.addColorStop(i / Math.max(1, f.ring.length - 1), col));
    c.fillStyle = ring;
  } else {
    c.fillStyle = f.ink;
  }
  c.beginPath();
  c.arc(cx, cy, r + 88, 0, Math.PI * 2);
  c.fill();

  c.fillStyle = f.bg;
  c.beginPath();
  c.arc(cx, cy, r + 50, 0, Math.PI * 2);
  c.fill();

  c.strokeStyle = f.ink;
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
    c.fillStyle = f.ink;
    c.font = "700 36px Space Grotesk, sans-serif";
    c.textAlign = "center";
    c.fillText("UPLOAD", cx, cy + 12);
  }

  // top badge
  c.fillStyle = f.badge;
  roundRect(c, cx - 160, 48, 320, 52, 12);
  c.fill();
  c.fillStyle = f.badgeInk;
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
  c.strokeStyle = f.ink;
  c.lineWidth = 3;
  roundRect(c, 140, H - 170, W - 280, 90, 16);
  c.stroke();

  c.fillStyle = f.ink;
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

/** Team frame 1200×630 — 1–3 builders (frame-in-goa-theta) */
function drawTeam(c) {
  const { W, H } = TEAM;
  const f = finish();
  const n = Math.min(3, Math.max(1, state.teamCount | 0));

  c.fillStyle = f.bg;
  c.fillRect(0, 0, W, H);

  // brand header bar
  c.fillStyle = "#0B6839";
  c.fillRect(0, 0, W, 72);
  c.fillStyle = "#FEE101";
  c.font = "800 28px Space Grotesk, sans-serif";
  c.textAlign = "left";
  c.fillText("HACKER HOUSE GOA · TEAM", 28, 46);
  c.font = "700 14px JetBrains Mono, monospace";
  c.fillStyle = "rgba(254,225,1,.8)";
  c.textAlign = "right";
  c.fillText("28–31 OCT 2026  ·  " + HASHTAG, W - 28, 46);
  c.textAlign = "left";

  const pad = 28;
  const top = 96;
  const bottom = 56;
  const gap = 16;
  const cellW = (W - pad * 2 - gap * (n - 1)) / n;
  const cellH = H - top - bottom;

  for (let i = 0; i < n; i++) {
    const slot = state.teamSlots[i] || {};
    const img = slot.image || (i === 0 ? state.image : null);
    const x = pad + i * (cellW + gap);
    const y = top;

    // foil cell border
    c.fillStyle = "#FEE101";
    roundRect(c, x, y, cellW, cellH, 14);
    c.fill();
    c.fillStyle = "#0a0a0a";
    roundRect(c, x + 4, y + 4, cellW - 8, cellH - 8, 12);
    c.fill();

    const photoH = cellH - 100;
    c.save();
    roundRect(c, x + 12, y + 12, cellW - 24, photoH, 10);
    c.clip();
    if (img) {
      // use slot image without pan for secondary members
      const prevZ = state.zoom;
      const prevX = state.panX;
      const prevY = state.panY;
      if (i > 0) {
        state.zoom = 1.1;
        state.panX = 0;
        state.panY = 0;
      }
      drawCoverRect(c, img, x + 12, y + 12, cellW - 24, photoH);
      state.zoom = prevZ;
      state.panX = prevX;
      state.panY = prevY;
    } else {
      c.fillStyle = "#0B6839";
      c.fillRect(x + 12, y + 12, cellW - 24, photoH);
      c.fillStyle = "#FEE101";
      c.font = "700 16px JetBrains Mono, monospace";
      c.textAlign = "center";
      c.fillText("PHOTO " + (i + 1), x + cellW / 2, y + 12 + photoH / 2);
      c.textAlign = "left";
    }
    c.restore();

    const nm = (slot.name || (i === 0 ? state.name : "") || "BUILDER " + (i + 1)).toUpperCase();
    const st = (slot.stack || (i === 0 ? state.stack : "") || "STACK").toUpperCase();
    c.fillStyle = "#fff";
    c.font = "800 18px Space Grotesk, sans-serif";
    c.fillText(nm.slice(0, 18), x + 16, y + photoH + 40);
    c.fillStyle = "#FEE101";
    c.font = "700 13px JetBrains Mono, monospace";
    c.fillText(st.slice(0, 22), x + 16, y + photoH + 64);
  }

  c.fillStyle = "rgba(254,225,1,.7)";
  c.font = "700 12px JetBrains Mono, monospace";
  c.textAlign = "center";
  c.fillText("LESS NOISE. MORE SIGNAL.  ·  247 BUILDERS  ·  GOA", W / 2, H - 22);
  c.textAlign = "left";
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
  } else if (state.format === "team") {
    canvas.width = TEAM.W;
    canvas.height = TEAM.H;
    c.clearRect(0, 0, TEAM.W, TEAM.H);
    drawTeam(c);
  } else if (isCollectibleCard()) {
    canvas.width = SIGNAL.W;
    canvas.height = SIGNAL.H;
    c.clearRect(0, 0, SIGNAL.W, SIGNAL.H);
    drawPassCollectible(c);
  } else {
    // relay (default) or official — landscape
    canvas.width = PASS.W;
    canvas.height = PASS.H;
    c.clearRect(0, 0, PASS.W, PASS.H);
    if (isOfficialCard()) drawPassOfficial(c);
    else drawPassRelay(c);
  }
  const ready = !!state.image || (state.format === "team" && state.teamSlots.some((s) => s.image));
  ["btn-dl", "btn-share", "btn-dl-mobile", "btn-share-mobile"].forEach((id) => {
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
  const kind =
    state.format === "pfp" ? "pfp" : state.format === "team" ? "team" : "builder-id";
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
  toast("Downloaded");
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
  state.name = $("f-name")?.value || "";
  state.stack = $("f-stack")?.value || "";
  state.titleId = $("f-title")?.value || state.titleId;
  state.theme = $("f-theme")?.value || state.theme || "relay";
  state.filter = $("f-filter")?.value || state.filter || "natural";
  state.finish = $("f-finish")?.value || state.finish || "goa";
  state.handle = $("f-handle")?.value || "";
  state.city = $("f-city")?.value || "";
  state.teamCount = Math.min(3, Math.max(1, +($("f-team-count")?.value || 1)));
  for (let i = 0; i < 3; i++) {
    const n = $(`t-name-${i}`);
    const s = $(`t-stack-${i}`);
    if (n) state.teamSlots[i].name = n.value;
    if (s) state.teamSlots[i].stack = s.value;
  }
  // keep slot 0 in sync with primary fields
  state.teamSlots[0].name = state.name || state.teamSlots[0].name;
  state.teamSlots[0].stack = state.stack || state.teamSlots[0].stack;
  if (state.image) state.teamSlots[0].image = state.image;
  if ($("id-display")) $("id-display").textContent = state.idNumber;
  if ($("fields-team")) {
    for (let i = 1; i < 3; i++) {
      const row = $(`team-row-${i}`);
      if (row) row.hidden = i >= state.teamCount;
    }
  }
  refreshPreviewChrome();
  renderCard();
}

async function onFile(file) {
  if (!file) return;
  try {
    state.image = await fileToImage(file);
    state.teamSlots[0].image = state.image;
    if ($("thumb")) $("thumb").src = state.objectUrl;
    if ($("drop-empty")) $("drop-empty").hidden = true;
    if ($("drop-has")) $("drop-has").hidden = false;
    renderCard();
  } catch (e) {
    toast(e.message || "Could not load image");
  }
}

async function loadSamplePhoto() {
  try {
    // Use hacker-man as sample if no photo asset
    const img = await loadImg("./public/assets/hacker-man.svg");
    state.image = img;
    state.teamSlots[0].image = img;
    if ($("thumb")) {
      $("thumb").src = "./public/assets/hacker-man.svg";
    }
    if ($("drop-empty")) $("drop-empty").hidden = true;
    if ($("drop-has")) $("drop-has").hidden = false;
    toast("Sample loaded — swap anytime");
    renderCard();
  } catch {
    toast("Sample unavailable");
  }
}

async function openWebcam() {
  if (!navigator.mediaDevices?.getUserMedia) {
    return toast("Webcam not available — use Upload");
  }
  const modal = $("webcam-modal");
  const video = $("webcam-video");
  if (!modal || !video) return toast("Webcam UI missing");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    });
    video.srcObject = stream;
    await video.play();
    modal.hidden = false;
    state._webcamStream = stream;
  } catch {
    toast("Camera permission denied");
  }
}

function closeWebcam() {
  const modal = $("webcam-modal");
  if (modal) modal.hidden = true;
  const video = $("webcam-video");
  if (state._webcamStream) {
    state._webcamStream.getTracks().forEach((t) => t.stop());
    state._webcamStream = null;
  }
  if (video) video.srcObject = null;
}

async function captureWebcam() {
  const video = $("webcam-video");
  if (!video || !video.videoWidth) return toast("Camera not ready");
  const off = document.createElement("canvas");
  off.width = video.videoWidth;
  off.height = video.videoHeight;
  off.getContext("2d").drawImage(video, 0, 0);
  closeWebcam();
  const blob = await new Promise((r) => off.toBlob(r, "image/jpeg", 0.92));
  if (!blob) return toast("Capture failed");
  const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
  await onFile(file);
  toast("Selfie captured");
}

function bind() {
  const goStudio = (fmt) => {
    if (fmt) setFormat(fmt);
    show("studio");
  };

  $("nav-create")?.addEventListener("click", () => goStudio());
  $("hero-create")?.addEventListener("click", () => goStudio());
  $("nav-map")?.addEventListener("click", () => show("map"));
  $("hero-map")?.addEventListener("click", () => show("map"));
  $("studio-home")?.addEventListener("click", () => show("landing"));
  $("studio-map")?.addEventListener("click", () => show("map"));
  $("map-back")?.addEventListener("click", () => show(state.image ? "studio" : "landing"));
  $("map-create")?.addEventListener("click", () => show("studio"));

  const openFormat = (el) => {
    if (el.dataset.theme) setTheme(el.dataset.theme);
    document.querySelectorAll(".format-chip, .format-card").forEach((c) => {
      const on = c === el;
      c.classList.toggle("on", on);
      if (c.hasAttribute("aria-pressed")) c.setAttribute("aria-pressed", on ? "true" : "false");
    });
    goStudio(el.dataset.format);
  };
  document.querySelectorAll(".format-chip[data-format], .format-card[data-format]").forEach((el) => {
    el.addEventListener("click", () => openFormat(el));
  });
  document.querySelectorAll(".pill[data-format]").forEach((el) => {
    el.addEventListener("click", () => {
      if (el.dataset.format === "pass" && state.theme === "signal") {
        /* keep signal theme if already on signal */
      } else if (el.dataset.format === "pass" && !["official", "relay", "signal", "wave", "sand", "neon"].includes(state.theme)) {
        setTheme("official");
      } else if (el.dataset.format === "pass" && state.format !== "pass") {
        setTheme(state.theme === "signal" ? "official" : state.theme || "official");
      }
      setFormat(el.dataset.format);
    });
  });
  document.querySelectorAll("#theme-pills .pill[data-theme]").forEach((el) => {
    el.addEventListener("click", () => {
      setFormat("pass");
      setTheme(el.dataset.theme);
    });
  });
  document.querySelectorAll("#filter-pills .pill[data-filter]").forEach((el) => {
    el.addEventListener("click", () => setFilter(el.dataset.filter));
  });
  document.querySelectorAll("#finish-pills .pill[data-finish]").forEach((el) => {
    el.addEventListener("click", () => setFinish(el.dataset.finish));
  });

  const drop = $("drop");
  const file = $("file");
  const openFilePicker = () => file?.click();
  if (drop && file) {
    drop.onclick = (e) => {
      if (e.target.closest("#rephoto")) return;
      openFilePicker();
    };
    drop.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openFilePicker();
      }
    });
    $("rephoto")?.addEventListener("click", (e) => {
      e.stopPropagation();
      openFilePicker();
    });
    $("btn-pick-file")?.addEventListener("click", openFilePicker);
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
  }
  // Preview stage also accepts click / drop
  const wrap = $("preview-wrap");
  if (wrap && file) {
    wrap.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      openFilePicker();
    });
    wrap.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openFilePicker();
      }
    });
    wrap.addEventListener("dragover", (e) => {
      e.preventDefault();
      wrap.classList.add("drag");
    });
    wrap.addEventListener("dragleave", () => wrap.classList.remove("drag"));
    wrap.addEventListener("drop", (e) => {
      e.preventDefault();
      wrap.classList.remove("drag");
      onFile(e.dataTransfer.files?.[0]);
    });
  }

  // Webcam selfie
  $("btn-webcam")?.addEventListener("click", openWebcam);
  $("btn-sample")?.addEventListener("click", loadSamplePhoto);
  $("webcam-capture")?.addEventListener("click", captureWebcam);
  $("webcam-cancel")?.addEventListener("click", closeWebcam);

  // Team photo slots
  for (let i = 1; i < 3; i++) {
    const inp = $(`t-file-${i}`);
    if (!inp) continue;
    inp.onchange = async () => {
      const f = inp.files?.[0];
      if (!f) return;
      try {
        const img = await fileToImage(f);
        state.teamSlots[i].image = img;
        state.teamSlots[i].objectUrl = state.objectUrl;
        const th = $(`t-thumb-${i}`);
        if (th) {
          th.src = state.objectUrl;
          th.hidden = false;
        }
        renderCard();
      } catch (e) {
        toast(e.message || "Could not load image");
      }
    };
  }

  ["f-name", "f-stack", "f-title", "f-theme", "f-filter", "f-finish", "f-handle", "f-city", "f-team-count", "t-name-1", "t-stack-1", "t-name-2", "t-stack-2"].forEach((id) => {
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
    $("sound-btn")?.classList.toggle("off", !state.soundOn);
    toast(state.soundOn ? "Sound on" : "Sound off");
  });

  // Mobile dock
  $("mdock-home")?.addEventListener("click", () => show("landing"));
  $("mdock-create")?.addEventListener("click", () => show("studio"));
  $("mdock-map")?.addEventListener("click", () => show("map"));

  const titleSel = $("f-title");
  if (titleSel) {
    titleSel.innerHTML = CLASSES.map(
      (c) => `<option value="${c.id}" ${c.id === state.titleId ? "selected" : ""}>${c.label}</option>`
    ).join("");
  }
  // Align UI pills with default Builder Pass theme
  setTheme(state.theme || "official");
  setFormat(state.format || "pass");

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

  $("btn-dl")?.addEventListener("click", download);
  $("btn-share")?.addEventListener("click", shareX);
  $("btn-dl-mobile")?.addEventListener("click", download);
  $("btn-share-mobile")?.addEventListener("click", shareX);
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
  try {
    state.sealMark = await loadImg("./public/assets/seal-goa.svg");
  } catch { /* */ }
  try {
    state.houseMark = await loadImg("./public/assets/hh-house-mark.svg");
  } catch { /* */ }
  try {
    state.hackerMan = await loadImg("./public/assets/hacker-man.svg");
  } catch { /* */ }
  try {
    state.energyBadge = await loadImg("./public/assets/energy-badge.svg");
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
