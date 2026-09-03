import { standardNormal } from "./random";

export function sampleGammaShape(rng: () => number, shape: number): number {
  if (shape <= 0) return 0;

  if (shape < 1) {
    const u = Math.max(rng(), Number.EPSILON);
    return sampleGammaShape(rng, shape + 1) * Math.pow(u, 1 / shape);
  }

  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);

  while (true) {
    const x = standardNormal(rng);
    const vBase = 1 + c * x;
    if (vBase <= 0) continue;
    const v = vBase * vBase * vBase;
    const u = rng();

    if (u < 1 - 0.0331 * x * x * x * x) return d * v;
    if (Math.log(Math.max(u, Number.EPSILON)) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
      return d * v;
    }
  }
}
