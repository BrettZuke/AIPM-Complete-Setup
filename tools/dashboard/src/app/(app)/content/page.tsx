import Link from "next/link";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ArrowRight, BarChart2, Eye, Heart, Plus, UserPlus } from "lucide-react";
import { getAuthContext, getActiveAgencyTemplate } from "@/lib/auth";
import { loadCreatorSettings } from "@/lib/creator/settings";
import { googleServiceAccountEmail } from "@/lib/content/google-doc-append";
import { ClientTabs } from "@/components/ui/client-tabs";
import { TabInfo } from "@/components/ui/tab-info";
import { StatCard, EmptyPanel } from "../dashboard/tabs";
import { ContentBoard } from "./content-board";
import { CreatorsPanel } from "./creators-panel";
import SignalPanel, { type Outlier } from "./signal-panel";
import RunsPanel, { type Run } from "./runs-panel";
import { MachineMap, type MachineStats } from "./machine-map";
import { FilmPanel } from "./film-panel";
import type { Creator } from "@/lib/content/creators";
import type { BoardCard } from "./board-types";
import type { Format, Platform, Stage, StageEvent } from "@/lib/content/board";

export const dynamic = "force-dynamic";

// Plain-English, non-technical tab explainers (Board v1.1). Kept together so the copy reads as one
// voice. No jargon, no emoji, no dashes.
const CONTENT_TAB_INFO: Record<string, string> = {
  workspace:
    "Your day-to-day content work. Plan pieces through their stages, check what is in scripting or editing, and keep an eye on ideas. This is the operating view your team lives in.",
  board:
    "A drag-and-drop board for every piece, from first idea to posted. Move a card between columns as the work progresses, and open a card to edit its script or details. Use the plus button at the top of any column to add a card straight into that column.",
  record:
    "Everything that is ready to record, one script at a time, laid out in the order you use it: the hook, the words with one sentence per line, the ask, and the exact screens to capture. Pick a script on the left, film it, then mark it filmed and it moves to Filming on the board.",
  performance:
    "How your published content is doing once it is live. See reach, engagement, and which pieces are outperforming the rest. The numbers fill in here once your platforms are connected.",
  overview:
    "How the whole thing fits together. Four jobs in order: two that know about you and never change, two that run against your competitors every time, and the writer that reads all four. Every number here is measured, so a zero is a real gap.",
  creators:
    "Everyone your content machine learns from, and what each one is for. Some teach it the craft of making content, others are direct copy targets whose posts feed your scripts. Pause anyone you no longer want it copying, or remove them entirely.",
};

const WORKSPACE_SUB_INFO: Record<string, string> = {
  pipeline:
    "The pieces currently in motion, grouped by the stage they are in: scripting, editing, or queued to post. Use it as a quick status check on work in progress.",
  sources:
    "Shows which idea sources and past winners are actually driving results, so you can do more of what works. It fills in as you tag pieces with where the idea came from.",
  calendar:
    "A month view of what is scheduled to go out and when. This view is being built and will show your posting schedule at a glance.",
  ideas:
    "This is the older idea list from before the Board. The place to add and work ideas now is the Board, under its Ideas column. Nothing here is lost. Use the button below to add an idea on the Board.",
};

const PERFORMANCE_SUB_INFO: Record<string, string> = {
  overview:
    "The headline numbers for your content in the selected period. Connect a platform to see reach and engagement roll up here.",
  pieces:
    "Performance broken out piece by piece, so you can see your best and worst performers. Published pieces appear once platform data is flowing.",
  outliers:
    "Pieces that clearly beat your usual numbers, flagged for you automatically. Use them to spot a format or hook worth repeating.",
  audience:
    "Who is watching and how your following is growing. Demographics and growth trends appear once your platforms are linked.",
};

// Creators owns three views of the same machine: who it reads, what it found, and what it did.
// These are sub-tabs rather than new top-level tabs on purpose (Brett 2026-07-30): the nav gets
// merged into, never widened.
const CREATORS_SUB_INFO: Record<string, string> = {
  roster:
    "Everyone the machine reads, and what each one is for. Copy means their winning formats get turned into your scripts; Learn from feeds your Brain; Track only collects without copying; Ideas only is inspiration whose format is never reused. Pausing someone here stops them being read anywhere.",
  signal:
    "The winning posts the machine found. A post only counts if it beat that same creator's own normal numbers, so a huge account cannot drown out a small one. Every script you get is built from these.",
  runs:
    "Every pass the machine has made, newest first, including anyone it could not read. Check here if scripts stop appearing.",
};

