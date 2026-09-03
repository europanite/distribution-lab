import type { DistributionDefinition } from "./types";

function logFactorial(n: number): number {
  let result = 0;
  for (let i = 2; i <= n; i += 1) result += Math.log(i);
  return result;
}

export const poissonDistribution: DistributionDefinition = {
  id: "poisson",
  name: "Poisson",
  kind: "discrete",
  description: "Models counts of independent events in a fixed interval.",
  formula: () => "P(X = k) = exp(−λ) λᵏ / k!, k = 0, 1, 2, …",
  parameters: [
    {
      key: "lambda",
      label: "Expected count",
      symbol: "λ",
      min: 0.1,
      max: 20,
      step: 0.1,
      defaultValue: 4,
    },
  ],
  plotDomain: [0, 40],
  domain: ({ lambda }) => [
    0,
    Math.max(8, Math.ceil(lambda + 4 * Math.sqrt(lambda))),
  ],
  evaluate: (x, { lambda }) => {
    const k = Math.round(x);
    if (k < 0 || Math.abs(x - k) > 1e-9) return 0;
    return Math.exp(-lambda + k * Math.log(lambda) - logFactorial(k));
  },
  sample: (rng, { lambda }) => {
    // Knuth's exact method; λ is intentionally capped at 20 in the UI.
    const threshold = Math.exp(-lambda);
    let product = 1;
    let k = 0;
    do {
      k += 1;
      product *= rng();
    } while (product > threshold);
    return k - 1;
  },
  mean: ({ lambda }) => lambda,
  variance: ({ lambda }) => lambda,
};
