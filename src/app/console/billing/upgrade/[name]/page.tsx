import { UpgradePageClient } from "./upgrade-client";

// Static export: list known templates here. Adding a new template
// (e.g. "enterprise") = drop {name}.template.json on EFS, add the
// name below, rebuild + deploy the console. Visiting an unlisted
// name 404s at the GitHub Pages layer (no static page generated).
export function generateStaticParams() {
  return [{ name: "metered" }];
}

export default async function UpgradePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  return <UpgradePageClient templateName={name} />;
}
