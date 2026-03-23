import type { Metadata } from "next";
import { ConsoleShell } from "./console-shell";
import { ConsoleNav } from "./console-nav";

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
    <ConsoleShell>
      <ConsoleNav>{children}</ConsoleNav>
    </ConsoleShell>
  );
}
