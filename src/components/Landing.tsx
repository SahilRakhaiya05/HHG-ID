"use client";

import { DEVFOLIO, HHGOA, type Format, type ThemeId } from "@/lib/constants";
import { useApp } from "@/context/AppContext";

export default function Landing() {
  const { setView, patchStudio } = useApp();

  const open = (format: Format, theme?: ThemeId) => {
    patchStudio({
      format,
      ...(theme ? { theme } : {}),
    });
    setView("studio");
  };

  return (
    <div className="view landing landing-min">
      <div className="land-bg" aria-hidden>
        <picture>
          <source media="(max-width: 720px)" srcSet="/image/bg.png" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/image/desktop-bg.jpg" alt="" className="land-img" />
        </picture>
        <div className="land-wash" />
      </div>

      <header className="topnav">
        <a className="brand" href={HHGOA} target="_blank" rel="noopener noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/image/hh-goa-circle-logo.png" alt="" width={34} height={34} />
          <div className="brand-text">
            <strong>Hacker Tracker</strong>
            <span>Goa · 28–31 Oct 2026</span>
          </div>
        </a>
        <div className="topnav-actions">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setView("map")}>
            Map
          </button>
          <a className="btn btn-ghost btn-sm" href={DEVFOLIO} target="_blank" rel="noopener noreferrer">
            Apply
          </a>
          <button type="button" className="btn btn-y btn-sm" onClick={() => open("pass", "official")}>
            Make yours
          </button>
        </div>
      </header>

      <section className="hero hero-min">
        <div className="hero-copy">
          <p className="eyebrow">#FrameInGoa</p>
          <h1>
            one photo.
            <br />
            <em>one frame.</em>
            <br />
            everything in place.
          </h1>
          <p className="lead">
            Free Builder Pass, PFP, or team frame — drawn in your browser. Pin yourself on the map when
            you are ready.
          </p>
          <div className="hero-btns">
            <button type="button" className="btn btn-y" onClick={() => open("pass", "official")}>
              Make yours
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setView("map")}>
              Open map
            </button>
          </div>
          <p className="hero-meta">
            247 seats · apply on{" "}
            <a href={DEVFOLIO} target="_blank" rel="noopener noreferrer">
              Devfolio
            </a>
          </p>
          <div className="tracker-signal" aria-label="Event signal live">
            <i />
            <b>LIVE</b>
            <span>247 BUILDERS</span>
            <span>4 DAYS</span>
            <span>LESS NOISE · MORE SIGNAL</span>
          </div>
          <div className="tracker-stats" aria-label="Event statistics">
            <span><b>247</b> Builders</span>
            <span><b>4</b> Days</span>
            <span><b>28–31</b> Oct</span>
            <span><b>GOA</b> India</span>
          </div>
        </div>
        <div className="hero-preview">
          <div className="hero-bezel">
            <div className="hero-bezel-cap"><span>HHG SIGNAL</span><b>ONLINE</b></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/goa-beach-art.png" alt="Hacker House Goa artwork" />
            <div className="hero-radar-sweep" aria-hidden />
          </div>
        </div>
      </section>

      <section className="formats formats-min" aria-label="Formats">
        <p className="formats-label">Choose a format</p>
        <div className="format-row">
          <button type="button" className="format-chip on" onClick={() => open("pass", "official")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/hh-goa-circle-logo.png" alt="" width={22} height={22} />
            <span>Builder Pass</span>
          </button>
          <button type="button" className="format-chip" onClick={() => open("pass", "relay")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/frame-in-goa-stamp.png" alt="" width={22} height={22} />
            <span>Builder ID</span>
          </button>
          <button type="button" className="format-chip" onClick={() => open("pfp")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/frame-template.jpg" alt="" width={22} height={22} />
            <span>PFP frame</span>
          </button>
          <button type="button" className="format-chip" onClick={() => open("team")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/mobile-header-banner.png" alt="" width={22} height={22} />
            <span>Team frame</span>
          </button>
          <button type="button" className="format-chip" onClick={() => open("pass", "signal")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/goa-beach-art.png" alt="" width={22} height={22} />
            <span>Signal</span>
          </button>
        </div>
      </section>

      <footer className="foot foot-min">
        <a href={HHGOA} target="_blank" rel="noopener noreferrer">
          hhgoa.com
        </a>
        <a href={DEVFOLIO} target="_blank" rel="noopener noreferrer">
          Devfolio
        </a>
        <a href="/admin">Admin</a>
        <strong>#FrameInGoa</strong>
      </footer>
    </div>
  );
}
