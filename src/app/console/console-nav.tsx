"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AUTH_API_URL } from "@/lib/constants";
import { useConsole } from "./console-context";
import { SESSION_TOKEN_KEY, REDIRECT_TO_KEY } from "./console-utils";

const TABS: readonly {
  path: string;
  label: string;
  permission?: string;
  requiresDomainVerified?: boolean;
}[] = [
  { path: "/console/organization", label: "Organization" },
  { path: "/console/logs", label: "Logs" },
  { path: "/console/members", label: "Members", permission: "widgets:users-table:manage" },
  { path: "/console/sso", label: "SSO", permission: "widgets:sso:manage", requiresDomainVerified: true },
  { path: "/console/api-keys", label: "API Keys", permission: "widgets:api-keys:manage" },
  { path: "/console/profile", label: "Profile" },
];

function isValidRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["vscode:", "vscode-insiders:", "https:", "http:"].includes(
      parsed.protocol,
    );
  } catch {
    return false;
  }
}

function getAppLabel(url: string): string {
  try {
    const scheme = new URL(url).protocol.replace(":", "");
    if (scheme === "vscode" || scheme === "vscode-insiders") {
      return "Visual Studio Code";
    }
    return scheme;
  } catch {
    return "application";
  }
}

export function ConsoleNav({ children }: { children: React.ReactNode }) {
  const { session, loading, onLogout } = useConsole();
  const pathname = usePathname();
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

  // Check sessionStorage for a pending redirect on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(REDIRECT_TO_KEY);
    if (stored && isValidRedirectUrl(stored)) {
      setPendingRedirect(stored);
    } else if (stored) {
      // Invalid URL — clean up
      sessionStorage.removeItem(REDIRECT_TO_KEY);
    }
  }, []);

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

  // Pending redirect — show redirect UI instead of normal console
  if (pendingRedirect) {
    const appLabel = getAppLabel(pendingRedirect);
    const isVSCode = appLabel === "Visual Studio Code";

    function handleContinue() {
      sessionStorage.removeItem(REDIRECT_TO_KEY);

      const url = new URL(pendingRedirect!);
      if (!url.searchParams.has("token")) {
        const token = localStorage.getItem(SESSION_TOKEN_KEY);
        if (token) url.searchParams.set("token", token);
      }

      window.location.href = url.toString();
      setTimeout(() => window.close(), 500);
    }

    function handleSwitchAccount() {
      // redirect_to stays in sessionStorage so it survives the login round-trip
      onLogout();
    }

    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md w-full text-center space-y-6">
          {session ? (
            <>
              <div>
                <h1 className="text-xl font-bold font-merriweather mb-2">
                  Signed in
                </h1>
                {session.organization ? (
                  <p className="text-gray-600 text-sm">
                    {session.organization.name}
                  </p>
                ) : null}
                <p className="text-gray-500 text-sm">{session.user.email}</p>
              </div>
              <button
                onClick={handleContinue}
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
              >
                {isVSCode ? "Return to Visual Studio Code" : "Continue"}
              </button>
              <button
                onClick={handleSwitchAccount}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Switch account
              </button>
            </>
          ) : (
            <>
              <div>
                <h1 className="text-xl font-bold font-merriweather mb-2">
                  Sign in required
                </h1>
                <p className="text-gray-600 text-sm">
                  Sign in to continue to {appLabel}.
                </p>
              </div>
              <a
                href={`${AUTH_API_URL}/auth/login?return_to=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
              >
                Sign in to continue
              </a>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <h1 className="text-2xl font-bold font-merriweather">
          Legalese Cloud Console
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          Check deployment activity, control your organization settings, manage team members, and API access.
        </p>
        <a
          href={`${AUTH_API_URL}/auth/login?return_to=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
          className="inline-flex items-center px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
        >
          Sign in to continue
        </a>
      </div>
    );
  }

  if (!session.organizationId && pathname !== "/console/onboarding") {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <h1 className="text-2xl font-bold font-merriweather">
          Join your team on Legalese
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          Contact your administrator for an invite, or create a new organization now if you want to start fresh.
        </p>
        <Link
          href="/console/onboarding"
          className="text-sm text-accent hover:underline"
        >
          Create a new organization
        </Link>
      </div>
    );
  }

  const permissions = session.permissions ?? [];

  return (
    <div>
      {/* Tabs — only shown when user has an org context */}
      {session.organizationId && pathname !== "/console/onboarding" ? (
        <>
          <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pr-8">
            <nav className="flex whitespace-nowrap">
              {TABS.filter((tab) =>
                (!tab.permission || permissions.includes(tab.permission)) &&
                (!tab.requiresDomainVerified || session.domainVerified)
              ).map((tab) => {
                const isActive =
                  pathname === tab.path ||
                  (tab.path === "/console/organization" && pathname === "/console");
                return (
                  <Link
                    key={tab.path}
                    href={tab.path}
                    className={`pb-3 mr-4 text-sm font-medium border-b-2 transition-colors ${
                      isActive
                        ? "border-accent text-accent"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="bg-white p-6 min-h-[400px] -mx-4 sm:-mx-6 lg:mx-0">
            {children}
          </div>
        </>
      ) : (
        <div className="p-6 min-h-[400px] -mx-4 sm:-mx-6 lg:mx-0">
          {children}
        </div>
      )}
    </div>
  );
}
