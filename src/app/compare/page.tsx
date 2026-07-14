import type { Metadata } from "next";
import { ConsoleShell } from "../console/console-shell";
import { CompareClient } from "./compare-client";

export const metadata: Metadata = {
  title: "Compare | Legalese",
  description:
    "See how different AI models understand your legislation: ontology, propositional, predicative and regulative encodings, side by side.",
};

export default function ComparePage() {
  return (
    <ConsoleShell>
      <CompareClient />
    </ConsoleShell>
  );
}
