"use client";

import { WidgetPage } from "../console-utils";
import { AdminPortalSsoConnection } from "@workos-inc/widgets/admin-portal-sso-connection";

export default function SsoPage() {
  return (
    <WidgetPage scope="widgets:sso:manage">
      {(token) => <AdminPortalSsoConnection authToken={token} />}
    </WidgetPage>
  );
}
