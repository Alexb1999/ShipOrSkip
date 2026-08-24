"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";

function safeFrom(value: FormDataEntryValue | string | null | undefined) {
  const path = String(value ?? "/deck");
  if (path.startsWith("/") && !path.startsWith("//")) return path;
  return "/deck";
}

export async function demoSignIn(formData: FormData) {
  const from = safeFrom(formData.get("from"));
  try {
    await signIn("demo", { intent: "play", redirectTo: from });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(`/login?from=${encodeURIComponent(from)}&error=demo`);
    }
    throw error;
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}
