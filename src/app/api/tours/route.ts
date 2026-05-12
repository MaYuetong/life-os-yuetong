import { NextResponse } from "next/server";
import { getUpcomingTours } from "@/lib/met-tour";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const upcoming = await getUpcomingTours();
    return NextResponse.json({ upcoming });
  } catch {
    return NextResponse.json({ upcoming: [] });
  }
}
