/**
 * Hacker Tracker · HH Goa 2026
 * World map · VIP/Boarding/PFP/Team cards · W Celeb Radar · #FrameInGoa
 */

const BRAND = {
  green: "#0B6839",
  greenMid: "#084D2A",
  greenDark: "#052C17",
  greenInk: "#02140C",
  yellow: "#FEE101",
  yellow2: "#F5D800",
  pink: "#FF2D84",
  cyan: "#7DFFC8",
  cream: "#F5EDD6",
  white: "#FAFAF8",
  red: "#FF4040",
  black: "#0A0A08",
};

const ACCENTS = {
  yellow: BRAND.yellow,
  pink: BRAND.pink,
  cyan: BRAND.cyan,
  white: BRAND.white,
};

const HQ = {
  id: "hh-goa-hq",
  kind: "hq",
  name: "HACKER HOUSE GOA HQ",
  stack: "Private beach residency",
  title: "MAIN LOCATION · 28–31 OCT",
  city: "Goa, India",
  lat: 15.5736,
  lng: 73.7419,
  createdAt: "2026-05-07T00:00:00.000Z",
};

const RUMORS = [
  { id: "r1", kind: "rumor", name: "Terminal Ghost", stack: "Unknown", title: "Signal only", lat: 40.71, lng: -74.0, city: "NYC", createdAt: "2026-08-01T10:00:00Z" },
  { id: "r2", kind: "rumor", name: "Fiber Fox", stack: "Unconfirmed", title: "Coastal hop", lat: 1.35, lng: 103.82, city: "Singapore", createdAt: "2026-08-03T14:00:00Z" },
  { id: "r3", kind: "rumor", name: "Onchain Otter", stack: "Rumor", title: "Night compile", lat: 51.5, lng: -0.12, city: "London", createdAt: "2026-08-05T09:00:00Z" },
  { id: "r4", kind: "rumor", name: "Lag Phantom", stack: "Rumor", title: "Mesh flicker", lat: -33.87, lng: 151.21, city: "Sydney", createdAt: "2026-08-06T11:00:00Z" },
];

const TITLES = [
  "Terminal Surfer", "Ship-or-Ship Specialist", "Onchain Cartographer", "Prompt Pirate",
  "Latency Assassin", "Beachside Architect", "Zero-Fluff Founder", "Fiber-Fed Builder",
  "Sandbox Sovereign", "Stack Alchemist", "Deploy Day Captain", "Signal Over Noise",
  "Goa Runtime Lead", "Token Tide Rider", "Agent Whisperer", "Mainnet Mariner",
  "API Horizon Scout", "Weekend Warship", "Commit Coastal", "Open Source Ocean",
];

const BOOT = [
  "INITIALIZING HACKER TRACKER v2.0…",
  "BOOTING CORE SERVICES [OK]",
  "LOADING WORLD MAP TILES…",
  "CALIBRATING RADAR SWEEP [OK]",
  "HYDRATING W CELEB RADAR…",
  "LOCATING HH GOA HQ [LOCKED]",
  "OPENING GLOBAL BUILDER MESH…",
  "SEARCHING FOR HACKER MAN…",
  "ALL SYSTEMS NOMINAL — TRACKER ONLINE",
];

const STORE = "hhgoa_builders_v2";
const $ = (id) => document.getElementById(id);

const state = {
  format: "vip",
  accent: "yellow",
  theme: "classic",
  image: null,
  objectUrl: null,
  zoom: 1.1,
  panX: 0,
  panY: 0,
  rot: 0,
  name: "",
  stack: "",
  title: TITLES[(Math.random() * TITLES.length) | 0],
  handle: "",
  team: "",
  city: "",
  bio: "",
  holo: true,
  barcode: true,
  hindi: true,
  lanyard: true,
  listOnMap: true,
  lat: HQ.lat + 0.01,
  lng: HQ.lng + 0.01,
  map: null,
  markers: new Map(),
  builders: [],
  radarTeams: [],
  logos: { mark: null, goa: null },
  pendingClick: null,
};

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
    if (typeof heic2any !== "function") throw new Error("HEIC converter missing");
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
  return ACCENTS[state.accent] || BRAND.yellow;
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

/* ── radar canvas ── */
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
    ctx.lineWidth = 1;
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
      const bx = cx + Math.cos(d.a + a * 0.12) * br;
      const by = cy + Math.sin(d.a + a * 0.12) * br;
      ctx.fillStyle = d.color || BRAND.cyan;
      ctx.beginPath();
      ctx.arc(bx, by, d.size || 3, 0, Math.PI * 2);
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

