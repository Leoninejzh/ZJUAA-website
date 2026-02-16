import { NextResponse } from "next/server";
import { DEFAULT_SITE_SETTINGS } from "@/lib/default-settings";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.siteSettings.findMany();
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }

    const merged = { ...DEFAULT_SITE_SETTINGS };
    for (const [key, value] of Object.entries(settings)) {
      try {
        (merged as Record<string, unknown>)[key] = JSON.parse(value);
      } catch {
        (merged as Record<string, unknown>)[key] = value;
      }
    }

    return NextResponse.json(merged);
  } catch (error) {
    console.error("[Settings API]", error);
    return NextResponse.json(DEFAULT_SITE_SETTINGS);
  }
}
