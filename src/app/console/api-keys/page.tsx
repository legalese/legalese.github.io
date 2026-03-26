"use client";

import { WidgetPage } from "../console-utils";
import { ApiKeys } from "@workos-inc/widgets/api-keys";

export default function ApiKeysPage() {
  return (
    <div className="space-y-2">
      <WidgetPage scope="widgets:api-keys:manage">
        {(token) => <ApiKeys authToken={token} />}
      </WidgetPage>
      <p className="text-xs text-gray-500">
        API keys allow you to call the L4 service programmatically. Use them to integrate your rules engine into your own applications, automate evaluations, build custom workflows and integrate agentic capabilities to your websites with WebMCP.
      </p>
    </div>
  );
}