/* ── preloader ── */
function boot() {
  const log = $("boot-log");
  const fill = $("boot-fill");
  const enter = $("btn-enter");
  const search = $("boot-search");
  let i = 0;
  let p = 0;
  const stop = spinRadar($("boot-radar"), {
    speed: 0.06,
    dots: [
      { a: 0.4, dist: 0.5, color: BRAND.yellow, size: 4 },
      { a: 2, dist: 0.7, color: BRAND.pink, size: 3 },
      { a: 4.2, dist: 0.4, color: BRAND.cyan, size: 3 },
      { a: 5.5, dist: 0.85, color: "#00ff70", size: 3 },
    ],
  });
  const phrases = ["SEARCHING FOR HACKER MAN…", "SCANNING WORLD MESH…", "LOCKING GOA HQ…", "W CELEB RADAR ONLINE…", "HACKER MAN NEARBY?"];
  let pi = 0;
  const pt = setInterval(() => {
    pi = (pi + 1) % phrases.length;
    search.textContent = phrases[pi];
  }, 850);
  const tick = () => {
    if (i < BOOT.length) {
      log.textContent += (i ? "\n" : "") + BOOT[i++];
      log.scrollTop = log.scrollHeight;
      setTimeout(tick, 100);
    } else {
      clearInterval(pt);
      search.textContent = "SIGNAL LOCKED — ENTER";
      search.style.animation = "none";
      fill.style.width = "100%";
      enter.hidden = false;
      stop();
      spinRadar($("boot-radar"), { speed: 0.03, dots: [{ a: 1, dist: 0.55, color: BRAND.yellow, size: 5 }] });
    }
  };
  const prog = setInterval(() => {
    p = Math.min(100, p + 2 + Math.random() * 2);
    fill.style.width = p + "%";
    if (p >= 100) clearInterval(prog);
  }, 70);
  tick();
  enter.addEventListener("click", enterApp);
}

async function enterApp() {
  $("preloader").hidden = true;
  $("app").hidden = false;
  document.body.style.overflow = "hidden";
  await initMap();
  spinRadar($("mini-radar"), {
    speed: 0.04,
    dots: [
      { a: 0.2, dist: 0.55, color: BRAND.yellow, size: 4 },
      { a: 1.8, dist: 0.7, color: BRAND.pink, size: 3 },
      { a: 3.5, dist: 0.4, color: "#00ff70", size: 3 },
      { a: 5, dist: 0.8, color: BRAND.red, size: 3 },
    ],
  });
  startTicker();
  refreshMarkers();
  renderLog();
  renderRadarTable();
  updateHud();
}

function startTicker() {
  const items = [
    "SEARCHING FOR HACKER MAN…",
    "HH GOA HQ · 28–31 OCT 2026 · GOA, INDIA",
    "MINT VIP ID · BOARDING PASS · PFP · TEAM",
    "PIN ANYWHERE ON EARTH · #FrameInGoa",
    "W CELEB RADAR · TASK #1 BOARD LIVE",
    "LESS NOISE · MORE SIGNAL · 247 BUILDERS",
  ];
  $("ticker").innerHTML = [...items, ...items].map((t) => `<span>${t}</span>`).join("");
}

/* ── map ── */
async function initMap() {
  if (state.map) return;
  const map = L.map("map", { zoomControl: false, worldCopyJump: true }).setView([20, 40], 2);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    attribution: "&copy; OSM &copy; CARTO",
  }).addTo(map);
  L.control.zoom({ position: "topright" }).addTo(map);
  L.circle([HQ.lat, HQ.lng], { radius: 1200, color: BRAND.yellow, weight: 1.5, fillColor: BRAND.yellow, fillOpacity: 0.1 }).addTo(map);
  state.map = map;

  map.on("click", (e) => {
    state.lat = +e.latlng.lat.toFixed(5);
    state.lng = +e.latlng.lng.toFixed(5);
    $("f-lat").value = state.lat;
    $("f-lng").value = state.lng;
    $("chip-coords").textContent = `${state.lat}, ${state.lng}`;
    $("chip-status").textContent = "PIN TARGET SET";
    // temporary target marker feel
    if (state.pendingClick) state.pendingClick.remove();
    state.pendingClick = L.circleMarker([state.lat, state.lng], {
      radius: 8,
      color: BRAND.cyan,
      fillColor: BRAND.cyan,
      fillOpacity: 0.6,
      weight: 2,
    }).addTo(map);
  });

  map.on("mousemove", (e) => {
    $("chip-coords").textContent = `${e.latlng.lat.toFixed(2)}, ${e.latlng.lng.toFixed(2)}`;
  });

  $("btn-world").onclick = () => map.flyTo([20, 40], 2, { duration: 1.1 });
  $("btn-hq").onclick = () => map.flyTo([HQ.lat, HQ.lng], 12, { duration: 1.1 });
  $("btn-me").onclick = () => {
    if (!navigator.geolocation) return map.flyTo([HQ.lat, HQ.lng], 11);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        state.lat = pos.coords.latitude;
        state.lng = pos.coords.longitude;
        $("f-lat").value = state.lat.toFixed(5);
        $("f-lng").value = state.lng.toFixed(5);
        map.flyTo([state.lat, state.lng], 11, { duration: 1 });
      },
      () => map.flyTo([HQ.lat, HQ.lng], 11)
    );
  };

  // city search via Nominatim (public)
  let searchTimer;
  $("loc-search").addEventListener("input", () => {
    clearTimeout(searchTimer);
    const q = $("loc-search").value.trim();
    if (q.length < 2) return;
    searchTimer = setTimeout(() => searchPlace(q), 450);
  });
  $("loc-search").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchPlace($("loc-search").value.trim());
    }
  });
}

async function searchPlace(q) {
  if (!q || !state.map) return;
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    const data = await res.json();
    if (!data?.[0]) {
      $("chip-status").textContent = "PLACE NOT FOUND";
      return;
    }
    const lat = +data[0].lat;
    const lng = +data[0].lon;
    state.lat = lat;
    state.lng = lng;
    state.city = data[0].display_name?.split(",")[0] || q;
    $("f-lat").value = lat.toFixed(5);
    $("f-lng").value = lng.toFixed(5);
    $("f-city").value = state.city;
    state.map.flyTo([lat, lng], 10, { duration: 1.2 });
    $("chip-status").textContent = "PLACE LOCKED";
  } catch {
    $("chip-status").textContent = "SEARCH FAILED";
  }
}

