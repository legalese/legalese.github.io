"use client";

import { useState, useEffect, useRef } from "react";
import { AUTH_API_URL, SERVICE_DOMAIN } from "@/lib/constants";
import { authHeaders } from "./console-utils";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 39);
}

export function OrgSetup() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const checkTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-derive slug from name unless user has manually edited it
  useEffect(() => {
    if (!slugEdited) {
      setSlug(toSlug(name));
    }
  }, [name, slugEdited]);

  // Debounced availability check
  useEffect(() => {
    if (checkTimeout.current) clearTimeout(checkTimeout.current);
    if (slug.length < 3) {
      setSlugStatus("idle");
      return;
    }
    setSlugStatus("checking");
    checkTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${AUTH_API_URL}/auth/org/check?slug=${encodeURIComponent(slug)}`,
          { credentials: "include", headers: authHeaders() },
        );
        setSlugStatus(res.ok ? "available" : "unavailable");
      } catch {
        setSlugStatus("idle");
      }
    }, 400);
    return () => {
      if (checkTimeout.current) clearTimeout(checkTimeout.current);
    };
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${AUTH_API_URL}/auth/org`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ name: name.trim(), slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Something went wrong.");
        return;
      }
      window.location.href = `${AUTH_API_URL}/auth/login?organization_id=${encodeURIComponent(data.organizationId)}&return_to=${encodeURIComponent(`${window.location.origin}/console`)}`;
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const slugHint = {
    idle: null,
    checking: <span className="text-gray-400">Checking availability…</span>,
    available: <span className="text-green-600">Available</span>,
    unavailable: <span className="text-red-500">Not available</span>,
  }[slugStatus];

  const canSubmit =
    !submitting &&
    name.trim().length > 0 &&
    slugStatus === "available";

  return (
    <div className="w-full max-w-md border border-gray-200 rounded-xl p-6 bg-white">
      <h2 className="text-lg font-semibold mb-4">Create a new organization</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Corp"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            disabled={submitting}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlugEdited(true);
              setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
            }}
            placeholder="acme-corp"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            disabled={submitting}
            required
          />
          <p className="text-xs mt-1 text-gray-400 min-h-[1.25rem]">
            {slugHint ?? `Used in your service URL: acme-corp.${SERVICE_DOMAIN}`}
          </p>
        </div>
        {submitError && (
          <p className="text-sm text-red-600">{submitError}</p>
        )}
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex justify-center items-center px-6 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? "Creating…" : "Create organization"}
        </button>
      </form>
    </div>
  );
}
