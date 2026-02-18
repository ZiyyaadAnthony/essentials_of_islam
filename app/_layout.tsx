import { Stack } from "expo-router";
import { ThemeProvider } from "@/context/ThemeContext";
import {
  ThemeProvider as NavigationThemeProvider,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { useAppTheme } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";

function NavigationWrapper() {
  const { theme } = useAppTheme();

  const navigationTheme = theme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <NavigationWrapper />
    </ThemeProvider>
  );
}
