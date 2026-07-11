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
- summary: Write 2-3 professional investment-research sentences in natural English.
  Explain the current market situation, investor sentiment, and short-term outlook.
  Avoid simply repeating the price or percentage.
  Make it sound like a premium institutional research report.
  Do not mention that you are an AI. Do not use generic or repetitive wording.
  Do not invent earnings results, analyst opinions, news, or events that were not provided.
  - why:
  - momentum: one concise sentence explaining the momentum assessment
  - trend: one concise sentence explaining the trend assessment
  - risk: one concise sentence explaining the risk level
  - value: one concise sentence explaining the value assessment
  Use only the information available in this analysis.
  Do not invent financial results, valuation metrics, news, or market events.
- strategy:
  - today: one of "BUY", "HOLD", "WAIT", "TRIM", "STRONG BUY"
  - oneWeek: one of "BUY", "HOLD", "WAIT", "TRIM", "STRONG BUY"
  - oneMonth: one of "BUY", "HOLD", "WAIT", "TRIM", "STRONG BUY"
  - oneYear: one of "BUY", "HOLD", "WAIT", "TRIM", "STRONG BUY"`;

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
    why: {
      type: "object",
      properties: {
        momentum: { type: "string" },
        trend: { type: "string" },
        risk: { type: "string" },
        value: { type: "string" },
      },
      required: ["momentum", "trend", "risk", "value"],
      additionalProperties: false,
    },
    strategy: {
      type: "object",
      properties: {
        today: {
          type: "string",
          enum: ["BUY", "HOLD", "WAIT", "TRIM", "STRONG BUY"],
        },
        oneWeek: {
          type: "string",
          enum: ["BUY", "HOLD", "WAIT", "TRIM", "STRONG BUY"],
        },
        oneMonth: {
          type: "string",
          enum: ["BUY", "HOLD", "WAIT", "TRIM", "STRONG BUY"],
        },
        oneYear: {
          type: "string",
          enum: ["BUY", "HOLD", "WAIT", "TRIM", "STRONG BUY"],
        },
      },

      required: ["today", "oneWeek", "oneMonth", "oneYear"],
      additionalProperties: false,
    },
  },
  required: [
    "company",
    "ticker",
    "greedScore",
    "momentum",
    "risk",
    "confidence",
    "summary",
    "why",
    "strategy",
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
    strategy: parsed.strategy,
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
