import { betaDistribution } from "./beta";
import { binomialDistribution } from "./binomial";
import { exponentialDistribution } from "./exponential";
import { gammaDistribution } from "./gamma";
import { lognormalDistribution } from "./lognormal";
import { normalDistribution } from "./normal";
import { poissonDistribution } from "./poisson";
import type { DistributionDefinition } from "./types";
import { uniformDistribution } from "./uniform";

export const DISTRIBUTIONS: DistributionDefinition[] = [
  normalDistribution,
  uniformDistribution,
  exponentialDistribution,
  lognormalDistribution,
  gammaDistribution,
  betaDistribution,
  poissonDistribution,
  binomialDistribution,
];

export function getDistribution(id: string): DistributionDefinition {
  return (
    DISTRIBUTIONS.find((distribution) => distribution.id === id) ??
    normalDistribution
  );
}
