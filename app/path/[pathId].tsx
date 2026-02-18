import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { Link } from "expo-router";
import { useThemeColor } from "@/hooks/use-theme-color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function PathScreen() {
  const { pathId } = useLocalSearchParams<{ pathId: string }>();
  const [lessons, setLessons] = useState<any[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // ✅ ALL hooks at top (never inside JSX)
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "border");

  const progressBackground = useThemeColor(
    { light: "rgba(0,0,0,0.08)", dark: "rgba(255,255,255,0.1)" },
    "background"
  );

  const completionBackground = useThemeColor(
    { light: "rgba(47,111,62,0.1)", dark: "rgba(47,111,62,0.2)" },
    "background"
  );

  // Fetch lessons
  useEffect(() => {
    async function fetchLessons() {
      if (!pathId) return;

      const q = query(
        collection(db, "lessons"),
        where("pathId", "==", pathId),
        orderBy("order")
      );

      const snapshot = await getDocs(q);
      setLessons(snapshot.docs.map((doc) => doc.data()));
    }

    fetchLessons();
  }, [pathId]);

  // Refresh completion when screen focuses
  useFocusEffect(
    React.useCallback(() => {
      async function loadCompletion() {
        const stored = await AsyncStorage.getItem("completedLessons");
        const parsed = stored ? JSON.parse(stored) : [];
        setCompletedLessons(parsed);
      }

      loadCompletion();
    }, [])
  );

  const completedCount = lessons.filter((lesson) =>
    completedLessons.includes(lesson.id)
  ).length;

  const progress = lessons.length > 0 ? completedCount / lessons.length : 0;
  const isSectionComplete =
    lessons.length > 0 && completedCount === lessons.length;

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 32,
        backgroundColor,
      }}
    >
      {/* Header */}
      <Text
        style={{
          fontSize: 26,
          fontWeight: "600",
          marginBottom: 28,
          color: textColor,
        }}
      >
        Lessons
      </Text>

      {/* Progress Section */}
      <View style={{ marginBottom: 32 }}>
        <Text
          style={{
            fontSize: 15,
            marginBottom: 10,
            color: textColor,
          }}
        >
          {completedCount} of {lessons.length} completed
        </Text>

        {/* Progress Bar Background */}
        <View
          style={{
            height: 8,
            borderRadius: 6,
            backgroundColor: progressBackground,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              backgroundColor: tintColor,
            }}
          />
        </View>
      </View>

      {/* Section Completion Badge */}
      {isSectionComplete && (
        <View
          style={{
            marginBottom: 28,
            padding: 14,
            borderRadius: 12,
            backgroundColor: completionBackground,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: tintColor,
              fontWeight: "600",
              fontSize: 15,
            }}
          >
            ✓ Section Completed
          </Text>
        </View>
      )}

      {/* Lesson List */}
      {lessons.map((lesson) => {
        const isCompleted = completedLessons.includes(lesson.id);

        return (
          <Link
            key={lesson.id}
            href={{
              pathname: "/lesson/[lessonId]",
              params: { lessonId: lesson.id },
            }}
            asChild
          >
            <Text
              style={{
                fontSize: 17,
                marginBottom: 18,
                color: isCompleted ? tintColor : textColor,
              }}
            >
              {isCompleted ? "✓ " : ""}
              {lesson.title}
            </Text>
          </Link>
        );
      })}
    </View>
  );
}
