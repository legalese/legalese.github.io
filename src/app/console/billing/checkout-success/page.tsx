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

  const upgraded =
    health.state === "ok" && health.data.config?.plan === "custom";

  if (upgraded) {
    return (
      <CenterCard>
        <SuccessIcon />
        <h1 className="text-2xl font-bold font-merriweather">
          You&rsquo;re upgraded!
        </h1>
        <p className="text-gray-600 text-sm max-w-md">
          {session.organization.name} is now on a metered plan. Your daily
          request limit is lifted and usage will be billed monthly via Stripe.
        </p>
        <Link
          href="/console/organization"
          className="inline-flex items-center px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
        >
          View your subscription
        </Link>
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
      <Link
        href="/console/organization"
        className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2"
      >
        Back to console
      </Link>
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