type Tab = "overview" | "workspace" | "board" | "record" | "performance" | "creators";
type WorkspaceSub = "pipeline" | "sources" | "calendar" | "ideas";
type PerformanceSub = "overview" | "pieces" | "outliers" | "audience";
type CreatorsSub = "roster" | "signal" | "runs";

const CREATORS_SUBS: { key: CreatorsSub; label: string }[] = [
  { key: "roster", label: "Roster" },
  { key: "signal", label: "What it found" },
  { key: "runs",   label: "Run history" },
];

const WORKSPACE_SUBS: { key: WorkspaceSub; label: string }[] = [
  { key: "pipeline",  label: "Pipeline" },
  { key: "sources",   label: "Sources" },
  { key: "calendar",  label: "Calendar" },
  { key: "ideas",     label: "Ideas" },
];

const PERFORMANCE_SUBS: { key: PerformanceSub; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "pieces",   label: "Pieces" },
  { key: "outliers", label: "Outliers" },
  { key: "audience", label: "Audience" },
];

export default async function ContentPage({ searchParams }: { searchParams: Promise<{ tab?: Tab; sub?: string; range?: string; from?: string; to?: string; piece?: string }> }) {
  const sp = await searchParams;


  const { supabase, agencyId } = await getAuthContext();
  await getActiveAgencyTemplate();
  const settings = await loadCreatorSettings(agencyId!);
  const TABS = [
    { key: "overview", label: "Overview" },
    { key: "board", label: "Board" },
    { key: "record", label: "Record" },
    { key: "creators", label: "Creators" },
    { key: "performance", label: "Performance" },
  ];
  const validTabs = new Set(TABS.map((t) => t.key));
  const tab: Tab = sp.tab && validTabs.has(sp.tab) ? sp.tab : "overview";
  const sub = sp.sub;
  const { data: items } = await supabase
    .from("content")
    .select("id,title,content_type,status,scheduled_for,created_at")
    .eq("agency_id", agencyId!)
    .order("scheduled_for", { ascending: true, nullsFirst: false });

  // Content board cards. content_cards is not in the generated Supabase types yet, so the board
  // query goes through the untyped-cast client (the repo idiom, see src/lib/agents/run.ts). The
  // Demo Workspace renders canned cards and never touches the DB.
  const sbCards = supabase as unknown as SupabaseClient;
  const { data: cardRows } = await sbCards
    .from("content_cards")
    .select("id,stage,position,title,topic,format,platform,hook,script,source,plan_month,notes,created_by,created_at,updated_at,posted_at,stage_history")
    .eq("agency_id", agencyId!)
    .order("position", { ascending: true });
  const boardCards: BoardCard[] = ((cardRows ?? []) as Record<string, unknown>[]).map(toBoardCard);

  // The Content Machine roster plus the numbers behind the flow map. Like content_cards, these
  // tables predate the generated types, so they go through the untyped-cast client. agency_id is
  // filtered explicitly on every read because View-as swaps in a service-role client and RLS stops
  // running.
  let workspaceName: string | null = null;
  let creators: Creator[] = [];
  let outliers: Outlier[] = [];
  let runs: Run[] = [];
  // The lanes this workspace actually runs, so the roster offers real choices rather than a
  // hardcoded list. A workspace with no plan gets none, and every creator feeds every piece.
  const contentLanes = [
    ...new Set(Object.values(settings.contentLanes ?? {}).flat().map((l) => String(l).trim()).filter(Boolean)),
  ];
  if (tab === "creators") {
    const sbu = supabase as unknown as SupabaseClient;
    const { data: ws } = await sbu.from("agencies").select("name").eq("id", agencyId!).maybeSingle();
    workspaceName = (ws as { name?: string } | null)?.name ?? null;
    const [rosterRes, outlierRes, runRes] = await Promise.all([
      sbu.from("content_creators")
        .select("id,handle,name,instagram,youtube,role,status,note,last_scraped_at,posts_count,videos_count,followers,scrape_limit,why,lanes")
        .eq("agency_id", agencyId!)
        .order("name", { ascending: true }),
      sbu.from("content_outliers")
        .select("id,url,platform,creator,handle,posted,post_type,metric,score,creator_median,multiple,views,likes,comments,analysed,caption_hook,hook_type,hook_template,format,ask,why_it_worked")
        .eq("agency_id", agencyId!)
        .order("multiple", { ascending: false })
        .limit(500),
      sbu.from("content_machine_runs")
        .select("id,stage,ran_at,creators_read,creators_skipped,outliers_found,outliers_analysed,scripts_written,detail")
        .eq("agency_id", agencyId!)
        .order("ran_at", { ascending: false })
        .limit(50),
    ]);
    creators = (rosterRes.data ?? []) as Creator[];
    outliers = (outlierRes.data ?? []) as Outlier[];
    runs = (runRes.data ?? []) as Run[];
  }

  // Everything the Overview draws. Counts are measured from the same tables the pipeline writes,
  // so the map can never claim something the machine did not actually do. agency_id is filtered
  // explicitly on every read because View-as swaps in a service-role client and RLS stops running.
  let machineStats: MachineStats | null = null;
  if (tab === "overview") {
    const sbu = supabase as unknown as SupabaseClient;
    const { data: wsRow } = await sbu.from("agencies").select("name").eq("id", agencyId!).maybeSingle();
    workspaceName = (wsRow as { name?: string } | null)?.name ?? null;
    const [rosterRes, docsRes, parseRes, scriptRes] = await Promise.all([
      sbu.from("content_creators").select("name,role,status,posts_count,videos_count").eq("agency_id", agencyId!),
      sbu.from("knowledge_docs").select("title,content_text").eq("agency_id", agencyId!),
      sbu.from("content_machine_runs").select("outliers_found,outliers_analysed,ran_at")
        .eq("agency_id", agencyId!).eq("stage", "parse")
        .order("ran_at", { ascending: false }).limit(1).maybeSingle(),
      sbu.from("content_cards").select("id", { count: "exact", head: true })
        .eq("agency_id", agencyId!).eq("stage", "scripted"),
    ]);

    const roster = (rosterRes.data ?? []) as {
      name: string; role: string; status: string; posts_count: number | null; videos_count: number | null;
    }[];
    const active = roster.filter((r) => r.status === "active");
    const docs = (docsRes.data ?? []) as { title: string; content_text: string | null }[];
    const lenOf = (match: string) =>
      docs.find((d) => d.title.toLowerCase().includes(match))?.content_text?.length ?? 0;
    const parse = parseRes.data as { outliers_found?: number; outliers_analysed?: number; ran_at?: string } | null;

    machineStats = {
      learnFrom: active.filter((r) => r.role === "strategist").length,
      copy: active.filter((r) => r.role === "emulate").length,
      posts: roster.reduce((n, r) => n + (r.posts_count ?? 0), 0),
      videos: roster.reduce((n, r) => n + (r.videos_count ?? 0), 0),
      brainChars: lenOf("strategist brain"),
      proofChars: lenOf("proof inventory"),
      winners: parse?.outliers_found ?? 0,
      patterns: parse?.outliers_analysed ?? 0,
      parsedAt: parse?.ran_at ?? null,
      scripts: scriptRes.count ?? 0,
      names: {
        strategist: active.filter((r) => r.role === "strategist").map((r) => r.name),
        emulate: active.filter((r) => r.role === "emulate").map((r) => r.name),
      },
    };
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="sk-label">CONTENT</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#F5F5F7]" style={{fontFamily:"var(--font-settoku-display),Georgia,serif"}}>Content</h1>
          <p className="mt-1.5 text-sm text-[#A8B0BD]">
            Plan and run the content pipeline, from the first idea to the finished script.
          </p>
        </div>
      </div>

      <ClientTabs
        tabs={TABS}
        initialTab={tab}
        info={CONTENT_TAB_INFO}
        panels={{
          workspace: <WorkspaceTab items={items ?? []} sub={(sub as WorkspaceSub) ?? "pipeline"} />,
          board: (
            <ContentBoard
              initialCards={boardCards}
              isDemo={false}
              googleDoc={{
                connected: !!settings.googleDocId,
                url: settings.googleDocUrl,
                serviceAccountEmail: googleServiceAccountEmail(),
              }}
            />
          ),
          // Everything ready to record, newest first: the freshest script is the one he has not
          // seen yet, and it is what the morning run just wrote.
          record: (
            <FilmPanel
              cards={boardCards
                .filter((c) => c.stage === "scripted")
                .sort((a, b) => b.created_at.localeCompare(a.created_at))
                .map((c) => ({
                  id: c.id,
                  title: c.title,
                  platform: c.platform,
                  format: c.format,
                  script: c.script,
                  notes: c.notes,
                  source: c.source,
                }))}
            />
          ),
          overview: machineStats
            ? <MachineMap stats={machineStats} workspace={workspaceName} />
            : <EmptyPanel icon={BarChart2} title="Nothing to map yet" sub="The overview fills in once the machine has run." />,
          creators: (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[rgba(255,255,255,0.06)] pb-2">
                <div className="flex gap-0 overflow-x-auto">
                  {CREATORS_SUBS.map(s => (
                    <div key={s.key} className="flex shrink-0 items-center">
                      <Link
                        href={`?tab=creators&sub=${s.key}`}
                        replace
                        scroll={false}
                        className={`py-2 pl-4 pr-1 text-sm font-medium transition-colors ${
                          (sub ?? "roster") === s.key
                            ? "text-[#F5F5F7] border-b-2 border-blue-500 -mb-[10px]"
                            : "text-[#A8B0BD] hover:text-[#F5F5F7]"
                        }`}
                      >{s.label}</Link>
                      <TabInfo label={s.label} text={CREATORS_SUB_INFO[s.key]} className="mr-2" />
                    </div>
                  ))}
                </div>
              </div>
              {(sub ?? "roster") === "signal"
                ? <SignalPanel outliers={outliers} />
                : (sub ?? "roster") === "runs"
                ? <RunsPanel runs={runs} nextRun={null} />
                : <CreatorsPanel initialCreators={creators} workspace={workspaceName} lanes={contentLanes} />}
            </div>
          ),
          performance: <PerformanceTab sub={(sub as PerformanceSub) ?? "overview"} />,
        }}
      />
    </div>
  );
}

