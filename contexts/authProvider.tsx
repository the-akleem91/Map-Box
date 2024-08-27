import React from "react";

import { useStorageState } from "@/hooks/useStorageState";
import type { User } from "@/types/user";

const AuthContext = React.createContext<{
  signIn: (data: User | null) => void;
  signOut: () => void;
  session?: User | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("auth_session");

  return (
    <AuthContext.Provider
      value={{
        signIn: (data) => {
          setSession(data);
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
