/**
 * HH Goa 2026 · Builder ID Studio
 * Landing · single polished ID card · live preview · world map · #FrameInGoa
 */

const BRAND = {
  green: "#0B6839",
  greenMid: "#084D2A",
  greenDark: "#052C17",
  greenInk: "#02140C",
  yellow: "#FEE101",
  cream: "#F5EDD6",
  white: "#FAFAF8",
  cyan: "#7DFFC8",
  pink: "#FF2D84",
  red: "#FF5050",
};

const ACCENT = {
  yellow: "#FEE101",
  lime: "#B8FF3C",
  cyan: "#7DFFC8",
  cream: "#F5EDD6",
};

const HQ = {
  id: "hh-goa-hq",
  kind: "hq",
  name: "HACKER HOUSE GOA HQ",
  stack: "Private beach residency",
  title: "MAIN LOCATION · 28–31 OCT",
  idNumber: "HHG-2026-HQ00",
  city: "Goa, India",
  lat: 15.5736,
  lng: 73.7419,
  createdAt: "2026-05-07T00:00:00.000Z",
};

/** Match competitor sticker classes */
const CLASSES = [
  { id: "terminal-surfer", label: "Terminal Surfer" },
  { id: "cache-raider", label: "Cache Raider" },
  { id: "wave-rider", label: "Wave Rider" },
  { id: "coconut-courier", label: "Coconut Courier" },
  { id: "harbor-hopper", label: "Harbor Hopper" },
  { id: "night-champion", label: "Night Champion" },
  { id: "comfort-coder", label: "Comfort Coder" },
];

const STICKER_CDN = "https://hhgoa-own-id-card.vercel.app/stickers";
const STORE = "hhgoa_id_v4";
const $ = (id) => document.getElementById(id);

const state = {
  view: "landing",
  image: null,
  objectUrl: null,
  zoom: 1.15,
  panX: 0,
  panY: 0,
  name: "",
  stack: "",
  titleId: CLASSES[(Math.random() * CLASSES.length) | 0].id,
  handle: "",
  city: "",
  team: "",
  bio: "",
  idNumber: "",
  listOnMap: true,
  lat: null,
  lng: null,
  locationSet: false,
  locationLabel: "",
  map: null,
  markers: new Map(),
  builders: [],
  radarTeams: [],
  logos: { mark: null, pass: null },
  stickers: {},
  mapReady: false,
  mapBooted: false,
  tempMark: null,
  pickMode: false,
  pickLat: null,
  pickLng: null,
  pickLabel: "",
  returnToStudioAfterPick: false,
};

function classLabel() {
  return CLASSES.find((c) => c.id === state.titleId)?.label || "Builder";
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
    if (typeof heic2any !== "function") throw new Error("HEIC converter missing — try JPG/PNG");
    const out = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
    blob = Array.isArray(out) ? out[0] : out;
  }
  if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
  state.objectUrl = URL.createObjectURL(blob);
  return loadImg(state.objectUrl);
}
function uid() {
  return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}
function esc(s) {
  return String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}
function accent() {
  return BRAND.yellow;
}
function genIdNumber(seed) {
  let h = 2166136261;
  const s = String(seed || Date.now()) + Math.random().toString(36);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const hex = (h >>> 0).toString(16).toUpperCase().padStart(8, "0");
  return `HHG-2026-${hex.slice(0, 4)}`;
}
function loadStore() {
  try {
    state.builders = JSON.parse(localStorage.getItem(STORE) || "[]");
  } catch {
    state.builders = [];
  }
}
function saveStore() {
  localStorage.setItem(STORE, JSON.stringify(state.builders));
}

/* ── toast ── */
function toast(msg, ms = 2400) {
  const el = $("toast");
  if (!el) return;
  el.textContent = msg;
  el.hidden = false;
  requestAnimationFrame(() => el.classList.add("show"));
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => { el.hidden = true; }, 250);
  }, ms);
}

function updateLocUI() {
  const status = $("loc-status");
  const label = $("loc-label");
  const coords = $("loc-coords");
  if (!status) return;
  if (state.locationSet && state.lat != null) {
    status.classList.add("is-set");
    label.textContent = state.locationLabel || "Location locked";
    coords.textContent = `${Number(state.lat).toFixed(4)}, ${Number(state.lng).toFixed(4)}`;
    if ($("f-lat")) $("f-lat").value = Number(state.lat).toFixed(5);
    if ($("f-lng")) $("f-lng").value = Number(state.lng).toFixed(5);
  } else {
    status.classList.remove("is-set");
    label.textContent = "No location selected";
    coords.textContent = "Pick on map before pinning";
    if ($("f-lat")) $("f-lat").value = "";
    if ($("f-lng")) $("f-lng").value = "";
  }
  const pinBtn = $("btn-pin");
  if (pinBtn) pinBtn.disabled = !(state.image && state.locationSet);
}

