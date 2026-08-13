"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CLASSES,
  HQ,
  type MoodId,
  type FilterId,
  type FinishId,
  type Format,
  type Pin,
  type ThemeId,
  uid,
} from "@/lib/constants";
import { fetchPins, savePin, uploadBlob } from "@/lib/supabase/pins";
import { createSharedCard } from "@/lib/supabase/shared-cards";
import { genIdNumber, loadImg } from "@/lib/render/card";
import { playUiSound } from "@/lib/ui-sound";

export type View = "landing" | "studio" | "map";

export type StudioState = {
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
  idNumber: string;
  zoom: number;
  panX: number;
  panY: number;
  image: HTMLImageElement | null;
  teamSlots: { name: string; stack: string; image: HTMLImageElement | null }[];
  teamCount: number;
  locationSet: boolean;
  lat: number | null;
  lng: number | null;
  locationLabel: string;
};

type Assets = {
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
};

type Ctx = {
  view: View;
  setView: (v: View) => void;
  studio: StudioState;
  setStudio: React.Dispatch<React.SetStateAction<StudioState>>;
  patchStudio: (p: Partial<StudioState>) => void;
  assets: Assets;
  pins: Pin[];
  reloadPins: () => Promise<void>;
  toast: string | null;
  showToast: (msg: string) => void;
  pickMode: boolean;
  setPickMode: (v: boolean) => void;
  pick: { lat: number | null; lng: number | null; label: string };
  setPick: (p: { lat: number | null; lng: number | null; label: string }) => void;
  returnAfterPick: boolean;
  setReturnAfterPick: (v: boolean) => void;
  autoPinAfterPick: boolean;
  setAutoPinAfterPick: (v: boolean) => void;
  lockLocation: () => void;
  dropPin: (canvas: HTMLCanvasElement | null) => Promise<void>;
  selectedPin: Pin | null;
  setSelectedPin: (p: Pin | null) => void;
  bootDone: boolean;
  setBootDone: (v: boolean) => void;
};

const AppContext = createContext<Ctx | null>(null);