function icon(kind) {
  const cls = kind === "hq" ? "hq" : kind === "you" ? "you" : kind === "radar" ? "radar" : kind === "rumor" ? "rumor" : "builder";
  const label = kind === "hq" ? "⌂" : kind === "you" ? "★" : kind === "radar" ? "#" : kind === "rumor" ? "?" : "◆";
  const size = kind === "hq" ? 38 : 28;
  return L.divIcon({
    className: "",
    html: `<div class="mk ${cls}"><span>${label}</span></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size - 4],
  });
}

function allPins() {
  const radarPins = state.radarTeams.map((t) => ({
    id: `radar-${t.rank}`,
    kind: "radar",
    name: t.name,
    stack: `@${t.handle} · ${t.views} views`,
    title: `Score ${t.score} · #${t.rank}`,
    city: t.city,
    lat: t.lat,
    lng: t.lng,
    post: t.post,
    handle: t.handle,
    createdAt: "2026-08-01T00:00:00Z",
  }));
  return [HQ, ...RUMORS, ...radarPins, ...state.builders];
}

function refreshMarkers() {
  if (!state.map) return;
  for (const m of state.markers.values()) m.remove();
  state.markers.clear();
  for (const pin of allPins()) {
    if (pin.lat == null || pin.lng == null) continue;
    const m = L.marker([pin.lat, pin.lng], { icon: icon(pin.kind || "builder") })
      .addTo(state.map)
      .on("click", () => showPin(pin));
    state.markers.set(pin.id, m);
  }
  updateHud();
}

function showPin(pin) {
  const card = $("pin-card");
  $("pin-name").textContent = pin.name || "—";
  $("pin-meta").textContent = [pin.stack, pin.city].filter(Boolean).join(" · ");
  $("pin-title").textContent = pin.title || "";
  $("pin-badge").textContent =
    pin.kind === "hq" ? "HQ" : pin.kind === "radar" ? "W CELEB" : pin.kind === "rumor" ? "SIGNAL" : pin.kind === "you" ? "YOU" : "BUILDER";
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
  } else {
    link.hidden = true;
  }
  card.hidden = false;
}

function updateHud() {
  const n = state.builders.length;
  const r = state.radarTeams.length;
  $("chip-count").textContent = `${n + r + 1} ON MAP`;
  $("tb-count").textContent = `${n} personal · ${r} radar teams · 1 HQ`;
  $("chip-status").textContent = n ? "BUILDERS LIVE" : "WORLD SCAN";
}

/* ── log + radar table ── */
function renderLog() {
  const items = [...allPins()].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 80);
  $("log-list").innerHTML = items
    .map((p) => {
      const lb = p.kind === "hq" ? "hq" : p.kind === "radar" ? "radar" : p.kind === "rumor" ? "rumor" : p.kind === "you" ? "you" : "";
      const label = p.kind === "hq" ? "HQ" : p.kind === "radar" ? "W CELEB" : p.kind === "rumor" ? "SIGNAL" : p.kind === "you" ? "YOU" : "BUILDER";
      const thumb = p.photo
        ? `<img src="${p.photo}" alt="" />`
        : `<img alt="" style="background:${p.kind === "hq" ? BRAND.yellow : p.kind === "radar" ? BRAND.pink : BRAND.green}" />`;
      return `<li data-id="${esc(p.id)}">${thumb}<div><span class="lb ${lb}">${label}</span><strong>${esc(p.name)}</strong><small>${esc(p.title || p.stack || "")}</small></div></li>`;
    })
    .join("");
  $("log-list").querySelectorAll("li").forEach((li) => {
    li.onclick = () => {
      const pin = allPins().find((p) => p.id === li.dataset.id);
      if (!pin || !state.map) return;
      state.map.flyTo([pin.lat, pin.lng], 6, { duration: 1 });
      showPin(pin);
      closeAll();
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
      state.map.flyTo([t.lat, t.lng], 5, { duration: 1.1 });
      showPin({
        id: `radar-${t.rank}`,
        kind: "radar",
        name: t.name,
        stack: `@${t.handle} · ${t.views}`,
        title: `Score ${t.score}`,
        city: t.city,
        lat: t.lat,
        lng: t.lng,
        post: t.post,
      });
      closeAll();
    };
  });
}

/* ── canvas helpers ── */
function themeColors() {
  if (state.theme === "night") {
    return { bg0: "#031510", bg1: "#010a06", ink: "#000", plate: "rgba(0,0,0,.9)" };
  }
  if (state.theme === "sunrise") {
    return { bg0: "#1a5c2e", bg1: "#8a6a10", ink: BRAND.greenInk, plate: "rgba(10,40,20,.88)" };
  }
  return { bg0: "#0e7d45", bg1: BRAND.greenInk, ink: BRAND.greenInk, plate: "rgba(2,20,12,.9)" };
}

