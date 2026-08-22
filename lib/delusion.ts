export type DelusionLabel =
  | "Underground Cash Cow"
  | "Ghost Revenue"
  | "Overvalued VC Bait"
  | "Vaporware Darling"
  | "Mildly Delusional"
  | "Calibrated";

export function delusionRatio(mrrRank: number, eloRank: number): number {
  const elo = Math.max(eloRank, 1);
  return Number((mrrRank / elo).toFixed(2));
}

export function delusionLabel(args: {
  mrr: number;
  mrrRank: number;
  eloRank: number;
  total: number;
}): DelusionLabel {
  const { mrr, mrrRank, eloRank, total } = args;
  if (total < 2) return "Calibrated";

  const mrrPercentile = mrrRank / total;
  const eloPercentile = eloRank / total;
  const highMrr = mrr >= 1000 && mrrPercentile <= 0.4;
  const lowMrr = mrr <= 1000;
  const highElo = eloPercentile <= 0.35;
  const lowElo = eloPercentile >= 0.6;

  if (highMrr && lowElo) {
    return mrr >= 10000 ? "Ghost Revenue" : "Underground Cash Cow";
  }
  if (lowMrr && highElo) {
    return mrr <= 0 ? "Vaporware Darling" : "Overvalued VC Bait";
  }
  const ratio = delusionRatio(mrrRank, eloRank);
  if (ratio > 1.8 || ratio < 0.55) return "Mildly Delusional";
  return "Calibrated";
}
