import React from "react";
import { Pressable, Text, View } from "react-native";
import type { DistributionDefinition } from "../distributions/types";

type Props = {
  distributions: DistributionDefinition[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function DistributionSelector({
  distributions,
  selectedId,
  onSelect,
}: Props) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {distributions.map((distribution) => {
        const selected = distribution.id === selectedId;
        return (
          <Pressable
            key={distribution.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onSelect(distribution.id)}
            style={({ pressed }) => ({
              minHeight: 42,
              paddingHorizontal: 16,
              borderRadius: 999,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: selected ? "#111827" : "#d1d5db",
              backgroundColor: selected ? "#111827" : pressed ? "#f3f4f6" : "#ffffff",
            })}
          >
            <Text
              style={{
                fontWeight: "700",
                color: selected ? "#ffffff" : "#111827",
              }}
            >
              {distribution.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
