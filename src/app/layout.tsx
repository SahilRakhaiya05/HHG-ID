import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  applicationName: "Hacker Tracker",
  title: {
    default: "Hacker Tracker · HH Goa 2026",
    template: "%s · Hacker Tracker",
  },
  description:
    "Build your HH Goa 2026 Builder Pass, PFP, or team frame. Pin yourself on the map. #FrameInGoa",
  keywords: ["Hacker House Goa", "HH Goa 2026", "Builder Pass", "FrameInGoa", "builder map"],
  authors: [{ name: "Hacker House Goa", url: "https://hhgoa.com" }],
  creator: "Hacker House Goa",
  category: "technology",
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false, address: false, email: false },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icons/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/icons/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/icons/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
    other: [{ rel: "mask-icon", url: "/assets/hacker-tracker-mark.svg", color: "#0b6839" }],
  },
  appleWebApp: {
    capable: true,
    title: "Hacker Tracker",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Hacker Tracker · HH Goa 2026",
    description: "Builder Pass & PFP frame for Hacker House Goa 2026.",
    url: "/",
    siteName: "Hacker Tracker",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/assets/BuilderPass.png", width: 1536, height: 1024, alt: "HH Goa 2026 Builder Pass" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hacker Tracker · HH Goa 2026",
    description: "Create your Builder Pass and join the HH Goa builder map. #FrameInGoa",
    images: ["/assets/BuilderPass.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b6839",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="/config.js" strategy="beforeInteractive" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Imbue:opsz,wght@10..100,500..700&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700;800&family=Victor+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
