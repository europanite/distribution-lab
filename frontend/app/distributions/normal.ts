import { standardNormal } from "../math/random";
import type { DistributionDefinition } from "./types";

export const normalDistribution: DistributionDefinition = {
  id: "normal",
  name: "Normal",
  kind: "continuous",
  description: "Symmetric bell-shaped distribution controlled by mean and spread.",
  formula: () =>
    "f(x) = 1/(σ√(2π)) · exp(−(x−μ)²/(2σ²))",
  parameters: [
    {
      key: "mu",
      label: "Mean",
      symbol: "μ",
      min: -10,
      max: 10,
      step: 0.1,
      defaultValue: 0,
    },
    {
      key: "sigma",
      label: "Standard deviation",
      symbol: "σ",
      min: 0.1,
      max: 5,
      step: 0.1,
      defaultValue: 1,
    },
  ],
  plotDomain: [-15, 15],
  domain: ({ mu, sigma }) => [mu - 4 * sigma, mu + 4 * sigma],
  evaluate: (x, { mu, sigma }) => {
    const z = (x - mu) / sigma;
    return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
  },
  sample: (rng, { mu, sigma }) => mu + sigma * standardNormal(rng),
  mean: ({ mu }) => mu,
  variance: ({ sigma }) => sigma * sigma,
};