function drawCover(c, img, box) {
  const { x, y, w, h } = box;
  const scale = Math.max(w / img.width, h / img.height) * state.zoom;
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = x + (w - dw) / 2 + (state.panX / 100) * w;
  const dy = y + (h - dh) / 2 + (state.panY / 100) * h;
  c.save();
  c.beginPath();
  c.rect(x, y, w, h);
  c.clip();
  c.translate(x + w / 2, y + h / 2);
  c.rotate((state.rot * Math.PI) / 180);
  c.translate(-(x + w / 2), -(y + h / 2));
  c.drawImage(img, dx, dy, dw, dh);
  c.restore();
}

function rr(c, x, y, w, h, r) {
  const R = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + R, y);
  c.arcTo(x + w, y, x + w, y + h, R);
  c.arcTo(x + w, y + h, x, y + h, R);
  c.arcTo(x, y + h, x, y, R);
  c.arcTo(x, y, x + w, y, R);
  c.closePath();
}

function brackets(c, x, y, w, h, len = 40, thick = 5, col = accent()) {
  c.strokeStyle = col;
  c.lineWidth = thick;
  c.lineCap = "square";
  const segs = [
    [x, y + len, x, y, x + len, y],
    [x + w - len, y, x + w, y, x + w, y + len],
    [x, y + h - len, x, y + h, x + len, y + h],
    [x + w - len, y + h, x + w, y + h, x + w, y + h - len],
  ];
  for (const [a, b, d, e, f, g] of segs) {
    c.beginPath();
    c.moveTo(a, b);
    c.lineTo(d, e);
    c.lineTo(f, g);
    c.stroke();
  }
}

function sun(c, cx, cy, r, col = accent()) {
  const g = c.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0, col + "59");
  g.addColorStop(1, col + "00");
  c.fillStyle = g;
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.fill();
}

function barcode(c, x, y, w, h, col = accent()) {
  c.fillStyle = col;
  let px = x;
  while (px < x + w) {
    const bw = 1 + ((Math.sin(px * 12.3) + 1) * 2) | 0;
    if ((px | 0) % 3 !== 0) c.fillRect(px, y, bw, h);
    px += bw + 1;
  }
}

function holoSeal(c, cx, cy, r, col = accent()) {
  c.save();
  c.strokeStyle = col;
  c.lineWidth = 3;
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.stroke();
  c.beginPath();
  c.arc(cx, cy, r - 8, 0, Math.PI * 2);
  c.stroke();
  c.fillStyle = col;
  c.font = "700 11px JetBrains Mono, monospace";
  c.textAlign = "center";
  c.fillText("HH GOA", cx, cy - 2);
  c.fillText("2026", cx, cy + 12);
  c.restore();
}

function fit(c, text, maxW, maxSize, min = 18, fam = "Imbue, serif") {
  let s = maxSize;
  c.font = `600 ${s}px ${fam}`;
  while (s > min && c.measureText(text).width > maxW) {
    s--;
    c.font = `600 ${s}px ${fam}`;
  }
  return s;
}

/* ── render formats ── */
function renderCard() {
  const canvas = $("canvas");
  const c = canvas.getContext("2d");
  const A = accent();
  if (state.format === "vip") {
    canvas.width = 1080;
    canvas.height = 1350;
    drawVIP(c, 1080, 1350, A);
  } else if (state.format === "boarding") {
    canvas.width = 1080;
    canvas.height = 566;
    drawBoarding(c, 1080, 566, A);
  } else if (state.format === "pfp") {
    canvas.width = 1080;
    canvas.height = 1080;
    drawPfp(c, 1080, A);
  } else {
    canvas.width = 1200;
    canvas.height = 630;
    drawTeam(c, 1200, 630, A);
  }
  const ok = !!state.image;
  $("btn-dl").disabled = !ok;
  $("btn-share").disabled = !ok;
  $("btn-pin").disabled = !ok;
}

