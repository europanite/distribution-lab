import { logGamma } from "../math/special";
import type { DistributionDefinition } from "./types";

function logCombination(n: number, k: number): number {
  return logGamma(n + 1) - logGamma(k + 1) - logGamma(n - k + 1);
}

export const binomialDistribution: DistributionDefinition = {
  id: "binomial",
  name: "Binomial",
  kind: "discrete",
  description: "Counts successes across a fixed number of independent Bernoulli trials.",
  formula: () => "P(X = k) = C(n,k) pᵏ (1−p)^(n−k), k = 0, …, n",
  parameters: [
    {
      key: "n",
      label: "Trials",
      symbol: "n",
      min: 1,
      max: 100,
      step: 1,
      defaultValue: 20,
    },
    {
      key: "p",
      label: "Success probability",
      symbol: "p",
      min: 0.01,
      max: 0.99,
      step: 0.01,
      defaultValue: 0.5,
    },
  ],
  plotDomain: [0, 100],
  domain: ({ n }) => [0, Math.round(n)],
  evaluate: (x, { n, p }) => {
    const trials = Math.round(n);
    const k = Math.round(x);
    if (k < 0 || k > trials || Math.abs(x - k) > 1e-9) return 0;
    const logMass =
      logCombination(trials, k) +
      k * Math.log(p) +
      (trials - k) * Math.log(1 - p);
    return Math.exp(logMass);
  },
  sample: (rng, { n, p }) => {
    const trials = Math.round(n);
    let successes = 0;
    for (let i = 0; i < trials; i += 1) {
      if (rng() < p) successes += 1;
    }
    return successes;
  },
  mean: ({ n, p }) => Math.round(n) * p,
  variance: ({ n, p }) => Math.round(n) * p * (1 - p),
};
