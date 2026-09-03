import { Platform } from "react-native";
import type {
  DistributionDefinition,
  DistributionParams,
} from "../distributions/types";

function safeNumber(value: number): string {
  if (!Number.isFinite(value)) return "";
  return Number.isInteger(value) ? String(value) : value.toPrecision(15).replace(/0+$/, "").replace(/\.$/, "");
}

function csvCell(value: string): string {
  if (!/[",\n\r]/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

function slugPart(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
}

function parameterSlug(
  distribution: DistributionDefinition,
  params: DistributionParams,
): string {
  return distribution.parameters
    .map((parameter) => `${parameter.key}-${slugPart(safeNumber(params[parameter.key]))}`)
    .join("_");
}

function triggerDownload(filename: string, contents: string, mimeType: string): boolean {
  if (Platform.OS !== "web" || typeof document === "undefined") return false;

  const blob = new Blob([contents], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
  return true;
}

export function downloadSamplesCsv(
  distribution: DistributionDefinition,
  params: DistributionParams,
  samples: number[],
  seed: string,
): boolean {
  const parameterKeys = distribution.parameters.map((parameter) => parameter.key);
  const header = ["index", "value", "distribution", ...parameterKeys, "seed"];
  const rows = samples.map((value, index) => [
    String(index + 1),
    safeNumber(value),
    distribution.id,
    ...parameterKeys.map((key) => safeNumber(params[key])),
    seed,
  ]);
  const csv = [
    header.map(csvCell).join(","),
    ...rows.map((row) => row.map(csvCell).join(",")),
  ].join("\n");
  const filename = `sample_${distribution.id}_${parameterSlug(distribution, params)}_n-${samples.length}_seed-${slugPart(seed || "0")}.csv`;
  return triggerDownload(filename, csv, "text/csv");
}

export function downloadJson(
  distribution: DistributionDefinition,
  params: DistributionParams,
  samples: number[],
  seed: string,
): boolean {
  const payload = {
    distribution: distribution.id,
    kind: distribution.kind,
    parameters: params,
    seed,
    sampleSize: samples.length,
    samples,
  };
  const filename = `sample_${distribution.id}_${parameterSlug(distribution, params)}_n-${samples.length}_seed-${slugPart(seed || "0")}.json`;
  return triggerDownload(filename, JSON.stringify(payload, null, 2), "application/json");
}