function drawVIP(c, W, H, A) {
  const T = themeColors();
  const bg = c.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, T.bg0);
  bg.addColorStop(1, T.bg1);
  c.fillStyle = bg;
  c.fillRect(0, 0, W, H);
  sun(c, W * 0.88, H * 0.08, 380, A);
  if (state.lanyard) {
    c.fillStyle = A;
    c.fillRect(W / 2 - 28, 0, 56, 70);
    c.fillStyle = BRAND.greenInk;
    c.fillRect(W / 2 - 18, 55, 36, 22);
    c.beginPath();
    c.arc(W / 2, 88, 14, 0, Math.PI * 2);
    c.fillStyle = A;
    c.fill();
  }
  c.strokeStyle = A;
  c.lineWidth = 14;
  c.strokeRect(28, 28, W - 56, H - 56);
  c.strokeStyle = "rgba(255,255,255,.15)";
  c.lineWidth = 2;
  c.strokeRect(48, 48, W - 96, H - 96);

  c.fillStyle = BRAND.greenInk;
  c.fillRect(64, 64, W - 128, 110);
  c.fillStyle = A;
  c.fillRect(64, 64, W - 128, 8);
  c.font = "700 15px JetBrains Mono, monospace";
  c.textAlign = "left";
  c.fillStyle = A;
  c.fillText("VIP CREDENTIAL · HHG-2026", 88, 108);
  c.fillStyle = BRAND.white;
  c.font = "600 52px Imbue, serif";
  c.fillText("BUILDER ID", 88, 155);
  c.textAlign = "right";
  c.fillStyle = A;
  c.font = "700 14px JetBrains Mono, monospace";
  c.fillText("28–31 OCT 2026", W - 88, 120);
  c.fillStyle = BRAND.cream;
  c.font = "500 13px JetBrains Mono, monospace";
  c.fillText(state.hindi ? "GOA · गोवा" : "GOA, INDIA", W - 88, 144);

  const photo = { x: 88, y: 200, w: W - 176, h: 540 };
  c.fillStyle = BRAND.greenInk;
  rr(c, photo.x, photo.y, photo.w, photo.h, 16);
  c.fill();
  c.save();
  rr(c, photo.x, photo.y, photo.w, photo.h, 16);
  c.clip();
  if (state.image) drawCover(c, state.image, photo);
  else {
    c.fillStyle = A;
    c.font = "600 24px JetBrains Mono, monospace";
    c.textAlign = "center";
    c.fillText("UPLOAD PHOTO", W / 2, photo.y + photo.h / 2);
  }
  c.restore();
  c.strokeStyle = A;
  c.lineWidth = 4;
  rr(c, photo.x, photo.y, photo.w, photo.h, 16);
  c.stroke();
  brackets(c, photo.x + 12, photo.y + 12, photo.w - 24, photo.h - 24, 42, 5, A);

  const py = 770;
  c.fillStyle = T.plate;
  rr(c, 88, py, W - 176, 430, 16);
  c.fill();
  c.strokeStyle = A + "66";
  c.lineWidth = 2;
  rr(c, 88, py, W - 176, 430, 16);
  c.stroke();
  c.fillStyle = A;
  c.fillRect(88, py, 12, 430);

  const name = (state.name || "YOUR NAME").toUpperCase();
  const stack = state.stack || "Builder · Stack TBD";
  const title = state.title || "Builder Class";
  const team = state.team || "";
  const bio = state.bio || "Less noise. More signal.";
  const handle = state.handle || "";

  c.textAlign = "left";
  c.fillStyle = A + "cc";
  c.font = "700 13px JetBrains Mono, monospace";
  c.fillText("NAME", 120, py + 42);
  const ns = fit(c, name, W - 280, 58);
  c.fillStyle = BRAND.white;
  c.font = `600 ${ns}px Imbue, serif`;
  c.fillText(name, 120, py + 98);

  c.fillStyle = A + "cc";
  c.font = "700 13px JetBrains Mono, monospace";
  c.fillText("STACK / ROLE", 120, py + 145);
  c.fillStyle = BRAND.cream;
  c.font = "600 24px JetBrains Mono, monospace";
  c.fillText(stack.slice(0, 44), 120, py + 180);

  c.fillStyle = A + "cc";
  c.font = "700 13px JetBrains Mono, monospace";
  c.fillText("BUILDER CLASS", 120, py + 225);
  c.fillStyle = A;
  c.font = "600 34px Imbue, serif";
  c.fillText(title, 120, py + 268);

  if (team) {
    c.fillStyle = A + "cc";
    c.font = "700 12px JetBrains Mono, monospace";
    c.fillText("TEAM", 120, py + 305);
    c.fillStyle = BRAND.white;
    c.font = "700 18px Space Grotesk, sans-serif";
    c.fillText(team, 120, py + 332);
  }

  c.fillStyle = "rgba(245,237,214,.65)";
  c.font = "500 15px JetBrains Mono, monospace";
  c.fillText(bio.slice(0, 60), 120, py + 370);
  c.fillStyle = "rgba(245,237,214,.5)";
  c.font = "500 13px JetBrains Mono, monospace";
  c.fillText(
    [handle ? (handle.startsWith("@") ? handle : `@${handle}`) : "#FrameInGoa", state.city].filter(Boolean).join(" · "),
    120,
    py + 400
  );

  c.textAlign = "right";
  c.fillStyle = A;
  c.font = "700 15px JetBrains Mono, monospace";
  c.fillText("HACKER HOUSE GOA", W - 120, py + 380);
  c.fillStyle = BRAND.cream;
  c.font = "500 12px JetBrains Mono, monospace";
  c.fillText("HACKER TRACKER", W - 120, py + 404);

  if (state.holo) holoSeal(c, W - 170, 130, 42, A);
  if (state.barcode) barcode(c, 120, H - 70, W - 240, 28, A);
  c.fillStyle = A;
  c.fillRect(56, H - 48, W - 112, 6);
  if (state.logos.mark) c.drawImage(state.logos.mark, W - 160, 78, 56, 56);
}

