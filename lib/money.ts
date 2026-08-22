import { Prisma } from "@prisma/client";

export function toNumber(value: Prisma.Decimal | number | string | null | undefined): number {
  if (value == null) return 0;
  return Number(value);
}

export function usd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}
