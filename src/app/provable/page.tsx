import type { Metadata } from "next";

// legalese.com/provable → the marketplace's own domain. Static export can't
// issue a real 301, so: canonical + meta refresh + JS replace.
const TARGET = "https://provable.legalese.com";

export const metadata: Metadata = {
  title: "Provable — the AI legal skill marketplace",
  description:
    "Provable is the marketplace for verifiable legal and policy skills: executable, source-open L4 rules your AI agents can call.",
  alternates: { canonical: TARGET },
};

export default function ProvableRedirect() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${TARGET}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(TARGET)})`,
        }}
      />
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Provable</h1>
        <p className="text-gray-600">
          The AI legal skill marketplace has moved to{" "}
          <a href={TARGET} className="text-accent underline">
            provable.legalese.com
          </a>
          .
        </p>
      </main>
    </>
  );
}
