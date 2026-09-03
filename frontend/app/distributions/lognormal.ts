import { standardNormal } from "../math/random";
import type { DistributionDefinition } from "./types";

export const lognormalDistribution: DistributionDefinition = {
  id: "lognormal",
  name: "Log-normal",
  kind: "continuous",
  description: "A positive, right-skewed distribution whose logarithm is normal.",
  formula: () =>
    "f(x) = 1/(xσ√(2π)) · exp(−(ln x−μ)²/(2σ²)), x > 0",
  parameters: [
    {
      key: "mu",
      label: "Log-mean",
      symbol: "μ",
      min: -2,
      max: 2,
      step: 0.1,
      defaultValue: 0,
    },
    {
      key: "sigma",
      label: "Log standard deviation",
      symbol: "σ",
      min: 0.1,
      max: 1.5,
      step: 0.1,
      defaultValue: 0.5,
    },
  ],
  plotDomain: [0, 50],
  domain: ({ mu, sigma }) => [0, Math.exp(mu + 3.8 * sigma)],
  evaluate: (x, { mu, sigma }) => {
    if (x <= 0) return 0;
    const z = (Math.log(x) - mu) / sigma;
    return Math.exp(-0.5 * z * z) / (x * sigma * Math.sqrt(2 * Math.PI));
  },
  sample: (rng, { mu, sigma }) => Math.exp(mu + sigma * standardNormal(rng)),
  mean: ({ mu, sigma }) => Math.exp(mu + (sigma * sigma) / 2),
  variance: ({ mu, sigma }) =>
    (Math.exp(sigma * sigma) - 1) * Math.exp(2 * mu + sigma * sigma),
};
