import { NextResponse } from "next/server";

import { getCurrentMembership } from "@/lib/membership";

export const runtime = "nodejs";

export async function GET() {
  try {
    const membership = await getCurrentMembership();

    return NextResponse.json({
      membership,
      isRoyal: membership === "ROYAL",
    });
  } catch (error) {
    console.error("[/api/membership] Failed to load membership:", error);

    return NextResponse.json(
      {
        error: "Unable to load membership.",
      },
      {
        status: 500,
      }
    );
  }
}