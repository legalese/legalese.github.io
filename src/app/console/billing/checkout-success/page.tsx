"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useConsole } from "../../console-context";
import { useServiceHealth } from "../../console-utils";

/**
 * Stripe redirects here after a successful Checkout Session.
 *
 *   /console/billing/checkout-success?cs={CHECKOUT_SESSION_ID}
 *
 * The actual config flip happens server-side via the
 * `checkout.session.completed` webhook, which races with this page.
 * We poll /service/health (via useServiceHealth, every ~10s) and
 * watch for `config.plan` to flip from "free" → "custom".
 *
 * Stripe's webhooks usually fire within seconds, but in the worst
 * case can take ~30s. We show "still processing" until then, and a
 * "this is taking longer than expected" hint after ~30s.
 */
const PROCESSING_HINT_AFTER_MS = 30_000;

export default function CheckoutSuccessPage() {
  const { session } = useConsole();
  const slug = session?.organization?.slug ?? "";
  const health = useServiceHealth(slug);
  const [hintShown, setHintShown] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHintShown(true), PROCESSING_HINT_AFTER_MS);
    return () => clearTimeout(t);
  }, []);

  if (!session?.organization) {
    return (
      <CenterCard>
        <p className="text-gray-500 text-sm">
          Sign in to your organization to view your subscription.
        </p>
      </CenterCard>
    );
  }

  // The success page handles two flows:
  //   - Fresh upgrade or resubscribe (Stripe redirects here after payment).
  //     The query param `?plan=<slug>` tells us which template to expect;
  //     when it's absent we accept any non-free plan as upgraded.
  //   - In-place plan switch (frontend redirects here directly after the
  //     /billing/checkout call returns kind: "switched"). Same logic —
  //     we wait for the webhook to flip `cfg.plan` to the expected slug.
  const expectedPlan =
    typeof window !== "undefined"
      ? new URL(window.location.href).searchParams.get("plan") ?? null
      : null;
  const currentPlan = health.state === "ok" ? health.data.config?.plan : null;
  const upgraded = expectedPlan
    ? currentPlan === expectedPlan
    : !!currentPlan && currentPlan !== "free";

  if (upgraded) {
    const cfg = health.state === "ok" ? health.data.config : null;
    // planName / billingPeriod come from the template via /service/health.
    // Both nullable (free / legacy plans), but in the `upgraded` branch
    // they should always be present — fall back gracefully if they aren't
    // (e.g. the proxy hasn't been redeployed with these fields yet).
    const planLabel = cfg?.planName ?? "a new plan";
    const periodLabel = cfg?.billingPeriod ?? "monthly";
    return (
      <CenterCard>
        <SuccessIcon />
        <h1 className="text-2xl font-bold font-merriweather">
          You&rsquo;re upgraded!
        </h1>
        <p className="text-gray-600 text-sm max-w-md">
          {session.organization.name} is now on the{" "}
          <strong>{planLabel}</strong>. Usage will be billed{" "}
          {periodLabel} via Stripe.
        </p>
        <button
          onClick={() => {
            window.location.href = "/console";
          }}
          className="text-sm font-merriweather text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline"><path d="M8.21192 3.09155C8.40164 2.95736 8.66555 2.96958 8.8418 3.13452C9.01806 3.29976 9.04853 3.56338 8.92676 3.76148L8.86524 3.84155L5.43555 7.49976L8.86524 11.158L8.92676 11.238C9.04853 11.4361 9.01806 11.6998 8.8418 11.865C8.66555 12.0299 8.40164 12.0422 8.21192 11.908L8.13477 11.8416L4.38477 7.84155C4.20487 7.64932 4.20487 7.35019 4.38477 7.15796L8.13477 3.15796L8.21192 3.09155Z" fill="currentColor"></path></svg> Back to console
        </button>
      </CenterCard>
    );
  }

  return (
    <CenterCard>
      <Spinner />
      <h1 className="text-xl font-bold font-merriweather">
        Activating your subscription…
      </h1>
      <p className="text-gray-600 text-sm max-w-md">
        Stripe is confirming your payment. This usually only takes a few
        seconds.
      </p>
      {hintShown && (
        <p className="text-xs text-gray-400 max-w-md">
          Still waiting? Try refreshing — the activation will complete in the
          background. If it doesn&rsquo;t resolve, contact{" "}
          <a
            href="mailto:support@legalese.com"
            className="underline underline-offset-2"
          >
            support@legalese.com
          </a>
          .
        </p>
      )}
      <button
        onClick={() => {
          window.location.href = "/console";
        }}
        className="text-sm font-merriweather text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline"><path d="M8.21192 3.09155C8.40164 2.95736 8.66555 2.96958 8.8418 3.13452C9.01806 3.29976 9.04853 3.56338 8.92676 3.76148L8.86524 3.84155L5.43555 7.49976L8.86524 11.158L8.92676 11.238C9.04853 11.4361 9.01806 11.6998 8.8418 11.865C8.66555 12.0299 8.40164 12.0422 8.21192 11.908L8.13477 11.8416L4.38477 7.84155C4.20487 7.64932 4.20487 7.35019 4.38477 7.15796L8.13477 3.15796L8.21192 3.09155Z" fill="currentColor"></path></svg> Back to console
      </button>
    </CenterCard>
  );
}

function CenterCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center max-w-2xl mx-auto">
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-10 w-10 text-accent"
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
  );
}

function SuccessIcon() {
  return (
    <svg
      className="h-12 w-12 text-green-500"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
