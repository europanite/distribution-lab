import React, { useMemo, useState } from "react";
import { Text, View } from "react-native";
import Svg, { Line, Path, Rect, Text as SvgText } from "react-native-svg";
import type {
  DistributionDefinition,
  DistributionParams,
} from "../distributions/types";

type Props = {
  distribution: DistributionDefinition;
  params: DistributionParams;
};

type Point = { x: number; y: number };

const HEIGHT = 340;
const PAD = { left: 52, right: 18, top: 22, bottom: 42 };

function formatAxis(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1000 || (abs > 0 && abs < 0.001)) return value.toExponential(1);
  if (abs >= 100) return value.toFixed(0);
  if (abs >= 10) return value.toFixed(1);
  return value.toFixed(2).replace(/\.?0+$/, "");
}

export default function DistributionPlot({ distribution, params }: Props) {
  const [width, setWidth] = useState(640);
  const [rawXMin, rawXMax] = distribution.plotDomain;
  const xMin = Number.isFinite(rawXMin) ? rawXMin : 0;
  const xMax = Number.isFinite(rawXMax) && rawXMax > xMin ? rawXMax : xMin + 1;

  const points = useMemo<Point[]>(() => {

    if (distribution.kind === "discrete") {
      const start = Math.max(0, Math.floor(xMin));
      const end = Math.max(start + 1, Math.ceil(xMax));
      return Array.from({ length: end - start + 1 }, (_, index) => {
        const x = start + index;
        return { x, y: Math.max(0, distribution.evaluate(x, params)) };
      });
    }

    const count = 260;
    const range = xMax - xMin;
    const edgeOffset = range / (count * 5);
    return Array.from({ length: count }, (_, index) => {
      const x = xMin + (range * index) / (count - 1);
      const rawY = distribution.evaluate(x, params);

      if (Number.isFinite(rawY)) {
        return { x, y: Math.max(0, rawY) };
      }

      const fallbackX =
        index === 0
          ? xMin + edgeOffset
          : index === count - 1
            ? xMax - edgeOffset
            : x;
      const fallbackY = distribution.evaluate(fallbackX, params);
      return { x, y: Number.isFinite(fallbackY) ? Math.max(0, fallbackY) : 0 };
    });
  }, [distribution, params, xMin, xMax]);

  const safeXMax = xMax > xMin ? xMax : xMin + 1;
  const autoYMax = Math.max(1e-9, ...points.map((point) => point.y)) * 1.08;
  const yMax =
    Number.isFinite(distribution.plotYMax) && (distribution.plotYMax ?? 0) > 0
      ? distribution.plotYMax!
      : autoYMax;
  const innerWidth = Math.max(1, width - PAD.left - PAD.right);
  const innerHeight = HEIGHT - PAD.top - PAD.bottom;

  const sx = (x: number) => PAD.left + ((x - xMin) / (safeXMax - xMin)) * innerWidth;
  const sy = (y: number) => PAD.top + innerHeight - (y / yMax) * innerHeight;

  const path =
    distribution.kind === "continuous"
      ? points
          .map((point, index) => `${index === 0 ? "M" : "L"}${sx(point.x).toFixed(2)},${sy(point.y).toFixed(2)}`)
          .join(" ")
      : "";

  const tickXs = [xMin, (xMin + safeXMax) / 2, safeXMax];

  return (
    <View
      onLayout={(event) => setWidth(Math.max(300, event.nativeEvent.layout.width))}
      style={{
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 14,
        padding: 12,
        backgroundColor: "#ffffff",
        minWidth: 0,
      }}
    >
      <Text style={{ fontWeight: "800", color: "#111827", marginBottom: 4 }}>
        {distribution.kind === "continuous" ? "Probability density" : "Probability mass"}
      </Text>
      <Text style={{ color: "#6b7280", fontSize: 13, marginBottom: 4 }}>
        Theoretical {distribution.name} distribution · fixed x-range: {formatAxis(xMin)} to {formatAxis(xMax)}
        {distribution.plotYMax ? ` · fixed y-range: 0 to ${formatAxis(distribution.plotYMax)}` : ""}
      </Text>
      <Svg width="100%" height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`}>
        <Line
          x1={PAD.left}
          x2={PAD.left}
          y1={PAD.top}
          y2={PAD.top + innerHeight}
          stroke="#9ca3af"
          strokeWidth={1}
        />
        <Line
          x1={PAD.left}
          x2={PAD.left + innerWidth}
          y1={PAD.top + innerHeight}
          y2={PAD.top + innerHeight}
          stroke="#9ca3af"
          strokeWidth={1}
        />
        <Line
          x1={PAD.left}
          x2={PAD.left + innerWidth}
          y1={PAD.top + innerHeight / 2}
          y2={PAD.top + innerHeight / 2}
          stroke="#e5e7eb"
          strokeWidth={1}
        />

        {distribution.kind === "continuous" ? (
          <Path d={path} fill="none" stroke="#2563eb" strokeWidth={3} />
        ) : (
          points.map((point) => {
            const slot = innerWidth / Math.max(points.length, 1);
            const barWidth = Math.max(2, Math.min(28, slot * 0.68));
            const x = sx(point.x) - barWidth / 2;
            const y = sy(point.y);
            return (
              <Rect
                key={point.x}
                x={x}
                y={y}
                width={barWidth}
                height={PAD.top + innerHeight - y}
                rx={2}
                fill="#2563eb"
              />
            );
          })
        )}

        <SvgText x={PAD.left - 8} y={PAD.top + 4} textAnchor="end" fontSize={11} fill="#6b7280">
          {formatAxis(yMax)}
        </SvgText>
        <SvgText
          x={PAD.left - 8}
          y={PAD.top + innerHeight / 2 + 4}
          textAnchor="end"
          fontSize={11}
          fill="#9ca3af"
        >
          {formatAxis(yMax / 2)}
        </SvgText>
        <SvgText
          x={PAD.left - 8}
          y={PAD.top + innerHeight + 4}
          textAnchor="end"
          fontSize={11}
          fill="#6b7280"
        >
          0
        </SvgText>

        {tickXs.map((tick, index) => (
          <SvgText
            key={`${tick}-${index}`}
            x={sx(tick)}
            y={PAD.top + innerHeight + 24}
            textAnchor={index === 0 ? "start" : index === 2 ? "end" : "middle"}
            fontSize={11}
            fill="#6b7280"
          >
            {formatAxis(tick)}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}
