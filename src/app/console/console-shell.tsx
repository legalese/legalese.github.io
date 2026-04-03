"use client";

import { useEffect, useState } from "react";
import "@radix-ui/themes/styles.css";
import "@workos-inc/widgets/styles.css";
import { WorkOsWidgets } from "@workos-inc/widgets";
import { AUTH_API_URL } from "@/lib/constants";
import { ConsoleContext, type ConsoleSession } from "./console-context";
import { ConsoleHeader } from "./console-header";
import { authHeaders, SESSION_TOKEN_KEY } from "./console-utils";

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<ConsoleSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Capture ?token= from auth callback redirect.
  // If a redirect_to destination is stored in sessionStorage (from a prior
  // /console/redirect visit), navigate back to the redirect page so the
  // user can complete the flow (e.g. after switching accounts).
  //
  // Also, if ?redirect_to= is present on any console page, route to the
  // redirect page (e.g. legalese.cloud/console?redirect_to=vscode://...).
  useEffect(() => {
    const url = new URL(window.location.href);

    // If redirect_to is present on a non-redirect page, route there
    const redirectTo = url.searchParams.get("redirect_to");
    if (redirectTo && url.pathname !== "/console/redirect") {
      url.pathname = "/console/redirect";
      window.location.href = url.toString();
      return;
    }

    const token = url.searchParams.get("token");
    if (token) {
      localStorage.setItem(SESSION_TOKEN_KEY, token);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);

      const pendingRedirect = sessionStorage.getItem("auth-redirect-to");
      if (pendingRedirect && url.pathname !== "/console/redirect") {
        window.location.href = "/console/redirect";
        return;
      }
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
          if (data.token) {
            localStorage.setItem(SESSION_TOKEN_KEY, data.token);
          }
        } else {
          localStorage.removeItem(SESSION_TOKEN_KEY);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    localStorage.removeItem(SESSION_TOKEN_KEY);
    window.location.href = `${AUTH_API_URL}/auth/logout`;
  }

  return (
    <WorkOsWidgets
      theme={{ accentColor: "crimson" }}
      style={{ "--heading-font-family": "var(--font-merriweather)" } as React.CSSProperties}
    >
      <ConsoleContext.Provider
        value={{ session, loading, onLogout: handleLogout }}
      >
        <div className="min-h-screen bg-gray-50">
          <ConsoleHeader />
          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </ConsoleContext.Provider>
    </WorkOsWidgets>
  );
}
