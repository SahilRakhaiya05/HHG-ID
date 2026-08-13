"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import { HQ, type Pin } from "@/lib/constants";
import { useApp } from "@/context/AppContext";
import { playUiSound } from "@/lib/ui-sound";

const PLACES: Record<string, { lat: number; lng: number; label: string }> = {
  goa: { lat: 15.2993, lng: 74.124, label: "Goa" },
  mumbai: { lat: 19.076, lng: 72.8777, label: "Mumbai" },
  bengaluru: { lat: 12.9716, lng: 77.5946, label: "Bengaluru" },
  bangalore: { lat: 12.9716, lng: 77.5946, label: "Bengaluru" },
  delhi: { lat: 28.6139, lng: 77.209, label: "Delhi" },
  hyderabad: { lat: 17.385, lng: 78.4867, label: "Hyderabad" },
  pune: { lat: 18.5204, lng: 73.8567, label: "Pune" },
  chennai: { lat: 13.0827, lng: 80.2707, label: "Chennai" },
  kolkata: { lat: 22.5726, lng: 88.3639, label: "Kolkata" },
  london: { lat: 51.5072, lng: -0.1276, label: "London" },
  singapore: { lat: 1.3521, lng: 103.8198, label: "Singapore" },
  dubai: { lat: 25.2048, lng: 55.2708, label: "Dubai" },
  "san francisco": { lat: 37.7749, lng: -122.4194, label: "San Francisco" },
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[char] || char);
}

function kindOf(pin: Pin) {
  if (pin.kind === "hq") return "hq";
  if (pin.kind === "pick") return "pick";
  if (pin.isSelf || pin.kind === "you") return "you";
  return "builder";
}

function markerIcon(pin: Pin) {
  const kind = kindOf(pin);
  const initials = pin.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "•";
  const content = pin.photo
    ? `<span class="real-marker-initials">${escapeHtml(initials)}</span><img src="${escapeHtml(pin.photo)}" alt="" loading="lazy" onerror="this.style.display='none'" />`
    : kind === "hq"
      ? "HH"
      : escapeHtml(initials);
  const badge = kind === "hq" ? "HQ" : kind === "you" ? "YOU" : "BUILDER";
  const iconSize: [number, number] = kind === "hq" ? [82, 96] : [60, 76];
  const iconAnchor: [number, number] = kind === "hq" ? [41, 88] : [30, 70];
  return L.divIcon({
    className: `real-map-marker real-map-marker--${kind}`,
    html: `<span class="real-marker-body"><span class="real-marker-halo"></span><span class="real-marker-ring ring-a"></span><span class="real-marker-ring ring-b"></span><span class="real-marker-badge">${badge}</span><span class="real-marker-face">${content}</span><span class="real-marker-tip"></span><span class="real-marker-label">${escapeHtml(pin.name)}</span></span>`,
    iconSize,
    iconAnchor,
  });
}

function selectedIcon() {
  return L.divIcon({
    className: "real-map-marker real-map-marker--pick",
    html: '<span class="real-marker-body"><span class="real-marker-halo"></span><span class="real-marker-ring ring-a"></span><span class="real-marker-ring ring-b"></span><span class="real-marker-badge">NEW PIN</span><span class="real-marker-face"><i class="pick-crosshair"></i></span><span class="real-marker-tip"></span><span class="real-marker-label">Selected location</span></span>',
    iconSize: [66, 82],
    iconAnchor: [33, 76],
  });
}

