"use client";

import { WidgetPage } from "../console-utils";
import { UsersManagement } from "@workos-inc/widgets/users-management";

export default function MembersPage() {
  return (
    <WidgetPage scope="widgets:users-table:manage">
      {(token) => <UsersManagement authToken={token} />}
    </WidgetPage>
  );
}
