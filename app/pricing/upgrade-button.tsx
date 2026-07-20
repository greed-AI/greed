"use client";

import { useState } from "react";

type CheckoutResponse = {
  url?: string;
  error?: string;
};

export default function UpgradeButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleUpgrade() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch("/api/checkout", {
        method: "POST",
      });

      const data = (await response.json()) as CheckoutResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to start checkout.");
      }

      if (!data.url) {
        throw new Error("Checkout URL was not returned.");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("[UpgradeButton] Checkout failed:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to start checkout."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-10">
      <button
        type="button"
        onClick={handleUpgrade}
        disabled={isLoading}
        className="w-full rounded-full bg-gold px-6 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Opening Checkout..." : "Upgrade to Royal"}
      </button>

      {errorMessage && (
        <p className="mt-3 text-center text-xs text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  );
}