import React from "react";
import { Text, View, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {REPO_URL} from "./SettingsBarUtil" 

const BAR_BG = "#111827";

const url = "https://github.com/europanite/client_side_python/";

export default function SettingsBar() {
  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: BAR_BG }}>
      <StatusBar style="light" backgroundColor={BAR_BG} />
      <View
        style={{
          width: "100%",
          maxWidth: 1180,
          alignSelf: "center",
          paddingHorizontal: 16,
          paddingVertical: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <TouchableOpacity onPress={() => Linking.openURL(REPO_URL)}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "800",
              marginBottom: 12,
              color: "rgb(255, 255, 255)",
              textDecorationLine: "underline",
            }}
          >
            Distribution-Lab
          </Text>
        </TouchableOpacity>
        <Text style={{ color: "#ffffff", fontSize: 15, lineHeight: 22, maxWidth: 760 }}>
            Choose a probability distribution, move its parameters, inspect the equation and curve,
            then export deterministic sample data without sending anything to a server.
        </Text>
      </View>
    </SafeAreaView>
  );
}
