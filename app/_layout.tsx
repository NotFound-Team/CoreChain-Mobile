import "@/global.css";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppState } from "@/hooks/useAppState";
import { useOnlineManager } from "@/hooks/useOnlineManager";
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AppStateStatus, Platform } from "react-native";
import { Toaster } from "sonner-native";

// import { getFCMToken } from "@/services/firebase.service";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const unstable_settings = {
  anchor: "(tabs)",
};

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

const AppScreens = () => {
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
        name="department/index"
        options={{ headerShown: false, gestureEnabled: true }}
      />
      <Stack.Screen
        name="project/index"
        options={{ headerShown: false, gestureEnabled: true }}
      />
      <Stack.Screen
        name="personnel/index"
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

  useEffect(() => {
    // getFCMToken();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
          <AppScreens />
          <Toaster />
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}