// content_cards row -> BoardCard. Coerces the untyped query result into the shape the board
// renders; the DB check constraints guarantee stage/format/platform are already valid values.
function toBoardCard(r: Record<string, unknown>): BoardCard {
  return {
    id: String(r.id),
    stage: (r.stage as Stage) ?? "ideas",
    position: typeof r.position === "number" ? r.position : Number(r.position ?? 0),
    title: String(r.title ?? ""),
    topic: (r.topic as string | null) ?? null,
    format: (r.format as Format | null) ?? null,
    platform: (r.platform as Platform | null) ?? null,
    hook: (r.hook as string | null) ?? null,
    script: (r.script as string | null) ?? null,
    source: (r.source as string | null) ?? null,
    plan_month: (r.plan_month as string | null) ?? null,
    notes: (r.notes as string | null) ?? null,
    created_by: String(r.created_by ?? "human"),
    created_at: String(r.created_at ?? new Date().toISOString()),
    updated_at: String(r.updated_at ?? new Date().toISOString()),
    posted_at: (r.posted_at as string | null) ?? null,
    stage_history: Array.isArray(r.stage_history) ? (r.stage_history as StageEvent[]) : [],
  };
}

type Item = { id: string; title: string; content_type: string | null; status: string | null; scheduled_for: string | null; created_at: string };

