"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import Landing from "@/components/Landing";
import Studio from "@/components/Studio";
import { isUiSoundEnabled, playUiSound, setUiSoundEnabled } from "@/lib/ui-sound";

const MapView = dynamic(() => import("@/components/SimpleMapView"), {
  ssr: false,
  loading: () => (
    <div className="view mapview map-loading">
      <p>Loading map…</p>
    </div>
  ),
});

function DockIcon({ type }: { type: "home" | "create" | "map" }) {
  const src = type === "home"
    ? "/image/hh-goa-circle-logo.png"
    : type === "create"
      ? "/image/frame-in-goa-stamp.png"
      : "/assets/map-pins-set.png";
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="mdock-icon" src={src} alt="" aria-hidden="true" />;
}

export default function AppShell() {
  const { view, setView, toast, bootDone, setBootDone } = useApp();
  const [soundOn, setSoundOn] = useState(true);

  const go = (next: "landing" | "studio" | "map") => {
    playUiSound(next === "map" ? "pin" : next === "studio" ? "open" : "click");
    setView(next);
  };

  useEffect(() => {
    setSoundOn(isUiSoundEnabled());
    const t = window.setTimeout(() => setBootDone(true), 1850);
    const onKey = () => setBootDone(true);
    window.addEventListener("keydown", onKey, { once: true });
    window.addEventListener("pointerdown", onKey, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onKey);
    };
  }, [setBootDone]);

  return (
    <>
      {!bootDone && (
        <div className="boot-sequence" aria-live="polite">
          <div className="boot-terminal">
            <div className="boot-title">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image/hh-goa-circle-logo.png" alt="" width={30} height={30} />
              Hacker Tracker <span>v2.47</span>
            </div>
            <div className="boot-log">
              <p>
                Booting core services <b>[OK]</b>
              </p>
              <p>
                Initializing world map <b>[OK]</b>
              </p>
              <p>
                Loading frame renderer <b>[OK]</b>
              </p>
              <p>Syncing Supabase signals <b>[OK]</b></p>
              <p>Mounting tracker controls <b>[OK]</b></p>
              <p>Verifying image pipeline <b>[OK]</b></p>
              <p>Ready…</p>
            </div>
            <div className="boot-progress">
              <i />
            </div>
            <small>Tap or press any key</small>
          </div>
        </div>
      )}

      <div className="page-shell">
        <div className="console-device" id="console-device">
          <button
            type="button"
            className="chrome-btn chrome-tl"
            title="Home"
            aria-label="Home"
            onClick={() => go("landing")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/hh-goa-circle-logo.png" alt="" width={34} height={34} />
          </button>

          <button
            type="button"
            className="chrome-btn chrome-tr"
            title="Open ID Studio"
            aria-label="Open ID Studio"
            onClick={() => go("studio")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/frame-in-goa-stamp.png" alt="" width={34} height={34} />
          </button>

          <div className="wordmark-hang">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/mobile-header-banner.png" alt="Hacker House Goa" className="wordmark-img goa-wordmark-img" />
            <span className="wordmark-thread" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/hh-goa-circle-logo.png" alt="" className="hang-orb" />
          </div>

          <nav className="side-tools left" aria-label="Tracker tools">
            <button type="button" className={`tool-btn ${view === "landing" ? "on" : ""}`} title="Home" onClick={() => go("landing")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image/hh-goa-circle-logo.png" alt="" />
            </button>
            <button type="button" className={`tool-btn ${view === "studio" ? "on" : ""}`} title="Builder ID" onClick={() => go("studio")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image/frame-in-goa-stamp.png" alt="" />
            </button>
            <button type="button" className={`tool-btn ${view === "map" ? "on" : ""}`} title="World map" onClick={() => go("map")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/map-pins-set.png" alt="" />
            </button>
          </nav>

          <div className="console-screen">
            {view === "landing" && <Landing />}
            {view === "studio" && <Studio />}
            {view === "map" && <MapView />}
          </div>

          <div className="console-statusbar">
            <button type="button" className="bottom-console-key" onClick={() => go("map")}>World Map</button>
            <div className="status-marquee">
              <span>
                Welcome to Hacker Tracker · View builder sightings worldwide · Mint your Builder ID · Share #FrameInGoa · HH Goa 28–31 Oct 2026 ·{" "}
              </span>
              <span>
                Welcome to Hacker Tracker · View builder sightings worldwide · Mint your Builder ID · Share #FrameInGoa · HH Goa 28–31 Oct 2026 ·{" "}
              </span>
            </div>
            <button type="button" className="bottom-console-key primary" onClick={() => go("studio")}>Create Pass</button>
            <button
              type="button"
              className={`sound-btn ${soundOn ? "" : "off"}`}
              onClick={() => {
                const next = !soundOn;
                setSoundOn(next);
                setUiSoundEnabled(next);
                if (next) playUiSound("success", true);
              }}
              aria-label={soundOn ? "Mute interface sound" : "Enable interface sound"}
              aria-pressed={soundOn}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/icon-sound.svg" alt="" />
            </button>
          </div>

          <div className="console-mascot" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/hacker-mascot.png" alt="" />
          </div>
        </div>

        <nav className="mobile-dock" aria-label="Main">
          <button
            type="button"
            className={`mdock-btn ${view === "landing" ? "on" : ""}`}
            onClick={() => go("landing")}
          >
            <DockIcon type="home" />
            <span>Home</span>
          </button>
          <button
            type="button"
            className={`mdock-btn ${view === "studio" ? "on" : ""}`}
            onClick={() => go("studio")}
          >
            <DockIcon type="create" />
            <span>Create</span>
          </button>
          <button
            type="button"
            className={`mdock-btn ${view === "map" ? "on" : ""}`}
            onClick={() => go("map")}
          >
            <DockIcon type="map" />
            <span>Map</span>
          </button>
        </nav>
      </div>

      <div className={`toast ${toast ? "show" : ""}`} hidden={!toast} role="status">
        {toast}
      </div>
    </>
  );
}
