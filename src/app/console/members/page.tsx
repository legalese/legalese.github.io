"use client";

import { WidgetPage } from "../console-utils";
import { useConsole } from "../console-context";
import { UsersManagement } from "@workos-inc/widgets/users-management";
import { AdminPortalDomainVerification } from "@workos-inc/widgets/admin-portal-domain-verification";

export default function MembersPage() {
  const { session } = useConsole();
  const canManageDomains = session?.permissions.includes("widgets:domain-verification:manage") ?? false;

  return (
    <div className="space-y-8">
      <WidgetPage scope="widgets:users-table:manage">
        {(token) => <UsersManagement authToken={token} />}
      </WidgetPage>
      {canManageDomains && (
        <div className="space-y-2">
          <WidgetPage scope="widgets:domain-verification:manage">
            {(token) => <AdminPortalDomainVerification authToken={token} />}
          </WidgetPage>
          <p className="text-xs text-gray-500">
            Verify your organization&apos;s domain by adding a DNS TXT record. Once verified, users who sign in with a matching email address are automatically added as members — no invitation required. Verified domains also unlock Single Sign-On (SSO) for your organization.
          </p>
        </div>
      )}
    </div>
  );
}
