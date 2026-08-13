"use client";

export type UiSound = "click" | "open" | "pin" | "success";

const STORAGE_KEY = "hhgoa_sound_enabled";
let audioContext: AudioContext | null = null;

export function isUiSoundEnabled() {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(STORAGE_KEY) !== "0";
}

export function setUiSoundEnabled(enabled: boolean) {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
}

export function playUiSound(kind: UiSound = "click", force = false) {
  if (typeof window === "undefined" || (!force && !isUiSoundEnabled())) return;
  try {
    audioContext ||= new AudioContext();
    const now = audioContext.currentTime;
    const gain = audioContext.createGain();
    const oscillator = audioContext.createOscillator();
    const settings: Record<UiSound, { start: number; end: number; duration: number; volume: number; type: OscillatorType }> = {
      click: { start: 330, end: 390, duration: .055, volume: .035, type: "square" },
      open: { start: 260, end: 520, duration: .11, volume: .045, type: "sine" },
      pin: { start: 520, end: 780, duration: .13, volume: .05, type: "triangle" },
      success: { start: 620, end: 940, duration: .18, volume: .05, type: "sine" },
    };
    const tone = settings[kind];
    oscillator.type = tone.type;
    oscillator.frequency.setValueAtTime(tone.start, now);
    oscillator.frequency.exponentialRampToValueAtTime(tone.end, now + tone.duration);
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(tone.volume, now + .012);
    gain.gain.exponentialRampToValueAtTime(.0001, now + tone.duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + tone.duration + .01);
  } catch {
    // Audio is enhancement-only; navigation must never depend on it.
  }
}
