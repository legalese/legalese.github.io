"use client";

import { useEffect, useState, useCallback } from "react";
import { AUTH_API_URL } from "@/lib/constants";
import { useConsole } from "./console-context";
import "@workos-inc/widgets/styles.css";

type Tab = "organization" | "users" | "api-keys" | "profile" | "security";

const WIDGET_SCOPES: Partial<Record<Tab, string>> = {
  users: "widgets:users-table:manage",
  "api-keys": "widgets:api-keys:manage",
  profile: "widgets:users-table:manage",
  security: "widgets:users-table:manage",
};

const TAB_LABELS: Record<Tab, string> = {
  organization: "Organization",
  users: "Members",
  "api-keys": "API Keys",
  profile: "Profile",
  security: "Security",
};

const SESSION_TOKEN_KEY = "wos-session-token";

function authHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(SESSION_TOKEN_KEY)
      : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function ConsolePage() {
  const { session, loading, onLogout } = useConsole();
  const [activeTab, setActiveTab] = useState<Tab>("organization");
  const [widgetToken, setWidgetToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Fetch widget token when session or tab changes (skip for non-widget tabs)
  const fetchWidgetToken = useCallback(
    async (tab: Tab) => {
      if (!session?.organizationId) return;
      const scope = WIDGET_SCOPES[tab];
      if (!scope) {
        setWidgetToken(null);
        setTokenError(null);
        return;
      }

      setWidgetToken(null);
      setTokenError(null);

      try {
        const res = await fetch(`${AUTH_API_URL}/auth/widget-token`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({
            organizationId: session.organizationId,
            scopes: [scope],
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setTokenError(err.error ?? "Failed to load widget");
          return;
        }

        const { token } = await res.json();
        setWidgetToken(token);
      } catch {
        setTokenError("Failed to connect to auth service");
      }
    },
    [session],
  );

  useEffect(() => {
    fetchWidgetToken(activeTab);
  }, [activeTab, fetchWidgetToken]);

  // Show spinner until session validation completes
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <svg
          className="animate-spin h-8 w-8 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    );
  }

  // Not logged in — header already shows "Sign in" link
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <h1 className="text-2xl font-bold font-merriweather">
          Sign in to continue
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          Access your organization settings, manage team members, and create API
          keys.
        </p>
        <a
          href={`${AUTH_API_URL}/auth/login?return_to=${encodeURIComponent(window.location.href)}`}
          className="inline-flex items-center px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
        >
          Sign in
        </a>
      </div>
    );
  }

  // No organization
  if (!session.organizationId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <h1 className="text-2xl font-bold font-merriweather">
          No organization selected
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          You need to be part of an organization to use the console. Contact
          your administrator for an invite.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onLogout}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Tabs */}
      <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pr-8">
        <nav className="flex whitespace-nowrap">
          {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 mr-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </nav>
      </div>

      {/* Content area */}
      <div className="bg-white p-6 min-h-[400px] -mx-4 sm:-mx-6 lg:mx-0">
        {activeTab === "organization" ? (
          <OrganizationInfo organization={session.organization} permissions={session.permissions} />
        ) : (
          <>
            {tokenError && (
              <div className="flex items-center justify-center py-12">
                <div className="text-red-600 text-sm">{tokenError}</div>
              </div>
            )}
            {!widgetToken && !tokenError && (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-500 text-sm">Loading...</div>
              </div>
            )}
            {widgetToken && (
              <WidgetRenderer tab={activeTab} token={widgetToken} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Import widgets statically — Next.js handles code splitting via the page boundary.
import { UsersManagement } from "@workos-inc/widgets/users-management";
import { ApiKeys } from "@workos-inc/widgets/api-keys";
import { UserProfile } from "@workos-inc/widgets/user-profile";
import { UserSecurity } from "@workos-inc/widgets/user-security";

import type { ConsoleOrganization } from "./console-context";

interface HealthData {
  status?: string;
  deployments?: {
    total?: number;
    ready?: number;
    pending?: number;
    compiling?: number;
    failed?: number;
  };
  config?: {
    binaryUrl?: string | null;
    instances?: number;
    evalMemoryMb?: number;
    compileMemoryMb?: number;
    maxDeployments?: number;
    maxConcurrentRequests?: number;
    evalTimeoutSeconds?: number;
    compileTimeoutSeconds?: number;
    maxZipSizeMb?: number;
    idleTimeoutHours?: number;
    dailyRequestLimit?: number;
    suspended?: boolean;
    stripeMeteredItems?: {
      customerId: string;
      requests: string;
      allocBytes: string;
    };
  };
}

type ServiceHealth =
  | { state: "loading" }
  | { state: "error" }
  | { state: "ok"; data: HealthData };

/** Derive plan label from the health endpoint's config. */
function planFromHealth(health: ServiceHealth): string {
  if (health.state !== "ok" || !health.data.config) return "Free plan";
  return health.data.config.stripeMeteredItems ? "Custom plan" : "Free plan";
}

function useServiceHealth(slug: string): ServiceHealth {
  const [health, setHealth] = useState<ServiceHealth>({ state: "loading" });

  useEffect(() => {
    if (!slug) {
      setHealth({ state: "error" });
      return;
    }
    fetch(`https://${slug}.legalese.cloud/health`, {
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
  }, [slug]);

  return health;
}

function DeploymentUrl({ slug, health }: { slug: string; health: ServiceHealth }) {
  const url = `https://${slug}.legalese.cloud`;

  let dot: React.ReactNode;
  let suffix: React.ReactNode = null;
  let buildTag: string | null = null;

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
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
      </span>
    );
    suffix = <span className="text-gray-400 text-sm">unreachable</span>;
  } else {
    const { deployments } = health.data;
    const total = deployments?.total ?? 0;
    const failed = deployments?.failed ?? 0;
    const compiling = deployments?.compiling ?? 0;
    const pending = deployments?.pending ?? 0;

    const dotColor =
      failed > 0
        ? "bg-red-500"
        : compiling > 0 || pending > 0
          ? "bg-yellow-400"
          : "bg-green-500";

    dot = (
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${dotColor}`} />
      </span>
    );
    suffix = (
      <span className="text-gray-400 text-sm">
        ({total === 1 ? "1 deployment" : `${total} deployments`})
      </span>
    );

    if (health.data.config?.binaryUrl) {
      buildTag = extractBuildTag(health.data.config.binaryUrl);
    }
  }

  return (
    <span className="inline-flex items-start gap-2 flex-wrap">
      <span className="inline-flex items-center gap-2">
        {dot}
        <span>{url}</span>
      </span>
      {suffix}
      {buildTag && (
        <div className="text-gray-400 font-mono text-xs">{buildTag}</div>
      )}
    </span>
  );
}

/** Extract the build tag (e.g. "vscode-wasm-build-59") from a GitHub release URL. */
function extractBuildTag(binaryUrl: string): string | null {
  // URL pattern: .../releases/download/{tag}/{filename}
  const match = binaryUrl.match(/\/releases\/download\/([^/]+)\//);
  return match?.[1] ?? null;
}

function RestartServiceButton({ slug }: { slug: string }) {
  const [state, setState] = useState<
    "idle" | "confirming" | "restarting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleRestart() {
    setState("restarting");
    setErrorMsg("");
    try {
      const res = await fetch(
        `https://${slug}.legalese.cloud/service/restart`,
        {
          method: "POST",
          headers: authHeaders(),
        },
      );
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
        <button
          onClick={handleRestart}
          className="text-red-600 hover:text-red-700 font-medium underline underline-offset-2"
        >
          Yes, restart
        </button>
        <button
          onClick={() => setState("idle")}
          className="text-gray-500 hover:text-gray-700 underline underline-offset-2"
        >
          Cancel
        </button>
      </span>
    );
  }

  if (state === "restarting") {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-gray-500">
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        Restarting...
      </span>
    );
  }

  if (state === "success") {
    return (
      <span className="text-sm text-green-600">Service restarted</span>
    );
  }

  if (state === "error") {
    return (
      <span className="text-sm text-red-600">{errorMsg}</span>
    );
  }

  return (
    <button
      onClick={() => setState("confirming")}
      className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2"
    >
      Restart service
    </button>
  );
}

function ServiceDetails({ health }: { health: ServiceHealth }) {
  if (health.state !== "ok" || !health.data.config) return null;

  const cfg = health.data.config;

  const details: { label: string; value: string }[] = [
    { label: "Instances", value: String(cfg.instances ?? "-") },
    { label: "Max deployments", value: String(cfg.maxDeployments ?? "-") },
    { label: "Max concurrent requests", value: String(cfg.maxConcurrentRequests ?? "-") },
    { label: "Max evaluation memory", value: `${cfg.evalMemoryMb ?? "-"} MB` },
    { label: "Compile memory", value: `${cfg.compileMemoryMb ?? "-"} MB` },
    { label: "Evaluation timeout", value: `${cfg.evalTimeoutSeconds ?? "-"}s` },
    { label: "Compile timeout", value: `${cfg.compileTimeoutSeconds ?? "-"}s` },
    { label: "Max deployment size", value: `${cfg.maxZipSizeMb ?? "-"} MB` },
    { label: "Idle timeout", value: `${cfg.idleTimeoutHours ?? "-"} hours` },
    { label: "Daily request limit", value: String(cfg.dailyRequestLimit ?? "-") },
  ];

  return (
    <details className="mt-1 group">
      <summary className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer select-none">
        More info
      </summary>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
        {details.map(({ label, value }) => (
          <div key={label} className="contents">
            <dt className="text-gray-400">{label}</dt>
            <dd className="text-gray-600 font-mono">{value}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

function OrganizationInfo({
  organization,
  permissions,
}: {
  organization?: ConsoleOrganization;
  permissions: string[];
}) {
  const health = useServiceHealth(organization?.slug ?? "");

  if (!organization) {
    return (
      <div className="text-gray-500 text-sm py-12 text-center">
        Organization details unavailable.
      </div>
    );
  }

  const isAdmin = permissions.includes("l4:admin");

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
      label: "L4 deployment URL",
      value: (
        <div className="w-full">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <DeploymentUrl slug={organization.slug} health={health} />
            {isAdmin && <RestartServiceButton slug={organization.slug} />}
          </div>
        </div>
      ),
    },
    {
      label: "Subscription",
      value: (
        <div>
          <span>{planFromHealth(health)}</span>
          <ServiceDetails health={health} />
        </div>
      )
    }
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

function WidgetRenderer({ tab, token }: { tab: Tab; token: string }) {
  switch (tab) {
    case "users":
      return <UsersManagement authToken={token} />;
    case "api-keys":
      return <ApiKeys authToken={token} />;
    case "profile":
      return <UserProfile authToken={token} />;
    case "security":
      return <UserSecurity authToken={token} />;
  }
}
