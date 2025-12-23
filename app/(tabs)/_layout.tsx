import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs } from "expo-router";
import {
  Calendar,
  ClipboardList,
  Home,
  Layers,
  Receipt,
} from "lucide-react-native";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.background,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { paddingBottom: 4, height: 70 },
        tabBarIndicatorStyle: {
          backgroundColor: "#7A5AF8",
          height: 3,
          borderRadius: 3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          headerShown: true,
          header: () => <SafeAreaView className="flex-1 bg-white"><Text className="mb-2 bg-red-300">Home</Text></SafeAreaView>,
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
        name="leave"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }: any) => (
            <View className="flex items-center py-2">
              <View className="mb-2">
                <Layers color={color} />
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
