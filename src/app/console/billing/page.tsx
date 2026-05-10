"use client";

import { useState } from "react";
import Link from "next/link";
import { AUTH_API_URL } from "@/lib/constants";
import { useConsole } from "../console-context";
import {
  authHeaders,
  useServiceHealth,
  planFromHealth,
} from "../console-utils";

/**
 * /console/billing — landing page for the Billing tab.
 *
 * Shows the active plan and a button that opens the Stripe Customer
 * Portal in the same window (update card, view invoices, cancel,
 * switch plans if the portal is configured for it).
 *
 * The tab is currently NOT linked from console-nav (it's commented out
 * there). Reachable by direct URL only until we're ready to ship it.
 *
 * Free-tier orgs are nudged toward /console/billing/upgrade/metered.
 */
export default function BillingPage() {
  const { session } = useConsole();
  if (!session?.organization) {
    return (
      <div className="text-gray-500 text-sm py-12 text-center">
        No organization selected.
      </div>
    );
  }
  const isAdmin = session.permissions.includes("l4:admin");
  return (
    <BillingContent
      slug={session.organization.slug}
      orgName={session.organization.name}
      isAdmin={isAdmin}
    />
  );
}

function BillingContent({
  slug,
  orgName,
  isAdmin,
}: {
  slug: string;
  orgName: string;
  isAdmin: boolean;
}) {
  const health = useServiceHealth(slug);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (health.state === "loading") {
    return <CenterMessage>Loading…</CenterMessage>;
  }
  if (health.state === "error") {
    return (
      <CenterMessage>
        <p className="text-red-600 text-sm">Service temporarily unavailable</p>
      </CenterMessage>
    );
  }

  const isPaid =
    !!health.data.config?.plan && health.data.config.plan !== "free";

  async function openPortal() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(
        `${AUTH_API_URL}/billing/portal?org=${encodeURIComponent(slug)}`,
        {
          method: "POST",
          headers: authHeaders(),
          credentials: "include",
        },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const { url } = await res.json();
      if (!url) throw new Error("Portal URL not returned");
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open portal");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <header>
        <h1 className="text-2xl font-bold font-merriweather">Billing</h1>
        <p className="text-gray-600 mt-2 text-sm">
          {orgName} · {planFromHealth(health)}
        </p>
      </header>

      {isPaid ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            Manage your subscription, payment method, and invoices in the
            Stripe Customer Portal.
          </p>
          {isAdmin ? (
            <>
              <button
                onClick={openPortal}
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting
                  ? "Opening Stripe…"
                  : "Manage subscription in Stripe"}
              </button>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </>
          ) : (
            <div className="rounded border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
              Only organization admins can manage billing.
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            {orgName} is on the free plan. Upgrade to lift the daily request
            limit and bill monthly via Stripe.
          </p>
          <Link
            href="/console/billing/upgrade/metered"
            className="inline-flex items-center px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
          >
            See pricing
          </Link>
        </div>
      )}
    </div>
  );
}

function CenterMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center py-24 text-center">
      <div>{children}</div>
    </div>
  );
}
