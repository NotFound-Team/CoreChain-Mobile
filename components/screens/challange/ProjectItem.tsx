import { IProject } from "@/types/project";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const getStatusStyles = (status: number) => {
  switch (status) {
    case 0:
      return { label: "Pending", color: "bg-yellow-50", text: "text-yellow-600" };
    case 1:
      return { label: "In Progress", color: "bg-blue-50/50", text: "text-blue-600" };
    case 2:
      return { label: "Completed", color: "bg-green-50", text: "text-green-600" };
    default:
      return { label: "Unknown", color: "bg-gray-100", text: "text-gray-600" };
  }
};

export const ProjectItem = ({ item }: { item: IProject }) => {
  const router = useRouter();
  const status = getStatusStyles(item.status);
  const formattedDate = dayjs(item.endDate).format("DD MMM");

  const handlePress = (id: string) => {
    // Assuming there is a project-details route or similar
    // Based on user request "nhấn đến detail project"
    router.push(`/project-details/${id}`);
  };

  return (
    <TouchableOpacity
      className="bg-white mx-4 mb-4 p-4 rounded-[20px] shadow-sm border border-gray-50"
      activeOpacity={0.8}
      onPress={() => handlePress(item?._id)}
    >
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
          <Ionicons name="briefcase" size={20} color="#3B82F6" />
        </View>
        <View className="flex-1">
          <Text
            className="text-[16px] font-bold text-[#1A1C1E] mb-1"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text className="text-gray-400 text-xs" numberOfLines={1}>
             {typeof item.manager === 'object' ? item.manager.name : "Manager"}
          </Text>
        </View>
      </View>

      {/* Badges: Status */}
      <View className="flex-row mb-4">
        <View
          className={`${status.color} px-3 py-1 rounded-full mr-2 flex-row items-center`}
        >
          <View
            className={`w-1.5 h-1.5 rounded-full ${status.text.replace("text", "bg")} mr-1.5`}
          />
          <Text className={`${status.text} text-[11px] font-semibold`}>
            {status.label}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="flex-row justify-between mb-1 items-center">
         <Text className="text-xs text-gray-500">Progress</Text>
         <Text className="text-xs font-bold text-gray-700">{item.progress}%</Text>
      </View>
      <View className="w-full h-[6px] bg-gray-100 rounded-full mb-4 overflow-hidden">
        <View
          className="h-full bg-blue-500"
          style={{ width: `${item.progress}%` }}
        />
      </View>

      <View className="flex-row justify-between items-center pt-2 border-t border-gray-50">
        <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-lg">
           <Ionicons name="people-outline" size={14} color="#9CA3AF" />
           <Text className="text-gray-500 text-[11px] font-medium ml-1">
             {(Array.isArray(item.teamMembers) ? item.teamMembers.length : 0)} Members
           </Text>
        </View>

        <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-lg">
          <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
          <Text className="text-gray-500 text-[11px] font-medium ml-1">
            {formattedDate}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
