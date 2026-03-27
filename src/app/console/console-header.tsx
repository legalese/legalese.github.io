"use client";

import Link from "next/link";
import Image from "next/image";
import { AUTH_API_URL, CMS_NAME } from "@/lib/constants";
import { useConsole } from "./console-context";

export function ConsoleHeader() {
  const { session, loading, onLogout } = useConsole();

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
              <button
                onClick={onLogout}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors ml-2"
              >
                Sign out
              </button>
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
