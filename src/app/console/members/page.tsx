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
        <WidgetPage scope="widgets:domain-verification:manage">
          {(token) => <AdminPortalDomainVerification authToken={token} />}
        </WidgetPage>
      )}
    </div>
  );
}
