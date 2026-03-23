"use client";

import { WidgetPage } from "../console-utils";
import { UserSecurity } from "@workos-inc/widgets/user-security";

export default function SecurityPage() {
  return (
    <WidgetPage scope="widgets:users-table:manage">
      {(token) => <UserSecurity authToken={token} />}
    </WidgetPage>
  );
}
