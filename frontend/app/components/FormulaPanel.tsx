import React from "react";
import { Text, View } from "react-native";
import type {
  DistributionDefinition,
  DistributionParams,
} from "../distributions/types";
import MathFormula from "./MathFormula";

type Props = {
  distribution: DistributionDefinition;
  params: DistributionParams;
};

export default function FormulaPanel({ distribution, params }: Props) {
  return (
    <View
      accessible
      accessibilityLabel={distribution.formula(params)}
      style={{
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 14,
        padding: 16,
        gap: 12,
        backgroundColor: "#ffffff",
      }}
    >
      <Text style={{ fontSize: 13, color: "#6b7280", fontWeight: "700" }}>
        FORMULA
      </Text>

      <View style={{ minHeight: 62, justifyContent: "center" }}>
        <MathFormula distribution={distribution} params={params} />
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {distribution.parameters.map((parameter) => (
          <View
            key={parameter.key}
            style={{
              borderRadius: 8,
              paddingHorizontal: 9,
              paddingVertical: 6,
              backgroundColor: "#f3f4f6",
            }}
          >
            <Text style={{ color: "#374151", fontVariant: ["tabular-nums"] }}>
              {parameter.symbol} = {params[parameter.key].toFixed(3).replace(/\.?0+$/, "")}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
