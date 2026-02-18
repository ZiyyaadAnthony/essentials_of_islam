import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/use-theme-color";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EssentialsScreen() {
  /* ================= THEME (ALL HOOKS HERE ONLY) ================= */

  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "border");
  const tintColor = useThemeColor({}, "tint");

  const highlightBackground = useThemeColor(
    { light: "#E8F3EC", dark: "#1C3B23" },
    "card"
  );

  const descriptionColor = useThemeColor(
    { light: "#444444", dark: "#B8B8BD" },
    "text"
  );

  const progressTrackColor = useThemeColor(
    { light: "rgba(0,0,0,0.1)", dark: "rgba(255,255,255,0.15)" },
    "background"
  );

  const dividerColor = useThemeColor(
    { light: "rgba(0,0,0,0.08)", dark: "rgba(255,255,255,0.15)" },
    "border"
  );

  /* ================= STATE ================= */

  const [totalLessons, setTotalLessons] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  /* ================= FETCH TOTAL LESSONS ================= */

  useEffect(() => {
    async function fetchLessons() {
      const snapshot = await getDocs(collection(db, "lessons"));
      setTotalLessons(snapshot.size);
    }
    fetchLessons();
  }, []);

  /* ================= LOAD COMPLETION ================= */

  useFocusEffect(
    useCallback(() => {
      async function loadCompletion() {
        const stored = await AsyncStorage.getItem("completedLessons");
        const parsed = stored ? JSON.parse(stored) : [];
        setCompletedLessons(parsed);
      }
      loadCompletion();
    }, [])
  );

  /* ================= CONTINUE LEARNING ================= */

  async function continueLearning() {
    const snapshot = await getDocs(collection(db, "lessons"));
    const allLessons = snapshot.docs
      .map((doc) => doc.data())
      .sort((a: any, b: any) => a.order - b.order);

    const stored = await AsyncStorage.getItem("completedLessons");
    const completed = stored ? JSON.parse(stored) : [];

    const nextLesson = allLessons.find(
      (lesson: any) => !completed.includes(lesson.id)
    );

    if (nextLesson) {
      router.push({
        pathname: "/lesson/[lessonId]",
        params: { lessonId: nextLesson.id },
      });
    }
  }

  /* ================= PROGRESS ================= */

  const completedCount = completedLessons.length;
  const progress = totalLessons > 0 ? completedCount / totalLessons : 0;

  /* ================= SECTION CARD ================= */

  function SectionCard({
    title,
    description,
    pathId,
    highlight = false,
  }: {
    title: string;
    description: string;
    pathId: string;
    highlight?: boolean;
  }) {
    return (
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/path/[pathId]",
            params: { pathId },
          })
        }
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: highlight ? highlightBackground : cardBackground,
            borderColor: highlight ? tintColor : borderColor,
            transform: [{ scale: pressed ? 0.98 : 1 }],
            opacity: pressed ? 0.92 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            { color: highlight ? tintColor : textColor },
          ]}
        >
          {title}
        </Text>

        <Text style={[styles.cardDescription, { color: descriptionColor }]}>
          {description}
        </Text>

        {highlight && (
          <Text style={[styles.recommendedText, { color: tintColor }]}>
            Recommended First
          </Text>
        )}
      </Pressable>
    );
  }

  /* ================= RENDER ================= */

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.header, { color: textColor }]}>The Essentials</Text>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <Text style={[styles.progressLabel, { color: textColor }]}>
          {completedCount} of {totalLessons} lessons completed
        </Text>

        <View
          style={[styles.progressBar, { backgroundColor: progressTrackColor }]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress * 100}%`,
                backgroundColor: tintColor,
              },
            ]}
          />
        </View>

        <Text style={[styles.progressPercent, { color: textColor }]}>
          {Math.round(progress * 100)}%
        </Text>
      </View>

      {/* Continue Button */}
      {progress < 1 && (
        <TouchableOpacity
          onPress={continueLearning}
          style={[styles.continueButton, { backgroundColor: tintColor }]}
        >
          <Text style={styles.continueText}>Continue Your Journey</Text>
        </TouchableOpacity>
      )}

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={[styles.dividerLine, { backgroundColor: dividerColor }]} />
        <Text
          style={[styles.dividerText, { backgroundColor, color: textColor }]}
        >
          Your Learning Journey
        </Text>
      </View>

      {/* Sections */}
      <SectionCard
        title="Foundations"
        description="Core beliefs and identity in Islam."
        pathId="foundations"
        highlight
      />

      <SectionCard
        title="Worship"
        description="Understanding Islamic acts of worship."
        pathId="worship"
      />

      <SectionCard
        title="Character"
        description="Purifying the heart and refining conduct."
        pathId="character"
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 24,
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressLabel: {
    fontSize: 15,
    marginBottom: 8,
    opacity: 0.85,
  },
  progressBar: {
    height: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  progressPercent: {
    marginTop: 6,
    fontSize: 14,
    opacity: 0.7,
  },
  continueButton: {
    marginBottom: 30,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  continueText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  dividerContainer: {
    marginBottom: 25,
    alignItems: "center",
  },
  dividerLine: {
    height: 1,
    width: "100%",
  },
  dividerText: {
    position: "absolute",
    top: -10,
    paddingHorizontal: 12,
    fontSize: 13,
    opacity: 0.7,
  },
  card: {
    padding: 20,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  recommendedText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "500",
  },
});
