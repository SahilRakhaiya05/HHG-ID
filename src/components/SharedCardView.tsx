"use client";

import { useState, type CSSProperties, type PointerEvent } from "react";
import type { SharedCard } from "@/lib/supabase/shared-cards";
import { playUiSound } from "@/lib/ui-sound";

export default function SharedCardView({ card }: { card: SharedCard }) {
  const [mode3d, setMode3d] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const shareUrl = typeof window === "undefined" ? "" : window.location.href;

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!mode3d) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    setTilt({ x: y * -13, y: x * 16 });
  };

  const reset = () => setTilt({ x: 0, y: 0 });

  const download = async () => {
    playUiSound("success");
    try {
      const response = await fetch(card.cardUrl);
      const blob = await response.blob();
      const href = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = href;
      anchor.download = `HH-Goa-2026-${card.name.replace(/[^a-z0-9]+/gi, "-")}.png`;
      anchor.click();
      URL.revokeObjectURL(href);
    } catch {
      window.open(card.cardUrl, "_blank", "noopener,noreferrer");
    }
  };

  const copyLink = async () => {
    await navigator.clipboard?.writeText(shareUrl);
    playUiSound("success");
  };

  const share = async () => {
    const text = `${card.name} · ${card.title}\n${card.idNumber} · HH Goa 2026\n#FrameInGoa`;
    if (navigator.share) {
      await navigator.share({ title: `${card.name} · HH Goa Builder Pass`, text, url: shareUrl }).catch(() => null);
      return;
    }
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer");
  };

  const style = {
    "--card-rx": `${tilt.x}deg`,
    "--card-ry": `${tilt.y + (flipped ? 180 : 0)}deg`,
  } as CSSProperties;

  return (
    <main className="shared-card-page">
      <header className="shared-card-header">
        <a href="/" className="shared-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/image/hh-goa-circle-logo.png" alt="" />
          <span><b>Hacker House Goa</b><small>Builder Credential · 2026</small></span>
        </a>
        <div className="shared-event"><b>28–31 OCT 2026</b><span>GOA · INDIA</span></div>
      </header>

      <section className={`shared-card-workspace ${mode3d ? "is-3d" : "is-2d"}`}>
        <div className="lanyard-rig" aria-hidden>
          <i className="lanyard-anchor" /><i className="lanyard-rope" /><i className="lanyard-clip" />
        </div>
        <div className="shared-scene" onPointerMove={move} onPointerLeave={reset}>
          <div className={`shared-card-object ${flipped ? "is-flipped" : ""} shared-format-${card.format}`} style={style}>
            <div className="shared-card-face shared-card-front">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.cardUrl} alt={`${card.name} HH Goa Builder Pass`} />
              <span className="shared-card-glare" />
            </div>
            <div className="shared-card-face shared-card-back">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image/desktop-bg.jpg" alt="" className="shared-back-bg" />
              <div className="shared-back-shade" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image/hh-goa-circle-logo.png" alt="Hacker House Goa" className="shared-back-logo" />
              <p className="shared-back-kicker">Verified Builder Credential</p>
              <h1>{card.name}</h1>
              <dl>
                <div><dt>Builder ID</dt><dd>{card.idNumber || card.id.slice(0, 13).toUpperCase()}</dd></div>
                <div><dt>Stack</dt><dd>{card.stack || "Builder"}</dd></div>
                <div><dt>Class</dt><dd>{card.title || "Builder"}</dd></div>
                <div><dt>Signal</dt><dd>{card.mood || "LOCKED IN"}</dd></div>
              </dl>
              <p className="shared-back-foot">#FrameInGoa · Less noise. More signal.</p>
            </div>
          </div>
        </div>

        <div className="shared-mode-row">
          <button type="button" className={`pill ${mode3d ? "on" : ""}`} onClick={() => { setMode3d(true); playUiSound("open"); }}>3D Card</button>
          <button type="button" className={`pill ${!mode3d ? "on" : ""}`} onClick={() => { setMode3d(false); setTilt({ x: 0, y: 0 }); }}>2D Card</button>
          <button type="button" className="pill" onClick={() => { setFlipped((value) => !value); playUiSound("click"); }}>Flip Card</button>
        </div>
      </section>

      <section className="shared-card-info">
        <div><span>Builder</span><strong>{card.name}</strong></div>
        <div><span>Role / Stack</span><strong>{card.stack || card.title}</strong></div>
        <div><span>Location</span><strong>{card.city || "Goa"}</strong></div>
        <div><span>Credential</span><strong>{card.idNumber || "HHG-2026"}</strong></div>
      </section>

      <div className="shared-actions">
        <button type="button" className="btn btn-y" onClick={download}>Download PNG</button>
        <button type="button" className="btn btn-pink" onClick={share}>Share Card</button>
        <button type="button" className="btn btn-ghost" onClick={copyLink}>Copy Link</button>
        <a href="/?studio=1" className="btn btn-ghost">Create Yours</a>
      </div>
    </main>
  );
}
