/** Demo login is for local/staging. Production stays X-only unless you flip this. */
export function demoLoginEnabled() {
  if (process.env.ALLOW_DEMO_LOGIN === "true") return true;
  if (process.env.ALLOW_DEMO_LOGIN === "false") return false;
  return process.env.NODE_ENV !== "production";
}

/** Instant "paid" checkout is for local only. Live site needs Stripe. */
export function demoPaymentsEnabled() {
  if (process.env.ALLOW_DEMO_PAYMENTS === "true") return true;
  if (process.env.ALLOW_DEMO_PAYMENTS === "false") return false;
  return process.env.NODE_ENV !== "production";
}
