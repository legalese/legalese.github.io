"use client";

import { WidgetPage } from "../console-utils";
import { UserProfile } from "@workos-inc/widgets/user-profile";
import { UserSecurity } from "@workos-inc/widgets/user-security";

export default function ProfilePage() {
  return (
    <WidgetPage scope="widgets:users-table:manage">
      {(token) => (
        <div className="space-y-8">
          <UserProfile authToken={token} />
          <UserSecurity authToken={token} />
        </div>
      )}
    </WidgetPage>
  );
}
