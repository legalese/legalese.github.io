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
      <div>
        <nav className="flex gap-6 pl-2">
          {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
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
      <div className="bg-white rounded-lg border border-gray-200 p-6 min-h-[400px]">
        {activeTab === "organization" ? (
          <OrganizationInfo organization={session.organization} />
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

interface ServiceStatus {
  ok: boolean;
  status: number;
  data: Record<string, unknown>;
}

function HealthSection({ slug }: { slug: string }) {
  const [result, setResult] = useState<ServiceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  useEffect(() => {
    fetch(`https://${slug}.legalese.cloud/health`, {
      headers: authHeaders(),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        setResult({ ok: res.ok, status: res.status, data });
      })
      .catch(() => setNetworkError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400 font-sans">
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
        Checking...
      </div>
    );
  }

  if (networkError) {
    return (
      <p className="text-sm text-gray-400 font-sans">
        Unable to reach service
      </p>
    );
  }

  if (!result) return null;

  const { data } = result;
  const entries = Object.entries(data);

  if (entries.length === 0) return null;

  // If the response is a simple error message, show it inline
  if (!result.ok && data.error && entries.length === 1) {
    return (
      <p className="text-sm text-gray-500 font-sans">
        {String(data.error)}
      </p>
    );
  }

  return (
    <dl className="divide-y divide-gray-100 font-sans">
      {!result.ok && (
        <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-gray-500">Status</dt>
          <dd className="mt-1 text-sm text-amber-600 sm:col-span-2 sm:mt-0">
            {result.status}
          </dd>
        </div>
      )}
      {entries.map(([key, value]) => (
        <div key={key} className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-gray-500">{key}</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 font-mono text-xs">
            {typeof value === "object"
              ? JSON.stringify(value)
              : String(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function OrganizationInfo({
  organization,
}: {
  organization?: ConsoleOrganization;
}) {
  if (!organization) {
    return (
      <div className="text-gray-500 text-sm py-12 text-center">
        Organization details unavailable.
      </div>
    );
  }

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Name", value: <strong>{organization.name}</strong> },
    { label: "Slug", value: organization.slug },
    {
      label: "L4 Deployment URL",
      value: `https://${organization.slug}.legalese.cloud`,
    },
    {
      label: "Registered since",
      value: new Date(organization.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      <dl className="divide-y divide-gray-100">
        {rows.map(({ label, value }) => (
          <div key={label} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div>
        <p className="text-sm font-semibold text-gray-900 mb-3 font-sans">
          Service status
        </p>
        <HealthSection slug={organization.slug} />
      </div>
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
