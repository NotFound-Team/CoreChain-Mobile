import "@/global.css";
import { useAuthStore } from "@/stores/auth-store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

import {
  AppStateStatus,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  interpolate,
  Easing as ReanimatedEasing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useOnlineManager } from "@/hooks/useOnlineManager";
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "sonner-native";

import { LinearGradient } from "expo-linear-gradient";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import InAppNotification from "@/components/InAppNotification";
import { SocketProvider } from "@/context/SocketContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
      <Stack.Screen name="(auth)/welcome" options={{ headerShown: false }} />
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
        name="feedback/index"
        options={{ headerShown: false, gestureEnabled: true }}
      />
      <Stack.Screen
        name="project-details/[id]"
        options={{ headerShown: false, gestureEnabled: true }}
      />
      <Stack.Screen
        name="create-task"
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
        name="versioning"
        options={{ headerShown: false, gestureEnabled: true }}
      />
    </Stack>
  );
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function SplashView() {
  const progress = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);

  useEffect(() => {
    // Logo and text entry
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withSpring(1, { damping: 12 });

    // Background movement (infinite loop)
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 6000, easing: ReanimatedEasing.linear }),
        withTiming(0, { duration: 6000, easing: ReanimatedEasing.linear }),
      ),
      -1,
      false,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedBackStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [-SCREEN_WIDTH, 0]);
    const translateY = interpolate(
      progress.value,
      [0, 1],
      [-SCREEN_HEIGHT / 2, 0],
    );

    return {
      transform: [{ translateX }, { translateY }, { rotate: "-15deg" }],
    };
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoScale.value }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Moving Wide Gradient Background */}
      <Animated.View style={[styles.gradientBox, animatedBackStyle]}>
        <LinearGradient
          colors={[
            "#8862F2",
            "#BFAFFF",
            "#FFFFFF",
            "#BFAFFF",
            "#8862F2",
            "#BFAFFF",
            "#FFFFFF",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.content,
          // animatedLogoStyle
        ]}
      >
        <View className="w-24 h-24 rounded-[32px] items-center justify-center mb-6 shadow-2xl shadow-indigo-200">
          <Image
            source={require("../assets/images/icon.png")}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
        <Text className="text-gray-900 text-4xl font-extrabold tracking-tighter">
          Core<Text className="text-indigo-600">Chain</Text>
        </Text>
        <Text className="text-gray-400 text-xs font-bold uppercase tracking-[4px] mt-3">
          Innovating Excellence
        </Text>
      </Animated.View>

      <View className="absolute bottom-12 items-center w-full">
        <View className="flex-row items-center space-x-2">
          <View className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
          <Text className="text-gray-400 text-[10px] font-bold">
            POWERED BY BLOCKCHAIN
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  gradientBox: {
    position: "absolute",
    width: SCREEN_WIDTH * 3,
    height: SCREEN_HEIGHT * 3,
    top: -SCREEN_HEIGHT,
    left: -SCREEN_WIDTH,
  },
  content: {
    alignItems: "center",
    zIndex: 10,
  },
});

// registerGlobals();

export default function RootLayout() {
  useOnlineManager();
  const colorScheme = useColorScheme();
  const [isShowSplash, setIsShowSplash] = useState(true);
  const [inAppNoti, setInAppNoti] = useState({
    visible: false,
    title: "",
    message: "",
  });
  const { isAuthenticated, loadStoredToken, user } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // const checkFcmToken = async () => {
  //   const currentFcmToken = await getFCMToken();
  //   if (currentFcmToken !== user?.fcmToken && isAuthenticated) {
  //     await updateFcmToken({ fcmToken: currentFcmToken!, id: user?.id! });
  //   }
  // };

  // Load config fcm token
  // useEffect(() => {
  //   requestUserPermission();
  //   // setupFCMListeners();
  //   const unsubscribe = setupFCMListeners((title, message) => {
  //     setInAppNoti({
  //       visible: true,
  //       title,
  //       message,
  //     });

  //     // auto hide sau 3s (UX tốt hơn)
  //     setTimeout(() => {
  //       setInAppNoti((prev) => ({ ...prev, visible: false }));
  //     }, 30000);
  //   });

  //   return unsubscribe;
  // }, []);

  /**
   * - If isAuthenticated = false ==> loadStoredToken
   * - Display SplashScreen
   */
  useEffect(() => {
    // Load stored token when app starts
    const init = async () => {
      if (!isAuthenticated) {
        await loadStoredToken();
      }

      SplashScreen.hideAsync();

      setTimeout(() => {
        setIsShowSplash(false);
      }, 2500);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  /**
   * - Check hasSeenWelcome
   * - Check first render isAuthenticated
   */
  useEffect(() => {
    if (isShowSplash) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Check if first time (mocked with SecureStore for now)
      const hasSeenWelcome = SecureStore.getItem("has_seen_welcome");

      if (!hasSeenWelcome) {
        router.replace("/(auth)/welcome");
        // Mark as seen so next time they go to signin
      } else {
        router.replace("/(auth)/signin");
      }
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to tabs if authenticated and trying to access auth pages
      router.replace("/(tabs)");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, segments, isShowSplash]);

  /**
   * Check FCM token
   */
  useEffect(() => {
    if (!user?.id) return;
    // checkFcmToken();
  }, [user?.id, user?.fcmToken]);

  if (isShowSplash) {
    return <SplashView />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            value={colorScheme === "light" ? DarkTheme : DefaultTheme}
          >
            <SocketProvider>
              <InAppNotification
                visible={inAppNoti.visible}
                title={inAppNoti.title}
                message={inAppNoti.message}
                onClose={() =>
                  setInAppNoti((prev) => ({ ...prev, visible: false }))
                }
              />
              <AppScreens />
              <Toaster />
            </SocketProvider>
            <StatusBar style={Platform.OS === "ios" ? "dark" : "auto"} />
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
