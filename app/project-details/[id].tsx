import { TaskItem } from "@/components/screens/challange/TaskItem";
import { getProjectDetail, updateProject } from "@/services/project.service";
import { getTasks } from "@/services/task.service";
import { useAuthStore } from "@/stores/auth-store";
import { IProject } from "@/types/project";
import { TypeTask } from "@/types/task";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const [project, setProject] = useState<IProject | null>(null);
  const [tasks, setTasks] = useState<TypeTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const insets = useSafeAreaInsets();

  const isManager = user?.roleName === "MANAGER";

  const fetchData = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const [projRes, taskRes] = await Promise.all([
        getProjectDetail(id),
        getTasks({ projectId: id }),
      ]);

      if (!projRes.isError) {
        setProject(projRes.data);
      }
      if (!taskRes.isError) {
        setTasks(taskRes.data.result || []);
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "All") return true;
    if (activeTab === "In Progress") return task.status === 2;
    if (activeTab === "Review") return task.status === 3;
    if (activeTab === "Finish") return task.status === 4;
    return true;
  });

  const handleUpdateStatus = async (newStatus: number) => {
    if (!id) return;
    try {
      setIsLoading(true);
      const res = await updateProject(id, { status: newStatus });
      if (!res.isError) {
        Alert.alert("Success", "Project status updated successfully");
        fetchData();
      } else {
        Alert.alert("Error", "Failed to update project status");
      }
    } catch (error) {
      console.error("Error updating project status:", error);
    } finally {
      setIsLoading(true); // Temporary to show loading while re-fetching
      fetchData();
    }
  };

  const handleProjectActions = () => {
    if (!project) return;
    Alert.alert("Project Actions", "Choose an action for this project", [
      {
        text: project.status === 1 ? "Mark as Review" : "Mark as In Progress",
        onPress: () => handleUpdateStatus(project.status === 1 ? 2 : 1), // Assuming 1: In Progress, 2: Review (matching user request)
      },
      {
        text: "Report Project",
        onPress: () =>
          Alert.alert("Report", "Project report has been generated."),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setIsLoading(true);
            const { deleteTask } = await import("@/services/task.service");
            const res = await deleteTask(taskId);
            if (!res.isError) {
              toast.success("Task deleted");
              fetchData();
            } else {
              Alert.alert("Error", res.message || "Failed to delete task");
            }
          } catch (error) {
            console.error("Delete error:", error);
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  if (isLoading && !isRefreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#8862F2" />
      </View>
    );
  }

  if (!project) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <Text className="text-gray-500 text-lg mb-4">Project not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-[#8862F2] px-6 py-2 rounded-full"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 3:
        return { label: "High", color: "bg-red-50 text-red-600" };
      case 2:
        return { label: "Medium", color: "bg-orange-50 text-orange-600" };
      default:
        return { label: "Low", color: "bg-blue-50 text-blue-600" };
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return { label: "Pending", color: "bg-yellow-50 text-yellow-600" };
      case 1:
        return { label: "In Progress", color: "bg-blue-50 text-blue-600" };
      case 2:
        return { label: "Completed", color: "bg-green-50 text-green-600" };
      default:
        return { label: "Unknown", color: "bg-gray-50 text-gray-600" };
    }
  };

  const renderHeader = () => (
    <View
      className="bg-white border-b border-gray-100"
      style={{ paddingTop: insets.top }}
    >
      {/* Top Bar */}
      <View className="px-6 py-4 flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
        >
          <Ionicons name="arrow-back" size={24} color="#1A1C1E" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#1A1C1E]">
          Project Details
        </Text>
        <TouchableOpacity
          onPress={handleProjectActions}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
        >
          <Ionicons name="ellipsis-horizontal" size={20} color="#1A1C1E" />
        </TouchableOpacity>
      </View>

      {/* Title & Banner area */}
      <View className="px-6 pb-6">
        <View className="flex-row items-center mb-6">
          <View className="w-16 h-16 bg-purple-100 rounded-3xl items-center justify-center mr-4">
            <Ionicons name="briefcase" size={32} color="#8862F2" />
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-[#1A1C1E] mb-1 leading-tight">
              {project.name}
            </Text>
            <View className="flex-row items-center">
              <View
                className={`${getStatusLabel(project.status).color} px-2 py-0.5 rounded-md mr-2`}
              >
                <Text className="text-[10px] font-bold uppercase">
                  {getStatusLabel(project.status).label}
                </Text>
              </View>
              <View
                className={`${getPriorityLabel(project.priority).color} px-2 py-0.5 rounded-md`}
              >
                <Text className="text-[10px] font-bold uppercase">
                  {getPriorityLabel(project.priority).label} Priority
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Info Grid */}
        <View className="flex-row flex-wrap gap-3">
          <View className="bg-gray-50 p-3 rounded-2xl flex-1 min-w-[45%]">
            <Text className="text-gray-400 text-[10px] uppercase font-bold mb-1">
              Start Date
            </Text>
            <View className="flex-row items-center">
              <Ionicons
                name="calendar-outline"
                size={14}
                color="#6B7280"
                className="mr-1"
              />
              <Text className="text-[#1A1C1E] font-bold text-xs">
                {dayjs(project.startDate).format("DD MMM, YYYY")}
              </Text>
            </View>
          </View>
          <View className="bg-gray-50 p-3 rounded-2xl flex-1 min-w-[45%]">
            <Text className="text-gray-400 text-[10px] uppercase font-bold mb-1">
              End Date
            </Text>
            <View className="flex-row items-center">
              <Ionicons
                name="calendar"
                size={14}
                color="#EF4444"
                className="mr-1"
              />
              <Text className="text-[#1A1C1E] font-bold text-xs">
                {dayjs(project.endDate).format("DD MMM, YYYY")}
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Card */}
        <View className="mt-4 bg-purple-50/50 p-4 rounded-3xl border border-purple-100">
          <View className="flex-row justify-between mb-2 items-center">
            <View>
              <Text className="text-xs font-bold text-purple-600 uppercase">
                Current Progress
              </Text>
              <Text className="text-gray-500 text-[11px]">
                {Number(
                  Math.round(
                    (tasks.filter((t) => t.status === 4).length /
                      (tasks.length || 1)) *
                      100 *
                      100,
                  ) / 100,
                ).toFixed(2)}
                % Tasks Done
              </Text>
            </View>
            <Text className="text-2xl font-black text-[#8862F2]">
              {Number(project.progress).toFixed(2)}%
            </Text>
          </View>
          <View className="w-full h-3 bg-white rounded-full overflow-hidden border border-purple-100">
            <View
              className="h-full bg-[#8862F2]"
              style={{ width: `${project.progress}%` }}
            />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F8F9FE]">
      <FlatList
        ListHeaderComponent={
          <>
            {renderHeader()}
            {/* Description & Details Info */}
            <View className="px-6 py-4">
              <Text className="text-lg font-bold text-[#1A1C1E] mb-2">
                Description
              </Text>
              <Text className="text-gray-500 leading-6 mb-6">
                {project.description ||
                  "No description provided for this project."}
              </Text>

              {/* Extra Info Grid */}
              <View className="flex-row flex-wrap gap-4">
                <View className="flex-1 min-w-[45%]">
                  <Text className="text-gray-400 text-[10px] uppercase font-bold mb-2">
                    Department
                  </Text>
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-lg bg-orange-100 items-center justify-center mr-2">
                      <Ionicons name="business" size={16} color="#F59E0B" />
                    </View>
                    <Text className="text-[#1A1C1E] font-bold text-sm">
                      {project.department || "General"}
                    </Text>
                  </View>
                </View>
                <View className="flex-1 min-w-[45%]">
                  <Text className="text-gray-400 text-[10px] uppercase font-bold mb-2">
                    Revenue
                  </Text>
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-lg bg-green-100 items-center justify-center mr-2">
                      <Ionicons name="cash" size={16} color="#10B981" />
                    </View>
                    <Text className="text-[#1A1C1E] font-bold text-sm">
                      ${project.revenue?.toLocaleString() || "0"}
                    </Text>
                  </View>
                </View>
                <View className="w-full">
                  <Text className="text-gray-400 text-[10px] uppercase font-bold mb-2">
                    Manager
                  </Text>
                  <View className="flex-row items-center bg-white p-3 rounded-2xl border border-gray-100">
                    <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-3">
                      <Text className="text-[#8862F2] font-black">
                        {typeof project.manager === "object"
                          ? project.manager.name.charAt(0)
                          : "M"}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-[#1A1C1E] font-bold">
                        {typeof project.manager === "object"
                          ? project.manager.name
                          : "Unassigned"}
                      </Text>
                      <Text className="text-gray-400 text-xs">
                        {typeof project.manager === "object"
                          ? project.manager.email
                          : project.manager}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Team Members Section */}
            <View className="px-6 mb-8">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-[#1A1C1E]">
                  Team Members
                </Text>
                <Text className="text-purple-600 font-bold text-xs">
                  {Array.isArray(project.teamMembers)
                    ? project.teamMembers.length
                    : 0}{" "}
                  Total
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="-mx-2 px-2 flex-row"
              >
                {(Array.isArray(project.teamMembers)
                  ? project.teamMembers
                  : []
                ).map((member, idx) => (
                  <View key={idx} className="items-center mr-4">
                    <View className="w-14 h-14 rounded-full bg-gray-200 border-2 border-white shadow-sm items-center justify-center overflow-hidden mb-1">
                      <Text className="text-gray-600 font-bold">
                        {typeof member === "object"
                          ? member.name.charAt(0)
                          : "U"}
                      </Text>
                    </View>
                    <Text
                      className="text-[10px] font-medium text-center text-gray-500 w-14"
                      numberOfLines={1}
                    >
                      {typeof member === "object" ? member.name : "User"}
                    </Text>
                  </View>
                ))}
                {!Array.isArray(project.teamMembers) ||
                  (project.teamMembers.length === 0 && (
                    <Text className="text-gray-400 italic text-sm">
                      No team members assigned
                    </Text>
                  ))}
              </ScrollView>
            </View>

            {/* Expenses & Attachments if they exist */}
            {(project.expenses?.length > 0 ||
              project.attachments?.length > 0) && (
              <View className="px-6 mb-8">
                <View className="flex-row gap-4">
                  {project.expenses?.length > 0 && (
                    <View className="flex-1 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                      <Text className="text-gray-400 text-[10px] uppercase font-bold mb-2">
                        Total Expenses
                      </Text>
                      <Text className="text-xl font-bold text-red-500">
                        $
                        {project.expenses
                          .reduce((acc, curr) => acc + curr.cost, 0)
                          .toLocaleString()}
                      </Text>
                    </View>
                  )}
                  {project.attachments?.length > 0 && (
                    <View className="flex-1 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                      <Text className="text-gray-400 text-[10px] uppercase font-bold mb-2">
                        Attachments
                      </Text>
                      <View className="flex-row items-center">
                        <Ionicons
                          name="document-attach-outline"
                          size={20}
                          color="#6B7280"
                        />
                        <Text className="text-lg font-bold text-[#1A1C1E] ml-1">
                          {project.attachments.length}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            )}

            <View className="px-6 mb-4">
              <Text className="text-lg font-bold text-[#1A1C1E] mb-4">
                Project Tasks
              </Text>

              {/* Task Tabs */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row mb-6"
              >
                {["All", "In Progress", "Review", "Finish"].map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 rounded-full mr-3 border ${
                      activeTab === tab
                        ? "bg-[#8862F2] border-[#8862F2]"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <Text
                      className={`font-bold text-xs ${
                        activeTab === tab ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {tab === "Finish" ? "Done" : tab}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {filteredTasks.length === 0 && (
                <View className="bg-white p-8 rounded-3xl items-center border border-dashed border-gray-200">
                  <Ionicons name="list-outline" size={40} color="#D1D5DB" />
                  <Text className="text-gray-400 mt-2">
                    No tasks in this category
                  </Text>
                </View>
              )}
            </View>
          </>
        }
        data={filteredTasks}
        renderItem={({ item }) => (
          <View>
            <TaskItem item={item} />
            {isManager && (
              <View className="flex-row justify-end px-6 -mt-2 mb-4 gap-3">
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/create-task",
                      params: { taskId: item._id, mode: "edit" },
                    })
                  }
                  className="flex-row items-center bg-gray-100 px-3 py-1.5 rounded-full"
                >
                  <Ionicons name="create-outline" size={14} color="#4B5563" />
                  <Text className="text-gray-600 font-bold ml-1 text-[10px]">
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteTask(item._id)}
                  className="flex-row items-center bg-red-50 px-3 py-1.5 rounded-full"
                >
                  <Ionicons name="trash-outline" size={14} color="#EF4444" />
                  <Text className="text-red-500 font-bold ml-1 text-[10px]">
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#8862F2"
          />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Create Task Button */}
      {isManager && (
        <View className="absolute bottom-6 left-0 right-0 px-6">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: "/create-task",
                params: { projectId: id },
              })
            }
            className="w-full bg-[#8862F2] h-14 rounded-full flex-row items-center justify-center shadow-lg shadow-purple-200"
          >
            <Text className="text-white text-lg font-bold ml-2">
              Create New Task
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
