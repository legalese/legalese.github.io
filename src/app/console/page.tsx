"use client";

import { useEffect, useState, useCallback } from "react";
import { AUTH_API_URL } from "@/lib/constants";
import "@workos-inc/widgets/styles.css";

interface SessionUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profilePictureUrl: string | null;
}

interface Session {
  authenticated: true;
  user: SessionUser;
  organizationId: string | null;
  permissions: string[];
}

type WidgetTab = "users" | "api-keys" | "profile" | "security";

const WIDGET_SCOPES: Record<WidgetTab, string> = {
  users: "widgets:users-table:manage",
  "api-keys": "widgets:api-keys:manage",
  profile: "widgets:users-table:manage",
  security: "widgets:users-table:manage",
};

const TAB_LABELS: Record<WidgetTab, string> = {
  users: "Members",
  "api-keys": "API Keys",
  profile: "Profile",
  security: "Security",
};

const SESSION_TOKEN_KEY = "wos-session-token";

/** Auth headers using the stored session token (or falling back to cookies). */
function authHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(SESSION_TOKEN_KEY)
      : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function ConsolePage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<WidgetTab>("users");
  const [widgetToken, setWidgetToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // On mount: capture ?token= from the auth callback redirect,
  // persist it in localStorage, and clean the URL.
  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (token) {
      localStorage.setItem(SESSION_TOKEN_KEY, token);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    }
  }, []);

  // Check session on mount
  useEffect(() => {
    fetch(`${AUTH_API_URL}/auth/session`, {
      credentials: "include",
      headers: authHeaders(),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) {
          setSession(data);
          // Server may return a refreshed sealed session token
          if (data.token) {
            localStorage.setItem(SESSION_TOKEN_KEY, data.token);
          }
        } else {
          // Token may be expired — clear it
          localStorage.removeItem(SESSION_TOKEN_KEY);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fetch widget token when session or tab changes
  const fetchWidgetToken = useCallback(
    async (tab: WidgetTab) => {
      if (!session?.organizationId) return;

      setWidgetToken(null);
      setTokenError(null);

      try {
        const res = await fetch(`${AUTH_API_URL}/auth/widget-token`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({
            organizationId: session.organizationId,
            scopes: [WIDGET_SCOPES[tab]],
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

  function handleLogout() {
    localStorage.removeItem(SESSION_TOKEN_KEY);
    window.location.href = `${AUTH_API_URL}/auth/logout`;
  }

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

  // Not logged in
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
            onClick={handleLogout}
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
      {/* User info bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          {session.user.profilePictureUrl && (
            <img
              src={session.user.profilePictureUrl}
              alt=""
              className="w-8 h-8 rounded-full"
            />
          )}
          <div>
            <div className="font-medium text-sm">
              {session.user.firstName} {session.user.lastName}
            </div>
            <div className="text-xs text-gray-500">{session.user.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          {(Object.keys(TAB_LABELS) as WidgetTab[]).map((tab) => (
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

      {/* Widget area */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 min-h-[400px]">
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
        {widgetToken && <WidgetRenderer tab={activeTab} token={widgetToken} />}
      </div>
    </div>
  );
}

// Import widgets statically — Next.js handles code splitting via the page boundary.
import { UsersManagement } from "@workos-inc/widgets/users-management";
import { ApiKeys } from "@workos-inc/widgets/api-keys";
import { UserProfile } from "@workos-inc/widgets/user-profile";
import { UserSecurity } from "@workos-inc/widgets/user-security";

function WidgetRenderer({ tab, token }: { tab: WidgetTab; token: string }) {
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
