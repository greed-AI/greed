export type StockData = {
  ticker: string;
  price: number;
  change: number;
  changePercent: string;
  volume: number;
  latestTradingDay: string;
};

type AlphaVantageQuote = {
  "01. symbol"?: string;
  "05. price"?: string;
  "06. volume"?: string;
  "07. latest trading day"?: string;
  "09. change"?: string;
  "10. change percent"?: string;
};

type AlphaVantageResponse = {
  "Global Quote"?: AlphaVantageQuote;
  Note?: string;
  Information?: string;
  "Error Message"?: string;
};

export async function fetchStockData(
  ticker: string
): Promise<StockData> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "Missing required environment variable: ALPHA_VANTAGE_API_KEY"
    );
  }

  const symbol = ticker.trim().toUpperCase();

  if (!symbol) {
    throw new Error("A valid ticker is required.");
  }

  const params = new URLSearchParams({
    function: "GLOBAL_QUOTE",
    symbol,
    apikey: apiKey,
  });

  const response = await fetch(
    `https://www.alphavantage.co/query?${params.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Alpha Vantage request failed with status ${response.status}.`
    );
  }

  const data = (await response.json()) as AlphaVantageResponse;

  if (data["Error Message"]) {
    throw new Error(
      `Alpha Vantage ticker error: ${data["Error Message"]}`
    );
  }

  if (data.Note) {
    throw new Error(
      `Alpha Vantage API limit: ${data.Note}`
    );
  }

  if (data.Information) {
    throw new Error(
      `Alpha Vantage API information: ${data.Information}`
    );
  }

  const quote = data["Global Quote"];

  if (!quote || Object.keys(quote).length === 0) {
    console.error(
      "[stock-data] Unexpected Alpha Vantage response:",
      data
    );

    throw new Error(
      `No stock data was returned for ${symbol}.`
    );
  }

  const returnedTicker = quote["01. symbol"];
  const price = Number(quote["05. price"]);
  const change = Number(quote["09. change"]);
  const volume = Number(quote["06. volume"]);
  const changePercent = quote["10. change percent"];
  const latestTradingDay = quote["07. latest trading day"];

  if (
    !returnedTicker ||
    !Number.isFinite(price) ||
    !Number.isFinite(change) ||
    !Number.isFinite(volume) ||
    !changePercent ||
    !latestTradingDay
  ) {
    console.error(
      "[stock-data] Incomplete Alpha Vantage quote:",
      quote
    );

    throw new Error(
      `Incomplete stock data was returned for ${symbol}.`
    );
  }

  return {
    ticker: returnedTicker,
    price,
    change,
    changePercent,
    volume,
    latestTradingDay,
  };
}