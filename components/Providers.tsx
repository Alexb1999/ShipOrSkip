"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { BrokieEgg } from "@/components/BrokieEgg";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      {children}
      <BrokieEgg />
    </SessionProvider>
  );
}

