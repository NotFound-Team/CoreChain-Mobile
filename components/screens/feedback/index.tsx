import { deleteFeedback } from "@/services/feedback.service";
import { useAuthStore } from "@/stores/auth-store";
import { IFeedback } from "@/types/feedback";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  useSafeAreaInsets
} from "react-native-safe-area-context";
import { CreateFeedbackModal } from "./CreateFeedbackModal";
import { FeedbackSkeleton } from "./FeedbackSkeleton";

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<IFeedback | null>(
    null
  );
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const fetchFeedbacks = async () => {
    try {
      // const res = await getFeedbacks({ createdBy: user?.id });
      // if (!res.isError) {
      //   setFeedbacks(res.data.result || []);
      // }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleEdit = (item: IFeedback) => {
    setSelectedFeedback(item);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this feedback?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              const res = await deleteFeedback(id);
              if (!res.isError) {
                fetchFeedbacks();
              } else {
                Alert.alert("Error", res.message || "Failed to delete");
              }
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "An error occurred");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: IFeedback }) => (
    <View className="bg-white p-4 rounded-2xl mb-3 border border-gray-100 shadow-sm">
      <View className="flex-row justify-between items-start mb-2">
        <View className="bg-purple-50 px-3 py-1 rounded-full">
          <Text className="text-[#8862F2] text-xs font-bold uppercase">
            {item.category}
          </Text>
        </View>
        <Text className="text-gray-400 text-xs">
          {dayjs(item.createdAt).format("MMM DD, YYYY")}
        </Text>
      </View>
      <Text className="text-gray-800 font-bold text-lg mb-1">{item.title}</Text>
      <Text className="text-gray-500 text-sm line-clamp-2" numberOfLines={2}>
        {item.content}
      </Text>
      {item.encryptedEmployeeId && (
        <View className="flex-row items-center mt-3">
          <Ionicons name="lock-closed" size={12} color="#9CA3AF" />
          <Text className="text-gray-400 text-xs ml-1">Anonymous</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View className="flex-row justify-end mt-4 pt-3 border-t border-gray-50 gap-3">
        <TouchableOpacity
          onPress={() => handleEdit(item)}
          className="flex-row items-center px-3 py-1.5 bg-blue-50 rounded-lg"
        >
          <Ionicons name="create-outline" size={16} color="#3B82F6" />
          <Text className="ml-1 text-[#3B82F6] font-medium text-xs">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDelete(item._id)}
          className="flex-row items-center px-3 py-1.5 bg-red-50 rounded-lg"
        >
          <Ionicons name="trash-outline" size={16} color="#EF4444" />
          <Text className="ml-1 text-[#EF4444] font-medium text-xs">
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F8F9FE]">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 pb-4 pt-10 bg-white"
        style={{ paddingTop: Math.max(insets.top, 20) }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-[#F3F0FF]"
        >
          <Ionicons name="chevron-back" size={24} color="#8862F2" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-[#1A1C1E]">
          Feedback
        </Text>
        <View className="w-10" />
      </View>

      {/* Content */}
      <View className="flex-1 px-4 pt-4">
        {isLoading ? (
          <FeedbackSkeleton />
        ) : feedbacks.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="file-tray-outline" size={40} color="#9CA3AF" />
            </View>
            <Text className="text-gray-500 font-medium">
              No feedback sent yet
            </Text>
            <Text className="text-gray-400 text-xs mt-1">
              Your voice matters. Send us your thoughts!
            </Text>
          </View>
        ) : (
          <FlatList
            data={feedbacks}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => {
                  setIsLoading(true);
                  fetchFeedbacks();
                }}
                tintColor="#8862F2"
              />
            }
          />
        )}
      </View>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => {
          setSelectedFeedback(null);
          setIsModalVisible(true);
        }}
        className="absolute bottom-10 right-6 w-16 h-16 bg-[#8862F2] rounded-full items-center justify-center shadow-xl shadow-purple-200"
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      <CreateFeedbackModal
        isVisible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedFeedback(null);
        }}
        onSuccess={fetchFeedbacks}
        initialData={selectedFeedback}
      />
    </View>
  );
}
