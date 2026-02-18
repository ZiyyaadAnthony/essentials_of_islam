import { View, Text, Pressable } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function SettingsScreen() {
  const { mode, setMode } = useAppTheme();

  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");
  const cardBackground = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "border");

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 32,
        backgroundColor,
      }}
    >
      <Text
        style={{
          fontSize: 26,
          fontWeight: "600",
          marginBottom: 32,
          color: textColor,
        }}
      >
        Settings
      </Text>

      <Text
        style={{
          fontSize: 18,
          marginBottom: 16,
          color: textColor,
        }}
      >
        Appearance
      </Text>

      {["light", "dark", "system"].map((option) => {
        const selected = mode === option;

        return (
          <Pressable
            key={option}
            onPress={() => setMode(option as any)}
            style={({ pressed }) => ({
              padding: 18,
              borderRadius: 12,
              marginBottom: 14,
              backgroundColor: cardBackground,
              borderWidth: 1,
              borderColor: selected ? tintColor : borderColor,
              transform: [{ scale: pressed ? 0.98 : 1 }],
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Text
              style={{
                fontSize: 16,
                color: selected ? tintColor : textColor,
                fontWeight: selected ? "600" : "400",
              }}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
