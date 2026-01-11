import LoadingOverlay from "@/components/customs/LoadingOverlay";
import { getTaskDetail, updateTask } from "@/services/task.service";
import { TypeTask } from "@/types/task";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; // Import thêm icon
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Helper: Soft UI Colors (Nền nhạt + Chữ đậm)
const getStatusStyles = (status: number) => {
  switch (status) {
    case 2: // In Progress
      return {
        label: "In Progress",
        bg: "bg-blue-100",
        text: "text-blue-700",
        icon: "timer-sand",
      };
    case 3: // Review
      return {
        label: "Review",
        bg: "bg-purple-100",
        text: "text-purple-700",
        icon: "eye-outline",
      };
    case 4: // Completed
      return {
        label: "Completed",
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        icon: "check-circle-outline",
      };
    default: // Todo
      return {
        label: "To Do",
        bg: "bg-slate-100",
        text: "text-slate-600",
        icon: "clipboard-list-outline",
      };
  }
};

const getPriorityStyles = (priority: number) => {
  switch (priority) {
    case 1: // High
      return {
        label: "High Priority",
        bg: "bg-red-100",
        text: "text-red-600",
        iconColor: "#DC2626",
      };
    case 2: // Medium
      return {
        label: "Medium Priority",
        bg: "bg-orange-100",
        text: "text-orange-600",
        iconColor: "#EA580C",
      };
    default: // Low
      return {
        label: "Low Priority",
        bg: "bg-blue-50",
        text: "text-blue-600",
        iconColor: "#2563EB",
      };
  }
};

