import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function WelcomeScreen() {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  return (
    <View
      style={{
        flex: 1,
        padding: 30,
        paddingTop: 100,
        backgroundColor,
      }}
    >
      {/* Text Section */}
      <View style={{ marginBottom: 60 }}>
        <Text
          style={{
            fontSize: 26,
            fontWeight: "500",
            marginBottom: 20,
            color: textColor,
          }}
        >
          Welcome.
          {"\n"}
          You are exactly where you need to be.
        </Text>

        <Text
          style={{
            fontSize: 16,
            lineHeight: 26,
            color: textColor,
            opacity: 0.85,
          }}
        >
          Whether you’ve just taken your Shahada or are still exploring, this
          journey is meant to be taken step by step.
          {"\n\n"}
          No pressure.
          {"\n"}
          No rush.
          {"\n"}
          Just guidance.
        </Text>
      </View>

      {/* Button */}
      <TouchableOpacity
        onPress={() => router.replace("/(tabs)")}
        style={{
          paddingVertical: 18,
          borderRadius: 10,
          backgroundColor: useThemeColor({}, "tint"),
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          Start the Essentials
        </Text>
      </TouchableOpacity>
    </View>
  );
}