const initialStudio = (): StudioState => ({
  format: "pass",
  theme: "official",
  filter: "natural",
  finish: "goa",
  name: "",
  stack: "",
  titleId: CLASSES[Math.floor(Math.random() * CLASSES.length)].id,
  handle: "",
  city: "",
  mood: "LOCKED IN",
  idNumber: genIdNumber(),
  zoom: 1.15,
  panX: 0,
  panY: 0,
  image: null,
  teamSlots: [
    { name: "", stack: "", image: null },
    { name: "", stack: "", image: null },
    { name: "", stack: "", image: null },
  ],
  teamCount: 1,
  locationSet: false,
  lat: null,
  lng: null,
  locationLabel: "",
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>("landing");
  const [studio, setStudio] = useState<StudioState>(initialStudio);
  const [assets, setAssets] = useState<Assets>({
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
  });
  const [pins, setPins] = useState<Pin[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [pickMode, setPickMode] = useState(false);
  const [pick, setPick] = useState<{ lat: number | null; lng: number | null; label: string }>({
    lat: null,
    lng: null,
    label: "",
  });
  const [returnAfterPick, setReturnAfterPick] = useState(false);
  const [autoPinAfterPick, setAutoPinAfterPick] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [bootDone, setBootDone] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  }, []);

  const patchStudio = useCallback((p: Partial<StudioState>) => {
    setStudio((s) => ({ ...s, ...p }));
  }, []);

  const reloadPins = useCallback(async () => {
    const list = await fetchPins();
    setPins(list);
  }, []);

  useEffect(() => {
    reloadPins();
    (async () => {
      try {
        const [passTpl, goaArt, cardBg, pfpTemplate, goaLogo, frameStamp, logoMark, sealMark, hackerMan] = await Promise.all([
          loadImg("/assets/BuilderPass.png").catch(() => null),
          loadImg("/image/goa-beach-art.png").catch(() => null),
          loadImg("/image/desktop-bg.jpg").catch(() => null),
          loadImg("/image/frame-template.jpg").catch(() => null),
          loadImg("/image/hh-goa-circle-logo.png").catch(() => null),
          loadImg("/image/frame-in-goa-stamp.png").catch(() => null),
          loadImg("/assets/hacker-tracker-mark.svg").catch(() => null),
          loadImg("/assets/seal-goa.svg").catch(() => null),
          loadImg("/assets/hacker-man.svg").catch(() => null),
        ]);
        const stickers: Record<string, HTMLImageElement> = {};
        const availableStickerIds = new Set([
          "terminal-surfer",
          "cache-raider",
          "wave-rider",
          "coconut-courier",
          "harbor-hopper",
          "night-champion",
          "comfort-coder",
        ]);
        await Promise.all(
          CLASSES.filter((c) => availableStickerIds.has(c.id)).map(async (c) => {
            try {
              stickers[c.id] = await loadImg(`/assets/stickers/${c.id}.png`);
            } catch {
              /* optional */
            }
          })
        );
        setAssets({ passTpl, goaArt, cardBg, pfpTemplate, goaLogo, frameStamp, logoMark, sealMark, hackerMan, stickers });
      } catch (e) {
        console.warn(e);
      }
    })();
  }, [reloadPins]);

  const lockLocation = useCallback(() => {
    if (pick.lat == null || pick.lng == null) {
      showToast("Tap the map first");
      return;
    }
    setStudio((s) => ({
      ...s,
      lat: pick.lat,
      lng: pick.lng,
      locationSet: true,
      locationLabel: pick.label || "Custom",
      city: s.city || (pick.label && pick.label !== "Selected" ? pick.label : s.city),
    }));
    setPickMode(false);
    playUiSound("pin");
    showToast("Location locked");
    if (returnAfterPick) {
      setReturnAfterPick(false);
      setView("studio");
    }
  }, [pick, returnAfterPick, showToast]);

  const dropPin = useCallback(
    async (canvas: HTMLCanvasElement | null) => {
      if (!studio.image) {
        showToast("Upload a photo first");
        return;
      }
      if (!studio.locationSet || studio.lat == null || studio.lng == null) {
        showToast("Pick a location first");
        setReturnAfterPick(true);
        setPickMode(true);
        setView("map");
        return;
      }
      showToast("Pinning…");

      const thumb = document.createElement("canvas");
      thumb.width = 160;
      thumb.height = 160;
      const tc = thumb.getContext("2d")!;
      // simple cover circle
      const img = studio.image;
      const iw = img.width;
      const ih = img.height;
      const scale = Math.max(160 / iw, 160 / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      tc.beginPath();
      tc.arc(80, 80, 80, 0, Math.PI * 2);
      tc.clip();
      tc.drawImage(img, 80 - dw / 2, 80 - dh / 2, dw, dh);
      const thumbBlob = await new Promise<Blob | null>((r) => thumb.toBlob(r, "image/jpeg", 0.85));
      let photoUrl = thumb.toDataURL("image/jpeg", 0.85);

      let cardUrl: string | null = null;
      let sharedCardId: string | null = null;
      let cardBlob: Blob | null = null;
      if (canvas) {
        cardBlob = await new Promise((r) => canvas.toBlob(r, "image/png"));
      }

      const id = uid();
      if (thumbBlob) {
        const pUrl = await uploadBlob(`thumbs/${id}.jpg`, thumbBlob, "image/jpeg");
        if (pUrl) photoUrl = pUrl;
      }
      if (cardBlob) {
        const shared = await createSharedCard(cardBlob, studio, id);
        if (shared) {
          cardUrl = shared.cardUrl;
          sharedCardId = shared.id;
        } else {
          const cUrl = await uploadBlob(`cards/${id}.png`, cardBlob, "image/png");
          if (cUrl) cardUrl = cUrl;
        }
      }

      const pin: Pin = {
        id,
        kind: "you",
        isSelf: true,
        name: studio.name.trim() || "Anonymous Builder",
        stack: studio.stack.trim() || "Builder",
        title: CLASSES.find((c) => c.id === studio.titleId)?.label || "Builder",
        handle: studio.handle.trim(),
        city: studio.city.trim() || studio.locationLabel || "",
        idNumber: studio.idNumber,
        format: studio.format,
        lat: studio.lat,
        lng: studio.lng,
        photo: photoUrl,
        cardUrl,
        sharedCardId,
        createdAt: new Date().toISOString(),
        theme: studio.theme,
      };

      const saved = await savePin(pin, {
        theme: studio.theme,
        filter: studio.filter,
        finish: studio.finish,
      });
      await reloadPins();
      setSelectedPin(saved);
      setView("map");
      playUiSound("success");
      showToast(sharedCardId ? "Pinned · personal share link ready" : cardUrl ? "Pinned · image saved to cloud" : "Pinned · saved on this device");
    },
    [studio, showToast, reloadPins]
  );

  const value = useMemo(
    () => ({
      view,
      setView,
      studio,
      setStudio,
      patchStudio,
      assets,
      pins,
      reloadPins,
      toast,
      showToast,
      pickMode,
      setPickMode,
      pick,
      setPick,
      returnAfterPick,
      setReturnAfterPick,
      autoPinAfterPick,
      setAutoPinAfterPick,
      lockLocation,
      dropPin,
      selectedPin,
      setSelectedPin,
      bootDone,
      setBootDone,
    }),
    [
      view,
      studio,
      patchStudio,
      assets,
      pins,
      reloadPins,
      toast,
      showToast,
      pickMode,
      pick,
      returnAfterPick,
      autoPinAfterPick,
      lockLocation,
      dropPin,
      selectedPin,
      bootDone,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp outside provider");
  return ctx;
}

export { HQ };