/* ── views ── */
function show(view) {
  state.view = view;
  $("landing").hidden = view !== "landing";
  $("studio").hidden = view !== "studio";
  $("tracker").hidden = view !== "tracker";
  document.body.style.overflow = view === "landing" ? "" : "hidden";
  if (view === "studio") {
    renderCard();
    $("id-display").textContent = state.idNumber;
    updateLocUI();
  }
  if (view === "tracker") {
    // Boot ONLY first time map loads
    if (!state.mapBooted) {
      runMapBoot(() => {
        state.mapBooted = true;
        loadTracker();
      });
    } else {
      loadTracker();
    }
  }
}

async function loadTracker() {
  $("boot").hidden = true;
  await ensureMap();
  refreshMarkers();
  renderLog();
  updateHud();
  if (state.pickMode) enterPickMode(false);
  setTimeout(() => state.map?.invalidateSize(), 100);
}

/* ── location pick mode (select BEFORE pin) ── */
async function openMapPicker() {
  state.returnToStudioAfterPick = true;
  state.pickMode = true;
  show("tracker");
  await ensureMap();
  enterPickMode(true);
}

function enterPickMode(resetPick = true) {
  state.pickMode = true;
  document.body.classList.add("is-picking");
  $("pick-banner").hidden = false;
  $("map-hint").textContent = "TAP MAP to choose · then Confirm location";
  $("chip-status").textContent = "SELECT LOCATION";
  $("btn-pick-confirm").disabled = !(state.pickLat != null || (state.locationSet && !resetPick));
  if (resetPick) {
    state.pickLat = state.locationSet ? state.lat : null;
    state.pickLng = state.locationSet ? state.lng : null;
    state.pickLabel = state.locationLabel || "";
  }
  if (state.pickLat != null) {
    setPickMarker(state.pickLat, state.pickLng, state.pickLabel);
    $("btn-pick-confirm").disabled = false;
    $("pick-selected").hidden = false;
    $("pick-selected-text").textContent =
      `${state.pickLabel || "Selected"} · ${Number(state.pickLat).toFixed(4)}, ${Number(state.pickLng).toFixed(4)}`;
  } else {
    $("pick-selected").hidden = true;
    $("btn-pick-confirm").disabled = true;
  }
  toast("Tap the map to select your location");
}

function exitPickMode() {
  state.pickMode = false;
  document.body.classList.remove("is-picking");
  $("pick-banner").hidden = true;
  $("map-hint").textContent = "Explore · or SELECT LOCATION from Studio";
  $("chip-status").textContent = state.builders.length ? "BUILDERS LIVE" : "WORLD SCAN";
}

