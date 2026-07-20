import { NextRequest, NextResponse } from "next/server";

import { consumeDailyAnalysis } from "@/lib/daily-usage";
import { generateDemoAnalysis } from "@/lib/demo-analysis";
import { generateStockAnalysis } from "@/lib/generate-analysis";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fetchStockData } from "@/lib/stock-data";
import { generateStockScoreAnalysis } from "@/lib/stock-score";

import type {
  AnalysisApiError,
  AnalysisResponse,
} from "@/lib/types/analysis";

export const runtime = "nodejs";

function isOpenAIQuotaError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const apiError = error as {
    code?: string;
    status?: number;
    message?: string;
  };

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
    error.message.startsWith(
      "Missing required environment variable"
    )
  ) {
    console.warn(
      "[/api/analyze] Demo fallback: OPENAI_API_KEY not configured"
    );
    return;
  }

  if (isOpenAIQuotaError(error)) {
    console.warn(
      "[/api/analyze] Demo fallback: OpenAI quota unavailable"
    );
    return;
  }

  console.warn(
    "[/api/analyze] Demo fallback: request failed",
    error
  );
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    const body = (await request.json()) as {
      ticker?: unknown;
    };

    if (
      typeof body.ticker !== "string" ||
      !body.ticker.trim()
    ) {
      return NextResponse.json<AnalysisApiError>(
        {
          error: "A valid ticker is required.",
        },
        {
          status: 400,
        }
      );
    }

    const ticker = body.ticker.trim().toUpperCase();

    const stockData = await fetchStockData(ticker);

    console.log(
      "[/api/analyze] Stock data:",
      stockData
    );

    const usage = await consumeDailyAnalysis();

    if (!usage.allowed) {
      return NextResponse.json(
        {
          error:
            "Today's free analysis limit has been reached.",
          code: "DAILY_ANALYSIS_LIMIT_REACHED",
          used: usage.used,
          remaining: usage.remaining,
          limit: 3,
        },
        {
          status: 429,
        }
      );
    }

    let analysis;

    try {
      analysis = await generateStockAnalysis(stockData);
    } catch (error) {
      console.error(
        "[/api/analyze] OPENAI ERROR:",
        error
      );

      console.warn(
        "OpenAI unavailable. Using local analysis."
      );

      analysis = generateStockScoreAnalysis(stockData);
    }

    const response: AnalysisResponse = {
      ...analysis,
      isDemo: false,
    };

    console.log("[/api/analyze] RESPONSE:", {
      ticker: response.ticker,
      isDemo: response.isDemo,
      strategy: response.strategy,
      usage,
    });

    return NextResponse.json({
      ...response,
      usage,
    });
  } catch (error) {
    logFallbackReason(error);
  
    const message =
      error instanceof Error ? error.message : "Unknown error";
  
    if (message.includes("No stock data")) {
      return NextResponse.json(
        {
          error:
            "Ticker not found. Please enter a stock symbol (e.g. AAPL, TSLA, NVDA).",
        },
        {
          status: 400,
        }
      );
    }
  
    return NextResponse.json(
      {
        error: "Unable to analyze this ticker.",
      },
      {
        status: 500,
      }
    );
  }
}