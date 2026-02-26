"use client";
import { SessionProvider } from "next-auth/react";
import AuthProvider from "./AuthProvider";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function NextAuthSesionProvider({ children }: any) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SessionProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