function setPickMarker(lat, lng, label) {
  state.pickLat = lat;
  state.pickLng = lng;
  state.pickLabel = label || state.pickLabel || "Selected";
  if (state.tempMark) state.tempMark.remove();
  if (!state.map) return;
  state.tempMark = L.marker([lat, lng], {
    icon: L.divIcon({
      className: "",
      html: `<div class="mk you"><span>★</span></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 24],
    }),
    zIndexOffset: 1000,
  }).addTo(state.map);
  $("pick-selected").hidden = false;
  $("pick-selected-text").textContent =
    `${state.pickLabel} · ${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`;
  $("btn-pick-confirm").disabled = false;
  $("chip-coords").textContent = `${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`;
}

function confirmPickLocation() {
  if (state.pickLat == null || state.pickLng == null) {
    toast("Tap the map first");
    return;
  }
  state.lat = state.pickLat;
  state.lng = state.pickLng;
  state.locationSet = true;
  state.locationLabel = state.pickLabel || state.city || "Custom pin";
  if (state.locationLabel && state.locationLabel !== "Selected") {
    state.city = state.city || state.locationLabel;
    if ($("f-city") && !$("f-city").value) $("f-city").value = state.city;
  }
  exitPickMode();
  updateLocUI();
  toast("Location locked · now Confirm pin");
  if (state.returnToStudioAfterPick) {
    state.returnToStudioAfterPick = false;
    show("studio");
  }
  renderCard();
}

function cancelPick() {
  exitPickMode();
  if (state.tempMark && !state.locationSet) {
    state.tempMark.remove();
    state.tempMark = null;
  } else if (state.locationSet && state.map) {
    setPickMarker(state.lat, state.lng, state.locationLabel);
    // keep marker visual only if still picking - already exited
    if (state.tempMark) {
      /* leave confirmed location marker as temp until pin drops - clear */
      state.tempMark.remove();
      state.tempMark = null;
    }
  }
  state.returnToStudioAfterPick = false;
  toast("Location pick cancelled");
}

/* ── radar anim ── */
function spinRadar(canvas, { speed = 0.045, dots = [] } = {}) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) / 2 - 5;
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
    ctx.strokeStyle = accent();
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = "rgba(254,225,1,.22)";
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
    ctx.arc(0, 0, r - 2, -0.4, 0.05);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    for (const d of dots) {
      const br = r * d.dist;
      ctx.fillStyle = d.color || BRAND.cyan;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(d.a + a * 0.12) * br, cy + Math.sin(d.a + a * 0.12) * br, d.size || 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = accent();
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    ctx.fill();
    a += speed;
    raf = requestAnimationFrame(draw);
  };
  draw();
  return () => cancelAnimationFrame(raf);
}

/* ── canvas: official Builder Pass template (from own-id-card RE) ── */
// Layout calibrated on BuilderPass.png 1536×1024
const PASS = {
  W: 1536,
  H: 1024,
  photo: { cx: 344, cy: 603, r: 142 },
  name: { x: 620, y: 400, maxW: 780 },
  stack: { x: 620, y: 530, maxW: 780 },
  title: { x: 620, y: 660, maxW: 780 },
  id: { x: 620, y: 760, maxW: 400 },
  handle: { x: 1020, y: 760, maxW: 380 },
};

function drawCoverCircle(c, img, cx, cy, r) {
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

function fit(c, text, maxW, maxSize, min = 18, fam = "Space Grotesk, sans-serif", weight = "800") {
  let s = maxSize;
  c.font = `${weight} ${s}px ${fam}`;
  while (s > min && c.measureText(text).width > maxW) {
    s--;
    c.font = `${weight} ${s}px ${fam}`;
  }
  return s;
}

function renderCard() {
  const canvas = $("canvas");
  if (!canvas) return;
  const c = canvas.getContext("2d");
  const { W, H, photo, name: nameBox, stack: stackBox, title: titleBox } = PASS;
  canvas.width = W;
  canvas.height = H;

  // 1) Official template background
  if (state.logos.pass) {
    c.drawImage(state.logos.pass, 0, 0, W, H);
  } else {
    // fallback green card
    c.fillStyle = "#063725";
    c.fillRect(0, 0, W, H);
    c.fillStyle = BRAND.yellow;
    c.font = "800 64px Space Grotesk, sans-serif";
    c.fillText("HACKER HOUSE", 80, 100);
  }

  // 2) Circular photo in pass hole
  if (state.image) {
    drawCoverCircle(c, state.image, photo.cx, photo.cy, photo.r);
  } else {
    c.fillStyle = "rgba(254,225,1,.12)";
    c.beginPath();
    c.arc(photo.cx, photo.cy, photo.r, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = BRAND.yellow;
    c.font = "700 18px JetBrains Mono, monospace";
    c.textAlign = "center";
    c.fillText("PHOTO", photo.cx, photo.cy + 6);
  }

  // 3) Text in form fields (cream/yellow on green)
  const name = (state.name || "BUILDER NAME").toUpperCase();
  const stack = (state.stack || "STACK & ROLE").toUpperCase();
  const title = classLabel().toUpperCase();

  c.textAlign = "left";
  c.fillStyle = "#FFF8EB";
  let ns = fit(c, name, nameBox.maxW, 42, 22, "Space Grotesk, sans-serif", "800");
  c.font = `800 ${ns}px Space Grotesk, sans-serif`;
  c.fillText(name, nameBox.x, nameBox.y);

  c.fillStyle = "#FEE101";
  let ss = fit(c, stack, stackBox.maxW, 28, 16, "Space Grotesk, sans-serif", "700");
  c.font = `700 ${ss}px Space Grotesk, sans-serif`;
  c.fillText(stack, stackBox.x, stackBox.y);

  c.fillStyle = "#E52B50";
  let ts = fit(c, title, titleBox.maxW, 30, 16, "Space Grotesk, sans-serif", "800");
  c.font = `800 ${ts}px Space Grotesk, sans-serif`;
  c.fillText(title, titleBox.x, titleBox.y);

  // ID + handle + city + team
  c.fillStyle = "rgba(254,225,1,.85)";
  c.font = "700 16px JetBrains Mono, monospace";
  c.fillText(state.idNumber || "HHG-2026-····", PASS.id.x, PASS.id.y);

  const meta = [
    state.handle ? (state.handle.startsWith("@") ? state.handle : `@${state.handle}`) : null,
    state.city || null,
    state.team ? `TEAM ${state.team}` : null,
  ]
    .filter(Boolean)
    .join("  ·  ")
    .toUpperCase();
  if (meta) {
    c.fillStyle = "rgba(255,248,235,.75)";
    c.font = "600 15px Space Grotesk, sans-serif";
    c.fillText(meta.slice(0, 48), PASS.handle.x - 200, PASS.handle.y);
  }

  // subtle #FrameInGoa
  c.fillStyle = "rgba(254,225,1,.55)";
  c.font = "700 14px JetBrains Mono, monospace";
  c.textAlign = "right";
  c.fillText("#FrameInGoa", W - 48, H - 36);
  c.textAlign = "left";

  // optional bio under fields
  if (state.bio) {
    c.fillStyle = "rgba(255,248,235,.55)";
    c.font = "500 14px Space Grotesk, sans-serif";
    c.fillText(state.bio.slice(0, 56), nameBox.x, 820);
  }

  const ready = !!state.image;
  ["btn-dl", "btn-dl-2", "btn-share"].forEach((id) => {
    const el = $(id);
    if (el) el.disabled = !ready;
  });
  const pinBtn = $("btn-pin");
  if (pinBtn) pinBtn.disabled = !(ready && state.locationSet);
}

/* ── map ── */
async function ensureMap() {
  if (state.mapReady && state.map) return;
  const map = L.map("map", { zoomControl: false, worldCopyJump: true }).setView([20, 40], 2);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    attribution: "&copy; OSM &copy; CARTO",
  }).addTo(map);
  L.control.zoom({ position: "topright" }).addTo(map);
  L.circle([HQ.lat, HQ.lng], {
    radius: 1400,
    color: BRAND.yellow,
    weight: 1.5,
    fillColor: BRAND.yellow,
    fillOpacity: 0.1,
  }).addTo(map);
  state.map = map;
  state.mapReady = true;

  map.on("click", async (e) => {
    const lat = +e.latlng.lat.toFixed(5);
    const lng = +e.latlng.lng.toFixed(5);
    $("chip-coords").textContent = `${lat}, ${lng}`;
    if (!state.pickMode) {
      // not in pick mode — show coords only, don't set pin
      $("chip-status").textContent = "EXPLORE";
      return;
    }
    $("chip-status").textContent = "LOCATION PICKED";
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
    state.map.panTo([lat, lng]);
  });
  map.on("mousemove", (e) => {
    if (!state.pickMode) {
      $("chip-coords").textContent = `${e.latlng.lat.toFixed(2)}, ${e.latlng.lng.toFixed(2)}`;
    }
  });

  // ticker
  const items = [
    "SEARCHING FOR HACKER MAN…",
    "HH GOA HQ · 28–31 OCT 2026",
    "MINT BUILDER ID · UNIQUE ID NUMBER",
    "PIN ANYWHERE ON EARTH · #FrameInGoa",
    "LESS NOISE · MORE SIGNAL",
  ];
  $("ticker").innerHTML = [...items, ...items].map((t) => `<span>${t}</span>`).join("");

  spinRadar($("mini-radar"), {
    speed: 0.04,
    dots: [
      { a: 0.3, dist: 0.55, color: BRAND.yellow, size: 4 },
      { a: 2, dist: 0.7, color: BRAND.pink, size: 3 },
      { a: 4, dist: 0.45, color: "#00ff70", size: 3 },
    ],
  });

  let st;
  $("loc-search").oninput = () => {
    clearTimeout(st);
    const q = $("loc-search").value.trim();
    if (q.length < 2) return;
    st = setTimeout(() => searchPlace(q), 450);
  };
}

async function searchPlace(q) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`,
      { headers: { Accept: "application/json" } }
    );
    const data = await res.json();
    if (!data?.[0]) {
      toast("Place not found");
      return;
    }
    const lat = +data[0].lat;
    const lng = +data[0].lon;
    const label = data[0].display_name?.split(",")[0] || q;
    state.map.flyTo([lat, lng], 10, { duration: 1.1 });
    if (!state.pickMode) enterPickMode(true);
    setPickMarker(lat, lng, label);
    $("chip-status").textContent = "PLACE LOCKED";
    toast(`Found: ${label}`);
  } catch {
    toast("Search failed");
  }
}

function icon(kind) {
  const cls = kind === "hq" ? "hq" : kind === "you" ? "you" : kind === "radar" ? "radar" : "builder";
  const label = kind === "hq" ? "⌂" : kind === "you" ? "★" : kind === "radar" ? "#" : "◆";
  const size = kind === "hq" ? 36 : 28;
  return L.divIcon({
    className: "",
    html: `<div class="mk ${cls}"><span>${label}</span></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size - 4],
  });
}

function allPins() {
  const radar = state.radarTeams.map((t) => ({
    id: `radar-${t.rank}`,
    kind: "radar",
    name: t.name,
    stack: `@${t.handle} · ${t.views}`,
    title: `Score ${t.score} · #${t.rank}`,
    idNumber: `RADAR-${String(t.rank).padStart(3, "0")}`,
    city: t.city,
    lat: t.lat,
    lng: t.lng,
    post: t.post,
    createdAt: "2026-08-01T00:00:00Z",
  }));
  return [HQ, ...radar, ...state.builders];
}

function refreshMarkers() {
  if (!state.map) return;
  for (const m of state.markers.values()) m.remove();
  state.markers.clear();
  for (const pin of allPins()) {
    if (pin.lat == null) continue;
    const m = L.marker([pin.lat, pin.lng], { icon: icon(pin.kind || "builder") })
      .addTo(state.map)
      .on("click", () => showPin(pin));
    state.markers.set(pin.id, m);
  }
  updateHud();
}

function showPin(pin) {
  $("pin-name").textContent = pin.name || "—";
  $("pin-meta").textContent = [pin.stack, pin.city].filter(Boolean).join(" · ");
  $("pin-title").textContent = pin.title || "";
  $("pin-idnum").textContent = pin.idNumber || "";
  $("pin-badge").textContent =
    pin.kind === "hq" ? "HQ" : pin.kind === "radar" ? "RADAR" : pin.kind === "you" ? "YOU" : "BUILDER";
  const img = $("pin-img");
  if (pin.photo) {
    img.src = pin.photo;
    img.style.background = "";
  } else {
    img.removeAttribute("src");
    img.style.background = pin.kind === "hq" ? BRAND.yellow : pin.kind === "radar" ? BRAND.pink : BRAND.green;
  }
  const link = $("pin-link");
  if (pin.post) {
    link.hidden = false;
    link.href = pin.post;
  } else link.hidden = true;
  $("pin-card").hidden = false;
}

function updateHud() {
  const n = state.builders.length;
  const r = state.radarTeams.length;
  $("chip-count").textContent = `${n + r + 1} ON MAP`;
  $("chip-status").textContent = n ? "BUILDERS LIVE" : "WORLD SCAN";
}

function renderLog() {
  const items = [...allPins()]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 60);
  $("log-list").innerHTML = items
    .map((p) => {
      const lb = p.kind === "hq" ? "hq" : p.kind === "radar" ? "radar" : p.kind === "you" ? "you" : "";
      const label = p.kind === "hq" ? "HQ" : p.kind === "radar" ? "RADAR" : p.kind === "you" ? "YOU" : "BUILDER";
      const thumb = p.photo
        ? `<img src="${p.photo}" alt="" />`
        : `<img alt="" style="background:${p.kind === "hq" ? BRAND.yellow : p.kind === "radar" ? BRAND.pink : BRAND.green}" />`;
      return `<li data-id="${esc(p.id)}">${thumb}<div><span class="lb ${lb}">${label}</span><strong>${esc(p.name)}</strong><small>${esc(p.idNumber || p.title || "")}</small></div></li>`;
    })
    .join("");
  $("log-list").querySelectorAll("li").forEach((li) => {
    li.onclick = () => {
      const pin = allPins().find((p) => p.id === li.dataset.id);
      if (!pin || !state.map) return;
      state.map.flyTo([pin.lat, pin.lng], 5, { duration: 1 });
      showPin(pin);
      closeDrawers();
    };
  });
}

function renderRadarTable() {
  const tb = $("radar-table").querySelector("tbody");
  tb.innerHTML = state.radarTeams
    .map(
      (t) => `<tr data-rank="${t.rank}">
      <td>${t.rank}</td>
      <td><strong>${esc(t.name)}</strong></td>
      <td><a href="https://x.com/${esc(t.handle)}" target="_blank" rel="noopener">@${esc(t.handle)}</a></td>
      <td>${esc(t.views)}</td>
      <td class="score">${t.score}</td>
      <td><a href="${esc(t.post)}" target="_blank" rel="noopener">Post ↗</a></td>
    </tr>`
    )
    .join("");
  tb.querySelectorAll("tr").forEach((tr) => {
    tr.onclick = (e) => {
      if (e.target.closest("a")) return;
      const t = state.radarTeams.find((x) => String(x.rank) === tr.dataset.rank);
      if (!t || !state.map) return;
      state.map.flyTo([t.lat, t.lng], 5, { duration: 1 });
      showPin({
        kind: "radar",
        name: t.name,
        stack: `@${t.handle}`,
        title: `Score ${t.score}`,
        idNumber: `RADAR-${t.rank}`,
        city: t.city,
        lat: t.lat,
        lng: t.lng,
        post: t.post,
      });
      closeDrawers();
    };
  });
}

/* ── export ── */
function blobPng() {
  return new Promise((res) => $("canvas").toBlob((b) => res(b), "image/png"));
}
function fname() {
  const slug = (state.name || "builder").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 20);
  return `hhgoa-builder-id-${slug || "card"}.png`;
}
async function download() {
  renderCard();
  const b = await blobPng();
  const u = URL.createObjectURL(b);
  const a = document.createElement("a");
  a.href = u;
  a.download = fname();
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1200);
}
function tweet() {
  const n = state.name.trim() ? `${state.name.trim()} · ` : "";
  return `${n}Builder ID locked for Hacker House Goa 2026\n${state.idNumber} · ${classLabel()}\n28–31 Oct · Goa\n\n#FrameInGoa #HHGoa #HackerHouseGoa`;
}
async function shareX() {
  renderCard();
  const b = await blobPng();
  const file = new File([b], fname(), { type: "image/png" });
  const text = tweet();
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text, title: "HH Goa Builder ID" });
      return;
    } catch (e) {
      if (e?.name === "AbortError") return;
    }
  }
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": b })]);
    }
  } catch { /* */ }
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank", "noopener");
}

