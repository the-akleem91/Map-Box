import "react-native-reanimated";
import "../global.css";

import { ThemeProvider } from "@react-navigation/native";
import {
  AnalyticsProvider,
  createClient,
} from "@segment/analytics-react-native";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { createContext, useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootSiblingParent } from "react-native-root-siblings";

import { APIProvider } from "@/api/apiProvider";
import { SessionProvider } from "@/contexts/authProvider";
import { useThemeColor } from "@/hooks/useThemeColor";

export { ErrorBoundary } from "expo-router";

const segmentClient = createClient({
  writeKey: process.env.EXPO_PUBLIC_SEGMENT_API_KEY || "",
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Providers>
      <RootSiblingParent>
        <Stack
          initialRouteName="index"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Slot />
        </Stack>
      </RootSiblingParent>
    </Providers>
  );
}

type AppContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isCreditOpen: boolean;
  setIsCreditOpen: (isCreditOpen: boolean) => void;
};

// Create the context with initial values
const AppContext = createContext<AppContextType>({
  isOpen: false,
  setIsOpen: () => {},
  isCreditOpen: false,
  setIsCreditOpen: () => {},
});

// Create a custom hook to use the context
export const useGestureHandler = () => useContext(AppContext);

const Providers = ({ children }: { children: React.ReactNode }) => {
  const theme = useThemeColor();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreditOpen, setIsCreditOpen] = useState(false);

  return (
    <AppContext.Provider
      value={{ isOpen, setIsOpen, isCreditOpen, setIsCreditOpen }}
    >
      <GestureHandlerRootView
        onTouchStart={() =>
          setTimeout(() => {
            if (!isOpen) return;
            setIsOpen(false);
          }, 100)
        }
        style={styles.container}
        className={theme.dark ? `dark` : undefined}
      >
        <ThemeProvider value={theme}>
          <AnalyticsProvider client={segmentClient}>
            <APIProvider>
              <SessionProvider>{children}</SessionProvider>
            </APIProvider>
          </AnalyticsProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </AppContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
