import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs } from "expo-router";
import {
  Building2,
  Calendar,
  ClipboardList,
  Home,
  Receipt
} from "lucide-react-native";
import React from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  console.log(insets.bottom);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.background,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          paddingBottom: Platform.OS === "ios" ? 20 : insets.bottom * 2,
          paddingTop: 10,
          height: 75,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ color, focused }: any) => (
            <View className="flex items-center py-2">
              <View className="mb-2">
                <Home color={color} />
              </View>
              {focused && (
                <View className="bg-red-500 w-8 h-[2px] rounded-lg"></View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }: any) => (
            <View className="flex items-center py-2">
              <View className="mb-2">
                <Calendar color={color} />
              </View>
              {focused && (
                <View className="bg-red-500 w-8 h-[2px] rounded-lg"></View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="challange"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }: any) => (
            <View className="flex items-center py-2">
              <View className="mb-2">
                <ClipboardList color={color} />
              </View>
              {focused && (
                <View className="bg-red-500 w-8 h-[2px] rounded-lg"></View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="expense"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }: any) => (
            <View className="flex items-center py-2">
              <View className="mb-2">
                <Receipt color={color} />
              </View>
              {focused && (
                <View className="bg-red-500 w-8 h-[2px] rounded-lg"></View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="department"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }: any) => (
            <View className="flex items-center py-2">
              <View className="mb-2">
                <Building2 color={color} />
              </View>
              {focused && (
                <View className="bg-red-500 w-8 h-[2px] rounded-lg"></View>
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