async function dropPin() {
  if (!state.image) {
    toast("Upload a photo first");
    return;
  }
  if (!state.locationSet || state.lat == null) {
    toast("Select your location on the map first");
    openMapPicker();
    return;
  }
  if (!state.listOnMap) {
    toast("Enable “List me on the world map”");
    return;
  }
  renderCard();
  const thumb = document.createElement("canvas");
  thumb.width = 160;
  thumb.height = 160;
  const tc = thumb.getContext("2d");
  drawCoverCircle(tc, state.image, 80, 80, 80);
  const photo = thumb.toDataURL("image/jpeg", 0.75);
  const lat = state.lat;
  const lng = state.lng;
  const pin = {
    id: uid(),
    kind: "you",
    name: state.name.trim() || "Anonymous Builder",
    stack: state.stack.trim() || "Builder",
    title: classLabel(),
    idNumber: state.idNumber,
    handle: state.handle.trim(),
    team: state.team.trim(),
    city: state.city.trim() || state.locationLabel || "World",
    bio: state.bio.trim(),
    lat,
    lng,
    photo,
    isSelf: true,
    createdAt: new Date().toISOString(),
  };
  state.builders = state.builders.filter((b) => !b.isSelf);
  state.builders.push(pin);
  saveStore();
  if (state.tempMark) {
    state.tempMark.remove();
    state.tempMark = null;
  }
  exitPickMode();
  show("tracker");
  await ensureMap();
  refreshMarkers();
  renderLog();
  state.map.flyTo([lat, lng], 5, { duration: 1.2 });
  showPin(pin);
  toast("Builder pin dropped on map · #FrameInGoa");
}

