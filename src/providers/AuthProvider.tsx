import { useSession } from "next-auth/react";
import { createContext, useState } from "react";

export const AuthContext = createContext<any>(null);

export default function AuthProvider({ children }: any) {
  const { data } = useSession();
  const sessionUser = data?.user
  const [loading, setLoading] = useState(true);

  const authInfo: any = {
    sessionUser,
    loading,
    setLoading,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
}
