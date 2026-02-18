import { View, Text, Pressable } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, TouchableOpacity, Modal } from "react-native";
import { useState } from "react";

export default function SettingsScreen() {
  const { mode, setMode } = useAppTheme();

  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");
  const cardBackground = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "border");
  const [showResetModal, setShowResetModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  async function resetProgress() {
    if (typeof window !== "undefined") {
      // Web
      const confirmed = window.confirm(
        "Are you sure you want to reset all completed lessons?"
      );

      if (confirmed) {
        await AsyncStorage.removeItem("completedLessons");
        alert("Progress Reset");
      }
    } else {
      // Native (iOS / Android)
      Alert.alert(
        "Reset Progress",
        "Are you sure you want to reset all completed lessons?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Reset",
            style: "destructive",
            onPress: async () => {
              await AsyncStorage.removeItem("completedLessons");
              Alert.alert("Progress Reset");
            },
          },
        ]
      );
    }
  }

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

      <TouchableOpacity
        onPress={() => setShowResetModal(true)}
        style={{
          marginTop: 40,
          paddingVertical: 16,
          borderRadius: 12,
          backgroundColor: "rgba(255,0,0,0.08)",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#B00020",
            fontWeight: "600",
          }}
        >
          Reset Progress
        </Text>
      </TouchableOpacity>

      <Modal visible={showResetModal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              width: "100%",
              borderRadius: 16,
              padding: 24,
              backgroundColor: cardBackground,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 12,
                color: textColor,
              }}
            >
              Reset Progress
            </Text>

            <Text
              style={{
                fontSize: 15,
                marginBottom: 24,
                color: textColor,
                opacity: 0.8,
              }}
            >
              This will remove all completed lessons. This action cannot be
              undone.
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
              <Pressable
                onPress={() => setShowResetModal(false)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                }}
              >
                <Text style={{ color: textColor }}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={async () => {
                  await AsyncStorage.removeItem("completedLessons");
                  setShowResetModal(false);

                  setShowToast(true);

                  setTimeout(() => {
                    setShowToast(false);
                  }, 2000);
                }}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: "rgba(255,0,0,0.1)",
                }}
              >
                <Text style={{ color: "#B00020", fontWeight: "600" }}>
                  Reset
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {showToast && (
        <View
          style={{
            position: "absolute",
            bottom: 40,
            left: 24,
            right: 24,
            paddingVertical: 14,
            borderRadius: 12,
            backgroundColor: "rgba(47,111,62,0.95)",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            Progress Reset ✓
          </Text>
        </View>
      )}
    </View>
  );
}
