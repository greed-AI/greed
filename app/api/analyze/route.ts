import { NextRequest, NextResponse } from "next/server";
import { generateDemoAnalysis } from "@/lib/demo-analysis";
import { generateStockAnalysis } from "@/lib/generate-analysis";
import type { AnalysisApiError, AnalysisResponse } from "@/lib/types/analysis";

export const runtime = "nodejs";

function isOpenAIQuotaError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const apiError = error as { code?: string; status?: number; message?: string };
  const message = apiError.message?.toLowerCase() ?? "";

  return (
    apiError.code === "insufficient_quota" ||
    apiError.status === 429 ||
    message.includes("insufficient_quota") ||
    message.includes("exceeded your current quota")
  );
}

function logFallbackReason(error: unknown): void {
  if (
    error instanceof Error &&
    error.message.startsWith("Missing required environment variable")
  ) {
    console.warn("[/api/analyze] Demo fallback: OPENAI_API_KEY not configured");
    return;
  }

  if (isOpenAIQuotaError(error)) {
    console.warn("[/api/analyze] Demo fallback: OpenAI quota unavailable");
    return;
  }

  console.warn("[/api/analyze] Demo fallback: OpenAI request failed", error);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { ticker?: unknown };

  if (typeof body.ticker !== "string" || !body.ticker.trim()) {
    return NextResponse.json<AnalysisApiError>(
      { error: "A valid ticker is required." },
      { status: 400 },
    );
  }

  const ticker = body.ticker.trim();

  try {
    const analysis = await generateStockAnalysis(ticker);
    const response: AnalysisResponse = { ...analysis, isDemo: false };
    return NextResponse.json(response);
  } catch (error) {
    logFallbackReason(error);

    const demo = generateDemoAnalysis(ticker);
    const response: AnalysisResponse = { ...demo, isDemo: true };
    return NextResponse.json(response);
  }
}
