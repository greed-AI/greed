import { getOpenAIClient } from "@/lib/openai";
import { env } from "@/lib/env";
import type { StockAnalysis } from "@/lib/types/analysis";

const SYSTEM_PROMPT = `You are Greed, a premium AI investment assistant.
Analyze the given stock ticker or company name and respond with structured data only.

Field rules:
- company: official company name
- ticker: uppercase stock symbol (e.g. TSLA)
- greedScore: integer 0-100 (higher = stronger bullish greed/sentiment)
- momentum: one of "Weak", "Moderate", "Strong", "Very Strong"
- risk: one of "Low", "Medium", "High" (overall investment risk)
- confidence: integer 0-100 (your confidence in this analysis)
- summary: 1-2 concise sentences, professional tone, actionable insight`;

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    company: { type: "string" },
    ticker: { type: "string" },
    greedScore: { type: "integer", minimum: 0, maximum: 100 },
    momentum: {
      type: "string",
      enum: ["Weak", "Moderate", "Strong", "Very Strong"],
    },
    risk: { type: "string", enum: ["Low", "Medium", "High"] },
    confidence: { type: "integer", minimum: 0, maximum: 100 },
    summary: { type: "string" },
  },
  required: [
    "company",
    "ticker",
    "greedScore",
    "momentum",
    "risk",
    "confidence",
    "summary",
  ],
  additionalProperties: false,
} as const;

function parseAnalysis(content: string): StockAnalysis {
  const parsed = JSON.parse(content) as StockAnalysis;

  return {
    company: parsed.company,
    ticker: parsed.ticker.toUpperCase(),
    greedScore: parsed.greedScore,
    momentum: parsed.momentum,
    risk: parsed.risk,
    confidence: parsed.confidence,
    summary: parsed.summary,
  };
}

export async function generateStockAnalysis(
  ticker: string,
): Promise<StockAnalysis> {
  const openai = getOpenAIClient();

  const response = await openai.chat.completions.create({
    model: env.openaiModel,
    temperature: 0.4,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "stock_analysis",
        strict: true,
        schema: RESPONSE_SCHEMA,
      },
    },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Analyze this stock: ${ticker}` },
    ],
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty response");
  }

  return parseAnalysis(content);
}