/* ── drawers / track ── */
function openDrawer(name) {
  closeDrawers();
  $(`panel-${name}`).hidden = false;
  $("backdrop").hidden = false;
  if (name === "log") renderLog();
  if (name === "radar") renderRadarTable();
  if (name === "track") {
    spinRadar($("track-radar"), {
      speed: 0.05,
      dots: [{ a: 2, dist: 0.5, color: BRAND.yellow, size: 4 }],
    });
  }
}
function closeDrawers() {
  ["log", "radar", "track"].forEach((n) => {
    $(`panel-${n}`).hidden = true;
  });
  $("backdrop").hidden = true;
}

function runSweep() {
  $("ghost").classList.remove("on");
  const stop = spinRadar($("track-radar"), {
    speed: 0.09,
    dots: [
      { a: 1, dist: 0.55, color: BRAND.red, size: 3 },
      { a: 2.8, dist: 0.7, color: BRAND.pink, size: 3 },
      { a: 4.5, dist: 0.4, color: BRAND.yellow, size: 4 },
    ],
  });
  const steps = ["Scanning continents…", "Filtering noise…", "HACKER MAN SIGNAL", "WORLD LOCKED"];
  let i = 0;
  const t = setInterval(() => {
    $("track-msg").textContent = steps[i] || steps[steps.length - 1];
    i++;
    if (i >= steps.length) {
      clearInterval(t);
      stop();
      $("ghost").classList.add("on");
      $("track-msg").textContent = "FOUND — mint your ID & pin anywhere";
      if (state.map) state.map.flyTo([HQ.lat, HQ.lng], 4, { duration: 1.3 });
    }
  }, 650);
}

