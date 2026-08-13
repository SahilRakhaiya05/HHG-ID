/**
 * Canvas card renderer — Builder Pass / ID / Signal / PFP / Team
 */
import {
  FINISHES,
  HASHTAG,
  PASS,
  PFP,
  SIGNAL,
  TEAM,
  THEMES,
  classLabel,
  type FilterId,
  type FinishId,
  type Format,
  type MoodId,
  type ThemeId,
} from "@/lib/constants";

export type RenderState = {
  format: Format;
  theme: ThemeId;
  filter: FilterId;
  finish: FinishId;
  name: string;
  stack: string;
  titleId: string;
  handle: string;
  city: string;
  mood: MoodId;
  lat: number | null;
  lng: number | null;
  idNumber: string;
  zoom: number;
  panX: number;
  panY: number;
  image: HTMLImageElement | HTMLCanvasElement | null;
  teamSlots: { name: string; stack: string; image: HTMLImageElement | null }[];
  teamCount: number;
  passTpl: HTMLImageElement | null;
  goaArt: HTMLImageElement | null;
  cardBg: HTMLImageElement | null;
  pfpTemplate: HTMLImageElement | null;
  goaLogo: HTMLImageElement | null;
  frameStamp: HTMLImageElement | null;
  stickers: Record<string, HTMLImageElement>;
  logoMark: HTMLImageElement | null;
  sealMark: HTMLImageElement | null;
  hackerMan: HTMLImageElement | null;
  qrCanvas: HTMLCanvasElement | null;
};

function theme(s: RenderState) {
  return THEMES[s.theme] || THEMES.official;
}
function finish(s: RenderState) {
  return FINISHES[s.finish] || FINISHES.goa;
}
function isCollectible(s: RenderState) {
  return theme(s).kind === "collectible";
}
function isOfficial(s: RenderState) {
  return s.theme === "official" && s.format === "pass";
}

function roundRect(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + rr, y);
  c.arcTo(x + w, y, x + w, y + h, rr);
  c.arcTo(x + w, y + h, x, y + h, rr);
  c.arcTo(x, y + h, x, y, rr);
  c.arcTo(x, y, x + w, y, rr);
  c.closePath();
}

function fit(
  c: CanvasRenderingContext2D,
  text: string,
  maxW: number,
  maxSize: number,
  min = 16,
  weight = "800"
) {
  let s = maxSize;
  c.font = `${weight} ${s}px Space Grotesk, sans-serif`;
  while (s > min && c.measureText(text).width > maxW) {
    s--;
    c.font = `${weight} ${s}px Space Grotesk, sans-serif`;
  }
  return s;
}

