"use client";

import { createContext, useContext } from "react";

interface SessionUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profilePictureUrl: string | null;
}

export interface ConsoleSession {
  authenticated: true;
  user: SessionUser;
  organizationId: string | null;
  permissions: string[];
}

interface ConsoleContextValue {
  session: ConsoleSession | null;
  loading: boolean;
  onLogout: () => void;
}

export const ConsoleContext = createContext<ConsoleContextValue>({
  session: null,
  loading: true,
  onLogout: () => {},
});

export function useConsole() {
  return useContext(ConsoleContext);
}
