import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

type WatchlistItem = {
  ticker: string;
  company: string;
  greedScore: number;
  risk: string;
  confidence?: number;
  action?: "BUY" | "HOLD" | "WAIT" | "TRIM" | "STRONG BUY";
};

type DashboardBriefRequest = {
  watchlist: WatchlistItem[];
};

const FALLBACK_BRIEF = [
  "Your watchlist is ready for review.",
  "Focus on the highest Greed Score and confidence signals.",
  "Monitor elevated risk before making new decisions.",
];

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DashboardBriefRequest;
    const watchlist = Array.isArray(body.watchlist) ? body.watchlist : [];

    if (watchlist.length === 0) {
      return NextResponse.json({
        brief: [
          "Add stocks to your watchlist to generate a personalized AI brief.",
        ],
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        brief: FALLBACK_BRIEF,
        isFallback: true,
      });
    }

    const openai = new OpenAI({
      apiKey,
    });

    const watchlistSummary = watchlist.map((stock) => ({
      ticker: stock.ticker,
      company: stock.company,
      greedScore: stock.greedScore,
      risk: stock.risk,
      confidence: stock.confidence ?? null,
      action: stock.action ?? null,
    }));

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content: `
You write concise daily watchlist briefs for an AI stock analysis dashboard.

Use only the supplied watchlist data.

Do not invent:
- news
- earnings
- analyst opinions
- valuation data
- market events
- price targets
- company fundamentals

Return valid JSON in this exact shape:

{
  "brief": [
    "First sentence.",
    "Second sentence.",
    "Third sentence."
  ]
}

Rules:
- Return exactly 3 sentences.
- Each sentence must be concise.
- Mention ticker symbols when useful.
- Compare Greed Score, confidence, risk, and action.
- Do not give personalized financial advice.
- Do not use markdown.
          `.trim(),
        },
        {
          role: "user",
          content: JSON.stringify({
            watchlist: watchlistSummary,
          }),
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json({
        brief: FALLBACK_BRIEF,
        isFallback: true,
      });
    }

    const parsed = JSON.parse(content) as {
      brief?: unknown;
    };

    const brief = Array.isArray(parsed.brief)
      ? parsed.brief
          .filter((item): item is string => typeof item === "string")
          .slice(0, 3)
      : [];

    if (brief.length === 0) {
      return NextResponse.json({
        brief: FALLBACK_BRIEF,
        isFallback: true,
      });
    }

    return NextResponse.json({
      brief,
      isFallback: false,
    });
  } catch (error) {
    console.error("Dashboard brief error:", error);

    return NextResponse.json({
      brief: FALLBACK_BRIEF,
      isFallback: true,
    });
  }
}