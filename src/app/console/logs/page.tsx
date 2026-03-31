"use client";

import { useEffect, useRef, useState } from "react";
import { useConsole } from "../console-context";
import { authHeaders } from "../console-utils";
import { AUTH_API_URL } from "@/lib/constants";
import { SectionSpinner } from "../section-spinner";

const POLL_INTERVAL_MS = 20_000;

interface LogEntry {
  ts: string;
  level: string;
  msg: string;
  source?: string;
  deploymentId?: string;
  fn?: string;
  status?: number;
  durationMs?: number;
  method?: string;
  path?: string;
  [key: string]: unknown;
}

export default function LogsPage() {
  const { session } = useConsole();
  const slug = session?.organization?.slug;
  const isAdmin = session?.permissions?.includes("l4:admin") ?? false;
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTs, setExpandedTs] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const newestTsRef = useRef<string | undefined>();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep ref in sync with latest entry timestamp (+1ms to avoid duplicates)
  useEffect(() => {
    const ts = entries[0]?.ts;
    if (!ts) return;
    newestTsRef.current = new Date(new Date(ts).getTime() + 1).toISOString();
  }, [entries]);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    async function fetchLogs(since?: string) {
      try {
        const sinceParam = since ? `&since=${encodeURIComponent(since)}` : "";
        const res = await fetch(
          `${AUTH_API_URL}/service/logs?org=${encodeURIComponent(slug!)}${sinceParam}`,
          { headers: authHeaders(), credentials: "include" },
        );
        if (!res.ok) {
          if (!cancelled) setError("Service temporarily unavailable");
          return;
        }
        const data = await res.json();
        if (cancelled) return;

        if (since && data.entries?.length > 0) {
          setEntries((prev) => {
            const existingKeys = new Set(prev.map((e: LogEntry) => `${e.ts}-${e.msg}`));
            const newEntries = data.entries.filter(
              (e: LogEntry) => !existingKeys.has(`${e.ts}-${e.msg}`),
            );
            return [...newEntries, ...prev].slice(0, 200);
          });
        } else if (!since) {
          setEntries(data.entries ?? []);
        }
        setLastUpdated(data.lastUpdated ?? new Date().toISOString());
        setError(null);
      } catch {
        if (!cancelled) setError("Service temporarily unavailable");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    // Initial fetch
    fetchLogs();

    // Poll using ref for latest timestamp (no side effects in setState)
    function startPolling() {
      timerRef.current = setInterval(() => {
        if (document.visibilityState !== "visible") return;
        fetchLogs(newestTsRef.current);
      }, POLL_INTERVAL_MS);
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        fetchLogs(newestTsRef.current);
        if (!timerRef.current) startPolling();
      } else {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }

    startPolling();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [slug, refreshKey]);

  if (!slug) {
    return <div className="text-gray-500 text-sm py-12 text-center">No organization selected.</div>;
  }

  return (
    <div className="font-sans">
      <div className="flex justify-between mb-4">
        {lastUpdated ?
          <>
            <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter..."
            className="text-sm border border-gray-200 rounded px-2 py-1 w-40 focus:outline-none focus:border-gray-400"
          />
          <span className="text-xs text-gray-400 flex items-center gap-2">
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            <button
              onClick={() => {
                setEntries([]);
                setLoading(true);
                newestTsRef.current = undefined;
                setRefreshKey((k) => k + 1);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Refresh"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H4.598a.75.75 0 0 0-.75.75v3.634a.75.75 0 0 0 1.5 0v-2.033l.312.311a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm-10.624-2.85a5.5 5.5 0 0 1 9.201-2.465l.312.311H11.768a.75.75 0 0 0 0 1.5h3.634a.75.75 0 0 0 .75-.75V3.536a.75.75 0 0 0-1.5 0v2.033l-.312-.311A7 7 0 0 0 2.628 8.396a.75.75 0 0 0 1.449.39Z" clipRule="evenodd" />
              </svg>
            </button>
          </span>
        </> : <>&nbsp;</>}
      </div>

      {error && <div className="text-sm mb-4 text-center italic text-gray-500">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-12"><SectionSpinner size={48} /></div>
      ) : entries.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
          No activity logged in the last 24 hours.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="pb-2 pr-3 font-medium">Time</th>
                <th className="pb-2 pr-3 font-medium">Level</th>
                <th className="pb-2 pr-3 font-medium">Source</th>
                <th className="pb-2 pr-3 font-medium">Message</th>
                <th className="pb-2 pr-3 font-medium">Function</th>
                <th className="pb-2 pr-3 font-medium">Deployment</th>
                {isAdmin && <th className="pb-2 pr-3 font-medium">Instance</th>}
              </tr>
            </thead>
            <tbody>
              {entries
                .filter((entry) => {
                  if (!filter) return true;
                  const q = filter.toLowerCase();
                  return (
                    entry.msg.toLowerCase().includes(q) ||
                    entry.level.toLowerCase().includes(q) ||
                    (entry.deploymentId ?? "").toLowerCase().includes(q) ||
                    String(entry.functionName ?? "").toLowerCase().includes(q) ||
                    (entry.source ?? "").toLowerCase().includes(q) ||
                    (isAdmin && String(entry.instanceId ?? "").toLowerCase().includes(q))
                  );
                })
                .map((entry) => {
                const id = `${entry.ts}-${entry.msg}`;
                return (
                  <LogRow
                    key={id}
                    entry={entry}
                    expanded={expandedTs === id}
                    onToggle={() => setExpandedTs(expandedTs === id ? null : id)}
                    isAdmin={isAdmin}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function LogRow({
  entry,
  expanded,
  onToggle,
  isAdmin,
}: {
  entry: LogEntry;
  expanded: boolean;
  onToggle: () => void;
  isAdmin: boolean;
}) {
  const levelColors: Record<string, string> = {
    fatal: "bg-red-200 text-red-800",
    error: "bg-red-100 text-red-700",
    warn: "bg-yellow-100 text-yellow-700",
    info: "bg-gray-100 text-gray-600",
    debug: "bg-blue-50 text-blue-600",
  };
  const levelClass = levelColors[entry.level] ?? levelColors.info;

  const extraFields = Object.entries(entry).filter(
    ([k]) => !["ts", "level", "msg", "source", "deploymentId", "functionName", "instanceId"].includes(k),
  );

  const timestamp = new Date(entry.ts)

  return (
    <>
      <tr
        className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <td className="py-1.5 pr-3 whitespace-nowrap text-gray-500">
          {timestamp.toLocaleString()}
        </td>
        <td className="py-1.5 pr-3">
          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${levelClass}`}>
            {entry.level}
          </span>
        </td>
        <td className="py-1.5 pr-3 text-gray-400 text-[10px]">
          {entry.source === "jl4-service" ? "JL4" : (entry.source ?? "")}
        </td>
        <td className="py-1.5 pr-3 text-gray-800 max-w-md truncate">
          {entry.msg}
        </td>
        <td className="py-1.5 pr-3 text-gray-400 font-mono">
          {typeof entry.functionName === "string" ? entry.functionName : ""}
        </td>
        <td className="py-1.5 pr-3 text-gray-400 font-mono">
          {entry.deploymentId ?? ""}
        </td>
        {isAdmin && (
          <td className="py-1.5 pr-3 text-gray-400 font-mono">
            {typeof entry.instanceId === "string" ? entry.instanceId : ""}
          </td>
        )}
      </tr>
      {expanded && extraFields.length > 0 && (
        <tr className="bg-gray-50">
          <td colSpan={isAdmin ? 7 : 6} className="px-4 py-2">
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[11px]">
              {extraFields.map(([key, value]) => (
                <div key={key} className="contents">
                  <dt className="text-gray-400 font-mono">{key}</dt>
                  <dd className="text-gray-600 font-mono break-all">
                    {typeof value === "object" ? JSON.stringify(value) : String(value ?? "")}
                  </dd>
                </div>
              ))}
            </dl>
          </td>
        </tr>
      )}
    </>
  );
}