function filteredPhoto(img: CanvasImageSource, filter: FilterId): CanvasImageSource {
  if (!img || filter === "natural") return img;
  const el = img as HTMLImageElement | HTMLCanvasElement;
  const iw = "naturalWidth" in el ? el.naturalWidth || el.width : (el as HTMLCanvasElement).width;
  const ih = "naturalHeight" in el ? el.naturalHeight || el.height : (el as HTMLCanvasElement).height;
  if (!iw || !ih) return img;
  const w = Math.min(iw, 900);
  const h = Math.round((ih / iw) * w);
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const ox = off.getContext("2d")!;
  ox.drawImage(img, 0, 0, w, h);
  const data = ox.getImageData(0, 0, w, h);
  const d = data.data;
  if (filter === "cel") {
    for (let i = 0; i < d.length; i += 4) {
      d[i] = Math.min(255, Math.round(d[i] / 48) * 48 * 1.08);
      d[i + 1] = Math.min(255, Math.round(d[i + 1] / 48) * 48 * 1.08);
      d[i + 2] = Math.min(255, Math.round(d[i + 2] / 48) * 48 * 1.05);
    }
  } else if (filter === "riso") {
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
  return off;
}

function drawCoverCircle(
  c: CanvasRenderingContext2D,
  img: CanvasImageSource,
  cx: number,
  cy: number,
  r: number,
  s: RenderState
) {
  if (!img) return;
  const src = filteredPhoto(img, s.filter);
  const iw = (src as HTMLImageElement).width || (src as HTMLCanvasElement).width;
  const ih = (src as HTMLImageElement).height || (src as HTMLCanvasElement).height;
  const size = r * 2;
  const scale = Math.max(size / iw, size / ih) * s.zoom;
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = cx - dw / 2 + (s.panX / 100) * size;
  const dy = cy - dh / 2 + (s.panY / 100) * size;
  c.save();
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.clip();
  c.drawImage(src, dx, dy, dw, dh);
  c.restore();
}

function drawCoverRect(
  c: CanvasRenderingContext2D,
  img: CanvasImageSource,
  x: number,
  y: number,
  w: number,
  h: number,
  s: RenderState
) {
  if (!img) return;
  const src = filteredPhoto(img, s.filter);
  const iw = (src as HTMLImageElement).width || (src as HTMLCanvasElement).width;
  const ih = (src as HTMLImageElement).height || (src as HTMLCanvasElement).height;
  const scale = Math.max(w / iw, h / ih) * s.zoom;
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = x + w / 2 - dw / 2 + (s.panX / 100) * w;
  const dy = y + h / 2 - dh / 2 + (s.panY / 100) * h;
  c.save();
  c.beginPath();
  c.rect(x, y, w, h);
  c.clip();
  c.drawImage(src, dx, dy, dw, dh);
  c.restore();
}

function drawFieldValue(
  c: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  maxSize: number,
  color: string,
  weight = "800"
) {
  const sz = fit(c, text, maxW, maxSize, 18, weight);
  c.font = `${weight} ${sz}px Space Grotesk, sans-serif`;
  c.textAlign = "left";
  c.textBaseline = "alphabetic";
  c.fillStyle = "rgba(0,0,0,.45)";
  c.fillText(text, x + 1.5, y + 1.5);
  c.fillStyle = color;
  c.fillText(text, x, y);
}

function metaLine(s: RenderState) {
  return [s.handle, s.city].filter(Boolean).join(" · ");
}

function coordinateLine(lat: number | null, lng: number | null) {
  if (lat == null || lng == null) return "15.2993° N · 74.1240° E";
  const ns = lat >= 0 ? "N" : "S";
  const ew = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${ns} · ${Math.abs(lng).toFixed(4)}° ${ew}`;
}

function drawInfoChip(
  c: CanvasRenderingContext2D,
  label: string,
  value: string,
  x: number,
  y: number,
  w: number,
  accent: string,
  icon: "pin" | "date" | "signal" | "code" | "check"
) {
  c.fillStyle = "rgba(0,0,0,.34)";
  roundRect(c, x, y, w, 66, 13);
  c.fill();
  c.strokeStyle = `${accent}88`;
  c.lineWidth = 2;
  c.stroke();
  const ix = x + 28;
  const iy = y + 33;
  c.strokeStyle = accent;
  c.fillStyle = accent;
  c.lineWidth = 3;
  if (icon === "pin") {
    c.beginPath(); c.arc(ix, iy - 5, 8, 0, Math.PI * 2); c.stroke();
    c.beginPath(); c.moveTo(ix - 7, iy); c.lineTo(ix, iy + 12); c.lineTo(ix + 7, iy); c.stroke();
    c.beginPath(); c.arc(ix, iy - 5, 2.5, 0, Math.PI * 2); c.fill();
  } else if (icon === "date") {
    c.strokeRect(ix - 10, iy - 10, 20, 20);
    c.beginPath(); c.moveTo(ix - 10, iy - 3); c.lineTo(ix + 10, iy - 3); c.stroke();
  } else if (icon === "signal") {
    for (let r = 5; r <= 14; r += 5) { c.beginPath(); c.arc(ix, iy + 6, r, Math.PI * 1.18, Math.PI * 1.82); c.stroke(); }
    c.beginPath(); c.arc(ix, iy + 6, 2.5, 0, Math.PI * 2); c.fill();
  } else if (icon === "code") {
    c.font = "800 23px JetBrains Mono, monospace";
    c.textAlign = "center"; c.fillText("</>", ix, iy + 8); c.textAlign = "left";
  } else {
    c.beginPath(); c.arc(ix, iy, 12, 0, Math.PI * 2); c.stroke();
    c.beginPath(); c.moveTo(ix - 6, iy); c.lineTo(ix - 1, iy + 6); c.lineTo(ix + 8, iy - 7); c.stroke();
  }
  c.fillStyle = "rgba(245,237,214,.5)";
  c.font = "700 10px JetBrains Mono, monospace";
  c.fillText(label, x + 52, y + 23);
  c.fillStyle = "#F5EDD6";
  c.font = "700 14px Space Grotesk, sans-serif";
  c.fillText(value.slice(0, 34), x + 52, y + 47);
}

function drawMoodBadge(
  c: CanvasRenderingContext2D,
  mood: string,
  x: number,
  y: number,
  width: number,
  accent: string,
  ink = "#02140C"
) {
  c.fillStyle = accent;
  roundRect(c, x, y, width, 34, 17);
  c.fill();
  c.fillStyle = ink;
  c.font = "800 12px JetBrains Mono, monospace";
  c.textAlign = "center";
  c.fillText(mood, x + width / 2, y + 22);
  c.textAlign = "left";
}

function drawBuilderQr(
  c: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  size: number
) {
  const cells = 25;
  const cell = size / cells;
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  c.fillStyle = "#F5EDD6";
  roundRect(c, x - 14, y - 14, size + 28, size + 28, 18);
  c.fill();
  c.fillStyle = "#111310";
  for (let row = 0; row < cells; row++) {
    for (let col = 0; col < cells; col++) {
      const inFinder =
        (row < 7 && col < 7) ||
        (row < 7 && col >= cells - 7) ||
        (row >= cells - 7 && col < 7);
      const edge = row === 0 || col === 0 || row === cells - 1 || col === cells - 1;
      const bit = ((hash >>> ((row * 7 + col * 11) % 31)) ^ row ^ (col * 3)) & 1;
      if (!inFinder && !edge && bit) c.fillRect(x + col * cell, y + row * cell, cell + .4, cell + .4);
    }
  }
  const finder = (fx: number, fy: number) => {
    c.fillStyle = "#111310";
    c.fillRect(x + fx * cell, y + fy * cell, cell * 7, cell * 7);
    c.fillStyle = "#F5EDD6";
    c.fillRect(x + (fx + 1) * cell, y + (fy + 1) * cell, cell * 5, cell * 5);
    c.fillStyle = "#111310";
    c.fillRect(x + (fx + 2) * cell, y + (fy + 2) * cell, cell * 3, cell * 3);
  };
  finder(0, 0);
  finder(cells - 7, 0);
  finder(0, cells - 7);
}

function drawPassOfficial(c: CanvasRenderingContext2D, s: RenderState) {
  const { W, H } = PASS;
  const id = s.idNumber || "HHG-2026-····";
  const name = (s.name || "YOUR NAME").toUpperCase();
  const stack = (s.stack || "YOUR STACK").toUpperCase();
  const title = classLabel(s.titleId).toUpperCase();
  const meta = metaLine(s);
  const bg = c.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#061A12");
  bg.addColorStop(.55, "#071D16");
  bg.addColorStop(1, "#0B281E");
  c.fillStyle = bg;
  c.fillRect(0, 0, W, H);
  if (s.cardBg) {
    drawCoverRect(c, s.cardBg, 0, 0, W, H, {
      ...s,
      filter: "natural",
      zoom: 1,
      panX: 0,
      panY: 0,
    });
    c.fillStyle = "rgba(2,20,12,.7)";
    c.fillRect(0, 0, W, H);
  }
  c.save();
  c.globalAlpha = .07;
  c.fillStyle = "#7DFFC8";
  for (let y = 48; y < H - 100; y += 64) {
    for (let x = 48; x < W; x += 64) {
      c.beginPath();
      c.arc(x + ((y / 64) % 2) * 18, y, 9, 0, Math.PI * 2);
      c.fill();
    }
  }
  c.strokeStyle = "#FEE101";
  c.lineWidth = 2;
  for (let y = 168; y < H - 120; y += 118) {
    c.beginPath();
    for (let x = 0; x <= W; x += 24) {
      const waveY = y + Math.sin(x / 34) * 8;
      if (x === 0) c.moveTo(x, waveY);
      else c.lineTo(x, waveY);
    }
    c.stroke();
  }
  c.restore();
  c.fillStyle = "rgba(0,0,0,.18)";
  roundRect(c, 28, 28, W - 56, H - 56, 42);
  c.fill();
  c.strokeStyle = "rgba(254,225,1,.65)";
  c.lineWidth = 3;
  roundRect(c, 28, 28, W - 56, H - 56, 42);
  c.stroke();

  c.fillStyle = "#F5EDD6";
  c.font = "600 58px Imbue, Georgia, serif";
  c.textAlign = "right";
  c.fillText("HH GOA 2026", W - 74, 112);
  c.fillStyle = "#FEE101";
  c.font = "700 16px JetBrains Mono, monospace";
  c.fillText("OFFICIAL BUILDER PASS", W - 74, 146);
  c.textAlign = "left";
  if (s.goaLogo) c.drawImage(s.goaLogo, 940, 48, 78, 78);
  else if (s.logoMark) c.drawImage(s.logoMark, 954, 58, 62, 62);
  if (s.sealMark) c.drawImage(s.sealMark, 1030, 58, 62, 62);

  c.save();
  c.translate(W - 108, 130);
  c.rotate(-.14);
  c.strokeStyle = "rgba(255,0,128,.58)";
  c.lineWidth = 4;
  c.beginPath();
  c.arc(0, 0, 70, 0, Math.PI * 2);
  c.stroke();
  c.beginPath();
  c.arc(0, 0, 56, 0, Math.PI * 2);
  c.stroke();
  c.fillStyle = "rgba(255,0,128,.75)";
  c.font = "800 17px JetBrains Mono, monospace";
  c.textAlign = "center";
  c.fillText("HH GOA", 0, -8);
  c.fillText("VERIFIED", 0, 18);
  c.restore();

  c.fillStyle = "#7DFFC8";
  c.font = "700 16px JetBrains Mono, monospace";
  c.fillText("BUILDER", 62, 98);

  c.fillStyle = "rgba(245,237,214,.08)";
  roundRect(c, 62, 122, 248, 250, 32);
  c.fill();
  c.strokeStyle = "rgba(254,225,1,.45)";
  c.lineWidth = 3;
  roundRect(c, 62, 122, 248, 250, 32);
  c.stroke();
  if (s.image) drawCoverRect(c, s.image, 62, 122, 248, 250, s);
  else if (s.hackerMan) c.drawImage(s.hackerMan, 96, 132, 180, 232);

  const nameSize = fit(c, name, 410, 56, 24, "800");
  c.fillStyle = "#F5EDD6";
  c.font = `800 ${nameSize}px Space Grotesk, sans-serif`;
  c.fillText(name, 338, 196);
  c.fillStyle = "#FEE101";
  c.font = "700 24px Space Grotesk, sans-serif";
  c.fillText(stack, 338, 246);
  c.fillStyle = "rgba(245,237,214,.6)";
  c.font = "600 19px Space Grotesk, sans-serif";
  c.fillText(title, 338, 290);
  drawMoodBadge(c, s.mood, 338, 326, 210, "#FF0080", "#FFFFFF");

  c.fillStyle = "#7DFFC8";
  c.font = "700 15px JetBrains Mono, monospace";
  c.fillText("STACK", 62, 432);
  c.fillStyle = "rgba(0,0,0,.28)";
  roundRect(c, 62, 452, 248, 50, 25);
  c.fill();
  c.strokeStyle = "rgba(125,255,200,.45)";
  c.stroke();
  c.fillStyle = "#7DFFC8";
  c.font = "700 16px Space Grotesk, sans-serif";
  c.fillText(stack.slice(0, 22), 84, 484);

  c.fillStyle = "#7DFFC8";
  c.font = "700 15px JetBrains Mono, monospace";
  c.fillText("COORDINATES", 62, 652);
  c.fillStyle = "#F5EDD6";
  c.font = "700 18px JetBrains Mono, monospace";
  c.fillText(coordinateLine(s.lat, s.lng), 62, 688);
  c.fillStyle = "rgba(245,237,214,.68)";
  c.font = "600 14px Space Grotesk, sans-serif";
  c.fillText((meta || `${s.city || "GOA"} · ${HASHTAG} · VERIFIED BUILDER`).slice(0, 46), 62, 724);
  if (s.frameStamp) c.drawImage(s.frameStamp, 324, 528, 250, 160);

  const artCx = 790;
  const artCy = 472;
  const artR = 246;
  c.fillStyle = "#0B6839";
  c.beginPath();
  c.arc(artCx, artCy, artR + 10, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = "#FEE101";
  c.lineWidth = 5;
  c.stroke();
  if (s.goaArt) {
    drawCoverCircle(c, s.goaArt, artCx, artCy, artR, { ...s, zoom: 1, panX: 0, panY: 0 });
  } else {
    c.fillStyle = "#FEE101";
    c.font = "600 72px Imbue, Georgia, serif";
    c.textAlign = "center";
    c.fillText("GOA", artCx, artCy + 24);
    c.textAlign = "left";
  }

  c.strokeStyle = "rgba(245,237,214,.16)";
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(1114, 100);
  c.lineTo(1114, 744);
  c.stroke();
  c.save();
  c.translate(1148, 110);
  c.strokeStyle = "rgba(125,255,200,.65)";
  c.lineWidth = 3;
  for (let r = 10; r <= 38; r += 7) {
    c.beginPath();
    c.arc(0, 0, r, Math.PI * .15, Math.PI * 1.82);
    c.stroke();
  }
  c.beginPath();
  c.moveTo(0, -34);
  c.quadraticCurveTo(22, 0, 0, 38);
  c.stroke();
  c.restore();
  if (s.qrCanvas) {
    c.save();
    c.imageSmoothingEnabled = false;
    c.fillStyle = "#F5EDD6";
    roundRect(c, 1190, 194, 202, 202, 18);
    c.fill();
    c.drawImage(s.qrCanvas, 1202, 206, 178, 178);
    c.restore();
  } else {
    drawBuilderQr(c, id, 1206, 210, 170);
  }
  c.fillStyle = "rgba(245,237,214,.58)";
  c.font = "700 14px JetBrains Mono, monospace";
  c.textAlign = "center";
  c.fillText("SCAN TO VERIFY BUILDER", 1291, 414);
  c.fillText("VERIFIED BUILDER ID", 1291, 494);
  c.fillStyle = "#7DFFC8";
  c.font = "800 30px JetBrains Mono, monospace";
  c.fillText(id, 1291, 540);
  c.fillStyle = "rgba(11,104,57,.3)";
  roundRect(c, 1168, 582, 246, 54, 27);
  c.fill();
  c.strokeStyle = "#7DFFC8";
  c.lineWidth = 2;
  c.stroke();
  c.fillStyle = "#7DFFC8";
  c.font = "700 14px JetBrains Mono, monospace";
  c.fillText("✓ ACCESS GRANTED", 1291, 616);
  c.textAlign = "left";

  c.fillStyle = "rgba(245,237,214,.08)";
  roundRect(c, 1150, 664, 284, 72, 14);
  c.fill();
  c.fillStyle = "rgba(245,237,214,.56)";
  c.font = "700 12px JetBrains Mono, monospace";
  c.fillText("ISSUED 08 AUG 2026", 1170, 692);
  c.fillText(`NO. ${id}`, 1170, 718);

  c.fillStyle = "#FEE101";
  roundRect(c, 28, H - 98, W - 56, 70, 0);
  c.fill();
  c.fillStyle = "#111310";
  c.font = "800 19px JetBrains Mono, monospace";
  c.textAlign = "center";
  c.fillText("GOA · INDIA · 28–31 OCT 2026 · BUILD · SHIP · REPEAT", W / 2, H - 54);
  c.textAlign = "left";
}

function drawPassRelay(c: CanvasRenderingContext2D, s: RenderState) {
  const W = PASS.W;
  const H = PASS.H;
  const t = theme(s);
  const f = finish(s);
  const id = s.idNumber || "HHG-2026-····";
  const name = (s.name || "YOUR NAME").toUpperCase();
  const stack = (s.stack || "YOUR STACK").toUpperCase();
  const title = classLabel(s.titleId).toUpperCase();
  const meta = metaLine(s);

  c.fillStyle = f.bg;
  c.fillRect(0, 0, W, H);

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

  c.fillStyle = "#061820";
  roundRect(c, 48, 48, W - 96, H - 96, 18);
  c.fill();

  c.fillStyle = "rgba(0,0,0,.55)";
  roundRect(c, 64, 64, W - 128, 56, 10);
  c.fill();
  c.fillStyle = "#7DFFC8";
  c.beginPath();
  c.arc(88, 92, 7, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#FEE101";
  c.font = "800 16px JetBrains Mono, monospace";
  c.fillText("HACKER TRACKER  ·  BUILDER ID  ·  LIVE", 108, 98);

  const pcx = 320;
  const pcy = 520;
  const pr = 168;
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
  if (s.image) drawCoverCircle(c, s.image, pcx, pcy, pr, s);
  else {
    c.fillStyle = "#0b6839";
    c.beginPath();
    c.arc(pcx, pcy, pr, 0, Math.PI * 2);
    c.fill();
  }
  c.strokeStyle = "#FEE101";
  c.lineWidth = 5;
  c.beginPath();
  c.arc(pcx, pcy, pr + 2, 0, Math.PI * 2);
  c.stroke();

  const sticker = s.stickers[s.titleId];
  if (sticker) c.drawImage(sticker, pcx + pr - 40, pcy + pr - 50, 100, 100);

  const px = 560;
  const py = 160;
  c.fillStyle = "rgba(0,0,0,.45)";
  roundRect(c, px, py, 900, 620, 16);
  c.fill();

  const row = (label: string, value: string, y: number, col: string, maxS = 36) => {
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
  drawMoodBadge(c, s.mood, px + 650, py + 510, 190, "#7DFFC8");
  c.fillStyle = "rgba(255,255,255,.45)";
  c.font = "600 13px JetBrains Mono, monospace";
  c.fillText(`${HASHTAG}  ·  LESS NOISE. MORE SIGNAL.`, px + 48, py + 570);

  drawInfoChip(c, "COORDINATES", coordinateLine(s.lat, s.lng), 92, 748, 420, "#7DFFC8", "pin");
  drawInfoChip(c, "EVENT", "28–31 OCT 2026 · GOA", 552, 828, 300, "#FEE101", "date");
  drawInfoChip(c, "NETWORK", "BUILDER SIGNAL ONLINE", 874, 828, 300, "#7DFFC8", "signal");
  drawInfoChip(c, "STATUS", "VERIFIED BUILDER", 1196, 828, 250, "#FF0080", "check");
  if (s.goaLogo) c.drawImage(s.goaLogo, 92, 834, 92, 92);
  if (s.frameStamp) c.drawImage(s.frameStamp, 204, 840, 260, 86);
  c.fillStyle = "rgba(255,255,255,.14)";
  c.fillRect(80, 946, W - 160, 2);
  c.fillStyle = "rgba(245,237,214,.62)";
  c.font = "700 13px JetBrains Mono, monospace";
  c.textAlign = "center";
  c.fillText("HACKER HOUSE GOA · BUILD · SHIP · REPEAT · OFFICIAL ID 2026", W / 2, 978);
  c.textAlign = "left";
}

function drawPassCollectible(c: CanvasRenderingContext2D, s: RenderState) {
  const W = SIGNAL.W;
  const H = SIGNAL.H;
  const t = theme(s);
  const id = s.idNumber || "HHG-2026-····";
  const name = (s.name || "BUILDER NAME").toUpperCase();
  const stack = (s.stack || "STACK & ROLE").toUpperCase();
  const title = classLabel(s.titleId).toUpperCase();

  c.fillStyle = "#0a0a0a";
  c.fillRect(0, 0, W, H);

  const face = c.createLinearGradient(40, 40, W - 40, H - 40);
  face.addColorStop(0, t.bg1 || "#0b6839");
  face.addColorStop(0.55, t.bg0 || "#052c17");
  face.addColorStop(1, t.bg2 || "#02140c");
  c.fillStyle = face;
  roundRect(c, 32, 32, W - 64, H - 64, 14);
  c.fill();
  c.strokeStyle = t.accent;
  c.lineWidth = 6;
  roundRect(c, 24, 24, W - 48, H - 48, 18);
  c.stroke();

  c.fillStyle = "rgba(0,0,0,.4)";
  roundRect(c, 48, 48, W - 96, 100, 12);
  c.fill();
  c.fillStyle = t.accent;
  c.font = "700 12px JetBrains Mono, monospace";
  c.fillText("HH GOA 2026  ·  BUILDER SIGNAL", 64, 76);
  const ns = fit(c, name, 900, 36, 18, "800");
  c.font = `800 ${ns}px Space Grotesk, sans-serif`;
  c.fillStyle = "#fff";
  c.fillText(name, 64, 120);

  c.fillStyle = t.accent2;
  roundRect(c, W - 280, 60, 200, 40, 10);
  c.fill();
  c.fillStyle = "#fff";
  c.font = "800 13px Space Grotesk, sans-serif";
  c.textAlign = "center";
  c.fillText(title.slice(0, 16), W - 180, 86);
  c.textAlign = "left";

  const ax = 52;
  const ay = 168;
  const aw = W - 104;
  const ah = 680;
  c.fillStyle = t.accent;
  roundRect(c, ax, ay, aw, ah, 16);
  c.fill();
  c.fillStyle = "#0a0a0a";
  roundRect(c, ax + 8, ay + 8, aw - 16, ah - 16, 12);
  c.fill();
  c.save();
  roundRect(c, ax + 14, ay + 14, aw - 28, ah - 28, 10);
  c.clip();
  if (s.image) drawCoverRect(c, s.image, ax + 14, ay + 14, aw - 28, ah - 28, s);
  else if (s.hackerMan) {
    const ch = ah * 0.85;
    const cw = ch * (240 / 320);
    c.drawImage(s.hackerMan, ax + (aw - cw) / 2, ay + (ah - ch) / 2, cw, ch);
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

  c.fillStyle = "rgba(0,0,0,.5)";
  roundRect(c, 48, ay + ah + 24, W - 96, 160, 14);
  c.fill();
  c.fillStyle = t.accent;
  c.font = "700 14px JetBrains Mono, monospace";
  c.fillText(stack, 72, ay + ah + 64);
  c.fillStyle = "#fff";
  c.font = "600 16px Space Grotesk, sans-serif";
  c.fillText(id, 72, ay + ah + 100);
  c.fillStyle = "rgba(255,255,255,.55)";
  c.font = "600 13px JetBrains Mono, monospace";
  c.fillText(HASHTAG, 72, ay + ah + 140);
  drawMoodBadge(c, s.mood, W - 282, ay + ah + 108, 186, t.accent, "#02140C");

  c.fillStyle = "rgba(0,0,0,.34)";
  roundRect(c, 48, 1054, W - 96, 360, 18);
  c.fill();
  c.strokeStyle = `${t.accent}66`;
  c.lineWidth = 2;
  c.stroke();
  drawInfoChip(c, "LOCATION", coordinateLine(s.lat, s.lng), 70, 1080, 500, t.accent, "pin");
  drawInfoChip(c, "EVENT DATE", "28–31 OCT 2026", 70, 1158, 500, t.accent2, "date");
  drawInfoChip(c, "BUILDER CLASS", title, 70, 1236, 500, t.accent, "code");
  drawInfoChip(c, "STATUS", "VERIFIED · ACCESS GRANTED", 70, 1314, 500, "#7DFFC8", "check");
  if (s.goaLogo) c.drawImage(s.goaLogo, 624, 1080, 150, 150);
  if (s.qrCanvas) {
    c.save();
    c.imageSmoothingEnabled = false;
    c.fillStyle = "#F5EDD6";
    roundRect(c, 804, 1080, 204, 204, 18);
    c.fill();
    c.drawImage(s.qrCanvas, 816, 1092, 180, 180);
    c.restore();
  } else {
    drawBuilderQr(c, id, 822, 1098, 168);
  }
  if (s.frameStamp) c.drawImage(s.frameStamp, 620, 1300, 360, 96);
  c.fillStyle = t.accent;
  c.fillRect(48, H - 74, W - 96, 3);
  c.fillStyle = "rgba(245,237,214,.68)";
  c.font = "700 12px JetBrains Mono, monospace";
  c.textAlign = "center";
  c.fillText("HH GOA · BUILDER SIGNAL · GLOBAL NETWORK · #FRAMEINGOA", W / 2, H - 38);
  c.textAlign = "left";
}

function drawPfp(c: CanvasRenderingContext2D, s: RenderState) {
  const { W, H } = PFP;
  const cx = W / 2;
  const cy = 512;
  const radius = 390;
  if (s.pfpTemplate) {
    c.drawImage(s.pfpTemplate, 0, 0, W, H);
    const photoY = 555;
    const photoR = 278;
    if (s.image) drawCoverCircle(c, s.image, cx, photoY, photoR, s);
    else if (s.hackerMan) {
      c.save();
      c.beginPath();
      c.arc(cx, photoY, photoR, 0, Math.PI * 2);
      c.clip();
      c.fillStyle = "#071A12";
      c.fillRect(cx - photoR, photoY - photoR, photoR * 2, photoR * 2);
      c.drawImage(s.hackerMan, cx - 150, photoY - 215, 300, 420);
      c.restore();
    }
    c.strokeStyle = "rgba(245,237,214,.55)";
    c.lineWidth = 5;
    c.beginPath();
    c.arc(cx, photoY, photoR + 3, 0, Math.PI * 2);
    c.stroke();
    const pfpName = (s.name || "GOA BUILDER").toUpperCase();
    c.fillStyle = "rgba(2,20,12,.9)";
    roundRect(c, 280, 808, 520, 74, 36);
    c.fill();
    c.strokeStyle = "rgba(254,225,1,.62)";
    c.lineWidth = 3;
    c.stroke();
    const nameSize = fit(c, pfpName, 450, 30, 16, "800");
    c.fillStyle = "#F5EDD6";
    c.font = `800 ${nameSize}px Space Grotesk, sans-serif`;
    c.textAlign = "center";
    c.fillText(pfpName, cx, 846);
    c.fillStyle = "#FEE101";
    c.font = "700 11px JetBrains Mono, monospace";
    c.fillText(`${s.idNumber} · ${s.mood}`, cx, 868);
    drawMoodBadge(c, "VERIFIED", 850, 122, 150, "#7DFFC8", "#02140C");
    c.fillStyle = "rgba(245,237,214,.58)";
    c.font = "700 10px JetBrains Mono, monospace";
    c.textAlign = "left";
    c.fillText("28–31 OCT 2026 · GOA, INDIA", 50, 1026);
    c.textAlign = "right";
    c.fillText(coordinateLine(s.lat, s.lng), W - 50, 1026);
    c.textAlign = "left";
    return;
  }
  c.fillStyle = "#111310";
  c.fillRect(0, 0, W, H);
  c.save();
  c.strokeStyle = "rgba(11,104,57,.42)";
  c.lineWidth = 5;
  for (let y = 120; y < H; y += 92) {
    c.beginPath();
    for (let x = -20; x <= W + 20; x += 20) {
      const yy = y + Math.sin(x / 34) * 9;
      if (x === -20) c.moveTo(x, yy);
      else c.lineTo(x, yy);
    }
    c.stroke();
  }
  c.restore();
  c.fillStyle = "#FEE101";
  c.font = "600 58px Imbue, Georgia, serif";
  c.textAlign = "center";
  c.fillText("HACKER HOUSE GOA", cx, 84);
  c.fillStyle = "rgba(245,237,214,.68)";
  c.font = "700 13px JetBrains Mono, monospace";
  c.fillText("OFFICIAL BUILDER PFP · 2026", cx, 112);
  c.fillStyle = "#0B6839";
  c.beginPath();
  c.arc(cx, cy, 468, 0, Math.PI * 2);
  c.fill();
  ["#FEE101", "#F5EDD6", "#0B6839", "#FF0080"].forEach((color, i) => {
    c.strokeStyle = color;
    c.lineWidth = 24 - i * 4;
    c.beginPath();
    c.arc(cx, cy, radius + 48 - i * 14, 0, Math.PI * 2);
    c.stroke();
  });
  if (s.image) drawCoverCircle(c, s.image, cx, cy, radius, s);
  else if (s.hackerMan) {
    c.save();
    c.beginPath();
    c.arc(cx, cy, radius, 0, Math.PI * 2);
    c.clip();
    c.fillStyle = "#F5EDD6";
    c.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    c.drawImage(s.hackerMan, cx - 200, cy - 280, 400, 550);
    c.restore();
  } else {
    c.fillStyle = "#F5EDD6";
    c.beginPath();
    c.arc(cx, cy, radius, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = "#171B16";
  roundRect(c, 174, 842, 732, 154, 24);
  c.fill();
  c.strokeStyle = "#FEE101";
  c.lineWidth = 4;
  roundRect(c, 174, 842, 732, 154, 24);
  c.stroke();
  const pfpName = (s.name || "BUILDER").toUpperCase();
  const ns = fit(c, pfpName, 620, 38, 20, "800");
  c.fillStyle = "#F5EDD6";
  c.font = `800 ${ns}px Space Grotesk, sans-serif`;
  c.textAlign = "center";
  c.fillText(pfpName, cx, 892);
  c.fillStyle = "#F5EDD6";
  c.font = "600 38px Imbue, Georgia, serif";
  c.fillText(HASHTAG, cx, 944);
  c.fillStyle = "#FEE101";
  c.font = "700 12px JetBrains Mono, monospace";
  c.fillText(`${s.mood} · GOA · 28–31 OCT 2026`, cx, 978);
  c.textAlign = "left";
}

function drawTeam(c: CanvasRenderingContext2D, s: RenderState) {
  const W = TEAM.W;
  const H = TEAM.H;
  const f = finish(s);
  c.fillStyle = f.bg;
  c.fillRect(0, 0, W, H);
  c.strokeStyle = "#FEE101";
  c.lineWidth = 6;
  roundRect(c, 16, 16, W - 32, H - 32, 20);
  c.stroke();

  c.fillStyle = "#FEE101";
  c.font = "800 22px JetBrains Mono, monospace";
  c.fillText("TEAM FRAME  ·  HH GOA 2026", 40, 56);
  c.textAlign = "right";
  c.fillStyle = "#7DFFC8";
  c.font = "700 13px JetBrains Mono, monospace";
  c.fillText(`${s.mood} · ${s.idNumber}`, W - 40, 54);
  c.textAlign = "left";

  const count = Math.min(3, Math.max(1, s.teamCount));
  const slots = [];
  for (let i = 0; i < count; i++) {
    if (i === 0) {
      slots.push({
        name: s.name || "Builder 1",
        stack: s.stack || "",
        image: s.image as HTMLImageElement | null,
      });
    } else {
      slots.push(s.teamSlots[i] || { name: `Builder ${i + 1}`, stack: "", image: null });
    }
  }
  const gap = 24;
  const cardW = (W - 80 - gap * (count - 1)) / count;
  slots.forEach((slot, i) => {
    const x = 40 + i * (cardW + gap);
    const y = 90;
    c.fillStyle = "rgba(11,104,57,.55)";
    roundRect(c, x, y, cardW, H - 140, 16);
    c.fill();
    const pr = Math.min(cardW * 0.28, 70);
    const pcx = x + cardW / 2;
    const pcy = y + 100;
    if (slot.image) drawCoverCircle(c, slot.image, pcx, pcy, pr, { ...s, zoom: 1.1, panX: 0, panY: 0 });
    else {
      c.fillStyle = "#02140c";
      c.beginPath();
      c.arc(pcx, pcy, pr, 0, Math.PI * 2);
      c.fill();
    }
    c.strokeStyle = "#FEE101";
    c.lineWidth = 3;
    c.beginPath();
    c.arc(pcx, pcy, pr + 2, 0, Math.PI * 2);
    c.stroke();
    c.fillStyle = "#fff";
    c.font = "800 18px Space Grotesk, sans-serif";
    c.textAlign = "center";
    c.fillText((slot.name || "Builder").slice(0, 18), pcx, y + 210);
    c.fillStyle = "#FEE101";
    c.font = "600 14px Space Grotesk, sans-serif";
    c.fillText((slot.stack || "").slice(0, 22), pcx, y + 236);
    c.fillStyle = "rgba(0,0,0,.28)";
    roundRect(c, x + 18, y + 262, cardW - 36, 48, 10);
    c.fill();
    c.fillStyle = "#F5EDD6";
    c.font = "700 12px JetBrains Mono, monospace";
    c.fillText(i === 0 ? classLabel(s.titleId).toUpperCase().slice(0, 26) : `TEAM BUILDER ${i + 1}`, pcx, y + 291);
    c.fillStyle = "rgba(125,255,200,.12)";
    roundRect(c, x + 18, y + 326, cardW - 36, 46, 23);
    c.fill();
    c.strokeStyle = "rgba(125,255,200,.45)";
    c.lineWidth = 2;
    c.stroke();
    c.fillStyle = "#7DFFC8";
    c.font = "700 11px JetBrains Mono, monospace";
    c.fillText("✓ VERIFIED · READY TO BUILD", pcx, y + 354);
    c.fillStyle = "rgba(245,237,214,.48)";
    c.font = "600 10px JetBrains Mono, monospace";
    c.fillText(`MEMBER ${String(i + 1).padStart(2, "0")} · HHG TEAM PASS`, pcx, y + 410);
    c.textAlign = "left";
  });
  c.fillStyle = "rgba(255,255,255,.12)";
  c.fillRect(40, H - 66, W - 80, 2);
  c.fillStyle = "rgba(255,255,255,.58)";
  c.font = "700 12px JetBrains Mono, monospace";
  c.fillText(`${HASHTAG} · 28–31 OCT 2026 · GOA, INDIA`, 40, H - 36);
  c.textAlign = "right";
  c.fillText(`${coordinateLine(s.lat, s.lng)} · ${count} BUILDER${count > 1 ? "S" : ""}`, W - 40, H - 36);
  c.textAlign = "left";
}

export function cardSize(s: Pick<RenderState, "format" | "theme">) {
  if (s.format === "pfp") return { w: PFP.W, h: PFP.H, label: "1080 × 1080" };
  if (s.format === "team") return { w: TEAM.W, h: TEAM.H, label: `${TEAM.W} × ${TEAM.H}` };
  if (isCollectible({ ...emptyState(), ...s } as RenderState))
    return { w: SIGNAL.W, h: SIGNAL.H, label: `${SIGNAL.W} × ${SIGNAL.H}` };
  return { w: PASS.W, h: PASS.H, label: "1536 × 1024" };
}

function emptyState(): RenderState {
  return {
    format: "pass",
    theme: "official",
    filter: "natural",
    finish: "goa",
    name: "",
    stack: "",
    titleId: "terminal-surfer",
    handle: "",
    city: "",
    mood: "LOCKED IN",
    lat: null,
    lng: null,
    idNumber: "",
    zoom: 1.15,
    panX: 0,
    panY: 0,
    image: null,
    teamSlots: [],
    teamCount: 1,
    passTpl: null,
    goaArt: null,
    cardBg: null,
    pfpTemplate: null,
    goaLogo: null,
    frameStamp: null,
    stickers: {},
    logoMark: null,
    sealMark: null,
    hackerMan: null,
    qrCanvas: null,
  };
}

export function previewLabel(s: Pick<RenderState, "format" | "theme">) {
  if (s.format === "pfp") return "PFP frame";
  if (s.format === "team") return "Team frame";
  if (s.theme === "official") return "Builder Pass";
  if (s.theme === "signal") return "Signal card";
  return "Builder ID";
}

export function renderCard(canvas: HTMLCanvasElement, s: RenderState) {
  const size = cardSize(s);
  if (canvas.width !== size.w) canvas.width = size.w;
  if (canvas.height !== size.h) canvas.height = size.h;
  const c = canvas.getContext("2d")!;
  c.clearRect(0, 0, size.w, size.h);

  if (s.format === "pfp") drawPfp(c, s);
  else if (s.format === "team") drawTeam(c, s);
  else if (isOfficial(s)) drawPassOfficial(c, s);
  else if (isCollectible(s)) drawPassCollectible(c, s);
  else drawPassRelay(c, s);
}

export function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => res(i);
    i.onerror = () => rej(new Error(`Failed to load ${src}`));
    i.src = src;
  });
}

export function genIdNumber(seed?: string) {
  let h = 2166136261;
  const s = String(seed || Date.now()) + Math.random().toString(36);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `HHG-2026-${(h >>> 0).toString(16).toUpperCase().padStart(8, "0").slice(0, 4)}`;
}

export async function fileToImage(file: File): Promise<HTMLImageElement> {
  let blob: Blob = file;
  const n = (file.name || "").toLowerCase();
  const t = (file.type || "").toLowerCase();
  if (t.includes("heic") || t.includes("heif") || n.endsWith(".heic") || n.endsWith(".heif")) {
    const heic2any = (await import("heic2any")).default;
    const out = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
    blob = Array.isArray(out) ? out[0] : out;
  }
  const url = URL.createObjectURL(blob);
  try {
    return await loadImg(url);
  } finally {
    // keep url alive while image is used — caller may revoke later
  }
}
