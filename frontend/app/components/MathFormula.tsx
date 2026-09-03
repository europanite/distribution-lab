import React, { type ReactNode } from "react";
import { Text, View } from "react-native";
import type {
  DistributionDefinition,
  DistributionParams,
} from "../distributions/types";

type Props = {
  distribution: DistributionDefinition;
  params: DistributionParams;
};

type MathTextProps = {
  children: ReactNode;
  small?: boolean;
  italic?: boolean;
};

function MathText({ children, small = false, italic = false }: MathTextProps) {
  return (
    <Text
      style={{
        color: "#111827",
        fontSize: small ? 14 : 22,
        lineHeight: small ? 18 : 30,
        fontFamily: "serif",
        fontStyle: italic ? "italic" : "normal",
      }}
    >
      {children}
    </Text>
  );
}

function Row({
  children,
  gap = 2,
  wrap = false,
}: {
  children: ReactNode;
  gap?: number;
  wrap?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        flexWrap: wrap ? "wrap" : "nowrap",
        gap,
      }}
    >
      {children}
    </View>
  );
}

function Fraction({
  numerator,
  denominator,
  small = false,
}: {
  numerator: ReactNode;
  denominator: ReactNode;
  small?: boolean;
}) {
  return (
    <View
      style={{
        alignItems: "stretch",
        justifyContent: "center",
        marginHorizontal: small ? 2 : 4,
        minWidth: small ? 24 : 34,
      }}
    >
      <View style={{ alignItems: "center", paddingHorizontal: 3, paddingBottom: 1 }}>
        {numerator}
      </View>
      <View style={{ borderTopWidth: 1.4, borderTopColor: "#111827", alignItems: "center", paddingTop: 1 }}>
        {denominator}
      </View>
    </View>
  );
}

function Sup({ children }: { children: ReactNode }) {
  return (
    <View
      style={{
        alignSelf: "flex-start",
        transform: [{ translateY: -5 }],
        marginLeft: 1,
        marginRight: 1,
      }}
    >
      {children}
    </View>
  );
}

function Choose({ top, bottom }: { top: ReactNode; bottom: ReactNode }) {
  return (
    <Row gap={1}>
      <MathText>(</MathText>
      <View style={{ alignItems: "center", minWidth: 20 }}>
        <MathText small>{top}</MathText>
        <MathText small>{bottom}</MathText>
      </View>
      <MathText>)</MathText>
    </Row>
  );
}

function NormalFormula() {
  return (
    <Row wrap>
      <MathText>f(x) = </MathText>
      <Fraction
        numerator={<MathText>1</MathText>}
        denominator={<MathText>σ√(2π)</MathText>}
      />
      <MathText>e</MathText>
      <Sup>
        <Row>
          <MathText small>−</MathText>
          <Fraction
            small
            numerator={<MathText small>(x−μ)²</MathText>}
            denominator={<MathText small>2σ²</MathText>}
          />
        </Row>
      </Sup>
    </Row>
  );
}

function ExponentialFormula() {
  return (
    <Row wrap>
      <MathText>f(x) = λe</MathText>
      <Sup><MathText small>−λx</MathText></Sup>
      <MathText>,  x ≥ 0</MathText>
    </Row>
  );
}

function LogNormalFormula() {
  return (
    <Row wrap>
      <MathText>f(x) = </MathText>
      <Fraction
        numerator={<MathText>1</MathText>}
        denominator={<MathText>xσ√(2π)</MathText>}
      />
      <MathText>e</MathText>
      <Sup>
        <Row>
          <MathText small>−</MathText>
          <Fraction
            small
            numerator={<MathText small>(ln x−μ)²</MathText>}
            denominator={<MathText small>2σ²</MathText>}
          />
        </Row>
      </Sup>
      <MathText>,  x &gt; 0</MathText>
    </Row>
  );
}

function GammaFormula() {
  return (
    <Row wrap>
      <MathText>f(x) = </MathText>
      <Fraction
        numerator={
          <Row>
            <MathText>x</MathText>
            <Sup><MathText small>k−1</MathText></Sup>
            <MathText>e</MathText>
            <Sup>
              <Row>
                <MathText small>−</MathText>
                <Fraction
                  small
                  numerator={<MathText small>x</MathText>}
                  denominator={<MathText small>θ</MathText>}
                />
              </Row>
            </Sup>
          </Row>
        }
        denominator={
          <Row>
            <MathText>Γ(k) θ</MathText>
            <Sup><MathText small>k</MathText></Sup>
          </Row>
        }
      />
      <MathText>,  x &gt; 0</MathText>
    </Row>
  );
}

function BetaFormula() {
  return (
    <Row wrap>
      <MathText>f(x) = </MathText>
      <Fraction
        numerator={
          <Row>
            <MathText>x</MathText>
            <Sup><MathText small>α−1</MathText></Sup>
            <MathText>(1−x)</MathText>
            <Sup><MathText small>β−1</MathText></Sup>
          </Row>
        }
        denominator={<MathText>B(α, β)</MathText>}
      />
      <MathText>,  0 &lt; x &lt; 1</MathText>
    </Row>
  );
}

function PoissonFormula() {
  return (
    <Row wrap>
      <MathText>P(X = k) = </MathText>
      <Fraction
        numerator={
          <Row>
            <MathText>e</MathText>
            <Sup><MathText small>−λ</MathText></Sup>
            <MathText>λ</MathText>
            <Sup><MathText small>k</MathText></Sup>
          </Row>
        }
        denominator={<MathText>k!</MathText>}
      />
      <MathText>,  k = 0, 1, 2, …</MathText>
    </Row>
  );
}

function BinomialFormula() {
  return (
    <Row wrap>
      <MathText>P(X = k) = </MathText>
      <Choose top="n" bottom="k" />
      <MathText>p</MathText>
      <Sup><MathText small>k</MathText></Sup>
      <MathText>(1−p)</MathText>
      <Sup><MathText small>n−k</MathText></Sup>
      <MathText>,  k = 0, …, n</MathText>
    </Row>
  );
}

function UniformFormula({ params }: { params: DistributionParams }) {
  const a = params.a;
  const width = params.width;
  const upper = a + width;

  return (
    <Row gap={5}>
      <MathText>f(x) = </MathText>
      <MathText>{"{"}</MathText>
      <View style={{ gap: 5 }}>
        <Row wrap>
          <Fraction
            numerator={<MathText>1</MathText>}
            denominator={<MathText>w</MathText>}
          />
          <MathText>,  a ≤ x ≤ a + w</MathText>
        </Row>
        <Row wrap>
          <MathText>0</MathText>
          <MathText>,  otherwise</MathText>
        </Row>
      </View>
      <View style={{ marginLeft: 8 }}>
        <MathText small>
          a = {a.toFixed(2)},  w = {width.toFixed(2)},  a + w = {upper.toFixed(2)}
        </MathText>
      </View>
    </Row>
  );
}

export default function MathFormula({ distribution, params }: Props) {
  switch (distribution.id) {
    case "normal":
      return <NormalFormula />;
    case "uniform":
      return <UniformFormula params={params} />;
    case "exponential":
      return <ExponentialFormula />;
    case "lognormal":
      return <LogNormalFormula />;
    case "gamma":
      return <GammaFormula />;
    case "beta":
      return <BetaFormula />;
    case "poisson":
      return <PoissonFormula />;
    case "binomial":
      return <BinomialFormula />;
    default:
      return <MathText>{distribution.formula(params)}</MathText>;
  }
}
