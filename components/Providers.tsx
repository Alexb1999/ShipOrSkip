"use client";

import { SessionProvider } from "next-auth/react";
import { BrokieEgg } from "@/components/BrokieEgg";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <BrokieEgg />
    </SessionProvider>
  );
}

