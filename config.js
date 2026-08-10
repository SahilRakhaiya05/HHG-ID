/**
 * HH Goa Frame · config
 *
 * 1. Create a free Supabase project: https://supabase.com
 * 2. Run supabase/schema.sql in the SQL editor
 * 3. Create a Storage bucket named `pins` (public)
 * 4. Paste URL + anon key below
 * 5. Set admin password (used only client-side for admin.html — change before deploy)
 *
 * Without Supabase the app still works: pins save in localStorage only.
 */
window.HHGOA_CONFIG = {
  supabaseUrl: "", // e.g. "https://xxxx.supabase.co"
  supabaseAnonKey: "", // anon public key
  adminPassword: "hhgoa2026", // change this
  event: {
    name: "Hacker House Goa 2026",
    hashtag: "#FrameInGoa",
    dates: "28–31 Oct 2026",
    hq: { lat: 15.5736, lng: 73.7419, label: "HH Goa HQ" },
  },
};
