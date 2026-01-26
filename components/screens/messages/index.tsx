import { useSocket } from "@/hooks/useSocket";
import { Conversation, getConversations } from "@/services/conversation.service";
import { useAuthStore } from "@/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Messages() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { socket, isConnected } = useSocket();

  const {
    data: conversationsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await getConversations();
      console.log("conversationsData", res);
      return res.data;
    },
  });

  const renderItem = ({ item }: { item: Conversation }) => {
    const isMine = item.last_message_sender_id && user?.id && String(item.last_message_sender_id) === String(user.id);

    let content = item.last_message_content || "";
    if (item.last_message_type === "file") {
      content = `File: ${item.last_message_file_name || "Attachment"}`;
    }

    const snippet = isMine ? `You: ${content}` : content;

    return (
      <TouchableOpacity
        className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100"
        activeOpacity={0.7}
        onPress={() => router.push(`/chat/${item.id}`)}
      >
        <View className="w-14 h-14 rounded-full overflow-hidden bg-[#FDE7E7]">
          <Image
            source={{ uri: item.avatar || `https://ui-avatars.com/api/?name=${item.name}&background=random` }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        </View>

        <View className="flex-1 ml-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-[16px] font-bold text-[#1A1C1E]">
              {item.name}
            </Text>
            <Text className="text-gray-400 text-[12px]">
              {dayjs.utc(item.last_message_at).local().format("HH:mm")}
            </Text>
          </View>

          <View className="flex-row justify-between items-center mt-1">
            <Text
              className="text-gray-500 text-[13px] flex-1 mr-2"
              numberOfLines={1}
            >
              {snippet}
            </Text>

            {(item.unread_count || 0) > 0 && (
              <View className="bg-[#FF5A5F] w-5 h-5 rounded-full items-center justify-center">
                <Text className="text-white text-[10px] font-bold">
                  {item.unread_count}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-[#F1F3F8]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 pt-8 bg-white" style={{ paddingTop: Math.max(insets.top, 20) }}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-[#F3F0FF]"
        >
          <Ionicons name="chevron-back" size={24} color="#8862F2" />
        </TouchableOpacity>

        <Text className="text-[18px] font-bold text-[#1A1C1E]">Messages</Text>

        <View className="w-10" />
      </View>

      {/* Search Trigger */}
      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.push("/search-user")}
          activeOpacity={0.8}
          className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-lg h-11 px-3"
        >
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <Text className="ml-2 text-gray-500 text-[15px]">
            Search for users...
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={conversationsData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View className="flex-1 items-center justify-center mt-10">
              <Text className="text-gray-500">No conversations yet</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
