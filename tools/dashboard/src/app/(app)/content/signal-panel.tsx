"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Search, Sparkles, TrendingUp } from "lucide-react";

// The competitor winners the machine found. Deliberately NOT the same thing as
// Performance > Outliers, which is about the operator's OWN posts beating their own average.
// These are tracked creators' posts beating THEIR averages, and they are what every script is
// built from. Until this panel existed the dashboard could say "208 winners" and show none of them.

export type Outlier = {
  id: string;
  url: string;
  platform: string;
  creator: string | null;
  handle: string | null;
  posted: string | null;
  post_type: string | null;
  metric: string;
  score: number | null;
  creator_median: number | null;
  multiple: number | null;
  views: number | null;
  likes: number | null;
  comments: number | null;
  analysed: boolean;
  caption_hook: string | null;
  hook_type: string | null;
  hook_template: string | null;
  format: string | null;
  ask: string | null;
  why_it_worked: string | null;
};

const num = (n: number | null) =>
  n === null || n === undefined ? "-" : Intl.NumberFormat("en", { notation: "compact" }).format(n);

// "views" and "engagement" are not interchangeable: Instagram reports no view count for carousels,
// so those creators are scored on likes plus comments instead. Showing a multiple without saying
// which metric produced it would quietly mislead.
const METRIC_LABEL: Record<string, string> = {
  views: "views",
  engagement: "likes + comments",
};

export default function SignalPanel({ outliers }: { outliers: Outlier[] }) {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<"all" | "instagram" | "youtube">("all");
  const [explainedOnly, setExplainedOnly] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const analysedCount = outliers.filter((o) => o.analysed).length;
  const creatorCount = new Set(outliers.map((o) => o.handle).filter(Boolean)).size;

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return outliers.filter((o) => {
      if (platform !== "all" && o.platform !== platform) return false;
      if (explainedOnly && !o.analysed) return false;
      if (!q) return true;
      return [o.creator, o.handle, o.hook_type, o.caption_hook, o.format]
        .some((v) => v?.toLowerCase().includes(q));
    });
  }, [outliers, query, platform, explainedOnly]);

  if (outliers.length === 0) {
    return (
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-8 text-center">
        <TrendingUp className="mx-auto size-5 text-[#5C6472]" />
        <p className="mt-3 text-sm text-[#F5F5F7]">No winners found yet</p>
        <p className="mt-1 text-xs text-[#7C8595]">
          These appear after the machine reads your creators and compares each post against that
          creator&apos;s own normal numbers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-[#F5F5F7]">
            {outliers.length} winners from {creatorCount} creators
          </p>
          <p className="text-xs text-[#7C8595]">
            Posts that beat their own creator&apos;s normal numbers. {analysedCount} have a written
            explanation; the rest are measured but not yet studied.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#5C6472]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search creator or hook"
              className="h-8 w-52 rounded-lg border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.03)] pl-8 pr-3 text-xs text-[#F5F5F7] placeholder:text-[#5C6472] focus:outline-none focus:ring-1 focus:ring-[rgba(255,255,255,0.18)]"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {(["all", "instagram", "youtube"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`rounded-full border px-2.5 py-1 text-xs transition ${
              platform === p
                ? "border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.08)] text-[#F5F5F7]"
                : "border-[rgba(255,255,255,0.08)] text-[#7C8595] hover:text-[#A8B0BD]"
            }`}
          >
            {p === "all" ? "All" : p === "instagram" ? "Instagram" : "YouTube"}
          </button>
        ))}
        <button
          onClick={() => setExplainedOnly((v) => !v)}
          className={`rounded-full border px-2.5 py-1 text-xs transition ${
            explainedOnly
              ? "border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.08)] text-[#F5F5F7]"
              : "border-[rgba(255,255,255,0.08)] text-[#7C8595] hover:text-[#A8B0BD]"
          }`}
        >
          Explained only
        </button>
        <span className="ml-1 text-xs text-[#5C6472]">
          {shown.length} shown
        </span>
      </div>

      {/* Horizontal scroll rather than squeezing columns: the page itself must never scroll sideways. */}
      <div className="overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.08)]">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead className="bg-[rgba(255,255,255,0.03)] text-[#7C8595]">
            <tr>
              <th className="px-3 py-2 font-medium">Creator</th>
              <th className="px-3 py-2 font-medium">Beat their normal by</th>
              <th className="px-3 py-2 font-medium">Measured on</th>
              <th className="px-3 py-2 font-medium">Why it won</th>
              <th className="px-3 py-2 font-medium">Posted</th>
              <th className="px-3 py-2 font-medium">Post</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((o) => {
              const isOpen = open === o.id;
              return (
                <tr
                  key={o.id}
                  onClick={() => setOpen(isOpen ? null : o.id)}
                  className="cursor-pointer border-t border-[rgba(255,255,255,0.06)] align-top hover:bg-[rgba(255,255,255,0.02)]"
                >
                  <td className="px-3 py-2">
                    <span className="text-[#F5F5F7]">{o.creator ?? o.handle ?? "-"}</span>
                    <span className="block text-[#5C6472]">
                      {o.handle ? `@${o.handle}` : ""} · {o.platform === "instagram" ? "IG" : "YT"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-[#7BE0A5]">
                      {o.multiple ? `${Math.round(o.multiple)}x` : "-"}
                    </span>
                    <span className="block text-[#5C6472]">
                      {num(o.score)} vs {num(o.creator_median)} normal
                    </span>
                  </td>
                  <td className="px-3 py-2 text-[#A8B0BD]">
                    {METRIC_LABEL[o.metric] ?? o.metric}
                  </td>
                  <td className="max-w-[280px] px-3 py-2">
                    {o.analysed ? (
                      <>
                        <span className="text-[#F5F5F7]">{o.hook_type ?? "-"}</span>
                        {isOpen && (
                          <span className="mt-1 block space-y-1 text-[#A8B0BD]">
                            {o.why_it_worked && <span className="block">{o.why_it_worked}</span>}
                            {o.hook_template && (
                              <span className="block text-[#7C8595]">
                                Template: {o.hook_template}
                              </span>
                            )}
                            {o.format && (
                              <span className="block text-[#7C8595]">Format: {o.format}</span>
                            )}
                            {o.ask && <span className="block text-[#7C8595]">Ask: {o.ask}</span>}
                          </span>
                        )}
                        {!isOpen && o.caption_hook && (
                          <span className="mt-0.5 block truncate text-[#5C6472]">
                            {o.caption_hook}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-[#5C6472]">Measured, not yet studied</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-[#7C8595]">{o.posted ?? "-"}</td>
                  <td className="px-3 py-2">
                    <a
                      href={o.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[#A8B0BD] hover:text-[#F5F5F7]"
                    >
                      Open <ArrowUpRight className="size-3" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="flex items-center gap-1.5 text-xs text-[#5C6472]">
        <Sparkles className="size-3" />
        Click any row to see the full reasoning, the reusable hook template, and the call to action
        it used.
      </p>
    </div>
  );
}
