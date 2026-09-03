import Slider from "@react-native-community/slider";
import React from "react";
import { Text, View } from "react-native";
import type { ParameterDefinition } from "../distributions/types";

type Props = {
  definition: ParameterDefinition;
  value: number;
  onChange: (value: number) => void;
  onCommit?: (value: number) => void;
};

function decimalsForStep(step: number): number {
  const text = String(step);
  const dot = text.indexOf(".");
  return dot < 0 ? 0 : text.length - dot - 1;
}

export default function ParameterSlider({
  definition,
  value,
  onChange,
  onCommit,
}: Props) {
  const decimals = Math.min(4, decimalsForStep(definition.step));

  return (
    <View style={{ gap: 4 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
        }}
      >
        <Text style={{ color: "#374151", fontWeight: "700" }}>
          {definition.label} ({definition.symbol})
        </Text>
        <Text
          selectable
          style={{ color: "#111827", fontVariant: ["tabular-nums"], fontWeight: "700" }}
        >
          {value.toFixed(decimals)}
        </Text>
      </View>
      <Slider
        accessibilityLabel={`${definition.label} ${definition.symbol}`}
        minimumValue={definition.min}
        maximumValue={definition.max}
        step={definition.step}
        value={value}
        onValueChange={onChange}
        onSlidingComplete={(nextValue) => onCommit?.(nextValue)}
        minimumTrackTintColor="#111827"
        maximumTrackTintColor="#d1d5db"
        thumbTintColor="#111827"
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: "#9ca3af", fontSize: 12 }}>{definition.min}</Text>
        {definition.description ? (
          <Text style={{ color: "#6b7280", fontSize: 12, flexShrink: 1, textAlign: "center" }}>
            {definition.description}
          </Text>
        ) : null}
        <Text style={{ color: "#9ca3af", fontSize: 12 }}>{definition.max}</Text>
      </View>
    </View>
  );
}