export default function SimpleMapView() {
  const {
    pins,
    pickMode,
    setPickMode,
    pick,
    setPick,
    lockLocation,
    setView,
    selectedPin,
    setSelectedPin,
    setReturnAfterPick,
    setAutoPinAfterPick,
    showToast,
  } = useApp();
  const mapNodeRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.MarkerClusterGroup | null>(null);
  const priorityLayerRef = useRef<L.LayerGroup | null>(null);
  const pickMarkerRef = useRef<L.Marker | null>(null);
  const pickModeRef = useRef(pickMode);
  const [search, setSearch] = useState("");
  const [ready, setReady] = useState(false);
  const [tileState, setTileState] = useState<"loading" | "fallback" | "ready" | "error">("loading");
  const [searching, setSearching] = useState(false);

  const moveMap = useCallback((lat: number, lng: number, zoom: number) => {
    const map = mapRef.current;
    if (!map) return;
    map.stop();
    map.invalidateSize({ pan: true, animate: false });
    map.setView([lat, lng], zoom, { animate: false });
    window.requestAnimationFrame(() => {
      if (mapRef.current === map) map.invalidateSize({ pan: true, animate: false });
    });
  }, []);

  const allPins = useMemo<Pin[]>(
    () => [
      {
        id: "hq",
        kind: "hq",
        name: "Hacker House Goa HQ",
        stack: "Four-day builder residency",
        title: "Main location · 28–31 Oct",
        handle: "",
        city: "Goa, India",
        idNumber: "HHG-2026-HQ00",
        format: "pass",
        lat: HQ.lat,
        lng: HQ.lng,
        photo: "/image/hh-goa-circle-logo.png",
        cardUrl: null,
        createdAt: "",
      },
      {
        id: "radar-mumbai",
        kind: "builder",
        name: "Mumbai Builder Radar",
        stack: "Community signal",
        title: "Builder Radar",
        handle: "",
        city: "Mumbai, India",
        idNumber: "HHG-RADAR-MUM",
        format: "pass",
        lat: 19.076,
        lng: 72.8777,
        photo: "/image/frame-in-goa-stamp.png",
        cardUrl: null,
        createdAt: "",
      },
      {
        id: "radar-bengaluru",
        kind: "builder",
        name: "Bengaluru Build Node",
        stack: "Build · Ship · Repeat",
        title: "Builder Node",
        handle: "",
        city: "Bengaluru, India",
        idNumber: "HHG-RADAR-BLR",
        format: "pass",
        lat: 12.9716,
        lng: 77.5946,
        photo: "/image/hh-goa-circle-logo.png",
        cardUrl: null,
        createdAt: "",
      },
      {
        id: "radar-singapore",
        kind: "builder",
        name: "Coastal Signal",
        stack: "Global builder network",
        title: "Signal Node",
        handle: "",
        city: "Singapore",
        idNumber: "HHG-RADAR-SG",
        format: "pass",
        lat: 1.3521,
        lng: 103.8198,
        photo: "/image/goa-beach-art.png",
        cardUrl: null,
        createdAt: "",
      },
      ...pins,
    ],
    [pins]
  );

  useEffect(() => {
    pickModeRef.current = pickMode;
  }, [pickMode]);

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) return;
    const map = L.map(mapNodeRef.current, {
      zoomControl: false,
      attributionControl: true,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true,
    }).setView([20, 8], 2);

    let disposed = false;
    let activeTiles: L.TileLayer | null = null;
    let fallbackLoaded = false;
    let primaryErrors = 0;
    let fallbackErrors = 0;
    let tileTimer: number | null = null;

    const markTileReady = () => {
      if (disposed) return;
      if (tileTimer) window.clearTimeout(tileTimer);
      setTileState("ready");
    };
    const loadFallbackTiles = () => {
      if (disposed || fallbackLoaded) return;
      fallbackLoaded = true;
      setTileState("fallback");
      if (tileTimer) window.clearTimeout(tileTimer);
      activeTiles?.removeFrom(map);
      const fallbackTiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        crossOrigin: true,
      });
      fallbackTiles.on("load", markTileReady);
      fallbackTiles.on("tileerror", () => {
        fallbackErrors += 1;
        if (fallbackErrors >= 2 && !disposed) setTileState("error");
      });
      activeTiles = fallbackTiles.addTo(map);
      tileTimer = window.setTimeout(() => {
        if (!disposed) setTileState("error");
      }, 10000);
    };

    const darkTiles = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO',
      subdomains: "abcd",
      maxZoom: 20,
      crossOrigin: true,
    });
    darkTiles.on("load", markTileReady);
    darkTiles.on("tileerror", () => {
      primaryErrors += 1;
      if (primaryErrors >= 2) loadFallbackTiles();
    });
    activeTiles = darkTiles.addTo(map);
    tileTimer = window.setTimeout(loadFallbackTiles, 8000);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    markerLayerRef.current = L.markerClusterGroup({
      maxClusterRadius: 54,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      spiderfyDistanceMultiplier: 1.35,
      removeOutsideVisibleBounds: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          className: "real-marker-cluster",
          html: `<span class="cluster-halo"></span><span class="cluster-ring"></span><span class="cluster-core"><b>${count}</b><small>SIGNALS</small></span>`,
          iconSize: [62, 70],
          iconAnchor: [31, 35],
        });
      },
    }).addTo(map);
    priorityLayerRef.current = L.layerGroup().addTo(map);

    map.on("click", ({ latlng }) => {
      if (!pickModeRef.current) return;
      setPick({ lat: latlng.lat, lng: latlng.lng, label: "Selected" });
    });
    map.whenReady(() => {
      setReady(true);
      window.requestAnimationFrame(() => map.invalidateSize(false));
    });
    mapRef.current = map;

    const resizeMap = () => map.invalidateSize({ pan: true, animate: false });
    const resizeObserver = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(() => window.requestAnimationFrame(resizeMap));
    resizeObserver?.observe(mapNodeRef.current);
    window.addEventListener("resize", resizeMap);
    window.addEventListener("orientationchange", resizeMap);

    return () => {
      disposed = true;
      if (tileTimer) window.clearTimeout(tileTimer);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resizeMap);
      window.removeEventListener("orientationchange", resizeMap);
      pickMarkerRef.current?.remove();
      markerLayerRef.current?.clearLayers();
      priorityLayerRef.current?.clearLayers();
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
      priorityLayerRef.current = null;
    };
    // Map instance is intentionally created once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markerLayerRef.current;
    const priorityLayer = priorityLayerRef.current;
    if (!map || !layer || !priorityLayer || !ready) return;
    layer.clearLayers();
    priorityLayer.clearLayers();
    allPins.forEach((pin) => {
      if (!Number.isFinite(pin.lat) || !Number.isFinite(pin.lng)) return;
      const pinKind = kindOf(pin);
      const marker = L.marker([pin.lat, pin.lng], {
        icon: markerIcon(pin),
        keyboard: true,
        bubblingMouseEvents: false,
        title: pin.name,
        zIndexOffset: pinKind === "hq" ? 2400 : pinKind === "you" ? 1800 : 0,
      })
        .on("click", () => {
          playUiSound("click");
          setSelectedPin(pin);
          moveMap(pin.lat, pin.lng, Math.max(map.getZoom(), 5));
        });
      if (pinKind === "hq" || pinKind === "you") marker.addTo(priorityLayer);
      else marker.addTo(layer);
    });
  }, [allPins, moveMap, ready, setSelectedPin]);

  useEffect(() => {
    const map = mapRef.current;
    pickMarkerRef.current?.remove();
    pickMarkerRef.current = null;
    if (!map || !pickMode || pick.lat == null || pick.lng == null) return;
    pickMarkerRef.current = L.marker([pick.lat, pick.lng], {
      icon: selectedIcon(),
      keyboard: false,
      interactive: false,
    }).addTo(map);
  }, [pickMode, pick]);

  const choose = (lat: number, lng: number, label: string) => {
    playUiSound("pin");
    setPickMode(true);
    setPick({ lat, lng, label });
    moveMap(lat, lng, 8);
  };

  const searchPlace = async () => {
    const query = search.trim().toLowerCase();
    if (!query || searching) return;
    const coordinate = query.match(/^\s*(-?\d+(?:\.\d+)?)\s*[, ]\s*(-?\d+(?:\.\d+)?)\s*$/);
    if (coordinate) {
      const lat = Number(coordinate[1]);
      const lng = Number(coordinate[2]);
      if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
        choose(lat, lng, "Coordinates");
        return;
      }
    }
    const place = PLACES[query];
    if (place) {
      choose(place.lat, place.lng, place.label);
      return;
    }
    try {
      setSearching(true);
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 8000);
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(search.trim())}`, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      window.clearTimeout(timeout);
      if (!response.ok) throw new Error(`Search failed: ${response.status}`);
      const results = await response.json();
      const result = results?.[0];
      if (!result) {
        showToast("Place not found · try city, country, or lat,lng");
        return;
      }
      const lat = Number(result.lat);
      const lng = Number(result.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) throw new Error("Invalid search coordinates");
      choose(lat, lng, String(result.display_name || search.trim()).split(",")[0]);
    } catch {
      showToast("Search unavailable · try lat,lng");
    } finally {
      setSearching(false);
    }
  };

  const useGps = () => {
    if (!navigator.geolocation) {
      showToast("GPS unavailable");
      return;
    }
    showToast("Reading GPS…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        choose(coords.latitude, coords.longitude, "GPS");
        showToast("GPS location ready");
      },
      () => showToast("GPS permission denied")
    );
  };

  const handleStagePick = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    const map = mapRef.current;
    if (!map || !pickMode) return;
    const target = event.target as HTMLElement;
    if (target.closest("button, input, a, .leaflet-control, .leaflet-marker-icon, .pick-bar, .pin-popup, .real-map-tools, .real-map-search")) return;
    const mapNode = mapNodeRef.current;
    if (!mapNode) return;
    const rect = mapNode.getBoundingClientRect();
    const point = L.point(event.clientX - rect.left, event.clientY - rect.top);
    const latlng = map.containerPointToLatLng(point);
    playUiSound("pin");
    setPick({ lat: latlng.lat, lng: latlng.lng, label: "Selected" });
  }, [pickMode, setPick]);

  return (
    <div className="view mapview real-map-view">
      <header className="bar map-bar">
        <button type="button" className="link-btn" onClick={() => setView("landing")}>Home</button>
        <div className="map-title">
          <span className="live-dot" />
          <strong>Builder map</strong>
          <span className="count">{allPins.length}</span>
        </div>
        <button type="button" className="btn btn-sm btn-y" onClick={() => setView("studio")}>Create</button>
      </header>

      <div className="real-map-stage" onClick={handleStagePick}>
        <div ref={mapNodeRef} className="real-world-map" aria-label="Real world builder map" />
        <div className="map-tint" aria-hidden />
        <div className="crt-grid" aria-hidden />
        <div className="crt-scan" aria-hidden />
        <div className="frame-corners" aria-hidden>
          <i className="fc tl" /><i className="fc tr" /><i className="fc bl" /><i className="fc br" />
        </div>

        <div className="ticker" aria-hidden>
          <div className="ticker-inner">
            <span>WORLD SIGNAL ACTIVE · {allPins.length} BUILDER SIGHTINGS · HH GOA 2026 · </span>
            <span>PIN YOUR FRAME · SHARE #FRAMEINGOA · LESS NOISE · MORE SIGNAL · </span>
          </div>
        </div>

        <div className="real-map-status">
          <span className={`chip ${pickMode ? "chip-y" : tileState === "error" ? "chip-error" : "chip-live"}`}><i />{pickMode ? "Tap map to place pin" : tileState === "ready" ? "Live world map" : tileState === "fallback" ? "Loading backup map" : tileState === "error" ? "Map tiles unavailable" : ready ? "Loading map tiles" : "Starting map"}</span>
          <span className="chip chip-dim">{allPins.length} signals</span>
        </div>

        <div className="real-map-search">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchPlace()}
            placeholder="Search city or lat,lng"
            aria-label="Search city or coordinates"
          />
          <button type="button" className="btn btn-sm btn-y" disabled={searching} onClick={searchPlace}>{searching ? "Finding…" : "Find"}</button>
        </div>

        <div className="real-map-tools">
          <button type="button" className="rail-btn" title="World" onClick={() => moveMap(20, 8, 2)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}<img src="/assets/map-pins-set.png" alt="" /><span>World</span>
          </button>
          <button type="button" className="rail-btn" title="Goa HQ" onClick={() => moveMap(HQ.lat, HQ.lng, 10)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}<img src="/assets/pin-hq.svg" alt="" /><span>HQ</span>
          </button>
          <button type="button" className={`rail-btn ${pickMode ? "on" : ""}`} title="Pick location" onClick={() => { setPickMode(true); showToast("Tap the map to set your pin"); }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}<img src="/image/frame-in-goa-stamp.png" alt="" /><span>Pin</span>
          </button>
          <button type="button" className="rail-btn" title="Use GPS" onClick={useGps}>
            {/* eslint-disable-next-line @next/next/no-img-element */}<img src="/assets/pin-you.svg" alt="" /><span>GPS</span>
          </button>
        </div>

        <div className="radar-box" aria-hidden>
          <svg id="mini-radar" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" /><circle cx="50" cy="50" r="30" /><circle cx="50" cy="50" r="16" />
            <path d="M50 6v88M6 50h88M19 19l62 62M81 19 19 81" />
            <path className="radar-sweep-line" d="M50 50 84 18" />
            <circle className="radar-dot" cx="74" cy="32" r="3" /><circle className="radar-dot alt" cx="29" cy="68" r="2.5" />
          </svg>
          <span className="radar-cap">LIVE</span>
        </div>

        {pickMode && (
          <div className="pick-bar" role="status">
            <div className="pick-copy">
              <strong>Select location</strong>
              <span>{pick.lat == null ? "Tap map, search a city, or use GPS" : `${pick.label || "Selected"} · ${pick.lat.toFixed(4)}, ${pick.lng?.toFixed(4)}`}</span>
            </div>
            <div className="pick-btns">
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => { setPickMode(false); setReturnAfterPick(false); setAutoPinAfterPick(false); }}>Cancel</button>
              <button type="button" className="btn btn-sm btn-y" disabled={pick.lat == null} onClick={lockLocation}>Confirm</button>
            </div>
          </div>
        )}

        {selectedPin && (
          <div className="pin-popup real-pin-popup" role="dialog" aria-label="Builder pin">
            <button type="button" className="pin-popup-x" onClick={() => setSelectedPin(null)} aria-label="Close">×</button>
            <div className="pin-popup-art">
              {selectedPin.photo || selectedPin.cardUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={selectedPin.cardUrl ? "is-card" : "is-photo"} src={selectedPin.cardUrl || selectedPin.photo || ""} alt={`${selectedPin.name} builder card`} loading="lazy" />
              ) : <div className="pin-popup-fallback" />}
            </div>
            <div className="pin-popup-body">
              <span className="badge">{selectedPin.kind === "hq" ? "HQ" : selectedPin.isSelf || selectedPin.kind === "you" ? "You" : "Builder"}</span>
              <span className={`storage-badge ${selectedPin.cardUrl ? "cloud" : "local"}`}>{selectedPin.cardUrl ? "Cloud image" : "Local image"}</span>
              <h3>{selectedPin.name}</h3>
              <p>{[selectedPin.stack, selectedPin.city].filter(Boolean).join(" · ") || "—"}</p>
              <p className="ptitle">{selectedPin.title}</p>
              <p className="pid">{selectedPin.idNumber}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
