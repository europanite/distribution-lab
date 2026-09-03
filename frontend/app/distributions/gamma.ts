import { sampleGammaShape } from "../math/gammaSampling";
import { logGamma } from "../math/special";
import type { DistributionDefinition } from "./types";

export const gammaDistribution: DistributionDefinition = {
  id: "gamma",
  name: "Gamma",
  kind: "continuous",
  description: "Flexible positive distribution controlled by shape and scale.",
  formula: () => "f(x) = x^(k−1) exp(−x/θ) / (Γ(k) θᵏ), x > 0",
  parameters: [
    {
      key: "shape",
      label: "Shape",
      symbol: "k",
      min: 0.3,
      max: 10,
      step: 0.1,
      defaultValue: 2,
    },
    {
      key: "scale",
      label: "Scale",
      symbol: "θ",
      min: 0.1,
      max: 5,
      step: 0.1,
      defaultValue: 1,
    },
  ],
  plotDomain: [0, 100],
  domain: ({ shape, scale }) => {
    const mean = shape * scale;
    const sd = Math.sqrt(shape) * scale;
    return [0, mean + 5 * sd];
  },
  evaluate: (x, { shape, scale }) => {
    if (x <= 0) return shape < 1 && x === 0 ? Number.POSITIVE_INFINITY : 0;
    const logDensity =
      (shape - 1) * Math.log(x) -
      x / scale -
      logGamma(shape) -
      shape * Math.log(scale);
    return Math.exp(logDensity);
  },
  sample: (rng, { shape, scale }) => sampleGammaShape(rng, shape) * scale,
  mean: ({ shape, scale }) => shape * scale,
  variance: ({ shape, scale }) => shape * scale * scale,
};
