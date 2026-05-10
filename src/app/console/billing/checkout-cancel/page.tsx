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
        <button
          onClick={() => {
            window.location.href = "/console";
          }}
          className="text-sm font-merriweather text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline"><path d="M8.21192 3.09155C8.40164 2.95736 8.66555 2.96958 8.8418 3.13452C9.01806 3.29976 9.04853 3.56338 8.92676 3.76148L8.86524 3.84155L5.43555 7.49976L8.86524 11.158L8.92676 11.238C9.04853 11.4361 9.01806 11.6998 8.8418 11.865C8.66555 12.0299 8.40164 12.0422 8.21192 11.908L8.13477 11.8416L4.38477 7.84155C4.20487 7.64932 4.20487 7.35019 4.38477 7.15796L8.13477 3.15796L8.21192 3.09155Z" fill="currentColor"></path></svg> Back to console
        </button>
      </div>
    </div>
  );
}
