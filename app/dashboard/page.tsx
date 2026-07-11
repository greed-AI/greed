"use client";

import { AnalysisPanel } from "@/app/components/analysis/analysis-panel";
import { AIBriefCard } from "@/app/components/dashboard/ai-brief-card";
import { AnalyzeSection } from "@/app/components/dashboard/analyze-section";
import { GreetingSection } from "@/app/components/dashboard/greeting-section";
import { MarketPulseSection } from "@/app/components/dashboard/market-pulse-section";
import { MyWatchlistSection } from "@/app/components/dashboard/my-watchlist-section";
import { TopOpportunityCard } from "@/app/components/dashboard/top-opportunity-card";
import { WatchlistChangesSection } from "@/app/components/dashboard/watchlist-changes-section";
import { getUser, signOut } from "@/lib/auth";
import { fetchStockAnalysis } from "@/lib/client/fetch-analysis";
import { generateDemoAnalysis } from "@/lib/demo-analysis";
import type { AnalysisResponse, StockAnalysis } from "@/lib/types/analysis";
import { addWatchlistItem, getWatchlistItems, deleteWatchlistItem } from "@/lib/watchlist";
import { buildWhyContent } from "@/lib/decision-why";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type RecentAnalysisItem = {
  ticker: string;
  company: string;
  greedScore: number;
  riskLevel: string;
};

type WatchlistItem = {
  ticker: string;
  company: string;
  greedScore: number;
  risk: string;
};

type ViewState = "idle" | "loading" | "result";

function getDisplayName(
  metadata: Record<string, unknown> | undefined,
  email: string | undefined,
): string | undefined {
  const fullName = metadata?.full_name;

  if (typeof fullName === "string" && fullName.trim()) {
    return fullName.trim();
  }

  if (email) {
    return email.split("@")[0];
  }

  return undefined;
}

export default function DashboardPage() {
  const router = useRouter();
  const [ticker, setTicker] = useState("");
  const [viewState, setViewState] = useState<ViewState>("idle");
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [recentHistory, setRecentHistory] = useState<RecentAnalysisItem[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [userName, setUserName] = useState<string | undefined>();
  const [signingOut, setSigningOut] = useState(false);
  const analysisRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void getUser().then(({ user }) => {
      if (!user) return;

      setUserName(
        getDisplayName(user.user_metadata, user.email ?? undefined),
      );
    });
  }, []);

  useEffect(() => {
    void getUser().then(async ({ user }) => {
      if (!user) return;
  
      try {
        const items = await getWatchlistItems(user.id);
        setWatchlist(items);
      } catch (error) {
        console.error(error);
      }
    });
  }, []);
  
  function addToHistory(analysis: StockAnalysis) {
    const entry: RecentAnalysisItem = {
      ticker: analysis.ticker,
      company: analysis.company,
      greedScore: analysis.greedScore,
      riskLevel: analysis.risk,
    };

    setRecentHistory((prev) => {
      const filtered = prev.filter((item) => item.ticker !== entry.ticker);
      return [entry, ...filtered].slice(0, 8);
    });
  }

  async function addToWatchlist(analysis: StockAnalysis) {
    const { user } = await getUser();

    if (!user) return;
    
    const alreadyExists = watchlist.some(
      (item) => item.ticker === analysis.ticker
    );
    
    if (alreadyExists) return;


    try {
      const whyContent = buildWhyContent(analysis);

console.log("WATCHLIST SAVE DATA:", {
  ticker: analysis.ticker,
  confidence: analysis.confidence,
  why: whyContent,
});
await addWatchlistItem({
  userId: user.id,
  ticker: analysis.ticker,
  company: analysis.company,
  greedScore: analysis.greedScore,
  risk: analysis.risk,
  confidence: analysis.confidence,
  why: whyContent,
});
    } catch (error) {
      console.error(error);
    }

    setWatchlist((prev) => {
      if (prev.some((item) => item.ticker === analysis.ticker)) {
        return prev;
      }

      return [
        ...prev,
        {
          ticker: analysis.ticker,
          company: analysis.company,
          greedScore: analysis.greedScore,
          risk: analysis.risk,
          confidence: analysis.confidence,
          why: buildWhyContent(analysis),
        },
      ];
    });
  }
  async function removeFromWatchlist(ticker: string) {
    const { user } = await getUser();
  
    if (!user) return;
  
    try {
      await deleteWatchlistItem(user.id, ticker);
  
      setWatchlist((prev) =>
        prev.filter((item) => item.ticker !== ticker)
      );
    } catch (error) {
      console.error(error);
    }
  }

  function handleAnalyze(event: FormEvent) {
    event.preventDefault();
    if (!ticker.trim()) return;

    setViewState("loading");
    setResult(null);

    void (async () => {
      const [analysis] = await Promise.all([
        fetchStockAnalysis(ticker).catch(() => ({
          ...generateDemoAnalysis(ticker),
          isDemo: true,
        })),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);

      setResult(analysis);
      addToHistory(analysis);
      setViewState("result");

      requestAnimationFrame(() => {
        analysisRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    })();
  }

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
    router.push("/sign-in");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="animate-pulse-glow absolute -left-32 top-0 h-[520px] w-[520px] rounded-full bg-gold/8 blur-[120px]" />
        <div className="animate-pulse-glow absolute -right-24 bottom-0 h-[480px] w-[480px] rounded-full bg-gold/6 blur-[100px] [animation-delay:3s]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,169,98,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-8 sm:px-8">
        <span className="text-sm font-medium tracking-[0.35em] text-gold">
          GREED
        </span>
        <button
          type="button"
          onClick={() => void handleSignOut()}
          disabled={signingOut}
          className="text-xs text-white/30 transition-colors hover:text-gold-light disabled:opacity-50"
        >
          {signingOut ? "Signing out…" : "Sign Out"}
        </button>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-2xl px-6 pb-16 sm:px-8">
        <div className="flex flex-col gap-10">
          <GreetingSection userName={userName} />
          <AIBriefCard />
          <TopOpportunityCard />
          <WatchlistChangesSection />
          <MarketPulseSection />
          <AnalyzeSection
            ticker={ticker}
            onTickerChange={setTicker}
            onSubmit={handleAnalyze}
            isLoading={viewState === "loading"}
          />

          <div ref={analysisRef} className="flex flex-col gap-6">
            <AnalysisPanel
              viewState={viewState}
              result={result}
              recentHistory={recentHistory}
              watchlist={watchlist}
              onAddToWatchlist={addToWatchlist}
              onRemoveFromWatchlist={removeFromWatchlist}
            />
          </div>

          <MyWatchlistSection
  watchlist={watchlist}
  onRemove={(ticker) => void removeFromWatchlist(ticker)}
/>
        </div>
      </main>

      <footer className="relative z-10 mx-auto w-full max-w-2xl px-6 pb-8 sm:px-8">
        <p className="text-center text-xs text-white/20">
          Not financial advice. For informational purposes only.
        </p>
      </footer>
    </div>
  );
}
