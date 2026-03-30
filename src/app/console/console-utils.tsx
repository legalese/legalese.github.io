"use client";

import { useEffect, useState, useCallback, type ReactNode } from "react";
import { AUTH_API_URL } from "@/lib/constants";
import { useConsole } from "./console-context";

export const SESSION_TOKEN_KEY = "wos-session-token";

export function authHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(SESSION_TOKEN_KEY)
      : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Service Health ──────────────────────────────────────────────────────

export interface HealthInstance {
  status: string;
  deployments: string[];
  deploymentStatus?: {
    total: number;
    ready: number;
    compiling: number;
    failed: number;
  } | null;
  token?: string;
}

export interface HealthConfig {
  plan: string;
  binaryUrl: string | null;
  dailyRequestLimit: number;
  blockOnOverage: boolean;
  maxConcurrentRequests: number;
  maxDeployments: number;
  maxEvalMemoryMb: number;
  compileMemoryMb: number;
  evalTimeoutSeconds: number;
  compileTimeoutSeconds: number;
  maxZipSizeMb: number;
  idleTimeoutHours: number;
  publicDeployments: string[];
  suspended: boolean;
}

export interface HealthData {
  status: string;
  instances: HealthInstance[];
  config: HealthConfig;
}

export type ServiceHealth =
  | { state: "loading" }
  | { state: "error" }
  | { state: "ok"; data: HealthData };

export function planFromHealth(health: ServiceHealth): string {
  if (health.state !== "ok" || !health.data.config) return "Free plan";
  return health.data.config.plan === "custom" ? "Custom plan" : "Free plan";
}

export function useServiceHealth(slug: string): ServiceHealth {
  const [health, setHealth] = useState<ServiceHealth>({ state: "loading" });

  useEffect(() => {
    if (!slug) {
      setHealth({ state: "error" });
      return;
    }

    function fetchHealth() {
      fetch(`${AUTH_API_URL}/service/health?org=${encodeURIComponent(slug)}`, {
        headers: authHeaders(),
        credentials: "include",
      })
        .then(async (res) => {
          if (!res.ok) {
            setHealth({ state: "error" });
            return;
          }
          const data: HealthData = await res.json().catch(() => ({}));
          setHealth({ state: "ok", data });
        })
        .catch(() => setHealth({ state: "error" }));
    }

    fetchHealth();

    let timer: ReturnType<typeof setInterval> | null = null;

    function startPolling() {
      if (!timer) timer = setInterval(fetchHealth, 10_000);
    }

    function stopPolling() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        fetchHealth();
        startPolling();
      } else {
        stopPolling();
      }
    }

    if (document.visibilityState === "visible") startPolling();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [slug]);

  return health;
}

// ── Widget Token ────────────────────────────────────────────────────────

export function useWidgetToken(organizationId: string | null, scope: string) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = useCallback(async () => {
    if (!organizationId || !scope) return;
    setToken(null);
    setError(null);

    try {
      const res = await fetch(`${AUTH_API_URL}/auth/widget-token`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          organizationId,
          scopes: [scope],
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.error ?? "Failed to load widget");
        return;
      }

      const data = await res.json();
      setToken(data.token);
    } catch {
      setError("Service temporarily unavailable");
    }
  }, [organizationId, scope]);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  return { token, error };
}

// ── Widget Page Wrapper ─────────────────────────────────────────────────

/**
 * Shared wrapper for WorkOS widget pages. Handles token fetching,
 * loading state, and error display — each page only needs to pass
 * the scope and render function.
 */
export function WidgetPage({
  scope,
  children,
}: {
  scope: string;
  children: (token: string) => ReactNode;
}) {
  const { session } = useConsole();
  const { token, error } = useWidgetToken(
    session?.organizationId ?? null,
    scope,
  );

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-600 text-sm">{error}</div>
      </div>
    );
  }
  if (!token) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  return <>{children(token)}</>;
}