export const TaskDetails = ({ id }: { id: string }) => {
  const [taskDetail, setTaskDetail] = useState<TypeTask | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        setIsLoading(true);
        const response = await getTaskDetail(id);
        if (!response.isError) {
          setTaskDetail(response.data);
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTaskDetails();
  }, [id]);

  if (!taskDetail && !isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F8FAFC]">
        <Text className="text-slate-400">Task not found</Text>
      </View>
    );
  }

  const statusInfo = taskDetail ? getStatusStyles(taskDetail.status) : null;
  const priorityInfo = taskDetail
    ? getPriorityStyles(taskDetail.priority)
    : null;

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      {isLoading && <LoadingOverlay visible={isLoading} />}

      {taskDetail && statusInfo && priorityInfo && (
        <>
          {/* Header trong suốt, đẹp hơn */}
          <SafeAreaView className="bg-[#F8FAFC] z-10">
            <View className="flex-row items-center justify-between px-5 py-2">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 items-center justify-center rounded-full bg-white border border-slate-100 shadow-sm"
              >
                <Ionicons name="arrow-back" size={22} color="#1E293B" />
              </TouchableOpacity>
              <Text className="text-lg font-bold text-slate-800">
                Task Details
              </Text>
              <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white border border-slate-100 shadow-sm">
                <Ionicons
                  name="ellipsis-horizontal"
                  size={22}
                  color="#1E293B"
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            className="px-5 mt-2"
          >
            {/* Title Section */}
            <View className="mb-6">
              <View
                className={`self-start px-3 py-1.5 rounded-full flex-row items-center mb-3 ${statusInfo.bg}`}
              >
                <MaterialCommunityIcons
                  name={statusInfo.icon as any}
                  size={14}
                  color={
                    statusInfo.text.split("-")[1] === "blue"
                      ? "#1D4ED8"
                      : statusInfo.text.split("-")[1] === "emerald"
                        ? "#047857"
                        : statusInfo.text.split("-")[1] === "purple"
                          ? "#7E22CE"
                          : "#475569"
                  }
                  style={{ marginRight: 4 }}
                />
                <Text
                  className={`${statusInfo.text} text-xs font-bold uppercase tracking-wider`}
                >
                  {statusInfo.label}
                </Text>
              </View>

              <Text className="text-3xl font-extrabold text-slate-900 leading-tight">
                {taskDetail.title}
              </Text>

              <View className="flex-row items-center mt-3 space-x-2">
                <Ionicons name="calendar-outline" size={16} color="#94A3B8" />
                <Text className="text-slate-400 text-sm font-medium">
                  Created on{" "}
                  {new Date(taskDetail.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </View>
            </View>

            {/* Info Grid (Priority & Deadline) */}
            <View className="flex-row gap-4 mb-6">
              {/* Priority Card */}
              <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <View className="flex-row items-center mb-2">
                  <View
                    className={`w-8 h-8 rounded-full items-center justify-center ${priorityInfo.bg} mr-2`}
                  >
                    <Ionicons
                      name="flag"
                      size={16}
                      color={priorityInfo.iconColor}
                    />
                  </View>
                  <Text className="text-slate-400 text-xs font-bold uppercase">
                    Priority
                  </Text>
                </View>
                <Text className="text-slate-800 font-bold text-base ml-1">
                  {priorityInfo.label.split(" ")[0]}
                </Text>
              </View>

              {/* Due Date Card */}
              <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <View className="flex-row items-center mb-2">
                  <View className="w-8 h-8 rounded-full items-center justify-center bg-purple-50 mr-2">
                    <Ionicons name="time" size={16} color="#9333EA" />
                  </View>
                  <Text className="text-slate-400 text-xs font-bold uppercase">
                    Due Date
                  </Text>
                </View>
                <Text className="text-slate-800 font-bold text-base ml-1">
                  {new Date(taskDetail.dueDate).toLocaleDateString("en-GB")}
                </Text>
              </View>
            </View>

            {/* Creator / Assignee Section */}
            <View className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-6 flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <Image
                  source={{
                    uri: `https://ui-avatars.com/api/?name=${taskDetail.createdBy.email}&background=0D8ABC&color=fff&size=128`,
                  }}
                  className="w-12 h-12 rounded-full border-2 border-slate-50"
                />
                <View className="ml-3 flex-1">
                  <Text className="text-slate-400 text-xs mb-0.5">
                    Assigned by
                  </Text>
                  <Text
                    className="font-bold text-slate-800 text-base"
                    numberOfLines={1}
                  >
                    {taskDetail.createdBy.email.split("@")[0]}
                  </Text>
                  <Text className="text-slate-400 text-xs" numberOfLines={1}>
                    {taskDetail.createdBy.email}
                  </Text>
                </View>
              </View>
              <TouchableOpacity className="bg-slate-50 p-2 rounded-full">
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={20}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            {/* Description */}
            <View className="mb-8">
              <Text className="text-lg font-bold text-slate-800 mb-3">
                Description
              </Text>
              <View className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <Text className="text-slate-600 leading-7 text-base">
                  {taskDetail.description ||
                    "No description provided for this task."}
                </Text>
              </View>
            </View>

            {/* Attachments Section (Optional) */}
            {taskDetail.attachments.length > 0 && (
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-lg font-bold text-slate-800">
                    Attachments
                  </Text>
                  <Text className="text-slate-400 text-sm">
                    {taskDetail.attachments.length} files
                  </Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {/* Demo Placeholder UI cho Attachment */}
                  <View className="w-24 h-24 bg-slate-200 rounded-xl mr-3 items-center justify-center">
                    <Ionicons name="document-text" size={30} color="#94A3B8" />
                  </View>
                  <View className="w-24 h-24 bg-slate-200 rounded-xl mr-3 items-center justify-center">
                    <Ionicons name="image" size={30} color="#94A3B8" />
                  </View>
                </ScrollView>
              </View>
            )}

            {/* Status Update Button */}
            {(taskDetail.status === 2 || taskDetail.status === 3) && (
              <View className="mb-6">
                <TouchableOpacity
                  onPress={async () => {
                    try {
                      setIsLoading(true);
                      const nextStatus = taskDetail.status === 2 ? 3 : 2;
                      const res = await updateTask(id, { status: nextStatus });
                      if (!res.isError) {
                        Alert.alert("Success", `Status updated to ${nextStatus === 3 ? "Review" : "In Progress"}`);
                        // Re-fetch data
                        const updatedRes = await getTaskDetail(id);
                        if (!updatedRes.isError) setTaskDetail(updatedRes.data);
                      } else {
                        Alert.alert("Error", res.message || "Failed to update status");
                      }
                    } catch (error) {
                      console.error("Status update error:", error);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className={`w-full h-14 rounded-2xl flex-row items-center justify-center shadow-sm ${taskDetail.status === 2 ? "bg-purple-600" : "bg-blue-600"}`}
                >
                  <MaterialCommunityIcons 
                    name={taskDetail.status === 2 ? "eye-outline" : "play-outline"} 
                    size={24} 
                    color="white" 
                  />
                  <Text className="text-white font-bold text-base ml-2">
                    {taskDetail.status === 2 ? "Mark as Review" : "Mark as In Progress"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View className="h-10" />
          </ScrollView>
        </>
      )}
    </View>
  );
};
