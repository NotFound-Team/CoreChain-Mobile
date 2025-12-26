import "@/global.css";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppState } from "@/hooks/useAppState";
import { useOnlineManager } from "@/hooks/useOnlineManager";
import { useAuthStore } from "@/stores/auth-store";
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { AppStateStatus, Platform } from "react-native";
import { Toaster } from "sonner-native";

export const unstable_settings = {
  anchor: "(tabs)",
};
function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

const AppScreens = () => {
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/signin");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, segments, navigationState?.key]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/signin" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile"
        options={{ headerShown: false, gestureEnabled: true }}
      />
      <Stack.Screen
        name="changepassword"
        options={{ headerShown: false, gestureEnabled: true }}
      />
      <Stack.Screen
        name="messages"
        options={{ headerShown: false, gestureEnabled: true }}
      />
      <Stack.Screen
        name="notifications"
        options={{ headerShown: false, gestureEnabled: true }}
      />
      <Stack.Screen
        name="task-details/[id]"
        options={{ headerShown: false, gestureEnabled: true }}
      />
      <Stack.Screen
        name="personal"
        options={{ headerShown: false, gestureEnabled: true }}
      />
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", title: "Modal" }}
      />
    </Stack>
  );
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});
export default function RootLayout() {
  useOnlineManager();

  useAppState(onAppStateChange);
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
        <AppScreens />
        <Toaster />
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
