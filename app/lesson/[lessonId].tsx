import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useThemeColor } from "@/hooks/use-theme-color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

type Block = {
  type: string;
  content: string;
  reference?: string;
};

type Lesson = {
  id: string;
  title: string;
  blocks?: Block[];
};

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [completed, setCompleted] = useState(false);

  // ✅ ALL HOOKS AT TOP
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");

  const reassuranceBg = useThemeColor(
    { light: "rgba(47,111,62,0.1)", dark: "rgba(47,111,62,0.2)" },
    "background"
  );

  const reflectionBg = useThemeColor(
    { light: "rgba(0,0,255,0.08)", dark: "rgba(0,0,255,0.15)" },
    "background"
  );

  const actionBg = useThemeColor(
    { light: "rgba(255,165,0,0.12)", dark: "rgba(255,165,0,0.2)" },
    "background"
  );

  // Fetch lesson
  useEffect(() => {
    async function fetchLesson() {
      if (!lessonId) return;

      const docRef = doc(db, "lessons", lessonId);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        setLesson(snapshot.data() as Lesson);
      }
    }

    fetchLesson();
  }, [lessonId]);

  // Check completion
  useEffect(() => {
    async function checkCompletion() {
      if (!lessonId) return;

      const stored = await AsyncStorage.getItem("completedLessons");
      const completedLessons: string[] = stored ? JSON.parse(stored) : [];

      setCompleted(completedLessons.includes(lessonId));
    }

    checkCompletion();
  }, [lessonId]);

  async function toggleCompletion() {
    if (!lessonId) return;

    const stored = await AsyncStorage.getItem("completedLessons");
    let completedLessons: string[] = stored ? JSON.parse(stored) : [];

    if (completedLessons.includes(lessonId)) {
      completedLessons = completedLessons.filter((id) => id !== lessonId);
      setCompleted(false);
    } else {
      completedLessons.push(lessonId);
      setCompleted(true);
    }

    await AsyncStorage.setItem(
      "completedLessons",
      JSON.stringify(completedLessons)
    );
  }

  if (!lesson) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor,
        }}
      >
        <ActivityIndicator size="large" color={tintColor} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 60,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text
          style={{
            fontSize: 26,
            fontWeight: "600",
            color: textColor,
            marginBottom: 20,
          }}
        >
          {lesson.title}
        </Text>

        {/* Blocks */}
        {lesson.blocks?.map((block, index) => {
          switch (block.type) {
            case "text":
              return (
                <Text
                  key={index}
                  style={{
                    fontSize: 17,
                    lineHeight: 28,
                    color: textColor,
                    marginBottom: 16,
                  }}
                >
                  {block.content}
                </Text>
              );

            case "section_title":
              return (
                <Text
                  key={index}
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    marginTop: 24,
                    marginBottom: 12,
                    color: textColor,
                  }}
                >
                  {block.content}
                </Text>
              );

            case "bullet":
              return (
                <Text
                  key={index}
                  style={{
                    fontSize: 16,
                    lineHeight: 26,
                    marginBottom: 8,
                    color: textColor,
                  }}
                >
                  • {block.content}
                </Text>
              );

            case "ayah":
              return (
                <View
                  key={index}
                  style={{
                    padding: 18,
                    borderLeftWidth: 4,
                    borderLeftColor: tintColor,
                    marginBottom: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: "right",
                      marginBottom: 10,
                      color: textColor,
                    }}
                  >
                    {block.content}
                  </Text>

                  {block.reference && (
                    <Text
                      style={{
                        fontSize: 14,
                        opacity: 0.7,
                        color: textColor,
                      }}
                    >
                      {block.reference}
                    </Text>
                  )}
                </View>
              );

            case "hadith":
              return (
                <View key={index} style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      fontStyle: "italic",
                      fontSize: 16,
                      lineHeight: 26,
                      color: textColor,
                    }}
                  >
                    {block.content}
                  </Text>
                  {block.reference && (
                    <Text
                      style={{
                        fontSize: 14,
                        opacity: 0.7,
                        marginTop: 6,
                        color: textColor,
                      }}
                    >
                      {block.reference}
                    </Text>
                  )}
                </View>
              );

            case "reassurance":
              return (
                <View
                  key={index}
                  style={{
                    padding: 18,
                    borderRadius: 12,
                    marginBottom: 20,
                    backgroundColor: reassuranceBg,
                  }}
                >
                  <Text
                    style={{ fontSize: 16, lineHeight: 26, color: textColor }}
                  >
                    {block.content}
                  </Text>
                </View>
              );

            case "reflection":
              return (
                <View
                  key={index}
                  style={{
                    padding: 18,
                    borderRadius: 12,
                    marginBottom: 20,
                    backgroundColor: reflectionBg,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      marginBottom: 8,
                      color: textColor,
                    }}
                  >
                    Reflection
                  </Text>
                  <Text
                    style={{ fontSize: 16, lineHeight: 26, color: textColor }}
                  >
                    {block.content}
                  </Text>
                </View>
              );

            case "action":
              return (
                <View
                  key={index}
                  style={{
                    padding: 18,
                    borderRadius: 12,
                    marginBottom: 20,
                    backgroundColor: actionBg,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      marginBottom: 8,
                      color: textColor,
                    }}
                  >
                    Try This Today
                  </Text>
                  <Text
                    style={{ fontSize: 16, lineHeight: 26, color: textColor }}
                  >
                    {block.content}
                  </Text>
                </View>
              );

            default:
              return null;
          }
        })}

        {/* Completion Button */}
        <TouchableOpacity
          onPress={toggleCompletion}
          style={{
            marginTop: 30,
            paddingVertical: 18,
            borderRadius: 12,
            backgroundColor: tintColor,
            opacity: completed ? 0.6 : 1,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
            {completed ? "Mark as Incomplete" : "Mark as Completed"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
