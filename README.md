# Hacker Tracker · HH Goa 2026

Spidey-Tracker–inspired console UI for **Hacker House Goa 2026** Task #1.

Upload a photo → mint a collectible Builder ID or PFP frame → download / share on X / pin on the world map.

**No login. No signup. One pass.**

## Features

- **Console shell** — cyan device bezel, hanging wordmark, side tools, status marquee, mascot (Spidey Tracker layout, HH Goa brand)
- **Boot sequence** — terminal-style loader
- **Builder ID** — Pokémon-style signed foil border, 5 card themes (Emerald / Sunset / Ocean / Neon / Holo)
- **PFP Frame** — circular X avatar
- **Builder map** — CRT map HUD, radar, photo pins, activity log
- **Admin** — hide/delete pins (`admin.html`)

## Formats (Task #1)

| | Format A · PFP Frame | Format B · Builder ID |
|--|--|--|
| Output | 1080×1080 profile picture | 1536×1024 collectible badge |
| Fields | Photo only (+ fit) | Name, stack, class, theme, handle, city |
| Use | X avatar | Timeline post image |

## Flow

1. Upload photo (JPG / PNG / WEBP / HEIC)
2. (ID only) name · stack · class · **theme**
3. Instant live preview
4. **Download PNG**
5. **Share to X** — `#FrameInGoa`
6. Optional: pick location → **Pin me on map**

## Run

```bash
npx --yes serve -l 5173
```

- App: http://localhost:5173  
- Studio: `?studio=1` · PFP: `?studio=1&format=pfp` · Map: `?map=1`  
- Admin: http://localhost:5173/admin.html  

## Supabase (optional)

Without keys, pins work via **localStorage**.

1. Create project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in SQL Editor
3. Storage → New bucket `pins` → **Public**
4. Paste URL + anon key into `config.js`
5. Change `adminPassword` before deploy

## Brand

- Event: [hhgoa.com](https://hhgoa.com) · 28–31 Oct 2026 · Goa
- Hashtag: `#FrameInGoa`
- Colors: deep navy console + HH green / yellow + sky cyan tracker chrome

## Assets

Custom SVGs under `public/assets/`: wordmark, map pins, filter/log icons. Generated hero/mascot/card refs for UI polish.
