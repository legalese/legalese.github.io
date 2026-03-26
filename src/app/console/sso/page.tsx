"use client";

import { WidgetPage } from "../console-utils";
import { AdminPortalSsoConnection } from "@workos-inc/widgets/admin-portal-sso-connection";

export default function SsoPage() {
  return (
    <div className="space-y-2">
      <WidgetPage scope="widgets:sso:manage">
        {(token) => <AdminPortalSsoConnection authToken={token} />}
      </WidgetPage>
      <p className="text-xs text-gray-500">
        Connect your identity provider to enable Single Sign-On (SSO). Once configured, members can log in using their existing company credentials and access is automatically revoked when they leave your organization.
      </p>
    </div>
  );
}
