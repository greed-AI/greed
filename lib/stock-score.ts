import type { StockAnalysis } from "@/lib/types/analysis";

type StockData = {
    ticker: string;
    price: number;
    change: number;
    changePercent: string;
    volume: number;
    latestTradingDay: string;
  };
  
  export function generateStockScoreAnalysis(
    stock: StockData,
  ): StockAnalysis {
    const percent = Number(stock.changePercent.replace("%", ""));
  
    let greedScore = 50;
  
    if (percent > 0) greedScore += 15;
    if (percent > 1) greedScore += 10;
    if (percent > 3) greedScore += 10;
  
    if (percent < 0) greedScore -= 15;
    if (percent < -1) greedScore -= 10;
    if (percent < -3) greedScore -= 10;
  
    greedScore = Math.max(0, Math.min(100, greedScore));
  
    const momentum =
      percent >= 3 ? "Very Strong" :
      percent >= 1 ? "Strong" :
      percent > -1 ? "Moderate" :
      "Weak";
  
    const risk =
      Math.abs(percent) >= 3 ? "High" :
      Math.abs(percent) >= 1 ? "Medium" :
      "Low";
  
    const confidence =
      stock.volume > 50_000_000 ? 85 :
      stock.volume > 10_000_000 ? 76 :
      65;
  
    return {
      company: stock.ticker,
      ticker: stock.ticker,
      greedScore,
      momentum,
      risk,
      confidence,
      summary: `${stock.ticker} is trading at $${stock.price}. Today's move is ${stock.changePercent}, with volume of ${stock.volume.toLocaleString()}.`,
      strategy: {
        today: {
          action:
            greedScore >= 80
              ? "STRONG BUY"
              : greedScore >= 65
                ? "BUY"
                : greedScore >= 45
                  ? "HOLD"
                  : greedScore >= 30
                    ? "WAIT"
                    : "TRIM",
          reason:
            greedScore >= 80
              ? "Very strong score conditions support an aggressive short-term stance."
              : greedScore >= 65
                ? "Positive score conditions support a constructive short-term stance."
                : greedScore >= 45
                  ? "Mixed score conditions favor holding rather than adding exposure."
                  : greedScore >= 30
                    ? "Weak score conditions suggest waiting for clearer confirmation."
                    : "Very weak score conditions support reducing exposure.",
        },
      
        oneWeek: {
          action:
            greedScore >= 75
              ? "BUY"
              : greedScore >= 55
                ? "HOLD"
                : greedScore >= 40
                  ? "WAIT"
                  : "TRIM",
          reason:
            greedScore >= 75
              ? "The current score supports a positive one-week outlook."
              : greedScore >= 55
                ? "The one-week outlook remains balanced, favoring patience."
                : greedScore >= 40
                  ? "The score suggests waiting for stronger confirmation over the next week."
                  : "Weak score conditions support trimming over the one-week horizon.",
        },
      
        oneMonth: {
          action:
            greedScore >= 70
              ? "BUY"
              : greedScore >= 50
                ? "HOLD"
                : greedScore >= 35
                  ? "WAIT"
                  : "TRIM",
          reason:
            greedScore >= 70
              ? "The current score supports a constructive one-month position."
              : greedScore >= 50
                ? "The one-month outlook is neutral enough to justify holding."
                : greedScore >= 35
                  ? "The score favors waiting for stronger medium-term confirmation."
                  : "Weak medium-term conditions support reducing exposure.",
        },
      
        oneYear: {
          action:
            greedScore >= 65
              ? "BUY"
              : greedScore >= 45
                ? "HOLD"
                : greedScore >= 30
                  ? "WAIT"
                  : "TRIM",
          reason:
            greedScore >= 65
              ? "The score supports a positive long-term stance."
              : greedScore >= 45
                ? "The long-term outlook remains balanced, favoring a hold."
                : greedScore >= 30
                  ? "The score suggests waiting before taking a long-term position."
                  : "Weak long-term conditions support reducing exposure.",
        },
      },
    };
  }