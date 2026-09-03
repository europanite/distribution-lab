export type SampleStatistics = {
  count: number;
  mean: number;
  standardDeviation: number;
  min: number;
  max: number;
};

export function summarizeSamples(values: number[]): SampleStatistics {
  if (values.length === 0) {
    return {
      count: 0,
      mean: 0,
      standardDeviation: 0,
      min: 0,
      max: 0,
    };
  }

  let sum = 0;
  let min = values[0];
  let max = values[0];

  for (const value of values) {
    sum += value;
    min = Math.min(min, value);
    max = Math.max(max, value);
  }

  const mean = sum / values.length;
  let squaredError = 0;
  for (const value of values) {
    const delta = value - mean;
    squaredError += delta * delta;
  }

  const variance =
    values.length > 1 ? squaredError / (values.length - 1) : 0;

  return {
    count: values.length,
    mean,
    standardDeviation: Math.sqrt(variance),
    min,
    max,
  };
}
