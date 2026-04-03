"use client";

import { useEffect, useState } from "react";
import { useConsole } from "../console-context";

const REDIRECT_TO_KEY = "auth-redirect-to";

function isValidRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Only allow known custom protocol schemes and https
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

export default function RedirectPage() {
  const { session, loading, onLogout } = useConsole();
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  // On mount, capture ?redirect_to from the URL into sessionStorage
  useEffect(() => {
    const url = new URL(window.location.href);
    const param = url.searchParams.get("redirect_to");
    if (param && isValidRedirectUrl(param)) {
      sessionStorage.setItem(REDIRECT_TO_KEY, param);
      setRedirectTo(param);
      // Clean up the URL
      url.searchParams.delete("redirect_to");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    } else {
      // Restore from sessionStorage (e.g. after re-login via "Switch account")
      const stored = sessionStorage.getItem(REDIRECT_TO_KEY);
      setRedirectTo(stored);
    }
  }, []);

  function handleContinue() {
    if (!redirectTo) return;
    sessionStorage.removeItem(REDIRECT_TO_KEY);

    // Ensure the redirect URL includes the session token so the
    // target app (e.g. VS Code extension) can authenticate.
    const url = new URL(redirectTo);
    if (!url.searchParams.has("token")) {
      const token = localStorage.getItem("wos-session-token");
      if (token) url.searchParams.set("token", token);
    }

    window.location.href = url.toString();
    // Try to close the tab after a short delay (works if we opened it)
    setTimeout(() => window.close(), 500);
  }

  function handleSwitchAccount() {
    // Logout will redirect to the auth login page.
    // The redirect_to stays in sessionStorage so it survives the round-trip.
    onLogout();
  }

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

  if (!redirectTo) {
    // No redirect target — just go to the console
    if (typeof window !== "undefined") {
      window.location.href = "/console/organization";
    }
    return null;
  }

  const appLabel = getAppLabel(redirectTo);
  const isVSCode = appLabel === "Visual Studio Code";

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
          </>
        )}
      </div>
    </div>
  );
}
