"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AUTH_API_URL, CMS_NAME } from "@/lib/constants";
import { useConsole } from "./console-context";

const MENU_LINK_CLASS =
  "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors";

export function ConsoleHeader() {
  const { session, loading, onLogout } = useConsole();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/assets/logos/legalese-logo.png"
              alt={CMS_NAME}
              width={32}
              height={32}
              className="rounded"
            />
            <span className="text-lg font-bold tracking-tight font-merriweather">
              {CMS_NAME}
            </span>
          </Link>

          {loading ? "" : session ? (
            <div className="flex items-center gap-3">
              {session.user.profilePictureUrl && (
                <img
                  src={session.user.profilePictureUrl}
                  alt=""
                  className="w-7 h-7 rounded-full"
                />
              )}
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium leading-tight">
                  {session.user.firstName} {session.user.lastName}
                </div>
                <div className="text-xs text-gray-500">
                  {session.user.email}
                </div>
              </div>
              <div className="relative ml-2">
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-label="Menu"
                  aria-expanded={menuOpen}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <path d="M3 5h14M3 10h14M3 15h14" />
                  </svg>
                </button>
                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setMenuOpen(false)}
                    />
                    <nav className="absolute right-0 z-40 mt-1 w-72 rounded-md border border-gray-200 bg-white shadow-lg py-1">
                      <Link
                        href="/console"
                        className={MENU_LINK_CLASS}
                        onClick={() => setMenuOpen(false)}
                      >
                        Cloud Console
                      </Link>
                      <Link
                        href="/compare"
                        className={MENU_LINK_CLASS}
                        onClick={() => setMenuOpen(false)}
                      >
                        Compare AI Legal Interpretations
                      </Link>
                      <div className="my-1 border-t border-gray-100" />
                      <Link
                        href="/"
                        className={MENU_LINK_CLASS}
                        onClick={() => setMenuOpen(false)}
                      >
                        Legalese Home
                      </Link>
                      <Link
                        href="/l4"
                        className={MENU_LINK_CLASS}
                        onClick={() => setMenuOpen(false)}
                      >
                        L4 Documentation
                      </Link>
                      <div className="my-1 border-t border-gray-100" />
                      <button
                        type="button"
                        onClick={onLogout}
                        className={`${MENU_LINK_CLASS} w-full text-left`}
                      >
                        Sign out
                      </button>
                    </nav>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div>
              <a
                href={`${AUTH_API_URL}/auth/signup?return_to=${typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""}`}
                className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
              >
                Sign up
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
