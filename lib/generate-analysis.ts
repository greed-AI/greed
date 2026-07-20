import { getOpenAIClient } from "@/lib/openai";
import { env } from "@/lib/env";
import type { StockAnalysis } from "@/lib/types/analysis";
import type { StockData } from "@/lib/stock-data";

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
  Base every explanation only on the provided ticker, greedScore, momentum, risk, confidence, and strategy.
Do not claim or imply sales growth, earnings performance, analyst views, valuation levels, market expansion, institutional activity, or recent events.
If supporting data was not provided, describe the signal only in terms of the available analysis fields.
Never present assumptions as facts.
The strategy reasons should be concise, specific, and directly tied to the Greed Score, momentum, risk, and confidence.

Avoid generic investment advice.

Each strategy reason should explain WHY that action was selected.

Today:
Focus on immediate momentum and current sentiment.

OneWeek:
Focus on short-term trend continuation.

OneMonth:
Focus on medium-term positioning and risk balance.

OneYear:
Focus on long-term conviction rather than short-term price movement.
- strategy:

today:
- Time horizon: today only.
- Focus on today's momentum, today's price movement, and today's trading activity.
- Be conservative after large upward moves.
- action: BUY, HOLD, WAIT, TRIM, or STRONG BUY.
- reason: one concise sentence.

oneWeek:
- Time horizon: the next 5–10 trading days.
- Consider whether momentum is likely to continue over the next week.
- action: BUY, HOLD, WAIT, TRIM, or STRONG BUY.
- reason: one concise sentence.

oneMonth:
- Time horizon: approximately one month.
- Ignore short-term noise when appropriate.
- action: BUY, HOLD, WAIT, TRIM, or STRONG BUY.
- reason: one concise sentence.

oneYear:
- Time horizon: approximately one year.
- Focus primarily on the longer-term outlook rather than today's movement.
- action: BUY, HOLD, WAIT, TRIM, or STRONG BUY.
- reason: one concise sentence.

Important rules:

- Each time horizon must be evaluated independently.
- Do not automatically repeat the same action.
- Different horizons should normally produce different actions.
- STRONG BUY should be rare.
- WAIT should only be used when uncertainty is genuinely high.
- Long-term recommendations should not simply copy today's recommendation.
Greed decision framework:

- Greed Score is the primary decision signal.
- Momentum is the secondary signal.
- Risk adjusts the aggressiveness of the recommendation.
- Confidence reflects how strongly the recommendation should be trusted.
- Daily price movement should influence only the Today recommendation unless the move is exceptionally large.

General guidance:

Greed Score 85-100
→ Normally BUY or STRONG BUY for medium and long-term horizons.

Greed Score 70-84
→ Normally BUY or HOLD.

Greed Score 55-69
→ Normally HOLD.

Greed Score 40-54
→ Normally HOLD or WAIT.

Greed Score below 40
→ WAIT or TRIM.

Never let a single day's price movement completely override a very high Greed Score.

Long-term consistency rules:

- If Greed Score is 70 or higher, oneYear should generally not be weaker than oneMonth unless risk is High.
- If Greed Score is 85 or higher, oneYear should usually be BUY or STRONG BUY.
- If momentum is Strong or Very Strong, oneMonth should generally not be TRIM.
- If Today is WAIT because of short-term volatility, oneMonth and oneYear should still reflect the broader Greed Score.
- oneYear should represent long-term conviction and should not overreact to a single day's decline.
- Use HOLD instead of WAIT for oneYear when the long-term outlook is mixed but not clearly bearish.

Today's recommendation may differ significantly from the one-month or one-year recommendation.`;

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
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["BUY", "HOLD", "WAIT", "TRIM", "STRONG BUY"],
            },
            reason: { type: "string" },
          },
          required: ["action", "reason"],
          additionalProperties: false,
        },
        oneWeek: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["BUY", "HOLD", "WAIT", "TRIM", "STRONG BUY"],
            },
            reason: { type: "string" },
          },
          required: ["action", "reason"],
          additionalProperties: false,
        },
        oneMonth: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["BUY", "HOLD", "WAIT", "TRIM", "STRONG BUY"],
            },
            reason: { type: "string" },
          },
          required: ["action", "reason"],
          additionalProperties: false,
        },
        oneYear: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["BUY", "HOLD", "WAIT", "TRIM", "STRONG BUY"],
            },
            reason: { type: "string" },
          },
          required: ["action", "reason"],
          additionalProperties: false,
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

  console.log("[GPT WHY]", parsed.why);
  
  return {
    company: parsed.company,
    ticker: parsed.ticker.toUpperCase(),
    greedScore: parsed.greedScore,
    momentum: parsed.momentum,
    risk: parsed.risk,
    confidence: parsed.confidence,
    summary: parsed.summary,
    why: parsed.why,
    strategy: parsed.strategy,
  };
}

export async function generateStockAnalysis(
  stock: StockData,
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
 {
  role: "user",
  content: `Analyze this stock using only the following market data.

Ticker: ${stock.ticker}
Current Price: ${stock.price}
Daily Change: ${stock.change}
Daily Change Percent: ${stock.changePercent}
Volume: ${stock.volume}
Latest Trading Day: ${stock.latestTradingDay}

Do not infer or assume earnings, revenue, analyst opinions, valuation, institutional activity, news, or market events.
If there is not enough information, explain only what can be concluded from the provided market data and analysis fields.`,
},
],
});

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty response");
  }

  return parseAnalysis(content);
}
