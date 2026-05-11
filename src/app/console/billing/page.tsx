"use client";

import { useEffect } from "react";

// /console/billing has been folded into /console (the organization page).
// The plan label there now carries the inline Upgrade / Manage button, so
// there's no longer a separate billing landing page. The /console/billing
// subroutes (/upgrade/[name], /checkout-success, /checkout-cancel) stay —
// only this index redirects.
export default function BillingPage() {
  useEffect(() => {
    window.location.replace("/console");
  }, []);
  return null;
}
