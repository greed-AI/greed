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
import type { WatchlistItem } from "@/lib/dashboard-types";

type RecentAnalysisItem = {
  ticker: string;
  company: string;
  greedScore: number;
  riskLevel: string;
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
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [recentHistory, setRecentHistory] = useState<RecentAnalysisItem[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [dailyUsage, setDailyUsage] = useState<{
    used: number;
    remaining: number;
    limit: number;
    allowed: boolean;
  } | null>(null);
  const [membership, setMembership] = useState<"FREE" | "ROYAL">("FREE");
  const [userName, setUserName] = useState<string | undefined>();
  const [signingOut, setSigningOut] = useState(false);
  const [showWatchlistUpgrade, setShowWatchlistUpgrade] = useState(false);
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
  
  async function loadDailyUsage() {
    try {
      const response = await fetch("/api/daily-usage", {
        cache: "no-store",
      });
  
      if (!response.ok) {
        return;
      }
  
      const data = await response.json();
  
      setDailyUsage(data);
    } catch (error) {
      console.error("Failed to load daily usage:", error);
    }
  }

  async function loadMembership() {
    try {
      const response = await fetch("/api/membership", {
        cache: "no-store",
      });
  
      if (!response.ok) {
        return;
      }
  
      const data = await response.json();
  
      setMembership(data.membership);
    } catch (error) {
      console.error("Failed to load membership:", error);
    }
  }
  
  useEffect(() => {
    void loadDailyUsage();
    void loadMembership();
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

    if (membership === "FREE" && watchlist.length >= 3) {
      setShowWatchlistUpgrade(true);
      return;
    }


    try {
      const whyContent = buildWhyContent(analysis);
      const watchlistWhy = {
        ...whyContent,
        strategy: analysis.strategy,
      };

console.log("WATCHLIST SAVE DATA:", {
  ticker: analysis.ticker,
  confidence: analysis.confidence,
  why: watchlistWhy,
});
await addWatchlistItem({
  userId: user.id,
  ticker: analysis.ticker,
  company: analysis.company,
  greedScore: analysis.greedScore,
  risk: analysis.risk,
  confidence: analysis.confidence,
  why: watchlistWhy,
  action: analysis.strategy.today.action,
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
          action: analysis.strategy.today.action,
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

  function runAnalysis(tickerToAnalyze: string) {
    const normalizedTicker = tickerToAnalyze.trim().toUpperCase();
  
    if (!normalizedTicker) return;
  
    setTicker(normalizedTicker);
    setViewState("loading");
    setResult(null);
    setAnalysisError(null);
  
    void (async () => {
      try {
        const [analysis] = await Promise.all([
          fetchStockAnalysis(normalizedTicker),
          new Promise((resolve) => setTimeout(resolve, 1000)),
        ]);
  
        setResult(analysis);
        addToHistory(analysis);
        setViewState("result");
  
        await loadDailyUsage();
  
        requestAnimationFrame(() => {
          analysisRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to analyze this ticker.";
      
        setAnalysisError(message);
        setViewState("idle");
      }
    })();
  }
  
  function handleAnalyze(event: FormEvent) {
    event.preventDefault();
    runAnalysis(ticker);
  }
  
  function handleOpenWatchlistAnalysis(tickerToAnalyze: string) {
    runAnalysis(tickerToAnalyze);
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
        <div className="flex items-center gap-4">
  <button
    type="button"
    onClick={() => router.push("/billing")}
    className="text-xs text-white/60 transition hover:text-gold-light"
  >
    Billing
  </button>

  <button
    type="button"
    onClick={() => void handleSignOut()}
    disabled={signingOut}
    className="text-xs text-white/30 transition hover:text-gold-light disabled:opacity-50"
  >
    {signingOut ? "Signing out…" : "Sign Out"}
  </button>
</div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-2xl px-6 pb-16 sm:px-8">
        <div className="flex flex-col gap-10">
          <GreetingSection userName={userName} />

  <section>
  <div className="rounded-2xl border border-gold/20 bg-white/[0.025] p-5">
    {membership === "ROYAL" ? (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold/60">
            Royal 1000 Membership
          </p>

          <p className="mt-2 text-2xl font-light text-white">
            Royal Member
          </p>

          <p className="mt-1 text-sm text-white/40">
            Unlimited AI analyses are active.
          </p>
        </div>

        <div className="rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-gold-light">
          Unlimited
        </div>
      </div>
    ) : dailyUsage ? (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold/60">
            Today&apos;s Free Analyses
          </p>

          <p className="mt-2 text-2xl font-light text-white">
            {dailyUsage.used} / {dailyUsage.limit} Used
          </p>

          <p className="mt-1 text-sm text-white/40">
            {dailyUsage.remaining} remaining today
          </p>
        </div>

        <div className="flex items-center gap-2">
          {Array.from({ length: dailyUsage.limit }).map((_, index) => (
            <span
              key={index}
              className={`h-2.5 w-10 rounded-full ${
                index < dailyUsage.used
                  ? "bg-gold"
                  : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>
    ) : (
      <p className="text-sm text-white/40">
        Loading membership information...
      </p>
    )}
  </div>
</section>
          <AIBriefCard watchlist={watchlist} />
          <TopOpportunityCard watchlist={watchlist} />
          <WatchlistChangesSection />
          <MarketPulseSection />
          <AnalyzeSection
            ticker={ticker}
            onTickerChange={setTicker}
            onSubmit={handleAnalyze}
            isLoading={viewState === "loading"}
            disabled={
              membership !== "ROYAL" &&
              !!dailyUsage &&
              dailyUsage.used >= dailyUsage.limit
            }
            showUpgrade={
              membership !== "ROYAL" &&
              !!dailyUsage &&
              dailyUsage.used >= dailyUsage.limit
            }
          />
{analysisError && (
  <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-4">
    <p className="text-sm font-medium text-red-300">
      {analysisError}
    </p>

    <p className="mt-2 text-xs leading-relaxed text-white/45">
      Enter a ticker symbol such as AAPL, TSLA, NVDA, or MSFT.
    </p>
  </div>
)}
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
  onOpenAnalysis={handleOpenWatchlistAnalysis}
/>
        </div>
      </main>
      {showWatchlistUpgrade && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-6 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-3xl border border-gold/30 bg-[#120f09] p-6 shadow-[0_0_80px_rgba(201,169,98,0.16)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-xl">
        🔒
      </div>

      <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.24em] text-gold/70">
        Royal Exclusive
      </p>

      <h2 className="mt-2 text-2xl font-light text-white">
        Unlock unlimited watchlists
      </h2>

      <p className="mt-3 text-sm leading-relaxed text-white/50">
        Free members can save up to 3 stocks. Upgrade to Royal to track
        unlimited opportunities.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => router.push("/pricing")}
          className="rounded-full bg-gold px-5 py-3 text-sm font-medium text-black transition hover:bg-gold-light"
        >
          Upgrade to Royal
        </button>

        <button
          type="button"
          onClick={() => setShowWatchlistUpgrade(false)}
          className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/50 transition hover:border-white/20 hover:text-white"
        >
          Maybe Later
        </button>
      </div>
    </div>
  </div>
)}
      <footer className="relative z-10 mx-auto w-full max-w-2xl px-6 pb-8 sm:px-8">
        <p className="text-center text-xs text-white/20">
          Not financial advice. For informational purposes only.
        </p>
      </footer>
    </div>
  );
}