function drawBoarding(c, W, H, A) {
  const T = themeColors();
  const bg = c.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, T.bg0);
  bg.addColorStop(1, T.bg1);
  c.fillStyle = bg;
  c.fillRect(0, 0, W, H);
  // perforated stub
  c.fillStyle = BRAND.greenInk;
  c.fillRect(W - 220, 0, 220, H);
  c.strokeStyle = A;
  c.setLineDash([6, 8]);
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(W - 220, 16);
  c.lineTo(W - 220, H - 16);
  c.stroke();
  c.setLineDash([]);
  c.lineWidth = 10;
  c.strokeRect(16, 16, W - 32, H - 32);

  // photo
  const photo = { x: 40, y: 90, w: 200, h: 200 };
  c.fillStyle = BRAND.greenInk;
  c.fillRect(photo.x, photo.y, photo.w, photo.h);
  if (state.image) drawCover(c, state.image, photo);
  c.strokeStyle = A;
  c.lineWidth = 3;
  c.strokeRect(photo.x, photo.y, photo.w, photo.h);

  c.fillStyle = A;
  c.font = "700 14px JetBrains Mono, monospace";
  c.textAlign = "left";
  c.fillText("BOARDING PASS", 40, 48);
  c.fillStyle = BRAND.white;
  c.font = "600 42px Bebas Neue, sans-serif";
  c.fillText("HACKER HOUSE GOA 2026", 40, 82);

  const name = (state.name || "PASSENGER").toUpperCase();
  c.fillStyle = A;
  c.font = "700 12px JetBrains Mono, monospace";
  c.fillText("PASSENGER", 270, 120);
  c.fillStyle = BRAND.white;
  c.font = `600 ${fit(c, name, 420, 40, 22)}px Imbue, serif`;
  c.fillText(name, 270, 165);

  c.fillStyle = A;
  c.font = "700 12px JetBrains Mono, monospace";
  c.fillText("FROM", 270, 210);
  c.fillStyle = BRAND.cream;
  c.font = "700 20px Space Grotesk, sans-serif";
  c.fillText((state.city || "WORLD").toUpperCase(), 270, 240);

  c.fillStyle = A;
  c.font = "700 12px JetBrains Mono, monospace";
  c.fillText("TO", 480, 210);
  c.fillStyle = BRAND.cream;
  c.font = "700 20px Space Grotesk, sans-serif";
  c.fillText(state.hindi ? "GOA · गोवा" : "GOA", 480, 240);

  c.fillStyle = A;
  c.font = "700 12px JetBrains Mono, monospace";
  c.fillText("CLASS", 270, 290);
  c.fillStyle = A;
  c.font = "600 26px Imbue, serif";
  c.fillText(state.title || "BUILDER", 270, 325);

  c.fillStyle = A;
  c.font = "700 12px JetBrains Mono, monospace";
  c.fillText("STACK", 520, 290);
  c.fillStyle = BRAND.cream;
  c.font = "600 16px JetBrains Mono, monospace";
  c.fillText((state.stack || "AI × CRYPTO").slice(0, 28), 520, 325);

  c.fillStyle = "rgba(245,237,214,.7)";
  c.font = "500 14px JetBrains Mono, monospace";
  c.fillText("28–31 OCT 2026 · PRIVATE BEACH RESIDENCY · #FrameInGoa", 40, H - 40);

  // stub content
  c.save();
  c.translate(W - 110, H / 2);
  c.rotate(-Math.PI / 2);
  c.fillStyle = A;
  c.font = "700 22px Bebas Neue, sans-serif";
  c.textAlign = "center";
  c.fillText("GATE HH · SEAT 247", 0, 0);
  c.restore();
  if (state.barcode) barcode(c, W - 200, 80, 160, 40, A);
  c.fillStyle = A;
  c.font = "700 12px JetBrains Mono, monospace";
  c.textAlign = "center";
  c.fillText((state.handle || "#FrameInGoa").slice(0, 16), W - 110, H - 50);
  if (state.logos.mark) c.drawImage(state.logos.mark, W - 175, H - 120, 50, 50);
}

function drawPfp(c, S, A) {
  const T = themeColors();
  const bg = c.createLinearGradient(0, 0, S, S);
  bg.addColorStop(0, T.bg0);
  bg.addColorStop(1, T.bg1);
  c.fillStyle = bg;
  c.fillRect(0, 0, S, S);
  sun(c, S * 0.8, S * 0.15, 280, A);
  c.strokeStyle = A;
  c.lineWidth = 18;
  c.strokeRect(18, 18, S - 36, S - 36);

  // circular photo
  const cx = S / 2;
  const cy = S / 2 + 10;
  const r = 340;
  c.save();
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.clip();
  if (state.image) drawCover(c, state.image, { x: cx - r, y: cy - r, w: r * 2, h: r * 2 });
  else {
    c.fillStyle = BRAND.greenInk;
    c.fillRect(cx - r, cy - r, r * 2, r * 2);
  }
  c.restore();
  c.strokeStyle = A;
  c.lineWidth = 10;
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.stroke();
  c.strokeStyle = "rgba(255,255,255,.2)";
  c.lineWidth = 3;
  c.beginPath();
  c.arc(cx, cy, r + 16, 0, Math.PI * 2);
  c.stroke();

  c.fillStyle = BRAND.greenInk;
  c.fillRect(48, 40, S - 96, 70);
  c.fillStyle = A;
  c.fillRect(48, 40, S - 96, 6);
  c.font = "700 16px JetBrains Mono, monospace";
  c.textAlign = "left";
  c.fillStyle = A;
  c.fillText("HACKER HOUSE", 68, 75);
  c.fillStyle = BRAND.white;
  c.font = "600 28px Imbue, serif";
  c.fillText("GOA 2026 PFP", 68, 100);
  c.textAlign = "right";
  c.fillStyle = A;
  c.font = "700 14px JetBrains Mono, monospace";
  c.fillText(state.hindi ? "गोवा" : "BUILDER", S - 68, 90);

  c.fillStyle = BRAND.greenInk;
  c.fillRect(48, S - 100, S - 96, 64);
  c.fillStyle = A;
  c.fillRect(48, S - 42, S - 96, 6);
  c.textAlign = "left";
  c.fillStyle = BRAND.cream;
  c.font = "700 20px JetBrains Mono, monospace";
  c.fillText("#FrameInGoa", 68, S - 60);
  c.fillStyle = "rgba(245,237,214,.65)";
  c.font = "500 12px JetBrains Mono, monospace";
  c.fillText((state.name || "BUILDER").toUpperCase() + (state.title ? ` · ${state.title}` : ""), 68, S - 40);
  if (state.logos.mark) c.drawImage(state.logos.mark, S - 140, 48, 60, 60);
}

