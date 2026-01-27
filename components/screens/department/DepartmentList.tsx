import DepartmentSkeleton from "@/components/skeletons/DepartmentSkeleton";
import { getDepartments } from "@/services/department.service";
import { useAuthStore } from "@/stores/auth-store";
import { IDepartment } from "@/types/department";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DepartmentList() {
  const router = useRouter();
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const isManager = user?.roleName?.toLowerCase() === "manager";
      const params = isManager
        ? { manager: user?.id }
        : { employees: user?.id };

      const listRes = await getDepartments(params);
      if (!listRes.isError) {
        setDepartments(listRes.data.result || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-4 pb-4 flex-row items-center border-b border-gray-100 bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-2xl bg-indigo-50 mr-3"
        >
          <Ionicons name="arrow-back" size={20} color="#4F46E5" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Departments</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchData}
            tintColor="#4F46E5"
          />
        }
      >
        {isLoading ? (
          <View className="p-6">
            <DepartmentSkeleton />
          </View>
        ) : departments.length === 0 ? (
          <View className="flex-1 justify-center items-center pt-20">
            <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="business-outline" size={40} color="#9CA3AF" />
            </View>
            <Text className="text-gray-500 font-medium">
              No departments found
            </Text>
            <Text className="text-gray-400 text-xs mt-1 text-center px-10">
              You are not assigned to any department yet.
            </Text>
          </View>
        ) : (
          <View className="p-6">
            <Text className="text-sm text-gray-400 font-medium mb-4 uppercase tracking-wider">
              Your Departments ({departments.length})
            </Text>
            {departments.map((dept) => (
              <TouchableOpacity
                key={dept._id}
                onPress={() => router.push(`/department/${dept._id}`)}
                className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm mb-4"
              >
                <View className="flex-row justify-between items-center mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <View className="bg-indigo-50 p-2 rounded-xl mr-3">
                        <Ionicons name="business" size={20} color="#4F46E5" />
                      </View>
                      <Text
                        className="text-gray-900 font-bold text-lg"
                        numberOfLines={1}
                      >
                        {dept.name}
                      </Text>
                    </View>
                    <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-11">
                      Code: {dept.code}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                </View>

                <View className="ml-11">
                  <Text className="text-gray-500 text-sm leading-5 mb-4" numberOfLines={2}>
                    {dept.description || "No description available."}
                  </Text>
                  
                  <View className="flex-row items-center gap-4">
                    <View className="flex-row items-center bg-gray-50 px-3 py-1.5 rounded-xl">
                      <Ionicons name="people-outline" size={14} color="#6B7280" />
                      <Text className="text-gray-600 text-[11px] font-bold ml-1.5">
                        {Array.isArray(dept.employees) ? dept.employees.length : 1} Members
                      </Text>
                    </View>
                    <View className="flex-row items-center bg-gray-50 px-3 py-1.5 rounded-xl">
                      <Ionicons name="layers-outline" size={14} color="#6B7280" />
                      <Text className="text-gray-600 text-[11px] font-bold ml-1.5">
                        {dept.projectIds?.length || 0} Projects
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
