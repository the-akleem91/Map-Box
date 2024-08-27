/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */
import type { Theme } from "@react-navigation/native";
import {
  DarkTheme as _DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { useColorScheme } from "nativewind";

import { colors } from "@/libs/themeColors";

const DarkTheme: Theme = {
  ..._DarkTheme,
  colors: {
    ..._DarkTheme.colors,
    primary: colors.dark.primary,
    background: colors.dark.background,
    text: colors.dark.text,
    border: colors.dark.border,
    card: colors.dark.card,
  },
};

const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.light.primary,
    background: colors.light.background,
  },
};

export function useThemeColor() {
  const { colorScheme } = useColorScheme();

  // if (colorScheme === "dark") return DarkTheme;

  return LightTheme;
}