function drawTeam(c, W, H, A) {
  const T = themeColors();
  const bg = c.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, T.bg0);
  bg.addColorStop(1, T.bg1);
  c.fillStyle = bg;
  c.fillRect(0, 0, W, H);
  sun(c, W * 0.9, 40, 300, A);
  c.strokeStyle = A;
  c.lineWidth = 12;
  c.strokeRect(20, 20, W - 40, H - 40);

  const photo = { x: 48, y: 48, w: 340, h: H - 96 };
  c.fillStyle = BRAND.greenInk;
  c.fillRect(photo.x, photo.y, photo.w, photo.h);
  if (state.image) drawCover(c, state.image, photo);
  c.strokeStyle = A;
  c.lineWidth = 4;
  c.strokeRect(photo.x, photo.y, photo.w, photo.h);

  c.fillStyle = A;
  c.font = "700 14px JetBrains Mono, monospace";
  c.textAlign = "left";
  c.fillText("TEAM FRAME · HH GOA 2026", 420, 80);
  c.fillStyle = BRAND.white;
  const team = (state.team || state.name || "YOUR TEAM").toUpperCase();
  c.font = `600 ${fit(c, team, 700, 64, 28)}px Imbue, serif`;
  c.fillText(team, 420, 150);

  c.fillStyle = A;
  c.font = "600 28px Imbue, serif";
  c.fillText(state.title || "Builders of Goa", 420, 210);
  c.fillStyle = BRAND.cream;
  c.font = "600 20px Space Grotesk, sans-serif";
  c.fillText(state.stack || "AI × Crypto · Ship mode", 420, 255);
  c.fillStyle = "rgba(245,237,214,.7)";
  c.font = "500 16px JetBrains Mono, monospace";
  c.fillText(state.bio || "Less noise. More signal.", 420, 300);
  c.fillText([state.handle ? `@${state.handle.replace(/^@/, "")}` : null, state.city, "#FrameInGoa"].filter(Boolean).join("  ·  "), 420, 340);

  c.fillStyle = A;
  c.fillRect(420, H - 100, 320, 40);
  c.fillStyle = BRAND.greenInk;
  c.font = "800 16px Space Grotesk, sans-serif";
  c.fillText("28–31 OCT · GOA RESIDENCY", 436, H - 74);

  if (state.holo) holoSeal(c, W - 120, 120, 48, A);
  if (state.barcode) barcode(c, 420, H - 50, 400, 22, A);
  if (state.logos.mark) c.drawImage(state.logos.mark, W - 140, H - 130, 64, 64);
}

/* ── export / share / pin ── */
function blobPng() {
  return new Promise((res) => $("canvas").toBlob((b) => res(b), "image/png"));
}
function fname() {
  const map = { vip: "vip-id", boarding: "boarding-pass", pfp: "pfp-frame", team: "team-card" };
  const slug = (state.name || "builder").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 20);
  return `hhgoa-${map[state.format] || "card"}-${slug || "frame"}.png`;
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
  const t = state.team ? `Team ${state.team} · ` : "";
  return `${n}${t}Hacker House Goa 2026 Builder ID locked 🌴\n${state.title || "Builder"} · tracking Hacker Man worldwide\n28–31 Oct · Goa\n\n#FrameInGoa #HHGoa #HackerHouseGoa`;
}
async function shareX() {
  renderCard();
  const b = await blobPng();
  const file = new File([b], fname(), { type: "image/png" });
  const text = tweet();
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text, title: "HH Goa 2026" });
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
  if (!state.image) return;
  renderCard();
  const thumb = document.createElement("canvas");
  thumb.width = 160;
  thumb.height = 160;
  drawCover(thumb.getContext("2d"), state.image, { x: 0, y: 0, w: 160, h: 160 });
  const photo = thumb.toDataURL("image/jpeg", 0.75);
  const lat = +($("f-lat").value || state.lat);
  const lng = +($("f-lng").value || state.lng);
  if (!state.listOnMap) {
    alert("Enable “List me on world map” first.");
    return;
  }
  const pin = {
    id: uid(),
    kind: "you",
    name: state.name.trim() || "Anonymous Builder",
    stack: state.stack.trim() || "Builder",
    title: state.title.trim() || "Builder Class",
    handle: state.handle.trim(),
    team: state.team.trim(),
    city: state.city.trim() || "World",
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
  refreshMarkers();
  renderLog();
  if (state.map) {
    state.map.flyTo([lat, lng], 4, { duration: 1.2 });
    showPin(pin);
  }
  $("chip-status").textContent = "YOUR PIN LIVE";
  closeAll();
}

