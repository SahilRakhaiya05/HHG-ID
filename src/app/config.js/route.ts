import { readFile } from "node:fs/promises";
import path from "node:path";

const FALLBACK = "window.HHGOA_CONFIG = {};";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "config.js");
    const contents = await readFile(filePath, "utf8");
    return new Response(contents, {
      headers: {
        "content-type": "application/javascript; charset=utf-8",
        "cache-control": "no-store, max-age=0",
      },
    });
  } catch {
    return new Response(FALLBACK, {
      headers: {
        "content-type": "application/javascript; charset=utf-8",
        "cache-control": "no-store, max-age=0",
      },
    });
  }
}