import { NextResponse } from "next/server";
import { DEFAULT_SITE_SETTINGS } from "@/lib/default-settings";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  const skipDb =
    process.env.SKIP_DATABASE === "1" ||
    !dbUrl ||
    (process.env.VERCEL && dbUrl.startsWith("file:"));
  if (skipDb) {
    return NextResponse.json(DEFAULT_SITE_SETTINGS);
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.siteSettings.findMany();
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }

    const merged = { ...DEFAULT_SITE_SETTINGS } as Record<string, unknown>;
    for (const [key, value] of Object.entries(settings)) {
      try {
        merged[key] = JSON.parse(value);
      } catch {
        merged[key] = value;
      }
    }
    if (!Array.isArray(merged.transparencyItems)) {
      merged.transparencyItems = DEFAULT_SITE_SETTINGS.transparencyItems;
    }

    return NextResponse.json(merged);
  } catch (error) {
    console.error("[Settings API]", error);
    return NextResponse.json(DEFAULT_SITE_SETTINGS);
  }
}
