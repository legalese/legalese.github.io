"use client";

import { WidgetPage } from "../console-utils";
import { ApiKeys } from "@workos-inc/widgets/api-keys";

export default function ApiKeysPage() {
  return (
    <WidgetPage scope="widgets:api-keys:manage">
      {(token) => <ApiKeys authToken={token} />}
    </WidgetPage>
  );
}
