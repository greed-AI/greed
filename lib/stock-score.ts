type StockData = {
    ticker: string;
    price: number;
    change: number;
    changePercent: string;
    volume: number;
    latestTradingDay: string;
  };
  
  export function generateStockScoreAnalysis(stock: StockData) {
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
    };
  }