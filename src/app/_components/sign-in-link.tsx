'use client';

import type { ReactNode } from 'react';
import { startLogin } from '@/lib/auth-login';

/**
 * "Sign in" for pages outside the console. Starts a PKCE sign-in
 * (lib/auth-login.ts: no session token in any URL) that lands on
 * `returnTo`, which must be a page inside ConsoleShell to finish the
 * exchange. Without JavaScript the link just opens that page, and the
 * console offers its own sign-in there.
 */
export function SignInLink({
  className,
  children,
  returnTo = '/console',
}: {
  className?: string;
  children: ReactNode;
  returnTo?: string;
}) {
  return (
    <a
      href={returnTo}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        void startLogin(new URL(returnTo, window.location.origin).toString());
      }}
    >
      {children}
    </a>
  );
}
