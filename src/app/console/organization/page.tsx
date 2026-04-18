"use client";

import { useEffect, useState } from "react";
import { useConsole } from "../console-context";
import type { ConsoleOrganization } from "../console-context";
import {
  authHeaders,
  useServiceHealth,
  planFromHealth,
  type ServiceHealth,
} from "../console-utils";
import { AUTH_API_URL, SERVICE_DOMAIN } from "@/lib/constants";
import Link from "next/link";

export default function OrganizationPage() {
  const { session } = useConsole();

  if (!session?.organization) {
    return (
      <div className="text-gray-500 text-sm py-12 text-center">
        No organization selected.
      </div>
    );
  }

  return (
    <OrganizationInfo
      organization={session.organization}
      permissions={session.permissions}
    />
  );
}

function OrganizationInfo({
  organization,
  permissions,
}: {
  organization: ConsoleOrganization;
  permissions: string[];
}) {
  const health = useServiceHealth(organization.slug);
  const isAdmin = permissions.includes("l4:admin");

  // Shared period state: flipping daily/weekly/monthly on one chart
  // cascades to every other usage chart in the tab.
  const [period, setPeriod] = useState<Period>("daily");

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Name", value: <strong>{organization.name}</strong> },
    {
      label: "Registered since",
      value: new Date(organization.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
    {
      label: "Subscription",
      value: (
        <ServiceDetails
          health={health}
          isAdmin={isAdmin}
          slug={organization.slug}
        />
      ),
    },
    {
      label: "L4 Deployment URL",
      value: (
        <div className="w-full">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <DeploymentUrl slug={organization.slug} health={health} />
            {isAdmin && health.state === "ok" && (
              <RestartServiceButton slug={organization.slug} />
            )}
          </div>
        </div>
      ),
    },
    {
      label: "L4 Requests",
      value: (
        <UsageChart
          slug={organization.slug}
          health={health}
          isAdmin={isAdmin}
          period={period}
          onPeriodChange={setPeriod}
        />
      ),
    },
    {
      label: "Legalese AI Usage",
      value: (
        <AiUsageChart
          slug={organization.slug}
          health={health}
          period={period}
          onPeriodChange={setPeriod}
        />
      ),
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      <dl className="divide-y divide-gray-100 min-w-0">
        {rows.map(({ label, value }) => (
          <div key={label} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 break-words">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// ── Deployment URL ──────────────────────────────────────────────────────

function DeploymentUrl({ slug, health }: { slug: string; health: ServiceHealth }) {
  const url = `https://${slug}.${SERVICE_DOMAIN}`;
  let dot: React.ReactNode;
  let suffix: React.ReactNode = null;

  if (health.state === "loading") {
    dot = (
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-300 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gray-300" />
      </span>
    );
  } else if (health.state === "error") {
    dot = (
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gray-300" />
      </span>
    );
    suffix = <span className="text-gray-400 text-sm">unavailable</span>;
  } else {
    const allStatuses = health.data.instances.map((i) => i.deploymentStatus).filter(Boolean);
    const total = allStatuses.reduce((sum, s) => sum + (s?.total ?? 0), 0);
    const failed = allStatuses.reduce((sum, s) => sum + (s?.failed ?? 0), 0);
    const compiling = allStatuses.reduce((sum, s) => sum + (s?.compiling ?? 0), 0);

    if (health.data.status === "idle") {
      dot = (
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400" />
        </span>
      );
      suffix = <span className="text-gray-400 text-sm">idle</span>;
    } else {
      const dotColor =
        failed > 0 ? "bg-red-500"
        : compiling > 0 ? "bg-yellow-400"
        : "bg-green-500";
      dot = (
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${dotColor}`} />
        </span>
      );
      suffix = (
        <span className="text-gray-400 text-sm">
          {total === 1 ? "1 deployment" : `${total} deployments`}
        </span>
      );
    }
  }

  // Extract build tag from binaryUrl (e.g. ".../releases/download/vscode-wasm-build-63/..." → "vscode-wasm-build-63")
  const buildTag = health.state === "ok" && health.data.config?.binaryUrl
    ? health.data.config.binaryUrl.match(/\/releases\/download\/([^/]+)\//)?.[1] ?? null
    : null;

  return (
    <div>
      <span className="inline-flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-2">
          {dot}
          <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-2">
            {url}
          </a>
        </span>
        {suffix}
      </span>
      {buildTag && <div className="text-gray-400 font-mono text-xs mt-1">{buildTag}</div>}
    </div>
  );
}

// ── Restart Button ──────────────────────────────────────────────────────

function RestartServiceButton({ slug }: { slug: string }) {
  const [state, setState] = useState<"idle" | "confirming" | "restarting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleRestart() {
    setState("restarting");
    setErrorMsg("");
    try {
      const res = await fetch(`${AUTH_API_URL}/service/restart?org=${encodeURIComponent(slug)}`, {
        method: "POST",
        headers: authHeaders(),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? body.detail ?? `HTTP ${res.status}`);
      }
      setState("success");
      setTimeout(() => setState("idle"), 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Restart failed");
      setState("error");
      setTimeout(() => setState("idle"), 5000);
    }
  }

  if (state === "confirming") {
    return (
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="text-gray-500">Restart service?</span>
        <button onClick={handleRestart} className="text-red-600 hover:text-red-700 font-medium underline underline-offset-2">Yes, restart</button>
        <button onClick={() => setState("idle")} className="text-gray-500 hover:text-gray-700 underline underline-offset-2">Cancel</button>
      </span>
    );
  }
  if (state === "restarting") {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-gray-500">
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Restarting...
      </span>
    );
  }
  if (state === "success") return <span className="text-sm text-green-600">Service restarted</span>;
  if (state === "error") return <span className="text-sm text-red-600">{errorMsg}</span>;
  return (
    <button onClick={() => setState("confirming")} className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2">
      Restart service
    </button>
  );
}

// ── Service Details ─────────────────────────────────────────────────────

function ServiceDetails({
  health,
  isAdmin,
  slug,
}: {
  health: ServiceHealth;
  isAdmin: boolean;
  slug: string;
}) {
  if (health.state !== "ok" || !health.data.config) return null;
  const cfg = health.data.config;
  const instanceCount = health.data.instances.length;
  const hostingDetails = [
    { label: "Instances", value: String(instanceCount) },
    { label: "Max deployments", value: String(cfg.maxDeployments ?? "-") },
    { label: "Max concurrent requests", value: String(cfg.maxConcurrentRequests ?? "-") },
    { label: "Max evaluation memory", value: `${cfg.maxEvalMemoryMb ?? "-"} MB` },
    { label: "Compile memory", value: `${cfg.compileMemoryMb ?? "-"} MB` },
    { label: "Evaluation timeout", value: `${cfg.evalTimeoutSeconds ?? "-"}s` },
    { label: "Compile timeout", value: `${cfg.compileTimeoutSeconds ?? "-"}s` },
    { label: "Max deployment size", value: `${cfg.maxZipSizeMb ?? "-"} MB` },
    { label: "Idle timeout", value: cfg.idleTimeoutHours === 0 ? "Always on" : `${cfg.idleTimeoutHours ?? "-"} hours` },
    { label: "Daily request limit", value: String(cfg.dailyRequestLimit ?? "-") },
  ];

  // Fold in AI limits when auth-proxy surfaced them from the shared
  // /efs/config files (.ai block). Undefined means no `.ai` configured
  // yet — we hide the rows rather than show a half-populated panel.
  const aiDetails: { label: string; value: string }[] = [];
  const ai = cfg.ai;
  if (ai) {
    if (typeof ai.dailyTokenLimit === "number") {
      aiDetails.push({
        label: "Daily token limit",
        value:
          ai.dailyTokenLimit > 0
            ? formatTokenLimit(ai.dailyTokenLimit)
            : "Unlimited (metered)",
      });
    }
    if (typeof ai.maxToolRounds === "number") {
      aiDetails.push({
        label: "Max tool rounds",
        value: String(ai.maxToolRounds),
      });
    }
    if (typeof ai.conversationTtlDays === "number") {
      aiDetails.push({
        label: "Conversation retention",
        value: `${ai.conversationTtlDays} days`,
      });
    }
  }
  return (
    <div>
      {cfg.suspended && (
        <div className="mb-3 flex items-start gap-2 rounded border border-yellow-400 bg-yellow-50 px-3 py-2.5 text-sm text-yellow-800">
          <span className="shrink-0">⚠</span>
          <span>
            This organization has been suspended.{" "}
            {isAdmin ? (
              <>Please contact <a href={`mailto:support@legalese.com?subject=${encodeURIComponent(`Account suspended - ${slug}`)}`} className="underline underline-offset-2">support@legalese.com</a>.</>
            ) : (
              "Please contact your administrator."
            )}
          </span>
        </div>
      )}
      <details className="group">
        <summary className="cursor-pointer select-none list-none">
          <span>{planFromHealth(health)}</span>
        </summary>
        <div
          className="mt-2 grid sm:grid-cols-2 gap-x-8 gap-y-4"
          style={{ padding: "8px 12px", border: "1px solid #eee", borderRadius: "4px" }}
        >
          <div>
            <b className="text-gray-500 mb-1.5">L4 Hosting</b>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
              {hostingDetails.map(({ label, value }) => (
                <div key={label} className="contents">
                  <dt className="text-gray-400">{label}</dt>
                  <dd className="text-gray-600 font-mono">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          {aiDetails.length > 0 && (
            <div>
              <b className="text-gray-500 mb-1.5">Legalese AI</b>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
                {aiDetails.map(({ label, value }) => (
                  <div key={label} className="contents">
                    <dt className="text-gray-400">{label}</dt>
                    <dd className="text-gray-600 font-mono">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}

// ── Usage Chart ─────────────────────────────────────────────────────────

type Period = "daily" | "weekly" | "monthly";
const PERIODS: Period[] = ["daily", "weekly", "monthly"];

interface Bucket {
  label: string;
  count: number;
}

function UsageChart({
  slug,
  health,
  isAdmin,
  period,
  onPeriodChange,
}: {
  slug: string;
  health: ServiceHealth;
  isAdmin: boolean;
  period: Period;
  onPeriodChange: (p: Period) => void;
}) {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayCount, setTodayCount] = useState<number | null>(null);

  const days = period === "daily" ? 30 : 90;

  useEffect(() => {
    if (health.state !== "ok") return;
    let cancelled = false;
    setLoading(true);

    fetch(`${AUTH_API_URL}/billing/usage?org=${encodeURIComponent(slug)}&period=${period}&days=${days}`, {
      headers: authHeaders(),
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          const b: Bucket[] = data.buckets ?? [];
          setBuckets(b);
          if (period === "daily" && b.length > 0) {
            setTodayCount(b[b.length - 1].count);
          }
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [slug, period, days, health.state]);

  if (health.state === "loading") {
    return <div className="h-32 flex items-center justify-center text-gray-400 text-xs">Loading...</div>;
  }
  if (health.state === "error") {
    return <span className="text-gray-400 text-sm">Service temporarily unavailable</span>;
  }

  const maxCount = Math.max(1, ...buckets.map((b) => b.count));

  const labelInterval = period === "daily" ? 5 : 1;

  return (
    <div>
      {(() => {
        const limit = health.data.config?.dailyRequestLimit ?? 0;
        if (limit > 0 && todayCount !== null && todayCount >= limit) {
          return (
            <div className="mb-3 flex items-start gap-2 rounded border border-yellow-400 bg-yellow-50 px-3 py-2.5 text-sm text-yellow-800">
              <span className="shrink-0">⚠</span>
              <span>
                You have reached your daily request limit.{" "}
                {isAdmin ? (
                  <>Contact <a href={`mailto:support@legalese.com?subject=${encodeURIComponent(`Increase request limit - ${slug}`)}`} className="underline underline-offset-2">support@legalese.com</a> to increase your limits.</>
                ) : (
                  "Please contact your administrator."
                )}
              </span>
            </div>
          );
        }
        return null;
      })()}

      {/* Period selector (shared state — flipping here also updates sibling charts) */}
      <PeriodSelector period={period} onChange={onPeriodChange} />

      <BarChart buckets={buckets} loading={loading} period={period} labelInterval={labelInterval} />

      <p className="text-xs text-gray-500 mt-2">
        These are the number of requests made to your L4 service. To get started, deploy your first L4 rules using our <a href="https://marketplace.visualstudio.com/items?itemName=Legalese.l4-vscode" target="_blank" rel="noopener">Visual Studio Code L4 Extension</a> or try the <a href="https://jl4.legalese.com" target="_blank" rel="noopener">online editor</a>.
      </p>
    </div>
  );
}

// ── AI Usage Chart ──────────────────────────────────────────────────────
//
// Token consumption from the ai-proxy (via auth-proxy's shared
// /billing/usage endpoint with source=ai-chat). Filter by pipeline model
// and by token metric; inherits the shared `period` state so flipping
// daily/weekly/monthly moves this chart in lockstep with the L4 one.

type AiMetric = "totalTokens" | "promptTokens" | "completionTokens" | "requests";
const AI_METRICS: { value: AiMetric; label: string }[] = [
  { value: "totalTokens", label: "Total tokens" },
  { value: "promptTokens", label: "Prompt tokens" },
  { value: "completionTokens", label: "Completion tokens" },
  { value: "requests", label: "Requests" },
];

const AI_MODELS: { value: string; label: string }[] = [
  { value: "", label: "All models" },
  { value: "legalese-compose-4", label: "Compose" },
  { value: "legalese-summize-4", label: "Summize" },
];

function AiUsageChart({
  slug,
  health,
  period,
  onPeriodChange,
}: {
  slug: string;
  health: ServiceHealth;
  period: Period;
  onPeriodChange: (p: Period) => void;
}) {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState(true);
  const [metric, setMetric] = useState<AiMetric>("totalTokens");
  const [model, setModel] = useState<string>("");

  const days = period === "daily" ? 30 : 90;

  useEffect(() => {
    if (health.state !== "ok") return;
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams({
      org: slug,
      source: "ai-chat",
      period,
      days: String(days),
      metric,
    });
    if (model) params.set("model", model);

    fetch(`${AUTH_API_URL}/billing/usage?${params.toString()}`, {
      headers: authHeaders(),
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setBuckets(data.buckets ?? []);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [slug, period, days, metric, model, health.state]);

  if (health.state === "loading") {
    return <div className="h-32 flex items-center justify-center text-gray-400 text-xs">Loading...</div>;
  }
  if (health.state === "error") {
    return <span className="text-gray-400 text-sm">Service temporarily unavailable</span>;
  }

  const labelInterval = period === "daily" ? 5 : 1;

  return (
    <div>
      {/* Period + model + metric controls */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <PeriodSelector period={period} onChange={onPeriodChange} />
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="text-xs rounded border border-gray-200 bg-white px-2 py-0.5 text-gray-600"
        >
          {AI_MODELS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value as AiMetric)}
          className="text-xs rounded border border-gray-200 bg-white px-2 py-0.5 text-gray-600"
        >
          {AI_METRICS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      <BarChart buckets={buckets} loading={loading} period={period} labelInterval={labelInterval} />

      <p className="text-xs text-gray-500 mt-2">
        Token consumption for Legalese AI chat use.
      </p>
    </div>
  );
}

// ── Shared chart primitives ─────────────────────────────────────────────

function PeriodSelector({
  period,
  onChange,
}: {
  period: Period;
  onChange: (p: Period) => void;
}) {
  return (
    <div className="flex gap-1">
      {PERIODS.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-2 py-0.5 text-xs rounded transition-colors ${
            period === p
              ? "bg-accent text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          {p.charAt(0).toUpperCase() + p.slice(1)}
        </button>
      ))}
    </div>
  );
}

function BarChart({
  buckets,
  loading,
  period,
  labelInterval,
}: {
  buckets: Bucket[];
  loading: boolean;
  period: Period;
  labelInterval: number;
}) {
  if (loading) {
    return <div className="h-32 flex items-center justify-center text-gray-400 text-xs">Loading...</div>;
  }
  if (buckets.length === 0) {
    return <div className="h-32 flex items-center justify-center text-gray-400 text-xs">No usage data for this period</div>;
  }
  const maxCount = Math.max(1, ...buckets.map((b) => b.count));
  return (
    <div>
      <div className="flex items-end gap-px h-32">
        {buckets.map((bucket) => {
          const pct = (bucket.count / maxCount) * 100;
          return (
            <div key={bucket.label} className="flex-1 flex flex-col items-center justify-end h-full group relative">
              <div
                className="w-full bg-accent/70 hover:bg-accent rounded-t transition-colors min-h-[1px]"
                style={{ height: `${Math.max(pct, bucket.count > 0 ? 2 : 0)}%` }}
              />
              <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                {bucket.label}: {bucket.count.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-px mt-1">
        {buckets.map((bucket, i) => (
          <div key={bucket.label} className="flex-1 text-center">
            {i % labelInterval === 0 ? (
              <span className="text-[9px] text-gray-400 leading-none">
                {formatLabel(bucket.label, period)}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatLabel(label: string, period: Period): string {
  if (period === "monthly") {
    // "2026-03" → "Mar" (noon UTC avoids day-boundary timezone shifts)
    const d = new Date(label + "-01T12:00:00Z");
    return d.toLocaleDateString(undefined, { month: "short" });
  }
  // daily/weekly: "2026-03-23" → "Mar 23"
  const d = new Date(label + "T12:00:00Z");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/**
 * Render a token quota at human scale: "10M", "2.5M", "250K".
 * Plain `toLocaleString()` on "10000000" is readable but long — the
 * subscription panel is compact, so abbreviate when we can lose no
 * meaningful precision.
 */
function formatTokenLimit(tokens: number): string {
  if (tokens >= 1_000_000) {
    const m = tokens / 1_000_000;
    const value = Number.isInteger(m) ? m.toFixed(0) : m.toFixed(1);
    return `${value}M`;
  }
  return `${tokens}`;
}
