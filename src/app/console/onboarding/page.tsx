"use client";

import { OrgSetup } from "../org-setup";
import { useConsole } from "../console-context";
import { AUTH_API_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OnboardingPage() {
  const { session, loading, onLogout } = useConsole();
  const router = useRouter();

  // Already in an org — send them to the console
  useEffect(() => {
    if (!loading && session?.organizationId) {
      router.replace("/console");
    }
  }, [loading, session, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-gray-500 text-sm">Loading…</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <h1 className="text-2xl font-bold font-merriweather">
          Sign in to continue
        </h1>
        <a
          href={`${AUTH_API_URL}/auth/login?return_to=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
          className="inline-flex items-center px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
        >
          Sign in
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <OrgSetup initiallyExpanded onLogout={onLogout} />
    </div>
  );
}
