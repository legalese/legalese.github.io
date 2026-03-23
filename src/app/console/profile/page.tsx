"use client";

import { WidgetPage } from "../console-utils";
import { UserProfile } from "@workos-inc/widgets/user-profile";

export default function ProfilePage() {
  return (
    <WidgetPage scope="widgets:users-table:manage">
      {(token) => <UserProfile authToken={token} />}
    </WidgetPage>
  );
}
