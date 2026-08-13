export const HQ = {
  lat: 15.5736,
  lng: 73.7419,
  label: "HH Goa HQ",
} as const;

export const HASHTAG = "#FrameInGoa";
export const LOCAL_KEY = "hhgoa_pins_v1";
export const DEVFOLIO = "https://hacker-house-goa-2026.devfolio.co/";
export const HHGOA = "https://hhgoa.com/";

export const CLASSES = [
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
] as const;

export type ClassId = (typeof CLASSES)[number]["id"];
export type Format = "pass" | "pfp" | "team";
export type ThemeId = "official" | "relay" | "signal" | "wave" | "sand" | "neon";
export type FilterId = "natural" | "cel" | "riso";
export type FinishId = "goa" | "night" | "sand";

export const MOODS = [
  { id: "LOCKED IN", label: "Locked in" },
  { id: "SHIPPING", label: "Shipping" },
  { id: "BUILD MODE", label: "Build mode" },
  { id: "DEBUGGING", label: "Debugging" },
  { id: "OCEAN FLOW", label: "Ocean flow" },
] as const;

export type MoodId = (typeof MOODS)[number]["id"];

export const PASS = {
  W: 1536,
  H: 1024,
  photo: { cx: 345, cy: 588, r: 146 },
  name: { x: 708, y: 488, maxW: 640 },
  stack: { x: 708, y: 585, maxW: 640 },
  title: { x: 708, y: 685, maxW: 640 },
  id: { x: 708, y: 748 },
  meta: { x: 708, y: 780 },
} as const;

export const SIGNAL = { W: 1080, H: 1512 } as const;
export const PFP = { W: 1080, H: 1080, r: 420 } as const;
export const TEAM = { W: 1200, H: 630 } as const;

export const THEMES: Record<
  ThemeId,
  {
    kind: "official" | "relay" | "collectible";
    label: string;
    accent: string;
    accent2: string;
    text: string;
    mute: string;
    classCol: string;
    foil: string[];
    bg0?: string;
    bg1?: string;
    bg2?: string;
  }
> = {
  relay: {
    kind: "relay",
    label: "Builder ID",
    accent: "#FEE101",
    accent2: "#FF0080",
    text: "#FFFFFF",
    mute: "rgba(255,255,255,.75)",
    classCol: "#FF0080",
    foil: ["#fee101", "#56d8ef", "#fee101", "#0b6839"],
  },
  official: {
    kind: "official",
    label: "Builder Pass",
    accent: "#FEE101",
    accent2: "#FFF8EB",
    text: "#FFF8EB",
    mute: "rgba(255,248,235,.8)",
    classCol: "#FF0080",
    foil: ["#fee101", "#ff0080", "#fee101", "#c4a800"],
  },
  signal: {
    kind: "collectible",
    label: "Signal Card",
    bg0: "#052c17",
    bg1: "#0b6839",
    bg2: "#02140c",
    accent: "#FEE101",
    accent2: "#FF0080",
    text: "#FFFFFF",
    mute: "rgba(255,255,255,.78)",
    classCol: "#FF0080",
    foil: ["#fff8b0", "#fee101", "#ff0080", "#7dffc8", "#fee101", "#c4a800"],
  },
  wave: {
    kind: "collectible",
    label: "Wave",
    bg0: "#041828",
    bg1: "#0a4a62",
    bg2: "#021018",
    accent: "#7DFFC8",
    accent2: "#FEE101",
    text: "#E8F8FF",
    mute: "rgba(232,248,255,.75)",
    classCol: "#FEE101",
    foil: ["#b8f0ff", "#7dffc8", "#0b6839", "#fee101", "#7dffc8"],
  },
  sand: {
    kind: "collectible",
    label: "Sand",
    bg0: "#2a1208",
    bg1: "#8b3a12",
    bg2: "#1a0a04",
    accent: "#FEE101",
    accent2: "#F5EDD6",
    text: "#FFF5E6",
    mute: "rgba(255,245,230,.72)",
    classCol: "#FF0080",
    foil: ["#fff0c0", "#fee101", "#c4a800", "#f5edd6", "#fee101"],
  },
  neon: {
    kind: "collectible",
    label: "Neon",
    bg0: "#120018",
    bg1: "#2a0840",
    bg2: "#050210",
    accent: "#FEE101",
    accent2: "#FF0080",
    text: "#FFFFFF",
    mute: "rgba(255,255,255,.75)",
    classCol: "#FF0080",
    foil: ["#ff9cdb", "#ff0080", "#fee101", "#7dffc8", "#ff0080"],
  },
};

export const FINISHES = {
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
} as const;

export type Pin = {
  id: string;
  name: string;
  stack: string;
  title: string;
  handle: string;
  city: string;
  idNumber: string;
  format: Format;
  lat: number;
  lng: number;
  photo: string | null;
  cardUrl: string | null;
  kind: "builder" | "hq" | "you" | "pick";
  isSelf?: boolean;
  createdAt: string;
  theme?: ThemeId;
};

export function classLabel(id: string) {
  return CLASSES.find((c) => c.id === id)?.label || "Builder";
}

export function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
