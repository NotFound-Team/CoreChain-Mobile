import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MESSAGES = [
  {
    id: "1",
    name: "Alicia Rochefort",
    message: "Hey Tonald, we have to attend our daily stand up...",
    time: "09.10",
    unreadCount: 1,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alicia",
  },
  {
    id: "2",
    name: "Jessica Tan",
    message: "Ey Tonald, let's do the design sprint at friday 10.00...",
    time: "09.10",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
  },
  {
    id: "3",
    name: "Lolita Xue",
    message: "Ey Tonald, let's do the design sprint at friday 10.00...",
    time: "09.10",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lolita",
  },
  {
    id: "4",
    name: "Eaj Prakk",
    message: "Ey Tonald, let's do the design sprint at friday 10.00...",
    time: "09.10",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eaj",
  },
  {
    id: "5",
    name: "Jason",
    message: "Ey Tonald, let's do the design sprint at friday 10.00...",
    time: "09.10",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jason",
  },
  {
    id: "6",
    name: "Kimberly",
    message: "Ey Tonald, let's do the design sprint at friday 10.00...",
    time: "09.10",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kimberly",
  },
  {
    id: "7",
    name: "Wang",
    message: "Ey Tonald, let's do the design sprint at friday 10.00...",
    time: "09.10",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wang",
  },
];

export default function Messages() {
  const renderItem = ({ item }: { item: (typeof MESSAGES)[0] }) => (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100"
      activeOpacity={0.7}
    >
      <View className="w-14 h-14 rounded-full overflow-hidden bg-[#FDE7E7]">
        <Image
          source={{ uri: item.avatar }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      </View>

      <View className="flex-1 ml-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-[16px] font-bold text-[#1A1C1E]">
            {item.name}
          </Text>
          <Text className="text-gray-400 text-[12px]">{item.time}</Text>
        </View>

        <View className="flex-row justify-between items-center mt-1">
          <Text
            className="text-gray-500 text-[13px] flex-1 mr-2"
            numberOfLines={1}
          >
            {item.message}
          </Text>

          {item.unreadCount > 0 && (
            <View className="bg-[#FF5A5F] w-5 h-5 rounded-full items-center justify-center">
              <Text className="text-white text-[10px] font-bold">
                {item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F1F3F8]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 pt-8 bg-white border-b border-b-gray-200">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-[#F3F0FF]"
        >
          <Ionicons name="chevron-back" size={24} color="#8862F2" />
        </TouchableOpacity>

        <Text className="text-[18px] font-bold text-[#1A1C1E]">Messages</Text>

        <View className="w-10" />
      </View>

      <FlatList
        data={MESSAGES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
