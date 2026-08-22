export const DEFAULT_ELO = 1200;
export const ELO_K = 32;
export const SUPER_SHIP_K = ELO_K * 10;

export function expectedScore(rating: number, opponentRating: number): number {
  return 1 / (1 + 10 ** ((opponentRating - rating) / 400));
}

export function eloDelta(args: {
  rating: number;
  opponentRating: number;
  won: boolean;
  k?: number;
}): number {
  const k = args.k ?? ELO_K;
  const expected = expectedScore(args.rating, args.opponentRating);
  const score = args.won ? 1 : 0;
  return Math.round(k * (score - expected));
}

export function applyElo(
  rating: number,
  opponentRating: number,
  won: boolean,
  k = ELO_K,
): number {
  return Math.max(100, rating + eloDelta({ rating, opponentRating, won, k }));
}
