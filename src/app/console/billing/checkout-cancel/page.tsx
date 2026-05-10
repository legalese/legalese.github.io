"use client";

import Link from "next/link";

/**
 * Stripe redirects here when the customer cancels at the Checkout page
 * (or closes the tab and re-opens via the cancel link). No payment was
 * captured and no org config was changed — just a clean "you can try
 * again" landing.
 */
export default function CheckoutCancelPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center max-w-2xl mx-auto">
      <svg
        className="h-12 w-12 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
      <h1 className="text-xl font-bold font-merriweather">
        Checkout cancelled
      </h1>
      <p className="text-gray-600 text-sm max-w-md">
        No payment was made and your subscription was not changed. You can
        come back any time when you&rsquo;re ready.
      </p>
      <div className="flex gap-2 mt-2">
        <Link
          href="/console/organization"
          className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2"
        >
          Back to console
        </Link>
      </div>
    </div>
  );
}
