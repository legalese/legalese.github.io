"use client";

import { useState } from "react";
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
    // VS Code extension callback (our extension only)
    if (parsed.protocol === "vscode:" || parsed.protocol === "vscode-insiders:") {
      return parsed.hostname === "legalese.l4-vscode";
    }
    // HTTPS links to our own domains only
    if (parsed.protocol === "https:") {
      const host = parsed.hostname;
      return (
        host === "legalese.com" ||
        host === "legalese.cloud" ||
        host.endsWith(".legalese.com") ||
        host.endsWith(".legalese.cloud")
      );
    }
    return false;
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
  // Resolve pending redirect synchronously on first render so it's
  // available before any useEffect fires. Check the URL first (initial
  // load from proxy), then fall back to sessionStorage (after re-login).
  const [redirected, setRedirected] = useState(false);
  const [pendingRedirect] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const urlParam = new URL(window.location.href).searchParams.get("redirect_to");
    if (urlParam && isValidRedirectUrl(urlParam)) return urlParam;
    const stored = sessionStorage.getItem(REDIRECT_TO_KEY);
    if (stored && isValidRedirectUrl(stored)) return stored;
    if (stored) sessionStorage.removeItem(REDIRECT_TO_KEY);
    return null;
  });

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

  // Pending redirect — show redirect UI instead of normal console.
  // We gate this on having a session: if there's no session yet (e.g.
  // cold visit from VS Code, or after switch-account sends the user
  // through logout) we fall through to the regular logged-out landing
  // page, which has its own "Sign in to continue" link.
  if (pendingRedirect && session && session.organizationId) {
    const appLabel = getAppLabel(pendingRedirect);
    const isVSCode = appLabel === "Visual Studio Code";

    function handleContinue() {
      sessionStorage.removeItem(REDIRECT_TO_KEY);

      const url = new URL(pendingRedirect!);
      // Always write the live localStorage token, even if the URL
      // already carries one. pendingRedirect may be a URL that was
      // captured before a switch-account — its embedded token would
      // be stale. console-shell strips the token from redirect_to
      // when it first stores it, but re-overwriting here is a cheap
      // defensive belt-and-braces.
      const token = localStorage.getItem(SESSION_TOKEN_KEY);
      if (token) {
        url.searchParams.set("token", token);
      } else {
        url.searchParams.delete("token");
      }

      setRedirected(true);
      window.location.href = url.toString();
      setTimeout(() => { window.close(); }, 30_000);
    }

    // Switch account is just a sign-out: delegate to the same handler
    // the header uses so the browser navigates through /auth/logout and
    // AuthKit's own logout, landing on the logged-out console. From
    // there the user clicks "Sign in to continue" to pick a new
    // account. redirect_to stays in sessionStorage across the round
    // trip so the new sign-in returns them to the Continue screen.
    const handleSwitchAccount = onLogout;

    const CHEVRON = <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline"><path d="M8.21192 3.09155C8.40164 2.95736 8.66555 2.96958 8.8418 3.13452C9.01806 3.29976 9.04853 3.56338 8.92676 3.76148L8.86524 3.84155L5.43555 7.49976L8.86524 11.158L8.92676 11.238C9.04853 11.4361 9.01806 11.6998 8.8418 11.865C8.66555 12.0299 8.40164 12.0422 8.21192 11.908L8.13477 11.8416L4.38477 7.84155C4.20487 7.64932 4.20487 7.35019 4.38477 7.15796L8.13477 3.15796L8.21192 3.09155Z" fill="currentColor"></path></svg>

    if (redirected) {
      return (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md w-full text-center space-y-6">
            <div>
              <h1 className="text-xl font-bold font-merriweather mb-2">
                {isVSCode ? "Signing in to Visual Studio Code ..." : "Redirecting you now ..."}
              </h1>
              <p className="text-gray-600 text-sm">
                {isVSCode ? "You can close this window now." : "Just a moment, please."}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              window.location.href = "/console";
            }}
            className="text-sm font-merriweather text-gray-400 hover:text-gray-600 transition-colors"
          >
            {CHEVRON} Back to console
        </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md w-full text-center space-y-6">
          <div>
            <h1 className="text-xl font-bold font-merriweather mb-2">
              Sign in {isVSCode ? "to Visual Studio Code" : "and redirect"}
            </h1>
            {session.organization ? (
              <p className="text-gray-600 text-sm">
                {session.organization.name}
              </p>
            ) : null}
            <p className="text-gray-500 text-sm">{session.user.email}</p>
          </div>
          <div className="space-y-1">
            <button
              onClick={handleContinue}
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
            >
              Continue
            </button>
            {!isVSCode && (
              <p className="text-xs text-gray-400 break-all">
                Redirect to{" "}
                <span className="text-gray-500">
                  {(() => {
                    try {
                      const u = new URL(pendingRedirect!);
                      return u.origin + u.pathname;
                    } catch {
                      return pendingRedirect;
                    }
                  })()}
                </span>
              </p>
            )}
          </div>
          <button
            onClick={handleSwitchAccount}
            className="text-sm text-accent hover:text-accent-hover transition-colors"
          >
            Switch account
          </button>
        </div>
        <button
          onClick={() => {
            sessionStorage.removeItem(REDIRECT_TO_KEY);
            window.location.href = "/console";
          }}
          className="text-sm font-merriweather text-gray-400 hover:text-gray-600 transition-colors"
        >
          {CHEVRON} Back to console
        </button>
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