function WorkspaceTab({ items, sub }: { items: Item[]; sub: WorkspaceSub }) {
  const scripting = items.filter(i => i.status === "draft" || i.status === "scripting");
  const editing = items.filter(i => i.status === "editing" || i.status === "review");
  const queued = items.filter(i => i.status === "scheduled" || i.status === "queued");

  return (
    <div className="space-y-6">
      {/* Sub-tabs + period */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[rgba(255,255,255,0.06)] pb-2">
        <div className="flex gap-0 overflow-x-auto">
          {WORKSPACE_SUBS.map(s => (
            <div key={s.key} className="flex shrink-0 items-center">
              <Link
                href={`?tab=workspace&sub=${s.key}`}
                replace
                scroll={false}
                className={`py-2 pl-4 pr-1 text-sm font-medium transition-colors ${
                  sub === s.key ? "text-[#F5F5F7] border-b-2 border-blue-500 -mb-[10px]" : "text-[#A8B0BD] hover:text-[#F5F5F7]"
                }`}
              >{s.label}</Link>
              <TabInfo label={s.label} text={WORKSPACE_SUB_INFO[s.key]} className="mr-2" />
            </div>
          ))}
        </div>
      </div>

      {sub === "pipeline" && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <KanbanColumn title="Scripting" count={scripting.length} items={scripting} color="text-purple-400" />
          <KanbanColumn title="Editing"   count={editing.length}   items={editing}   color="text-amber-400" />
          <KanbanColumn title="Queued"    count={queued.length}    items={queued}    color="text-emerald-400" />
        </div>
      )}

      {sub === "sources" && (
        <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] p-5">
          <div className="text-sm font-semibold text-[#F5F5F7] mb-3">Source ROI</div>
          <EmptyPanel icon={BarChart2} title="No source attribution" sub="Tag pieces with the source/idea origin to see what's working." />
        </div>
      )}

      {sub === "calendar" && (
        <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] p-5">
          <EmptyPanel icon={BarChart2} title="Calendar view coming" sub="Month view of scheduled pieces ships next." />
        </div>
      )}

      {sub === "ideas" && (
        <div className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] p-5">
          {/* Ideas reconciliation (Board v1.1): this older list overlapped the Board's Ideas column
              and had no way to add an idea. Point people to the Board without removing anything. */}
          <div className="flex items-start gap-3 rounded-lg border border-[rgba(0,131,255,0.20)] bg-[rgba(0,131,255,0.04)] p-4">
            <BarChart2 className="mt-0.5 size-4 shrink-0 text-[#0083FF]" />
            <div className="text-sm leading-relaxed text-[#A8B0BD]">
              <span className="font-medium text-[#F5F5F7]">Ideas live on the Board now.</span>{" "}
              This older list is kept for reference so nothing is lost. To add and work an idea, use the Board and its Ideas column: add a card, write the hook and script, then drag it forward as it gets made.
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="?tab=board"
              scroll={false}
              className="inline-flex items-center gap-2 rounded-full bg-[#0083FF] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0072e0]"
            >
              <Plus className="size-4" /> New card on the Board
            </Link>
            <Link href="?tab=board" scroll={false} className="inline-flex items-center gap-1.5 text-sm text-[#0083FF] hover:underline">
              Open the Board <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <EmptyPanel icon={BarChart2} title="No ideas in this older list" sub="This bank is not being added to anymore. New ideas go on the Board." />
        </div>
      )}
    </div>
  );
}

