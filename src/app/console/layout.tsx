import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CMS_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Console",
  robots: { index: false, follow: false },
};

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
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
            <span className="text-sm text-gray-500 font-medium">Console</span>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
