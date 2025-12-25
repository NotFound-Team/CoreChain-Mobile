import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const NOTIFICATIONS = [
  {
    id: "1",
    title: "New Task Assigned to You!",
    description: "You have new task for this sprint from Alicia, you can check your task \"Create Onboarding Screen\" by tap here",
    time: "09.10",
    icon: "document-text",
    iconColor: "#8862F2",
  },
  {
    id: "2",
    title: "Expense has been approved!",
    description: "Your expense has been been approved by jessica, view expense report here",
    time: "09.10",
    icon: "document-text",
    iconColor: "#8862F2",
  },
  {
    id: "3",
    title: "You have invited in meeting!",
    description: "You have been invited to a meeting. Tap to find the meeting details",
    time: "09.10",
    icon: "people",
    iconColor: "#8862F2",
  },
];

export default function Notifications() {
  const renderItem = ({ item }: { item: typeof NOTIFICATIONS[0] }) => (
    <TouchableOpacity 
      className="flex-row items-start px-4 py-4 bg-white border-b border-gray-100"
      activeOpacity={0.7}
    >
      {/* Icon Container */}
      <View 
        className="w-12 h-12 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: `${item.iconColor}10` }}
      >
        <Ionicons name={item.icon as any} size={24} color={item.iconColor} />
      </View>

      {/* Content Container */}
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-[15px] font-bold text-[#1A1C1E] flex-1 mr-2">
            {item.title}
          </Text>
          <Text className="text-gray-400 text-[12px]">{item.time}</Text>
        </View>
        
        <Text className="text-gray-500 text-[13px] leading-5">
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F1F3F8]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 pt-8 border-b border-gray-200 bg-white">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-[#F3F0FF]"
        >
          <Ionicons name="chevron-back" size={24} color="#8862F2" />
        </TouchableOpacity>
        
        <Text className="text-[18px] font-bold text-[#1A1C1E]">Notifications</Text>
        
        <View className="w-10" />
      </View>

      {/* List Notifications */}
      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View className="h-20" />} // Tạo khoảng trống dưới cùng
      />
    </SafeAreaView>
  );
}