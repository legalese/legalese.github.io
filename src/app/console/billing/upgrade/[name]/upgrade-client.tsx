"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AUTH_API_URL } from "@/lib/constants";
import { useConsole } from "../../../console-context";
import {
  authHeaders,
  useServiceHealth,
} from "../../../console-utils";

interface TemplatePrice {
  id: string;
  nickname: string | null;
  productName: string | null;
  /** product.unit_label, e.g. "1k tokens", "MB". */
  unitLabel: string | null;
  /** Per-unit cents as integer; null for tiered or sub-cent prices. */
  unitAmount: number | null;
  /** Sub-cent per-unit as string (e.g. "0.4"); preferred over unitAmount when present. */
  unitAmountDecimal: string | null;
  currency: string;
  transformQuantity: { divideBy: number; round: string } | null;
  /** "per_unit" | "tiered" | null */
  billingScheme: string | null;
  meterEventName: string | null;
}

interface TemplatePublic {
  name: string;
  description: string;
  currency: string;
  billingPeriod: string;
  prices: TemplatePrice[];
}

type TemplateState =
  | { state: "loading" }
  | { state: "not-found" }
  | { state: "error"; message: string }
  | { state: "ok"; data: TemplatePublic };

export function UpgradePageClient({ templateName }: { templateName: string }) {
  const { session } = useConsole();
  const [tpl, setTpl] = useState<TemplateState>({ state: "loading" });

  useEffect(() => {
    if (!templateName) return;
    let cancelled = false;
    setTpl({ state: "loading" });
    fetch(
      `${AUTH_API_URL}/billing/templates/${encodeURIComponent(templateName)}`,
    )
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 404) {
          setTpl({ state: "not-found" });
          return;
        }
        if (!res.ok) {
          setTpl({ state: "error", message: `HTTP ${res.status}` });
          return;
        }
        const data: TemplatePublic = await res.json();
        setTpl({ state: "ok", data });
      })
      .catch(() =>
        setTpl({ state: "error", message: "Service temporarily unavailable" }),
      );
    return () => {
      cancelled = true;
    };
  }, [templateName]);

  const CHEVRON = <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline"><path d="M8.21192 3.09155C8.40164 2.95736 8.66555 2.96958 8.8418 3.13452C9.01806 3.29976 9.04853 3.56338 8.92676 3.76148L8.86524 3.84155L5.43555 7.49976L8.86524 11.158L8.92676 11.238C9.04853 11.4361 9.01806 11.6998 8.8418 11.865C8.66555 12.0299 8.40164 12.0422 8.21192 11.908L8.13477 11.8416L4.38477 7.84155C4.20487 7.64932 4.20487 7.35019 4.38477 7.15796L8.13477 3.15796L8.21192 3.09155Z" fill="currentColor"></path></svg>

  if (tpl.state === "loading") {
    return <CenterMessage><span className="text-gray-400">Loading…</span></CenterMessage>;
  }
  if (tpl.state === "not-found") {
    return (
      <CenterMessage>
        <h1 className="text-xl font-bold font-merriweather mb-2">
          Plan not found
        </h1>
        <p className="text-gray-500 text-sm">
          No plan named <span className="font-mono">{templateName}</span>{" "}
          exists.
        </p>
        <button
          onClick={() => {
            window.location.href = "/console";
          }}
          className="text-sm font-merriweather text-gray-400 hover:text-gray-600 transition-colors"
        >
          {CHEVRON} Back to console
        </button>
      </CenterMessage>
    );
  }
  if (tpl.state === "error") {
    return (
      <CenterMessage>
        <p className="text-red-600 text-sm">
          Could not load plan: {tpl.message}
        </p>
      </CenterMessage>
    );
  }

  if (!session?.organization) {
    return (
      <CenterMessage>
        <p className="text-gray-500 text-sm">
          Sign in to an organization to upgrade.
        </p>
      </CenterMessage>
    );
  }

  return (
    <UpgradeContent
      templateName={templateName}
      template={tpl.data}
      slug={session.organization.slug}
      orgName={session.organization.name}
      isAdmin={session.permissions.includes("l4:admin")}
    />
  );
}

