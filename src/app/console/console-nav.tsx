"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AUTH_API_URL } from "@/lib/constants";
import { useConsole } from "./console-context";
import { authHeaders, SESSION_TOKEN_KEY, REDIRECT_TO_KEY } from "./console-utils";

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
  const { session, loading } = useConsole();
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
  if (pendingRedirect && session) {
    const appLabel = getAppLabel(pendingRedirect);
    const isVSCode = appLabel === "Visual Studio Code";

    function handleContinue() {
      sessionStorage.removeItem(REDIRECT_TO_KEY);

      const url = new URL(pendingRedirect!);
      if (!url.searchParams.has("token")) {
        const token = localStorage.getItem(SESSION_TOKEN_KEY);
        if (token) url.searchParams.set("token", token);
      }

      setRedirected(true);
      window.location.href = url.toString();
      setTimeout(() => { window.close(); }, 30_000);
    }

    // Switch account: hit /auth/logout with the current bearer so the
    // server tears down the app session, drop the local token, then
    // forward to the sign-in link — same URL the logged-out landing
    // page uses. redirect_to stays in sessionStorage so the round-trip
    // brings the user back to the Continue screen for the new account.
    //
    // credentials: "include" is load-bearing: without it the browser
    // neither sends nor applies cookies on this request, so AuthKit's
    // session cookie on legalese.cloud survives the logout — and the
    // subsequent /auth/login navigation silently re-authenticates the
    // same user. Including credentials lets the server's Set-Cookie
    // clear the AuthKit session properly.
    async function handleSwitchAccount() {
      try {
        await fetch(`${AUTH_API_URL}/auth/logout`, {
          method: "POST",
          credentials: "include",
          headers: authHeaders(),
        });
      } catch {
        // swallow — we're switching regardless
      }
      localStorage.removeItem(SESSION_TOKEN_KEY);
      window.location.href = `${AUTH_API_URL}/auth/login?return_to=${encodeURIComponent(window.location.href)}`;
    }

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
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Switch account
          </button>
        </div>
        <button
          onClick={() => {
            sessionStorage.removeItem(REDIRECT_TO_KEY);
            window.location.href = "/console";
          }}
          className="text-sm text-accent hover:text-accent-hover transition-colors"
        >
          Back to your console
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
