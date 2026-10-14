// Sign-in to Legalese Cloud without the session token in a URL.
//
// The console starts every login with a PKCE challenge
// (/auth/login?code_challenge=…). jl4-auth-proxy then returns a short-lived
// code (?code=h1.…) instead of the session token (?token=…), and the console
// exchanges code + verifier at POST /auth/exchange. The verifier never
// leaves this tab's sessionStorage, so a code that leaks through history or
// a screenshot is useless.
//
// Editors (the VS Code extension) send their own challenge with redirect_to;
// the console's Continue asks the proxy for the editor link with a code bound
// to it (POST /auth/handoff), and the editor redeems that code itself.

import { AUTH_API_URL } from "@/lib/constants";

const VERIFIER_KEY = "legalese-login-verifier";
const VERIFIER_TTL_MS = 15 * 60 * 1000;

function base64url(bytes: Uint8Array): string {
  let s = "";
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** RFC 7636 S256 challenge for a verifier. */
export async function s256(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  return base64url(new Uint8Array(digest));
}

/** The shape of an S256 challenge (base64url of a SHA-256 digest). */
export function isS256Challenge(value: string | null): value is string {
  return !!value && /^[A-Za-z0-9_-]{43}$/.test(value);
}

/** Start a console sign-in that returns to `returnTo` with a code. */
export async function startLogin(
  returnTo: string,
  opts: { organizationId?: string } = {},
): Promise<void> {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const verifier = base64url(bytes);
  sessionStorage.setItem(
    VERIFIER_KEY,
    JSON.stringify({ verifier, createdAt: Date.now() }),
  );
  const params = new URLSearchParams({
    return_to: returnTo,
    code_challenge: await s256(verifier),
    code_challenge_method: "S256",
  });
  if (opts.organizationId) params.set("organization_id", opts.organizationId);
  window.location.href = `${AUTH_API_URL}/auth/login?${params.toString()}`;
}

/**
 * Finish a console sign-in: exchange the code from the URL for the session
 * token. Returns null when there's no pending login in this tab or the
 * exchange is refused.
 */
export async function completeLogin(code: string): Promise<string | null> {
  const raw = sessionStorage.getItem(VERIFIER_KEY);
  sessionStorage.removeItem(VERIFIER_KEY);
  let pending: { verifier?: unknown; createdAt?: unknown } = {};
  try {
    pending = raw ? JSON.parse(raw) : {};
  } catch {
    return null;
  }
  if (
    typeof pending.verifier !== "string" ||
    typeof pending.createdAt !== "number" ||
    Date.now() - pending.createdAt > VERIFIER_TTL_MS
  ) {
    return null;
  }
  try {
    const res = await fetch(`${AUTH_API_URL}/auth/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, code_verifier: pending.verifier }),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { token?: unknown };
    return typeof body.token === "string" ? body.token : null;
  } catch {
    return null;
  }
}