function KanbanColumn({ title, count, items, color }: { title: string; count: number; items: Item[]; color: string }) {
  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0C0C10]/40 p-4 min-h-[300px]">
      <div className="mb-3 flex items-center justify-between">
        <span className={`text-xs font-semibold uppercase tracking-widest ${color}`}>{title}</span>
        <span className="text-xs font-medium text-[#A8B0BD] tabular-nums">{count}</span>
      </div>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-xs text-[#7C8595] text-center py-6">Empty</p>
        ) : items.map(it => (
          <div key={it.id} className="rounded-md border border-[rgba(255,255,255,0.08)] bg-[#0C0C10]/80 p-2.5">
            <div className="text-xs font-medium text-[#F5F5F7] line-clamp-2">{it.title}</div>
            <div className="mt-1 text-[10px] text-[#7C8595] capitalize">{it.content_type ?? "post"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PerformanceTab({ sub }: { sub: PerformanceSub }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[rgba(255,255,255,0.06)] pb-2">
        <div className="flex gap-0 overflow-x-auto">
          {PERFORMANCE_SUBS.map(s => (
            <div key={s.key} className="flex shrink-0 items-center">
              <Link
                href={`?tab=performance&sub=${s.key}`}
                replace
                scroll={false}
                className={`py-2 pl-4 pr-1 text-sm font-medium transition-colors ${
                  sub === s.key ? "text-[#F5F5F7] border-b-2 border-blue-500 -mb-[10px]" : "text-[#A8B0BD] hover:text-[#F5F5F7]"
                }`}
              >{s.label}</Link>
              <TabInfo label={s.label} text={PERFORMANCE_SUB_INFO[s.key]} className="mr-2" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total reach" value="-" sub="Connect platforms" accent />
        <StatCard label="Engagement rate" value="-" sub="Likes + comments / reach" />
        <StatCard label="New followers" value="-" sub="Across all channels" />
        <StatCard label="Pieces published" value="-" sub="In this period" />
      </div>

      {sub === "overview" && (
        <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] p-5">
          <div className="text-sm font-semibold text-[#F5F5F7] mb-3">Source ROI</div>
          <EmptyPanel icon={BarChart2} title="Connect a platform" sub="Wire Instagram, YouTube, or TikTok in Settings → Integrations to see ROI per source." />
        </div>
      )}

      {sub === "pieces" && (
        <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] p-5">
          <EmptyPanel icon={Eye} title="No published pieces yet" sub="Performance per piece appears here once content is live." />
        </div>
      )}

      {sub === "outliers" && (
        <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] p-5">
          <EmptyPanel icon={Heart} title="No outliers detected" sub="AI flags pieces that meaningfully outperform your baseline." />
        </div>
      )}

      {sub === "audience" && (
        <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] p-5">
          <EmptyPanel icon={UserPlus} title="No audience data" sub="Demographics and growth trends appear here once platforms are linked." />
        </div>
      )}
    </div>
  );
}
