# Hacker Tracker · HH Goa 2026

Frame-in-Goa style ID / PFP / team generator + builder map.  
Branded for [hhgoa.com](https://hhgoa.com) (green `#0b6839` · yellow `#fee101` · pink `#ff0080`).

## Reverse-engineered references

| Site | Patterns adopted |
|------|------------------|
| [hhg-t1.vercel.app](https://hhg-t1.vercel.app/) | Builder title marquee, PFP + Builder Pass dual format, punchy class names |
| [hhg-id-card.vercel.app](https://hhg-id-card.vercel.app/) | Privacy-first upload, webcam path, dark green studio |
| [frame-in-goa-theta.vercel.app](https://frame-in-goa-theta.vercel.app/) | **PFP / Builder ID / Team**, Natural·Cel·Riso filters, Goa·Night·Sand finish, agenda, FAQ, Devfolio CTA |

## Formats

| Format | Size | Notes |
|--------|------|--------|
| Builder Pass | 1536×1024 | Official `BuilderPass.png` template |
| Signal Card | 1080×1512 | Creative vertical badge (foil + signed) |
| PFP frame | 1080×1080 | Circular X avatar + finish theme |
| Team frame | 1200×630 | 1–3 builders (timeline card) |

## Studio extras

- Photo treatment: **Natural · Cel · Riso**
- Finish: **Goa · Night · Sand**
- Selfie (webcam) + Sample
- Map pin (localStorage and/or Supabase)

## Run

```bash
npm install
npm run dev
```

- App: http://localhost:3000
- Admin: http://localhost:3000/admin
- Production validation: `npm run build`

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. SQL Editor → paste & run `supabase/schema.sql`
3. The schema creates/updates the public **`pins`** storage bucket and required RLS policies.
4. Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
ADMIN_PASSWORD=choose-a-strong-password
```

Without Supabase, pins still work via **localStorage**.

Public clients can read visible pins and insert unique pin/images only. Update/delete moderation runs through the server-only `/api/admin/pins` route using `SUPABASE_SERVICE_ROLE_KEY`.

After changing policies, rerun the complete `supabase/schema.sql`, then verify:

```bash
npm run verify:supabase
npm run verify:supabase-security
```

Both commands create temporary probe data and clean it with the service role. The security command must report that anonymous pin updates and storage deletes are denied.

## Deploy to Vercel

1. Import the repository into Vercel.
2. Add all five environment variables above; set `NEXT_PUBLIC_SITE_URL` to the production HTTPS URL.
3. Run the latest `supabase/schema.sql` in Supabase SQL Editor.
4. Deploy. Vercel uses `npm run build` automatically.
5. Verify `/`, `/admin`, the world map, and one test pin upload.

Never expose `SUPABASE_SERVICE_ROLE_KEY` or `ADMIN_PASSWORD` with a `NEXT_PUBLIC_` prefix.

## Privacy

Frames render **on-device**. Supabase is only used if you pin/share with keys configured (card thumb + row).
