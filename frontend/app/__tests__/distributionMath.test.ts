import { betaDistribution } from "../distributions/beta";
import { binomialDistribution } from "../distributions/binomial";
import { exponentialDistribution } from "../distributions/exponential";
import { gammaDistribution } from "../distributions/gamma";
import { lognormalDistribution } from "../distributions/lognormal";
import { normalDistribution } from "../distributions/normal";
import { poissonDistribution } from "../distributions/poisson";
import { uniformDistribution } from "../distributions/uniform";
import { DISTRIBUTIONS } from "../distributions/registry";
import { generateSamples } from "../math/sampling";

const EPS = 1e-8;

test("standard normal density at zero", () => {
  const actual = normalDistribution.evaluate(0, { mu: 0, sigma: 1 });
  expect(Math.abs(actual - 0.3989422804014327)).toBeLessThan(EPS);
});

test("uniform density is constant inside the interval", () => {
  expect(uniformDistribution.evaluate(2, { a: 0, width: 4 })).toBeCloseTo(0.25, 10);
  expect(uniformDistribution.evaluate(5, { a: 0, width: 4 })).toBe(0);
});

test("exponential density at zero equals lambda", () => {
  expect(exponentialDistribution.evaluate(0, { lambda: 2 })).toBeCloseTo(2, 10);
});

test("log-normal density at x=1 for mu=0 sigma=1 matches standard normal constant", () => {
  expect(lognormalDistribution.evaluate(1, { mu: 0, sigma: 1 })).toBeCloseTo(
    0.3989422804014327,
    10,
  );
});

test("poisson masses sum close to one over a wide finite range", () => {
  const lambda = 4;
  let sum = 0;
  for (let k = 0; k <= 40; k += 1) {
    sum += poissonDistribution.evaluate(k, { lambda });
  }
  expect(sum).toBeCloseTo(1, 10);
});

test("binomial masses sum to one", () => {
  let sum = 0;
  for (let k = 0; k <= 20; k += 1) {
    sum += binomialDistribution.evaluate(k, { n: 20, p: 0.3 });
  }
  expect(sum).toBeCloseTo(1, 10);
});

test("beta mean and gamma mean match their analytic formulas", () => {
  expect(betaDistribution.mean({ alpha: 2, beta: 5 })).toBeCloseTo(2 / 7, 10);
  expect(gammaDistribution.mean({ shape: 3, scale: 2 })).toBeCloseTo(6, 10);
});

test("all default distributions generate finite reproducible samples", () => {
  for (const distribution of DISTRIBUTIONS) {
    const params = Object.fromEntries(
      distribution.parameters.map((parameter) => [
        parameter.key,
        parameter.defaultValue,
      ]),
    );
    const first = generateSamples(distribution, params, 100, "42");
    const second = generateSamples(distribution, params, 100, "42");
    expect(second).toEqual(first);
    expect(first.every(Number.isFinite)).toBe(true);
  }
});


test("all distributions define a finite fixed plotting domain", () => {
  for (const distribution of DISTRIBUTIONS) {
    const [min, max] = distribution.plotDomain;
    expect(Number.isFinite(min)).toBe(true);
    expect(Number.isFinite(max)).toBe(true);
    expect(max).toBeGreaterThan(min);
  }
});

test("exponential plot y-axis is fixed and covers the full lambda slider range", () => {
  const lambda = exponentialDistribution.parameters.find(
    (parameter) => parameter.key === "lambda",
  );
  expect(lambda).toBeDefined();
  expect(exponentialDistribution.plotYMax).toBeDefined();
  expect(exponentialDistribution.plotYMax).toBeGreaterThanOrEqual(lambda!.max);
});

