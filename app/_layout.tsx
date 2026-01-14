import { SocketProvider } from "@/context/SocketContext";
import "@/global.css";
import { useAuthStore } from "@/stores/auth-store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { AppStateStatus, Platform, Text, View } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useOnlineManager } from "@/hooks/useOnlineManager";
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "sonner-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { registerGlobals } from '@livekit/react-native';

export const unstable_settings = {
  anchor: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        name="search-user"
        options={{ headerShown: false, gestureEnabled: true }}
      />
      <Stack.Screen
        name="meeting"
        options={{ headerShown: false, gestureEnabled: true }}
      />
      <Stack.Screen
        name="video-meeting"
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

registerGlobals();

export default function RootLayout() {
  useOnlineManager();
  const colorScheme = useColorScheme();
  const [isShowSplash, setIsShowSplash] = useState(true);
  const { isAuthenticated, loadStoredToken } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Load stored token when app starts
    loadStoredToken();

    // Hide the native splash screen immediately to show our custom one
    SplashScreen.hideAsync();

    // Show custom splash for 1.5 seconds
    const timer = setTimeout(() => {
      setIsShowSplash(false);
    }, 1500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isShowSplash) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to the sign-in page if not authenticated and not already in auth group
      router.replace("/(auth)/signin");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to tabs if authenticated and trying to access auth pages
      router.replace("/(tabs)");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, segments, isShowSplash]);

  if (isShowSplash) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-blue-600 text-4xl font-bold">Core Chain</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          value={colorScheme === "light" ? DarkTheme : DefaultTheme}
        >
          <SocketProvider>
            <AppScreens />
            <Toaster />
          </SocketProvider>
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}