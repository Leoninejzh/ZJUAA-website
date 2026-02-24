import { DEFAULT_SITE_SETTINGS } from "./default-settings";

export async function getSettings() {
  try {
    const base =
      process.env.NEXTAUTH_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
      "http://localhost:3000";
    const res = await fetch(`${base}/api/settings`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      return { ...DEFAULT_SITE_SETTINGS, ...data };
    }
  } catch {
    // ignore
  }
  return DEFAULT_SITE_SETTINGS;
}
