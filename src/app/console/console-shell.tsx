"use client";

import { useEffect, useState } from "react";
import { AUTH_API_URL } from "@/lib/constants";
import { ConsoleContext, type ConsoleSession } from "./console-context";
import { ConsoleHeader } from "./console-header";

const SESSION_TOKEN_KEY = "wos-session-token";

function authHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(SESSION_TOKEN_KEY)
      : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<ConsoleSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Capture ?token= from auth callback redirect
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
  );
}