function UpgradeContent({
  templateName,
  template,
  slug,
  orgName,
  isAdmin,
}: {
  templateName: string;
  template: TemplatePublic;
  slug: string;
  orgName: string;
  isAdmin: boolean;
}) {
  const health = useServiceHealth(slug);
  const alreadyPaid =
    health.state === "ok" && health.data.config?.plan === "custom";

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(
        `${AUTH_API_URL}/billing/checkout?org=${encodeURIComponent(slug)}&template=${encodeURIComponent(templateName)}`,
        {
          method: "POST",
          headers: authHeaders(),
          credentials: "include",
        },
      );
      if (res.status === 409) {
        setError("This organization is already on a paid plan.");
        setSubmitting(false);
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const { url } = await res.json();
      if (!url) throw new Error("Checkout URL not returned");
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <header>
        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
          Upgrade plan
        </p>
        <h1 className="text-2xl font-bold font-merriweather">
          {template.name}
        </h1>
        {template.description && (
          <p className="text-gray-600 mt-2 text-sm">{template.description}</p>
        )}
        <p className="text-xs text-gray-400 mt-3">
          For organization{" "}
          <span className="font-medium text-gray-600">{orgName}</span> · billed{" "}
          {template.billingPeriod} in {template.currency.toUpperCase()}
        </p>
      </header>

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="px-5 py-3 border-b border-gray-100 text-xs font-medium uppercase tracking-wider text-gray-500">
          Pricing
        </div>
        <ul className="divide-y divide-gray-100">
          {template.prices.map((p) => (
            <li
              key={p.id}
              className="px-5 py-3 flex items-center justify-between gap-4"
            >
              <span className="text-sm text-gray-800">
                {p.productName ?? p.nickname ?? p.id}
              </span>
              <span className="text-sm text-gray-600 font-mono whitespace-nowrap">
                {formatPrice(p)}
              </span>
            </li>
          ))}
        </ul>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          You&rsquo;re only charged for what you use. No monthly minimum.
        </div>
      </div>

      {alreadyPaid ? (
        <div className="rounded border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
          This organization is already on a paid plan.{" "}
          <Link href="/console/organization" className="underline">
            View your subscription
          </Link>
          .
        </div>
      ) : isAdmin ? (
        <div className="text-center space-y-2">
          <button
            onClick={handleUpgrade}
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Spinner /> Redirecting…
              </>
            ) : (
              <>Upgrade to {template.name}</>
            )}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <p className="text-xs text-gray-400">
            You&rsquo;ll be redirected to Stripe to enter payment details. You
            can cancel any time from your organization page.
          </p>
        </div>
      ) : (
        <div className="rounded border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          Only organization admins can change billing. Ask an admin in{" "}
          <span className="font-medium">{orgName}</span> to upgrade.
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

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 mr-2"
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

/**
 * Format a Stripe Price for the upgrade page.
 *
 * Stripe surfaces the per-unit price one of three ways:
 *  1. `unitAmount` (integer cents) — used when the price is ≥ 1¢ per unit
 *     AND the price is not tiered.
 *  2. `unitAmountDecimal` (decimal string, e.g. "0.4") — used when the
 *     price is sub-cent (Stripe can't represent 0.4¢ as an integer).
 *     Always check this when `unitAmount` is null AND `billingScheme === "per_unit"`.
 *  3. Tiered — `billingScheme === "tiered"`, no single per-unit value.
 *
 * `transformQuantity.divideBy` (when set on the Price) means Stripe
 * divides incoming usage by N before applying unit_amount, so the
 * displayed price reads "$X per N units".
 *
 * Falls back to `unitLabel` from the product to describe what a "unit"
 * is (e.g. "1k tokens", "MB"). Set this on Products in Stripe to make
 * the display self-documenting.
 */
function formatPrice(p: TemplatePrice): string {
  const unit = p.unitLabel ?? "unit";
  // Prefer the decimal string (handles sub-cent prices) when it's
  // actually present; fall back to the integer cents value. The strict
  // `typeof === "string"` check matters: `unitAmountDecimal` will be
  // `undefined` against an older backend that doesn't surface the
  // field yet, and `parseFloat(undefined)` → NaN would otherwise make
  // every price (even non-decimal ones) render as "—".
  const cents =
    typeof p.unitAmountDecimal === "string" && p.unitAmountDecimal.length > 0
      ? parseFloat(p.unitAmountDecimal)
      : p.unitAmount;
  if (cents == null || Number.isNaN(cents)) {
    if (p.billingScheme === "tiered") return "Tiered";
    return "—";
  }
  const dollars = cents / 100;
  // Sub-cent prices need 4 decimal places to be readable ($0.0040 not $0.00).
  // Integer-dollar amounts use the locale-aware currency formatter for
  // proper symbols/separators.
  const formatted =
    dollars >= 1
      ? dollars.toLocaleString(undefined, {
          style: "currency",
          currency: p.currency.toUpperCase(),
        })
      : `$${dollars.toFixed(dollars < 0.01 ? 4 : 2)}`;
  if (p.transformQuantity?.divideBy && p.transformQuantity.divideBy > 1) {
    return `${formatted} per ${p.transformQuantity.divideBy.toLocaleString()} ${unit}s`;
  }
  return `${formatted} per ${unit}`;
}
