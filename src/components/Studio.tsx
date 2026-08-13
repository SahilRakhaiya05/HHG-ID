"use client";

import { useEffect, useRef, useState } from "react";
import {
  CLASSES,
  MOODS,
  type FilterId,
  type FinishId,
  type Format,
  type ThemeId,
} from "@/lib/constants";
import { useApp } from "@/context/AppContext";
import {
  cardSize,
  fileToImage,
  genIdNumber,
  previewLabel,
  renderCard,
  type RenderState,
} from "@/lib/render/card";
import { HASHTAG } from "@/lib/constants";
import { playUiSound } from "@/lib/ui-sound";
import { createSharedCard } from "@/lib/supabase/shared-cards";

export default function Studio() {
  const {
    studio,
    patchStudio,
    assets,
    setView,
    setPickMode,
    setReturnAfterPick,
    autoPinAfterPick,
    setAutoPinAfterPick,
    showToast,
    dropPin,
  } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [qrCanvas, setQrCanvas] = useState<HTMLCanvasElement | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  const renderState = (): RenderState => ({
    format: studio.format,
    theme: studio.theme,
    filter: studio.filter,
    finish: studio.finish,
    name: studio.name,
    stack: studio.stack,
    titleId: studio.titleId,
    handle: studio.handle,
    city: studio.city,
    mood: studio.mood,
    lat: studio.lat,
    lng: studio.lng,
    idNumber: studio.idNumber,
    zoom: studio.zoom,
    panX: studio.panX,
    panY: studio.panY,
    image: studio.image,
    teamSlots: studio.teamSlots,
    teamCount: studio.teamCount,
    passTpl: assets.passTpl,
    goaArt: assets.goaArt,
    cardBg: assets.cardBg,
    pfpTemplate: assets.pfpTemplate,
    goaLogo: assets.goaLogo,
    frameStamp: assets.frameStamp,
    stickers: assets.stickers,
    logoMark: assets.logoMark,
    sealMark: assets.sealMark,
    hackerMan: assets.hackerMan,
    qrCanvas,
  });

  useEffect(() => {
    let cancelled = false;
    const canvas = document.createElement("canvas");
    const payload = [
      "HACKER HOUSE GOA 2026",
      `BUILDER ID: ${studio.idNumber}`,
      `NAME: ${studio.name.trim() || "BUILDER"}`,
      `STACK: ${studio.stack.trim() || "BUILDER"}`,
      studio.handle.trim() ? `X: ${studio.handle.trim()}` : "",
      studio.locationSet && studio.lat != null && studio.lng != null
        ? `LOCATION: ${studio.lat.toFixed(5)},${studio.lng.toFixed(5)}`
        : "",
      "#FrameInGoa",
    ].filter(Boolean).join("\n");
    import("qrcode")
      .then((QRCode) => QRCode.toCanvas(canvas, payload, {
        width: 220,
        margin: 2,
        errorCorrectionLevel: "M",
        color: { dark: "#111310", light: "#F5EDD6" },
      }))
      .then(() => { if (!cancelled) setQrCanvas(canvas); })
      .catch(() => { if (!cancelled) setQrCanvas(null); });
    return () => { cancelled = true; };
  }, [studio.idNumber, studio.name, studio.stack, studio.handle, studio.locationSet, studio.lat, studio.lng]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderCard(canvas, renderState());
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled && canvasRef.current) renderCard(canvasRef.current, renderState());
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studio, assets, qrCanvas]);

  useEffect(() => {
    setPublishedUrl(null);
  }, [studio]);

  useEffect(() => {
    if (!autoPinAfterPick || !studio.image || !studio.locationSet) return;
    if (studio.format === "pass" && studio.theme === "official" && !qrCanvas) return;
    const timer = window.setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) renderCard(canvas, renderState());
      setAutoPinAfterPick(false);
      dropPin(canvas);
    }, 100);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPinAfterPick, studio.image, studio.locationSet, studio.lat, studio.lng, qrCanvas]);

  const onFile = async (file?: File | null) => {
    if (!file) return;
    try {
      setBusy(true);
      const img = await fileToImage(file);
      patchStudio({
        image: img,
        idNumber: studio.image ? studio.idNumber : genIdNumber(file.name),
      });
      playUiSound("success");
      showToast("Photo loaded · pass created automatically");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Could not load image");
    } finally {
      setBusy(false);
    }
  };

  const download = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !studio.image) {
      showToast("Upload a photo first");
      return;
    }
    if (studio.format === "pass" && studio.theme === "official" && !qrCanvas) {
      showToast("Preparing your verification QR…");
      return;
    }
    renderCard(canvas, renderState());
    const a = document.createElement("a");
    a.download = `hhgoa-${studio.format}-${(studio.name || "builder").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
    playUiSound("success");
    showToast("Downloaded");
  };

  const publishCurrentCard = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !studio.image) {
      showToast("Upload a photo first");
      return null;
    }
    if (studio.format === "pass" && studio.theme === "official" && !qrCanvas) {
      showToast("Preparing your verification QR…");
      return null;
    }
    renderCard(canvas, renderState());
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
    if (!blob) return null;
    if (publishedUrl) return { blob, url: publishedUrl };
    setPublishing(true);
    showToast("Publishing your 3D Builder Card…");
    try {
      const shared = await createSharedCard(blob, studio);
      if (!shared) {
        showToast("Could not publish link · check Supabase frames schema");
        return { blob, url: "" };
      }
      const url = `${window.location.origin}/card/${shared.id}`;
      setPublishedUrl(url);
      playUiSound("success");
      showToast("3D Builder Card published");
      return { blob, url };
    } finally {
      setPublishing(false);
    }
  };

  const shareX = async () => {
    const published = await publishCurrentCard();
    if (!published) return;
    const { blob, url } = published;
    const text = `${studio.name.trim() || "Goa Builder"} · ${studio.idNumber}\nLocked in for Hacker House Goa 2026\n\n${HASHTAG}`;
    if (blob && navigator.share && navigator.canShare?.({ files: [new File([blob], "frame.png", { type: "image/png" })] })) {
      try {
        await navigator.share({
          text,
          url: url || undefined,
          files: [new File([blob], "hhgoa-frame.png", { type: "image/png" })],
        });
        return;
      } catch {
        /* fall through */
      }
    }
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}${url ? `&url=${encodeURIComponent(url)}` : ""}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const copyShareLink = async () => {
    const published = await publishCurrentCard();
    if (!published?.url) return;
    await navigator.clipboard.writeText(published.url);
    playUiSound("success");
    showToast("3D card link copied");
  };

  const size = cardSize(studio);
  const needsQr = studio.format === "pass" && studio.theme === "official";
  const ready = !!studio.image && (!needsQr || !!qrCanvas);
  const readinessLabel = !studio.image ? "Photo needed" : needsQr && !qrCanvas ? "Preparing QR" : "Ready";
  const isPortrait =
    studio.format === "pass" && ["signal", "wave", "sand", "neon"].includes(studio.theme);
  const previewShape =
    studio.format === "pfp"
      ? "square"
      : studio.format === "team"
        ? "wide"
        : isPortrait
          ? "portrait"
          : "landscape";

  return (
    <div className="view studio">
      <header className="bar">
        <button type="button" className="link-btn" onClick={() => setView("landing")}>
          Home
        </button>
        <strong className="bar-title">Studio</strong>
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => setView("map")}>
          Map
        </button>
      </header>

      <div className="studio-intro">
        <p className="kicker">The studio</p>
        <h2>Upload a photo. Take the frame. Post it.</h2>
        <p className="studio-lede">
          JPG, PNG, WebP, HEIC. Drawn on your device. Pin yourself when you are ready.
        </p>
        <div className="studio-protocol" aria-label="Builder pass workflow">
          <span><b>01</b> Photo</span>
          <span><b>02</b> Signal</span>
          <span><b>03</b> Pin</span>
        </div>
      </div>

      <div className="studio-layout">
        <section className={`preview-col preview-col--${previewShape}`}>
          <div className="preview-head">
            <h2>{previewLabel(studio)}</h2>
            <div className="preview-meta">
              <span className={`preview-ready ${ready ? "is-ready" : ""}`}>
                {readinessLabel}
              </span>
              <span>{size.label}</span>
            </div>
          </div>
          <div
            className={`preview-wrap ${studio.format === "pass" && studio.theme === "official" ? "official-frame" : ""} ${isPortrait ? "is-portrait" : ""} ${studio.format === "pfp" ? "is-pfp" : ""} ${studio.format === "team" ? "is-team" : ""}`}
            role="button"
            tabIndex={0}
            onClick={() => fileRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileRef.current?.click();
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onFile(e.dataTransfer.files?.[0]);
            }}
            aria-label="Frame preview. Click or drop a photo."
          >
            <canvas
              ref={canvasRef}
              className="preview-canvas"
              width={size.w}
              height={size.h}
            />
          </div>
          <p className="preview-hint">Tap the frame or drop a photo</p>
          <div className="preview-actions">
            <button type="button" className="btn btn-y" disabled={!ready} onClick={download}>
              Download PNG
            </button>
            <button type="button" className="btn btn-ghost" disabled={!ready} onClick={shareX}>
              Share to X
            </button>
            <button type="button" className="btn btn-ghost" disabled={!ready || publishing} onClick={copyShareLink}>
              {publishing ? "Publishing…" : "Copy 3D Link"}
            </button>
            {publishedUrl && <a className="btn btn-pink" href={publishedUrl} target="_blank" rel="noopener noreferrer">Open 3D Card</a>}
          </div>
        </section>

        <aside className="form-col">
          <section className="stu-block">
            <header className="stu-head">
              <span className="kicker kicker-pink">Choose</span>
              <h3>Format</h3>
            </header>
            <div className="pill-row" role="group" aria-label="Format">
              {(
                [
                  ["pass", "Builder Pass"],
                  ["pfp", "PFP frame"],
                  ["team", "Team frame"],
                ] as [Format, string][]
              ).map(([f, label]) => (
                <button
                  key={f}
                  type="button"
                  className={`pill ${studio.format === f ? "on" : ""}`}
                  aria-pressed={studio.format === f}
                  onClick={() => patchStudio({ format: f })}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section className="stu-block">
            <header className="stu-head">
              <span className="kicker kicker-pink">Upload</span>
              <h3>Photo</h3>
            </header>
            <div
              className="drop"
              role="button"
              tabIndex={0}
              onClick={() => fileRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
              }}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*,.heic,.heif"
                hidden
                onChange={(e) => onFile(e.target.files?.[0])}
              />
              {!studio.image ? (
                <div>
                  <div className="drop-ico">↑</div>
                  <strong>Drop photo here</strong>
                  <span>or click to choose a file</span>
                </div>
              ) : (
                <div id="drop-has">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img id="thumb" src={studio.image.src} alt="Your photo" />
                  <span className="link-btn">Change photo</span>
                </div>
              )}
            </div>
            <div className="btn-row photo-actions">
              <button
                type="button"
                className="btn btn-pink btn-sm"
                disabled={busy}
                onClick={() => fileRef.current?.click()}
              >
                Upload
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={async () => {
                  try {
                    const img = await (await import("@/lib/render/card")).loadImg(
                      "/assets/hacker-man.svg"
                    );
                    patchStudio({ image: img });
                    showToast("Sample loaded");
                  } catch {
                    showToast("Sample unavailable");
                  }
                }}
              >
                Sample
              </button>
            </div>
            <p className="hint-soft">Nothing is uploaded until you pin or share.</p>
          </section>

          {studio.format !== "pfp" && (
            <div className="stu-block fields">
              <header className="stu-head">
                <span className="kicker kicker-pink">Details</span>
                <h3>Your card</h3>
              </header>
              <label className="field">
                Name
                <input
                  value={studio.name}
                  maxLength={36}
                  placeholder="Name on the card"
                  autoComplete="name"
                  onChange={(e) => patchStudio({ name: e.target.value })}
                />
              </label>
              <label className="field">
                Stack
                <input
                  value={studio.stack}
                  maxLength={40}
                  placeholder="e.g. Full-stack · AI"
                  onChange={(e) => patchStudio({ stack: e.target.value })}
                />
              </label>
              <label className="field">
                Builder class
                <div className="field-row">
                  <select
                    value={studio.titleId}
                    onChange={(e) => patchStudio({ titleId: e.target.value })}
                    aria-label="Builder class"
                  >
                    {CLASSES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="icon-btn"
                    title="Shuffle class"
                    aria-label="Shuffle class"
                    onClick={() =>
                      patchStudio({
                        titleId: CLASSES[Math.floor(Math.random() * CLASSES.length)].id,
                      })
                    }
                  >
                    ↻
                  </button>
                </div>
              </label>

              {studio.format === "pass" && (
                <>
                  <p className="label">Card style</p>
                  <div className="pill-row" role="group" aria-label="Card style">
                    {(
                      [
                        ["official", "Builder Pass"],
                        ["relay", "Builder ID"],
                        ["signal", "Signal"],
                        ["wave", "Wave"],
                        ["sand", "Sand"],
                        ["neon", "Neon"],
                      ] as [ThemeId, string][]
                    ).map(([t, label]) => (
                      <button
                        key={t}
                        type="button"
                        className={`pill ${studio.theme === t ? "on" : ""}`}
                        aria-pressed={studio.theme === t}
                        onClick={() => patchStudio({ theme: t })}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="field-2">
                <label className="field">
                  X handle
                  <input
                    value={studio.handle}
                    maxLength={28}
                    placeholder="@you"
                    onChange={(e) => patchStudio({ handle: e.target.value })}
                  />
                </label>
                <label className="field">
                  City
                  <input
                    value={studio.city}
                    maxLength={28}
                    placeholder="City"
                    onChange={(e) => patchStudio({ city: e.target.value })}
                  />
                </label>
              </div>
              <p className="label">Builder mood</p>
              <div className="pill-row mood-row" role="group" aria-label="Builder mood">
                {MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    type="button"
                    className={`pill ${studio.mood === mood.id ? "on" : ""}`}
                    aria-pressed={studio.mood === mood.id}
                    onClick={() => patchStudio({ mood: mood.id })}
                  >
                    {mood.label}
                  </button>
                ))}
              </div>
              <div className="id-chip">
                <span>ID</span>
                <code>{studio.idNumber}</code>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => patchStudio({ idNumber: genIdNumber() })}
                >
                  New ID
                </button>
              </div>
            </div>
          )}

          {studio.format === "team" && (
            <div className="stu-block fields">
              <header className="stu-head">
                <span className="kicker kicker-pink">Crew</span>
                <h3>Team frame</h3>
              </header>
              <label className="field">
                Team size
                <select
                  value={studio.teamCount}
                  onChange={(e) => patchStudio({ teamCount: Number(e.target.value) })}
                >
                  <option value={1}>1 builder</option>
                  <option value={2}>2 builders</option>
                  <option value={3}>3 builders</option>
                </select>
              </label>
              <p className="hint-soft">Builder 1 uses the main photo and name above.</p>
              {[1, 2].map((i) =>
                studio.teamCount > i ? (
                  <div key={i}>
                    <label className="field">
                      Builder {i + 1} photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const img = await fileToImage(f);
                          const teamSlots = [...studio.teamSlots];
                          teamSlots[i] = { ...teamSlots[i], image: img };
                          patchStudio({ teamSlots });
                        }}
                      />
                    </label>
                    <div className="field-2">
                      <label className="field">
                        Name
                        <input
                          value={studio.teamSlots[i]?.name || ""}
                          maxLength={28}
                          onChange={(e) => {
                            const teamSlots = [...studio.teamSlots];
                            teamSlots[i] = { ...teamSlots[i], name: e.target.value };
                            patchStudio({ teamSlots });
                          }}
                        />
                      </label>
                      <label className="field">
                        Stack
                        <input
                          value={studio.teamSlots[i]?.stack || ""}
                          maxLength={28}
                          onChange={(e) => {
                            const teamSlots = [...studio.teamSlots];
                            teamSlots[i] = { ...teamSlots[i], stack: e.target.value };
                            patchStudio({ teamSlots });
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}

          <section className="stu-block look">
            <header className="stu-head">
              <span className="kicker kicker-pink">Style</span>
              <h3>Finish</h3>
            </header>
            <p className="label">Photo treatment</p>
            <div className="pill-row" role="group" aria-label="Photo treatment">
              {(
                [
                  ["natural", "Natural"],
                  ["cel", "Cel"],
                  ["riso", "Riso"],
                ] as [FilterId, string][]
              ).map(([f, label]) => (
                <button
                  key={f}
                  type="button"
                  className={`pill ${studio.filter === f ? "on" : ""}`}
                  aria-pressed={studio.filter === f}
                  onClick={() => patchStudio({ filter: f })}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="label">Theme</p>
            <div className="pill-row" role="group" aria-label="Finish theme">
              {(
                [
                  ["goa", "Goa"],
                  ["night", "Night"],
                  ["sand", "Sand"],
                ] as [FinishId, string][]
              ).map(([f, label]) => (
                <button
                  key={f}
                  type="button"
                  className={`pill ${studio.finish === f ? "on" : ""}`}
                  aria-pressed={studio.finish === f}
                  onClick={() => patchStudio({ finish: f })}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section className="stu-block crop">
            <header className="stu-head">
              <span className="kicker kicker-pink">Frame</span>
              <h3>Photo fit</h3>
            </header>
            <label>
              Zoom
              <input
                type="range"
                min={1}
                max={2.5}
                step={0.01}
                value={studio.zoom}
                onChange={(e) => patchStudio({ zoom: Number(e.target.value) })}
              />
            </label>
            <label>
              Pan X
              <input
                type="range"
                min={-45}
                max={45}
                step={1}
                value={studio.panX}
                onChange={(e) => patchStudio({ panX: Number(e.target.value) })}
              />
            </label>
            <label>
              Pan Y
              <input
                type="range"
                min={-45}
                max={45}
                step={1}
                value={studio.panY}
                onChange={(e) => patchStudio({ panY: Number(e.target.value) })}
              />
            </label>
          </section>

          <section className="stu-block pin-block">
            <header className="stu-head">
              <span className="kicker kicker-pink">Map</span>
              <h3>
                Pin <span className="opt">(optional)</span>
              </h3>
            </header>
            <p className={`pin-hint ${studio.locationSet ? "set" : ""}`}>
              {studio.locationSet && studio.lat != null
                ? `${studio.locationLabel || "Locked"} · ${studio.lat.toFixed(3)}, ${studio.lng?.toFixed(3)}`
                : "Pick a spot on the map, then pin yourself."}
            </p>
            <div className="btn-row">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setAutoPinAfterPick(false);
                  setReturnAfterPick(true);
                  setPickMode(true);
                  setView("map");
                  showToast("Tap the map to set your location");
                }}
              >
                Pick location
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  if (!navigator.geolocation) {
                    showToast("GPS unavailable");
                    return;
                  }
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      patchStudio({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        locationSet: true,
                        locationLabel: "GPS",
                      });
                      showToast("GPS locked");
                    },
                    () => showToast("GPS denied")
                  );
                }}
              >
                Use GPS
              </button>
            </div>
            <button
              type="button"
              className="btn btn-y"
              disabled={!studio.image}
              onClick={() => {
                if (!studio.locationSet) {
                  setAutoPinAfterPick(true);
                  setReturnAfterPick(true);
                  setPickMode(true);
                  setView("map");
                  showToast("Choose a location · pin uploads automatically after confirmation");
                  return;
                }
                const canvas = canvasRef.current;
                if (canvas) renderCard(canvas, renderState());
                dropPin(canvasRef.current);
              }}
            >
              {studio.locationSet ? "Upload pass & pin" : "Create pass & choose pin"}
            </button>
          </section>

          <div className="actions-stack actions-stack-mobile">
            <button type="button" className="btn btn-y" disabled={!ready} onClick={download}>
              Download PNG
            </button>
            <button type="button" className="btn btn-ghost" disabled={!ready} onClick={shareX}>
              Share to X
            </button>
            <button type="button" className="btn btn-ghost" disabled={!ready || publishing} onClick={copyShareLink}>
              {publishing ? "Publishing…" : "Copy 3D Link"}
            </button>
            {publishedUrl && <a className="btn btn-pink" href={publishedUrl} target="_blank" rel="noopener noreferrer">Open 3D Card</a>}
          </div>
        </aside>
      </div>
    </div>
  );
}
