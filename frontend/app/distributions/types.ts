export type DistributionKind = "continuous" | "discrete";

export type DistributionParams = Record<string, number>;

export type ParameterDefinition = {
  key: string;
  label: string;
  symbol: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  description?: string;
};

export type DistributionDefinition = {
  id: string;
  name: string;
  kind: DistributionKind;
  description: string;
  formula: (params: DistributionParams) => string;
  parameters: ParameterDefinition[];
  domain: (params: DistributionParams) => [number, number];
  plotDomain: [number, number];
  plotYMax?: number;
  evaluate: (x: number, params: DistributionParams) => number;
  sample: (rng: () => number, params: DistributionParams) => number;
  mean: (params: DistributionParams) => number;
  variance: (params: DistributionParams) => number;
};

export function defaultParams(
  distribution: DistributionDefinition,
): DistributionParams {
  return Object.fromEntries(
    distribution.parameters.map((parameter) => [
      parameter.key,
      parameter.defaultValue,
    ]),
  );
}
