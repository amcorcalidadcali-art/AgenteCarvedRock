"use client";

import { calculateCost, formatCost, formatTokens } from "@/lib/pricing";

export type AggregatedModelUsage = {
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

export type TokenUsageSummary = {
  models: AggregatedModelUsage[];
  totalTokens: number;
};

type TokenUsagePanelProps = {
  summary: TokenUsageSummary;
};

export default function TokenUsagePanel({ summary }: TokenUsagePanelProps) {
  const hasData = summary.models.length > 0;
  const totalCost = summary.models.reduce((sum, item) => {
    return (
      sum + calculateCost(item.model, item.promptTokens, item.completionTokens)
    );
  }, 0);

  return (
    <section className="flex h-full flex-col bg-white">
      <header className="px-4 pb-2 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Token-Nutzung
        </p>
        <p className="text-lg font-semibold text-gray-900">
          Aktuelle Unterhaltung
        </p>
      </header>

      <div className="px-4 pb-3">
        <div className="rounded-2xl bg-gray-50 px-4 py-3">
          <div className="text-[11px] uppercase tracking-wide text-gray-500">
            Gesamt bis jetzt
          </div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">
            {formatTokens(summary.totalTokens)}
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Geschätzte Kosten · {formatCost(totalCost)}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {hasData ? (
          <ul className="space-y-3">
            {summary.models.map((item) => {
              const cost = calculateCost(
                item.model,
                item.promptTokens,
                item.completionTokens
              );
              return (
                <li
                  key={item.model}
                  className="rounded-2xl bg-gray-50 px-3 py-2.5"
                >
                  <div className="flex items-center justify-between text-sm font-medium text-gray-900">
                    <span className="truncate">{item.model}</span>
                    <span>{formatTokens(item.totalTokens)} Tokens</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                    <span>Eingabe · Ausgabe</span>
                    <span>
                      {formatTokens(item.promptTokens)} ·{" "}
                      {formatTokens(item.completionTokens)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                    <span>Kosten</span>
                    <span className="font-semibold text-gray-900">
                      {formatCost(cost)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-2xl bg-gray-50 px-4 py-6 text-sm text-gray-500">
            Noch keine Token verbraucht. Stelle eine Frage, um die Nutzung zu sehen.
          </div>
        )}
      </div>
    </section>
  );
}
