import type {
  DistributionDefinition,
  DistributionParams,
} from "../distributions/types";
import { createSeededRng } from "./random";

export const MIN_SAMPLE_SIZE = 1;
export const MAX_SAMPLE_SIZE = 20_000;

export function clampSampleSize(value: number): number {
  if (!Number.isFinite(value)) return 1000;
  return Math.max(
    MIN_SAMPLE_SIZE,
    Math.min(MAX_SAMPLE_SIZE, Math.round(value)),
  );
}

export function generateSamples(
  distribution: DistributionDefinition,
  params: DistributionParams,
  sampleSize: number,
  seed: string,
): number[] {
  const size = clampSampleSize(sampleSize);
  const rng = createSeededRng(seed);
  return Array.from({ length: size }, () => distribution.sample(rng, params));
}
