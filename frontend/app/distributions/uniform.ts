import type { DistributionDefinition } from "./types";

export const uniformDistribution: DistributionDefinition = {
  id: "uniform",
  name: "Uniform",
  kind: "continuous",
  description: "Every value inside a finite interval has the same density.",
  formula: ({ a, width }) =>
    `f(x) = 1/${width.toFixed(2)} for ${a.toFixed(2)} ≤ x ≤ ${(a + width).toFixed(2)}, otherwise 0`,
  parameters: [
    {
      key: "a",
      label: "Lower bound",
      symbol: "a",
      min: -10,
      max: 10,
      step: 0.1,
      defaultValue: 0,
    },
    {
      key: "width",
      label: "Width",
      symbol: "w",
      min: 0.2,
      max: 12,
      step: 0.1,
      defaultValue: 4,
      description: "Upper bound is a + w.",
    },
  ],
  plotDomain: [-12, 24],
  domain: ({ a, width }) => {
    const padding = Math.max(0.6, width * 0.2);
    return [a - padding, a + width + padding];
  },
  evaluate: (x, { a, width }) =>
    x >= a && x <= a + width ? 1 / width : 0,
  sample: (rng, { a, width }) => a + width * rng(),
  mean: ({ a, width }) => a + width / 2,
  variance: ({ width }) => (width * width) / 12,
};
