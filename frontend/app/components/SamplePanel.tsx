import React, { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, Text, TextInput, View } from "react-native";
import type {
  DistributionDefinition,
  DistributionParams,
} from "../distributions/types";
import { clampSampleSize } from "../math/sampling";
import { summarizeSamples } from "../math/statistics";
import { downloadJson, downloadSamplesCsv } from "../utils/download";

type Props = {
  distribution: DistributionDefinition;
  params: DistributionParams;
  samples: number[];
  sampleSize: number;
  onSampleSizeChange: (sampleSize: number) => void;
  seed: string;
  onSeedChange: (seed: string) => void;
};

function metric(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  if (abs >= 1000 || (abs > 0 && abs < 0.001)) return value.toExponential(3);
  return value.toFixed(4).replace(/\.?0+$/, "");
}

export default function SamplePanel({
  distribution,
  params,
  samples,
  sampleSize,
  onSampleSizeChange,
  seed,
  onSeedChange,
}: Props) {
  const [sampleSizeText, setSampleSizeText] = useState(String(sampleSize));
  const stats = useMemo(() => summarizeSamples(samples), [samples]);

  useEffect(() => setSampleSizeText(String(sampleSize)), [sampleSize]);

  const commitSampleSize = () => {
    const parsed = Number(sampleSizeText);
    const next = clampSampleSize(parsed);
    onSampleSizeChange(next);
    setSampleSizeText(String(next));
  };

  const preview = samples.slice(0, 8).map((value) => metric(value)).join(", ");
  const downloadSupported = Platform.OS === "web";

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 14,
        padding: 16,
        gap: 14,
        backgroundColor: "#ffffff",
      }}
    >
      <View style={{ gap: 3 }}>
        <Text style={{ fontWeight: "800", color: "#111827" }}>Sample generator</Text>
        <Text style={{ color: "#6b7280", fontSize: 13 }}>
          Data is generated locally from the current parameters and seed.
        </Text>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        <View style={{ flexGrow: 1, minWidth: 150, gap: 5 }}>
          <Text style={{ color: "#374151", fontWeight: "700" }}>Sample size</Text>
          <TextInput
            accessibilityLabel="Sample size"
            keyboardType="numeric"
            value={sampleSizeText}
            onChangeText={setSampleSizeText}
            onBlur={commitSampleSize}
            onSubmitEditing={commitSampleSize}
            style={{
              minHeight: 44,
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 9,
              paddingHorizontal: 11,
              color: "#111827",
              backgroundColor: "#ffffff",
            }}
          />
          <Text style={{ color: "#9ca3af", fontSize: 11 }}>1–20,000 rows</Text>
        </View>

        <View style={{ flexGrow: 2, minWidth: 180, gap: 5 }}>
          <Text style={{ color: "#374151", fontWeight: "700" }}>Seed</Text>
          <TextInput
            accessibilityLabel="Random seed"
            value={seed}
            onChangeText={(value) => onSeedChange(value || "0")}
            autoCapitalize="none"
            style={{
              minHeight: 44,
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 9,
              paddingHorizontal: 11,
              color: "#111827",
              backgroundColor: "#ffffff",
            }}
          />
          <Text style={{ color: "#9ca3af", fontSize: 11 }}>Same seed + parameters = same data</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {[
          ["Mean", stats.mean],
          ["Std. dev.", stats.standardDeviation],
          ["Min", stats.min],
          ["Max", stats.max],
        ].map(([label, value]) => (
          <View
            key={String(label)}
            style={{
              minWidth: 118,
              flexGrow: 1,
              backgroundColor: "#f9fafb",
              borderRadius: 10,
              padding: 10,
              gap: 3,
            }}
          >
            <Text style={{ color: "#6b7280", fontSize: 12 }}>{label}</Text>
            <Text selectable style={{ color: "#111827", fontWeight: "800", fontVariant: ["tabular-nums"] }}>
              {metric(Number(value))}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ gap: 5 }}>
        <Text style={{ color: "#6b7280", fontSize: 12 }}>First values</Text>
        <Text selectable style={{ color: "#374151", fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" }}>
          {preview}{samples.length > 8 ? ", …" : ""}
        </Text>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <DownloadButton
          label="Download CSV"
          disabled={!downloadSupported}
          onPress={() => downloadSamplesCsv(distribution, params, samples, seed)}
        />
        <DownloadButton
          label="Download JSON"
          disabled={!downloadSupported}
          secondary
          onPress={() => downloadJson(distribution, params, samples, seed)}
        />
      </View>

      {!downloadSupported ? (
        <Text style={{ color: "#92400e", fontSize: 12 }}>
          File download is enabled in the web build. Native export can be added later with Expo FileSystem/Sharing.
        </Text>
      ) : null}
    </View>
  );
}

type DownloadButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
};

function DownloadButton({ label, onPress, disabled, secondary }: DownloadButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 44,
        paddingHorizontal: 16,
        justifyContent: "center",
        borderRadius: 9,
        borderWidth: 1,
        borderColor: disabled ? "#d1d5db" : "#111827",
        backgroundColor: disabled
          ? "#f3f4f6"
          : secondary
            ? pressed
              ? "#f3f4f6"
              : "#ffffff"
            : pressed
              ? "#374151"
              : "#111827",
      })}
    >
      <Text
        style={{
          fontWeight: "800",
          color: disabled ? "#9ca3af" : secondary ? "#111827" : "#ffffff",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
