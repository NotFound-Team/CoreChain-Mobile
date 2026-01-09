import DepartmentSkeleton from "@/components/skeletons/DepartmentSkeleton";
import { getDepartments } from "@/services/department.service";
import { useAuthStore } from "@/stores/auth-store";
import { IDepartment } from "@/types/department";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DepartmentScreen() {
  const router = useRouter();
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const res = await getDepartments({ employees: user?.id });
      if (!res.isError) {
        setDepartments(res.data.result);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = ({ item }: { item: IDepartment }) => (
    <View className="bg-white p-4 rounded-2xl mb-3 border border-gray-100 shadow-sm">
      <View className="flex-row justify-between items-start mb-2">
        <View className="bg-indigo-50 px-3 py-1 rounded-full">
          <Text className="text-indigo-600 text-xs font-bold uppercase">
            {item.code}
          </Text>
        </View>
        <Text className="text-gray-400 text-xs">
          Founded: {dayjs(item.createdAt).format("MMM YYYY")}
        </Text>
      </View>
      <Text className="text-gray-900 font-bold text-lg mb-1">{item.name}</Text>
      <Text
        className="text-gray-500 text-sm line-clamp-2 mb-3"
        numberOfLines={2}
      >
        {item.description || "No description available."}
      </Text>

      {/* Stats or Info */}
      <View className="flex-row items-center gap-4 border-t border-gray-50 pt-3">
        <View className="flex-row items-center">
          <Ionicons name="people-outline" size={16} color="#6B7280" />
          <Text className="text-gray-600 text-xs ml-1">
            {item.employees?.length || 0} Members
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="folder-open-outline" size={16} color="#6B7280" />
          <Text className="text-gray-600 text-xs ml-1">
            {item.projectIds?.length || 0} Projects
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FE]">
      {/* Header */}
      <View className="px-6 pt-4 pb-4 flex-row items-center bg-white border-b border-gray-100 gap-3">
        <TouchableOpacity onPress={() => router.back()} className="p-1 -ml-2">
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Departments</Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-4 pt-4">
        {isLoading ? (
          <View>
            {[1, 2, 3, 4].map((i) => (
              <DepartmentSkeleton key={i} />
            ))}
          </View>
        ) : departments.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="business-outline" size={40} color="#9CA3AF" />
            </View>
            <Text className="text-gray-500 font-medium">
              No departments found
            </Text>
          </View>
        ) : (
          <FlatList
            data={departments}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => {
                  setIsLoading(true);
                  fetchDepartments();
                }}
                tintColor="#4F46E5"
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