/* ── form sync ── */
function sync() {
  state.name = $("f-name").value;
  state.stack = $("f-stack").value;
  state.titleId = $("f-title")?.value || state.titleId;
  state.handle = $("f-handle").value;
  state.city = $("f-city").value;
  state.team = $("f-team").value;
  state.bio = $("f-bio").value;
  state.listOnMap = $("t-list").checked;
  renderCard();
  $("id-display").textContent = state.idNumber;
  updateLocUI();
}

function bind() {
  // landing
  ["btn-start", "btn-start-top", "btn-start-2"].forEach((id) => {
    $(id)?.addEventListener("click", () => show("studio"));
  });
  $("btn-start-map").onclick = () => show("tracker");
  $("btn-home").onclick = () => show("landing");
  $("btn-open-map").onclick = () => show("tracker");
  $("btn-from-map").onclick = () => show("studio");
  $("btn-mint-from-map").onclick = () => show("studio");
  $("btn-world").onclick = () => state.map?.flyTo([20, 40], 2, { duration: 1 });
  $("btn-goa").onclick = () => state.map?.flyTo([HQ.lat, HQ.lng], 12, { duration: 1 });

  // upload
  const drop = $("drop");
  const file = $("file");
  drop.onclick = () => file.click();
  $("rephoto").onclick = (e) => {
    e.stopPropagation();
    file.click();
  };
  file.onchange = async () => {
    const f = file.files?.[0];
    if (!f) return;
    try {
      state.image = await fileToImage(f);
      $("thumb").src = state.objectUrl;
      $("drop-empty").hidden = true;
      $("drop-has").hidden = false;
      if (!state.name) {
        // keep id stable once set
      }
      renderCard();
    } catch (e) {
      alert(e.message || "Could not load image");
    }
  };
  drop.ondragover = (e) => {
    e.preventDefault();
    drop.classList.add("drag");
  };
  drop.ondragleave = () => drop.classList.remove("drag");
  drop.ondrop = async (e) => {
    e.preventDefault();
    drop.classList.remove("drag");
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    try {
      state.image = await fileToImage(f);
      $("thumb").src = state.objectUrl;
      $("drop-empty").hidden = true;
      $("drop-has").hidden = false;
      renderCard();
    } catch (err) {
      alert(err.message || "Could not load image");
    }
  };

  [
    "f-name", "f-stack", "f-title", "f-handle", "f-city", "f-team", "f-bio",
    "t-list", "f-lat", "f-lng",
  ].forEach((id) => {
    const el = $(id);
    if (!el) return;
    el.addEventListener("input", sync);
    el.addEventListener("change", sync);
  });

  // populate builder class select
  const titleSel = $("f-title");
  if (titleSel && titleSel.tagName === "SELECT") {
    titleSel.innerHTML = CLASSES.map(
      (c) => `<option value="${c.id}" ${c.id === state.titleId ? "selected" : ""}>${c.label}</option>`
    ).join("");
  }
  updateLocUI();

  $("reroll").onclick = () => {
    state.titleId = CLASSES[(Math.random() * CLASSES.length) | 0].id;
    if (titleSel) titleSel.value = state.titleId;
    renderCard();
  };
  $("regen-id").onclick = () => {
    state.idNumber = genIdNumber(state.name + Date.now());
    $("id-display").textContent = state.idNumber;
    renderCard();
    toast("New ID number issued");
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

  $("btn-pick-map").onclick = () => openMapPicker();
  $("btn-pick-from-map").onclick = () => {
    state.returnToStudioAfterPick = false;
    enterPickMode(true);
  };
  $("btn-pick-confirm").onclick = confirmPickLocation;
  $("btn-pick-cancel").onclick = cancelPick;

  $("btn-gps").onclick = () => {
    if (!navigator.geolocation) return toast("GPS unavailable");
    toast("Reading GPS…");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        state.returnToStudioAfterPick = state.view === "studio";
        if (state.view !== "tracker") show("tracker");
        await ensureMap();
        enterPickMode(true);
        setPickMarker(lat, lng, "Your GPS");
        state.map.flyTo([lat, lng], 11, { duration: 1 });
        toast("GPS locked · Confirm location");
      },
      () => toast("GPS failed / denied")
    );
  };
  $("btn-hq").onclick = () => {
    const lat = HQ.lat + (Math.random() - 0.5) * 0.02;
    const lng = HQ.lng + (Math.random() - 0.5) * 0.02;
    state.lat = lat;
    state.lng = lng;
    state.locationSet = true;
    state.locationLabel = "Near Goa HQ";
    state.city = "Goa";
    if ($("f-city")) $("f-city").value = "Goa";
    updateLocUI();
    renderCard();
    toast("Location set near HH Goa HQ");
  };

  $("btn-radar-hq").onclick = () => state.map?.flyTo([HQ.lat, HQ.lng], 12, { duration: 1 });
  $("btn-radar-me").onclick = () => {
    if (state.locationSet) state.map?.flyTo([state.lat, state.lng], 10, { duration: 1 });
    else $("btn-gps").click();
  };

  $("btn-dl").onclick = download;
  $("btn-dl-2").onclick = download;
  $("btn-share").onclick = shareX;
  $("btn-pin").onclick = dropPin;

  $("btn-log").onclick = () => openDrawer("log");
  $("btn-radar").onclick = () => openDrawer("radar");
  $("btn-track").onclick = () => openDrawer("track");
  $("btn-sweep").onclick = runSweep;
  document.querySelectorAll("[data-close]").forEach((b) => (b.onclick = closeDrawers));
  $("backdrop").onclick = closeDrawers;
  $("pin-x").onclick = () => {
    $("pin-card").hidden = true;
  };
}

