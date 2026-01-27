import { useDebounce } from "@/hooks/useDebounce";
import { TaskQueue } from "@/queue/task-queue";
import { createPrivateConversation } from "@/services/conversation.service";
import { searchUsers } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "./EmptyState";
import UserItemSkeleton from "./UserItemSkeleton";

interface User {
  _id: string;
  name: string;
  avatar?: string;
}
const queue = new TaskQueue(1);
// Simple debounce hook implementation
// function useDebounce<T>(value: T, delay: number): T {
//   const [debouncedValue, setDebouncedValue] = useState(value);

//   React.useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);

//   return debouncedValue;
// }

export default function SearchUser() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);
  const [results, setResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();
  const currentUserId = user?.id;

  const abortRef = useRef<AbortController | null>(null);

  // Effect to handle search
  React.useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    queue.enqueue(async (signal) => {
      setIsLoading(true);

      try {
        const res = await searchUsers(debouncedQuery, controller.signal);

        if (signal?.aborted) return;

        if (!res.isError) {
          const users = res.data?.result || [];
          const filtered = currentUserId
            ? users.filter((u: User) => u._id !== currentUserId)
            : users;

          setResults(filtered);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Search error:", err);
        }
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    }, controller.signal);

    return () => {
      controller.abort();
    };

    // const fetchUsers = async () => {
    //   setIsLoading(true);
    //   try {
    //     const res = await searchUsers(debouncedQuery);

    //     if (!res.isError) {
    //       const users = res.data?.result || [];
    //       // Lọc user hiện tại
    //       const filteredUsers = currentUserId
    //         ? users.filter((u: User) => u._id !== currentUserId)
    //         : users;
    //       setResults(filteredUsers);
    //     }
    //   } catch (error) {
    //     console.error("Search error:", error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    // fetchUsers();
  }, [debouncedQuery, currentUserId]);

  const handleUserPress = async (userId: string) => {
    const res = await createPrivateConversation(userId);
    if (!res.isError && res.data) {
      const conversationId = res.data.id;
      router.push(`/chat/${conversationId}`);
    } else {
      console.error("Failed to create conversation", res.message);
    }
  };

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100"
      onPress={() => handleUserPress(item._id)}
    >
      <View className="w-10 h-10 rounded-full overflow-hidden bg-[#FDE7E7]">
        <Image
          source={{
            uri:
              item.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`,
          }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      </View>
      <Text className="ml-3 text-[#1A1C1E] font-medium text-[16px]">
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with Search Input */}
      <View className="flex-row items-center px-4 py-2 border-b border-gray-200 gap-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A1C1E" />
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 h-14">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-[#1A1C1E] text-[16px]"
            placeholder="Search users..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListHeaderComponent={
          isLoading ? (
            <View className="w-full">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
                <UserItemSkeleton key={index} />
              ))}
            </View>
          ) : null
        }
        ListEmptyComponent={() => {
          if (isLoading) return null;

          if (debouncedQuery.trim().length > 0) {
            return <EmptyState query={debouncedQuery} />;
          }

          if (!debouncedQuery) {
            return (
              <View className="pt-20 items-center">
                <Text className="text-gray-400">
                  Enter a name to find friends...
                </Text>
              </View>
            );
          }

          return null;
        }}
      />
    </SafeAreaView>
  );
}
