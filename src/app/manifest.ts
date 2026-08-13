import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hacker Tracker · HH Goa 2026",
    short_name: "Hacker Tracker",
    description: "Create your HH Goa Builder Pass, join the builder map, and share #FrameInGoa.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#02140c",
    theme_color: "#0b6839",
    orientation: "any",
    categories: ["social", "entertainment", "utilities"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