/* ── track ── */
function runSweep() {
  const ghost = $("ghost");
  const msg = $("track-msg");
  ghost.classList.remove("on");
  const stop = spinRadar($("track-radar"), {
    speed: 0.09,
    dots: [
      { a: 1, dist: 0.55, color: BRAND.red, size: 3 },
      { a: 2.5, dist: 0.7, color: BRAND.pink, size: 3 },
      { a: 4, dist: 0.4, color: BRAND.yellow, size: 4 },
      { a: 5.5, dist: 0.85, color: BRAND.cyan, size: 3 },
    ],
  });
  const steps = ["Scanning continents…", "AI × Crypto mesh…", "Filtering noise…", "HACKER MAN SIGNAL", "WORLD LOCKED"];
  let i = 0;
  const t = setInterval(() => {
    msg.textContent = steps[i] || steps[steps.length - 1];
    i++;
    if (i >= steps.length) {
      clearInterval(t);
      stop();
      ghost.classList.add("on");
      msg.textContent = "FOUND — mint ID & pin anywhere on Earth";
      if (state.map) state.map.flyTo([HQ.lat, HQ.lng], 4, { duration: 1.4 });
    }
  }, 650);
}

/* ── panels ── */
function openPanel(name) {
  closeAll();
  const el = $(`panel-${name}`);
  if (!el) return;
  el.hidden = false;
  $("backdrop").hidden = false;
  if (name === "mint") renderCard();
  if (name === "log") renderLog();
  if (name === "radar") renderRadarTable();
  if (name === "track") spinRadar($("track-radar"), { speed: 0.05, dots: [{ a: 2, dist: 0.5, color: BRAND.yellow, size: 4 }] });
}
function closeAll() {
  ["mint", "log", "radar", "track", "help"].forEach((n) => {
    const el = $(`panel-${n}`);
    if (el) el.hidden = true;
  });
  $("backdrop").hidden = true;
}

function syncFields() {
  state.name = $("f-name").value;
  state.stack = $("f-stack").value;
  state.title = $("f-title").value;
  state.handle = $("f-handle").value;
  state.team = $("f-team").value;
  state.city = $("f-city").value;
  state.bio = $("f-bio").value;
  state.holo = $("t-holo").checked;
  state.barcode = $("t-barcode").checked;
  state.hindi = $("t-hindi").checked;
  state.lanyard = $("t-lanyard").checked;
  state.listOnMap = $("t-list").checked;
  if ($("f-lat").value) state.lat = +$("f-lat").value;
  if ($("f-lng").value) state.lng = +$("f-lng").value;
  renderCard();
}

function bind() {
  document.querySelectorAll("[data-open]").forEach((b) => b.addEventListener("click", () => openPanel(b.dataset.open)));
  document.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeAll));
  $("backdrop").onclick = closeAll;
  $("pin-x").onclick = () => {
    $("pin-card").hidden = true;
  };

  document.querySelectorAll(".fmt").forEach((b) => {
    b.onclick = () => {
      document.querySelectorAll(".fmt").forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
      state.format = b.dataset.fmt;
      renderCard();
    };
  });
  document.querySelectorAll("[data-accent]").forEach((b) => {
    b.onclick = () => {
      document.querySelectorAll("[data-accent]").forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
      state.accent = b.dataset.accent;
      renderCard();
    };
  });
  document.querySelectorAll("[data-theme]").forEach((b) => {
    b.onclick = () => {
      document.querySelectorAll("[data-theme]").forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
      state.theme = b.dataset.theme;
      renderCard();
    };
  });

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
      renderCard();
    } catch (e) {
      alert(e.message || "Image load failed");
    }
  };
  drop.ondragover = (e) => e.preventDefault();
  drop.ondrop = async (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    try {
      state.image = await fileToImage(f);
      $("thumb").src = state.objectUrl;
      $("drop-empty").hidden = true;
      $("drop-has").hidden = false;
      renderCard();
    } catch (err) {
      alert(err.message || "Image load failed");
    }
  };

  ["f-name", "f-stack", "f-title", "f-handle", "f-team", "f-city", "f-bio", "t-holo", "t-barcode", "t-hindi", "t-lanyard", "t-list", "f-lat", "f-lng"].forEach((id) => {
    $(id).addEventListener("input", syncFields);
    $(id).addEventListener("change", syncFields);
  });
  $("f-title").value = state.title;
  $("f-lat").value = state.lat.toFixed(5);
  $("f-lng").value = state.lng.toFixed(5);
  $("reroll").onclick = () => {
    state.title = TITLES[(Math.random() * TITLES.length) | 0];
    $("f-title").value = state.title;
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
  $("rot").oninput = () => {
    state.rot = +$("rot").value;
    renderCard();
  };

  $("btn-gps").onclick = () => {
    if (!navigator.geolocation) return alert("GPS unavailable");
    navigator.geolocation.getCurrentPosition((pos) => {
      state.lat = pos.coords.latitude;
      state.lng = pos.coords.longitude;
      $("f-lat").value = state.lat.toFixed(5);
      $("f-lng").value = state.lng.toFixed(5);
      if (state.map) state.map.flyTo([state.lat, state.lng], 5, { duration: 1 });
    });
  };
  $("btn-use-hq").onclick = () => {
    state.lat = HQ.lat + (Math.random() - 0.5) * 0.04;
    state.lng = HQ.lng + (Math.random() - 0.5) * 0.04;
    $("f-lat").value = state.lat.toFixed(5);
    $("f-lng").value = state.lng.toFixed(5);
    state.city = "Goa";
    $("f-city").value = "Goa";
  };

  $("btn-dl").onclick = download;
  $("btn-share").onclick = shareX;
  $("btn-pin").onclick = dropPin;
  $("btn-sweep").onclick = runSweep;
}

async function main() {
  loadStore();
  bind();
  try {
    state.logos.mark = await loadImg("./public/assets/2-47.svg");
  } catch { /* */ }
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
  renderCard();
  boot();
}

main();
