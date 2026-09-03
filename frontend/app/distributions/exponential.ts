import type { DistributionDefinition } from "./types";

export const exponentialDistribution: DistributionDefinition = {
  id: "exponential",
  name: "Exponential",
  kind: "continuous",
  description: "Models positive waiting times with a constant event rate.",
  formula: () => "f(x) = λ exp(−λx), x ≥ 0",
  parameters: [
    {
      key: "lambda",
      label: "Rate",
      symbol: "λ",
      min: 0.1,
      max: 5,
      step: 0.1,
      defaultValue: 1,
    },
  ],
  plotDomain: [0, 20],
  plotYMax: 5.5,
  domain: ({ lambda }) => [0, 6 / lambda],
  evaluate: (x, { lambda }) => (x < 0 ? 0 : lambda * Math.exp(-lambda * x)),
  sample: (rng, { lambda }) =>
    -Math.log(Math.max(1 - rng(), Number.EPSILON)) / lambda,
  mean: ({ lambda }) => 1 / lambda,
  variance: ({ lambda }) => 1 / (lambda * lambda),
};
