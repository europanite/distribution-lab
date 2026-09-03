import { sampleGammaShape } from "../math/gammaSampling";
import { logBeta } from "../math/special";
import type { DistributionDefinition } from "./types";

export const betaDistribution: DistributionDefinition = {
  id: "beta",
  name: "Beta",
  kind: "continuous",
  description: "A flexible distribution on [0, 1], useful for probabilities and proportions.",
  formula: () => "f(x) = x^(α−1)(1−x)^(β−1) / B(α,β), 0 < x < 1",
  parameters: [
    {
      key: "alpha",
      label: "Alpha",
      symbol: "α",
      min: 0.3,
      max: 10,
      step: 0.1,
      defaultValue: 2,
    },
    {
      key: "beta",
      label: "Beta",
      symbol: "β",
      min: 0.3,
      max: 10,
      step: 0.1,
      defaultValue: 5,
    },
  ],
  plotDomain: [0, 1],
  domain: () => [0, 1],
  evaluate: (x, { alpha, beta }) => {
    if (x <= 0) return alpha < 1 && x === 0 ? Number.POSITIVE_INFINITY : 0;
    if (x >= 1) return beta < 1 && x === 1 ? Number.POSITIVE_INFINITY : 0;
    return Math.exp(
      (alpha - 1) * Math.log(x) +
        (beta - 1) * Math.log(1 - x) -
        logBeta(alpha, beta),
    );
  },
  sample: (rng, { alpha, beta }) => {
    const x = sampleGammaShape(rng, alpha);
    const y = sampleGammaShape(rng, beta);
    return x / (x + y);
  },
  mean: ({ alpha, beta }) => alpha / (alpha + beta),
  variance: ({ alpha, beta }) =>
    (alpha * beta) /
    ((alpha + beta) * (alpha + beta) * (alpha + beta + 1)),
};
