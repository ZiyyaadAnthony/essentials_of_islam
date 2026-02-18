import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useSystemColorScheme } from "react-native";

type ThemeMode = "light" | "dark" | "system";

type ThemeContextType = {
  theme: "light" | "dark";
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useSystemColorScheme() ?? "light";
  const [mode, setModeState] = useState<ThemeMode>("system");

  const theme = mode === "system" ? systemTheme : mode;

  useEffect(() => {
    async function loadTheme() {
      const stored = await AsyncStorage.getItem("themeMode");
      if (stored === "light" || stored === "dark" || stored === "system") {
        setModeState(stored);
      }
    }

    loadTheme();
  }, []);

  async function setMode(mode: ThemeMode) {
    setModeState(mode);
    await AsyncStorage.setItem("themeMode", mode);
  }

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used inside ThemeProvider");
  }
  return context;
}
