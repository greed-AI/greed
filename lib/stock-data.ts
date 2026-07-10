export async function fetchStockData(ticker: string) {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  
    if (!apiKey) {
      throw new Error("Missing ALPHA_VANTAGE_API_KEY");
    }
  
    const symbol = ticker.trim().toUpperCase();
  
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  
    const response = await fetch(url, {
      next: { revalidate: 60 },
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch stock data");
    }
  
    const data = await response.json();
    const quote = data["Global Quote"];
  
    if (!quote || Object.keys(quote).length === 0) {
      throw new Error("No stock data found");
    }
  
    return {
      ticker: quote["01. symbol"],
      price: Number(quote["05. price"]),
      change: Number(quote["09. change"]),
      changePercent: quote["10. change percent"],
      volume: Number(quote["06. volume"]),
      latestTradingDay: quote["07. latest trading day"],
    };
  }