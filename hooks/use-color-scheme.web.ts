import { useAppTheme } from "@/context/ThemeContext";

/**
 * Custom color scheme hook that respects app theme setting
 */
export function useColorScheme() {
  const { theme } = useAppTheme();
  return theme;
}
