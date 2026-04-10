"use client";

import { useEffect, useState } from "react";
import "@radix-ui/themes/styles.css";
import "@workos-inc/widgets/styles.css";
import { WorkOsWidgets } from "@workos-inc/widgets";
import { AUTH_API_URL } from "@/lib/constants";
import { ConsoleContext, type ConsoleSession } from "./console-context";
import { ConsoleHeader } from "./console-header";
import { authHeaders, SESSION_TOKEN_KEY, REDIRECT_TO_KEY } from "./console-utils";

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<ConsoleSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Capture ?token= and ?redirect_to= from query string on mount, then
  // verify the session. The bearer is kept in localStorage so it's
  // shared across tabs. Cross-domain cookies between legalese.github.io
  // and legalese.cloud don't work, so the Bearer header is the only
  // auth signal — the URL ?token= is the authoritative source for a
  // fresh login and must not be overwritten by the /auth/session
  // response (which previously clobbered the new token after
  // switch-account and left "Continue" forwarding the old session).
  useEffect(() => {
    const url = new URL(window.location.href);
    let dirty = false;

    const redirectTo = url.searchParams.get("redirect_to");
    if (redirectTo) {
      sessionStorage.setItem(REDIRECT_TO_KEY, redirectTo);
      url.searchParams.delete("redirect_to");
      dirty = true;
    }

    const tokenFromUrl = url.searchParams.get("token");
    const hasUrlToken = !!tokenFromUrl;
    if (tokenFromUrl) {
      localStorage.setItem(SESSION_TOKEN_KEY, tokenFromUrl);
      url.searchParams.delete("token");
      dirty = true;
    }

    if (dirty) {
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    }

    fetch(`${AUTH_API_URL}/auth/session`, {
      credentials: "include",
      headers: authHeaders(),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) {
          setSession(data);
          // Only populate localStorage from the session response when we
          // did NOT just capture a URL token. The URL token represents
          // an explicit, up-to-date login and must win over whatever the
          // server derived from cookies.
          if (data.token && !hasUrlToken) {
            localStorage.setItem(SESSION_TOKEN_KEY, data.token);
          }
        } else if (!hasUrlToken) {
          // Server says this session is invalid — clear the stale
          // localStorage token so stale credentials don't linger. Skip
          // this when we just received a fresh URL token so a transient
          // server error can't wipe a valid new login.
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
