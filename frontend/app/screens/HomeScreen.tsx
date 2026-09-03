import React, { useMemo, useState } from "react";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";
import DistributionPlot from "../components/DistributionPlot";
import DistributionSelector from "../components/DistributionSelector";
import FormulaPanel from "../components/FormulaPanel";
import ParameterSlider from "../components/ParameterSlider";
import SamplePanel from "../components/SamplePanel";
import { DISTRIBUTIONS, getDistribution } from "../distributions/registry";
import { defaultParams, type DistributionParams } from "../distributions/types";
import { generateSamples } from "../math/sampling";

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const wide = width >= 920;
  const [distributionId, setDistributionId] = useState("normal");
  const distribution = useMemo(
    () => getDistribution(distributionId),
    [distributionId],
  );
  const [params, setParams] = useState<DistributionParams>(() =>
    defaultParams(getDistribution("normal")),
  );
  const [sampleParams, setSampleParams] = useState<DistributionParams>(() =>
    defaultParams(getDistribution("normal")),
  );
  const [sampleSize, setSampleSize] = useState(1000);
  const [seed, setSeed] = useState("42");

  const samples = useMemo(
    () => generateSamples(distribution, sampleParams, sampleSize, seed),
    [distribution, sampleParams, sampleSize, seed],
  );

  const selectDistribution = (id: string) => {
    const nextDistribution = getDistribution(id);
    setDistributionId(id);
    const nextParams = defaultParams(nextDistribution);
    setParams(nextParams);
    setSampleParams(nextParams);
  };

  const updateParameter = (key: string, value: number) => {
    setParams((current) => ({ ...current, [key]: value }));
  };

  const commitParameter = (key: string, value: number) => {
    setParams((current) => ({ ...current, [key]: value }));
    setSampleParams((current) => ({ ...current, [key]: value }));
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      contentContainerStyle={{ alignItems: "center", padding: 16, paddingBottom: 56 }}
    >
      <View style={{ width: "100%", maxWidth: 1180, gap: 18 }}>
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: width < 500 ? 27 : 34, fontWeight: "900", color: "#111827" }}>
            Distribution Lab
          </Text>
          <Text style={{ color: "#4b5563", fontSize: 15, lineHeight: 22, maxWidth: 760 }}>
            Choose a probability distribution, move its parameters, inspect the equation and curve,
            then export deterministic sample data without sending anything to a server.
          </Text>
        </View>

        <DistributionSelector
          distributions={DISTRIBUTIONS}
          selectedId={distribution.id}
          onSelect={selectDistribution}
        />

        <View style={{ flexDirection: wide ? "row" : "column", gap: 16, alignItems: "stretch" }}>
          <View style={{ flex: wide ? 0.9 : undefined, minWidth: 0, gap: 14 }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 14,
                padding: 16,
                backgroundColor: "#ffffff",
                gap: 5,
              }}
            >
              <Text style={{ fontSize: 21, fontWeight: "900", color: "#111827" }}>
                {distribution.name}
              </Text>
              <Text style={{ color: "#6b7280", lineHeight: 20 }}>{distribution.description}</Text>
              <Text style={{ color: "#9ca3af", fontSize: 12, textTransform: "uppercase", fontWeight: "700" }}>
                {distribution.kind}
              </Text>
            </View>

            <FormulaPanel distribution={distribution} params={params} />

            <View
              style={{
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 14,
                padding: 16,
                backgroundColor: "#ffffff",
                gap: 18,
              }}
            >
              <Text style={{ color: "#111827", fontWeight: "800" }}>Parameters</Text>
              {distribution.parameters.map((parameter) => (
                <ParameterSlider
                  key={parameter.key}
                  definition={parameter}
                  value={params[parameter.key]}
                  onChange={(value) => updateParameter(parameter.key, value)}
                  onCommit={(value) => commitParameter(parameter.key, value)}
                />
              ))}
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                <Text style={{ color: "#6b7280" }}>
                  Theoretical mean: {distribution.mean(params).toFixed(4).replace(/\.?0+$/, "")}
                </Text>
                <Text style={{ color: "#6b7280" }}>
                  Variance: {distribution.variance(params).toFixed(4).replace(/\.?0+$/, "")}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ flex: wide ? 1.35 : undefined, minWidth: 0, gap: 14 }}>
            <DistributionPlot distribution={distribution} params={params} />
            <SamplePanel
              distribution={distribution}
              params={sampleParams}
              samples={samples}
              sampleSize={sampleSize}
              onSampleSizeChange={setSampleSize}
              seed={seed}
              onSeedChange={setSeed}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
