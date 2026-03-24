"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AUTH_API_URL } from "@/lib/constants";
import { useConsole } from "./console-context";

const TABS: readonly {
  path: string;
  label: string;
  permission?: string;
}[] = [
  { path: "/console/organization", label: "Organization" },
  { path: "/console/logs", label: "Logs" },
  { path: "/console/members", label: "Members", permission: "widgets:users-table:manage" },
  { path: "/console/api-keys", label: "API Keys", permission: "widgets:api-keys:manage" },
  { path: "/console/profile", label: "Profile" },
];

export function ConsoleNav({ children }: { children: React.ReactNode }) {
  const { session, loading, onLogout } = useConsole();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <svg
          className="animate-spin h-8 w-8 text-gray-400"
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
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <h1 className="text-2xl font-bold font-merriweather">
          Sign in to continue
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          Access your organization settings, manage team members, and create API
          keys.
        </p>
        <a
          href={`${AUTH_API_URL}/auth/login?return_to=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
          className="inline-flex items-center px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
        >
          Sign in
        </a>
      </div>
    );
  }

  if (!session.organizationId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <h1 className="text-2xl font-bold font-merriweather">
          No organization selected
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          You need to be part of an organization to use the console. Contact
          your administrator for an invite.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onLogout}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Tabs */}
      <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pr-8">
        <nav className="flex whitespace-nowrap">
          {TABS.filter((tab) => !tab.permission || session.permissions.includes(tab.permission)).map((tab) => {
            const isActive =
              pathname === tab.path ||
              (tab.path === "/console/organization" && pathname === "/console");
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`pb-3 mr-4 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? "border-accent text-accent"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Content area */}
      <div className="bg-white p-6 min-h-[400px] -mx-4 sm:-mx-6 lg:mx-0">
        {children}
      </div>
    </div>
  );
}
