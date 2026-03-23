"use client";

import { useEffect, useRef, useState } from "react";
import { useConsole } from "../console-context";
import { authHeaders } from "../console-utils";

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

export default function ActivityPage() {
  const { session } = useConsole();
  const slug = session?.organization?.slug;
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTs, setExpandedTs] = useState<string | null>(null);
  const newestTsRef = useRef<string | undefined>();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep ref in sync with latest entries
  useEffect(() => {
    newestTsRef.current = entries[0]?.ts;
  }, [entries]);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    async function fetchLogs(since?: string) {
      try {
        const params = since ? `?since=${encodeURIComponent(since)}` : "";
        const res = await fetch(
          `https://${slug}.legalese.cloud/service/logs${params}`,
          { headers: authHeaders(), credentials: "include" },
        );
        if (!res.ok) {
          if (!cancelled) setError("Service temporarily unavailable");
          return;
        }
        const data = await res.json();
        if (cancelled) return;

        if (since && data.entries?.length > 0) {
          setEntries((prev) => [...data.entries, ...prev].slice(0, 200));
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
  }, [slug]);

  if (!slug) {
    return <div className="text-gray-500 text-sm py-12 text-center">No organization selected.</div>;
  }

  return (
    <div className="font-sans">
      <div className="flex items-center justify-between mb-4">
        {lastUpdated && (
          <span className="text-xs text-gray-400">
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        )}
      </div>

      {error && <div className="text-sm mb-4 text-center italic text-gray-500">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400 text-sm">Loading...</div>
      ) : entries.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
          No activity logged yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-400">
                <th className="pb-2 pr-3 font-medium">Time</th>
                <th className="pb-2 pr-3 font-medium">Level</th>
                <th className="pb-2 pr-3 font-medium">Message</th>
                <th className="pb-2 pr-3 font-medium">Deployment</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const id = `${entry.ts}-${entry.msg}`;
                return (
                  <LogRow
                    key={id}
                    entry={entry}
                    expanded={expandedTs === id}
                    onToggle={() => setExpandedTs(expandedTs === id ? null : id)}
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
}: {
  entry: LogEntry;
  expanded: boolean;
  onToggle: () => void;
}) {
  const levelColors: Record<string, string> = {
    error: "bg-red-100 text-red-700",
    warn: "bg-yellow-100 text-yellow-700",
    info: "bg-gray-100 text-gray-600",
    debug: "bg-blue-50 text-blue-600",
  };
  const levelClass = levelColors[entry.level] ?? levelColors.info;

  const extraFields = Object.entries(entry).filter(
    ([k]) => !["ts", "level", "msg", "source", "deploymentId"].includes(k),
  );

  return (
    <>
      <tr
        className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <td className="py-1.5 pr-3 whitespace-nowrap text-gray-500">
          {relativeTime(entry.ts)}
        </td>
        <td className="py-1.5 pr-3">
          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${levelClass}`}>
            {entry.level}
          </span>
        </td>
        <td className="py-1.5 pr-3 text-gray-800 max-w-md truncate">
          {entry.msg}
        </td>
        <td className="py-1.5 pr-3 text-gray-400 font-mono">
          {entry.deploymentId ?? ""}
        </td>
      </tr>
      {expanded && extraFields.length > 0 && (
        <tr className="bg-gray-50">
          <td colSpan={4} className="px-4 py-2">
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

function relativeTime(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