/* ── map boot ONLY (first map open — Spidey-style) ── */
function runMapBoot(done) {
  const boot = $("boot");
  const log = $("boot-log");
  const fill = $("boot-fill");
  const enter = $("btn-enter");
  const search = $("boot-search");
  boot.hidden = false;
  log.textContent = "";
  fill.style.width = "0%";
  enter.hidden = true;
  search.style.animation = "";
  search.textContent = "SEARCHING FOR HACKER MAN…";

  const lines = [
    "INITIALIZING MAP RENDER PIPELINE…",
    "CALIBRATING RADAR SWEEP [OK]",
    "LOCATING HH GOA HQ [LOCKED]",
    "HYDRATING BUILDER PINS…",
    "OPENING WORLD MESH…",
    "SEARCHING FOR HACKER MAN…",
    "MAP SYSTEMS NOMINAL",
  ];
  let i = 0;
  let p = 0;
  const stop = spinRadar($("boot-radar"), {
    speed: 0.07,
    dots: [
      { a: 0.4, dist: 0.5, color: BRAND.yellow, size: 4 },
      { a: 2.1, dist: 0.72, color: BRAND.pink, size: 3 },
      { a: 4, dist: 0.4, color: BRAND.cyan, size: 3 },
      { a: 5.4, dist: 0.85, color: "#00ff70", size: 3 },
    ],
  });
  const phrases = ["SEARCHING FOR HACKER MAN…", "SCANNING WORLD MESH…", "LOCKING GOA HQ…", "MAP ONLINE…"];
  let pi = 0;
  const pt = setInterval(() => {
    pi = (pi + 1) % phrases.length;
    search.textContent = phrases[pi];
  }, 700);
  const tick = () => {
    if (i < lines.length) {
      log.textContent += (i ? "\n" : "") + lines[i++];
      log.scrollTop = log.scrollHeight;
      setTimeout(tick, 80);
    } else {
      clearInterval(pt);
      search.textContent = "MAP READY";
      search.style.animation = "none";
      fill.style.width = "100%";
      enter.hidden = false;
      stop();
      // auto-enter after short beat if user doesn't click
      const auto = setTimeout(() => {
        boot.hidden = true;
        done?.();
      }, 900);
      enter.onclick = () => {
        clearTimeout(auto);
        boot.hidden = true;
        done?.();
      };
    }
  };
  const prog = setInterval(() => {
    p = Math.min(100, p + 3 + Math.random() * 3);
    fill.style.width = p + "%";
    if (p >= 100) clearInterval(prog);
  }, 50);
  tick();
}

async function main() {
  loadStore();
  state.idNumber = genIdNumber("boot");
  $("boot").hidden = true; // no boot on landing
  bind();
  try {
    state.logos.mark = await loadImg("./public/assets/2-47.svg");
  } catch { /* */ }
  try {
    state.logos.pass = await loadImg("./public/assets/BuilderPass.png");
  } catch {
    console.warn("BuilderPass template missing");
  }
  try {
    const r = await fetch("./data/radar.json");
    const data = await r.json();
    state.radarTeams = data.teams || [];
  } catch {
    state.radarTeams = [];
  }
  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch { /* */ }
  }
  $("id-display").textContent = state.idNumber;
  renderCard();
  updateLocUI();

  const q = new URLSearchParams(location.search);
  if (q.get("map") === "1") show("tracker");
  else if (q.get("studio") === "1") show("studio");
  else show("landing");
}

main();
