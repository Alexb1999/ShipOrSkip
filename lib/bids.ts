export const MIN_BID = 10;
export const BID_TTL_HOURS = 24 * 7;
export const DAILY_DECAY = 0.8;

export function effectiveBidAmount(
  bidAmount: number,
  createdAt: Date,
  now = new Date(),
): number {
  const hoursAlive = Math.max(
    0,
    (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60),
  );
  const days = Math.floor(hoursAlive / 24);
  return Number((bidAmount * DAILY_DECAY ** days).toFixed(2));
}

export function bidExpiresAt(from = new Date()): Date {
  return new Date(from.getTime() + BID_TTL_HOURS * 60 * 60 * 1000);
}

export function minNextBid(currentEffective: number | null | undefined): number {
  if (!currentEffective || currentEffective < MIN_BID) return MIN_BID;
  return Math.ceil(currentEffective) + 1;
}
