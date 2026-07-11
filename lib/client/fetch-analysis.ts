import type { AnalysisApiError, AnalysisResponse } from "@/lib/types/analysis";

export async function fetchStockAnalysis(
  ticker: string,
): Promise<AnalysisResponse> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticker }),
  });

  if (!response.ok) {
    const errorBody = (await response.json()) as AnalysisApiError;
    throw new Error(errorBody.error || "Analysis request failed");
  }

  const data = (await response.json()) as AnalysisResponse;

  console.log("[CLIENT] ANALYSIS RESPONSE:", data);

  return data;
}