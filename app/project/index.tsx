// import { getProjects } from "@/services/project.service";
import { useAuthStore } from "@/stores/auth-store";
import { IProject } from "@/types/project";
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

const MOCK_PROJECTS: IProject[] = [
  {
    _id: "1",
    name: "Mobile App Redesign",
    description: "Revamping the user interface for better UX and performance.",
    attachments: [],
    department: "1",
    manager: {
      _id: "user1",
      name: "Alice Manager",
      email: "alice@example.com",
    },
    teamMembers: [
      { _id: "u1", name: "John Doe", email: "john@example.com" },
      { _id: "u2", name: "Jane Smith", email: "jane@example.com" },
      { _id: "u3", name: "Bob Johnson", email: "bob@example.com" },
      { _id: "u4", name: "Alice Brown", email: "alice@example.com" },
    ],
    tasks: ["t1", "t2", "t3"],
    expenses: [],
    revenue: 0,
    priority: 1,
    status: 1, // In Progress
    progress: 65,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-03-31"),
    actualEndDate: new Date(),
    isDeleted: false,
    createdAt: new Date("2023-12-20"),
    updatedAt: new Date("2024-01-20"),
    deletedAt: new Date(),
    createdBy: { _id: "admin", email: "admin@example.com" },
    updatedBy: { _id: "admin", email: "admin@example.com" },
    deletedBy: { _id: "", email: "" },
  },
  {
    _id: "2",
    name: "Backend Migration",
    description: "Migrating legacy services to a microservices architecture.",
    attachments: [],
    department: "1",
    manager: {
      _id: "user1",
      name: "Alice Manager",
      email: "alice@example.com",
    },
    teamMembers: [
      { _id: "u5", name: "Charlie Lee", email: "charlie@example.com" },
      { _id: "u6", name: "David Kim", email: "david@example.com" },
    ],
    tasks: ["t4", "t5"],
    expenses: [],
    revenue: 0,
    priority: 2,
    status: 0, // Pending
    progress: 10,
    startDate: new Date("2024-04-01"),
    endDate: new Date("2024-06-30"),
    actualEndDate: new Date(),
    isDeleted: false,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
    deletedAt: new Date(),
    createdBy: { _id: "admin", email: "admin@example.com" },
    updatedBy: { _id: "admin", email: "admin@example.com" },
    deletedBy: { _id: "", email: "" },
  },
  {
    _id: "3",
    name: "Q1 Marketing Campaign",
    description: "Launch campaign for the new product line.",
    attachments: [],
    department: "3",
    manager: { _id: "user8", name: "Sarah Connor", email: "sarah@example.com" },
    teamMembers: [{ _id: "u7", name: "Eva Green", email: "eva@example.com" }],
    tasks: ["t6"],
    expenses: [],
    revenue: 50000,
    priority: 1,
    status: 2, // Completed
    progress: 100,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-03-31"),
    actualEndDate: new Date("2024-03-25"),
    isDeleted: false,
    createdAt: new Date("2023-11-15"),
    updatedAt: new Date("2024-03-25"),
    deletedAt: new Date(),
    createdBy: { _id: "admin", email: "admin@example.com" },
    updatedBy: { _id: "admin", email: "admin@example.com" },
    deletedBy: { _id: "", email: "" },
  },
];

export default function ProjectScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      // const res = await getProjects({ teamMembers: user?.id });
      // if (!res.isError) {
      //   setProjects(res.data.result);
      // }
      setTimeout(() => {
        setProjects(MOCK_PROJECTS);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return "text-yellow-600 bg-yellow-50"; // Pending
      case 1:
        return "text-blue-600 bg-blue-50"; // In Progress
      case 2:
        return "text-green-600 bg-green-50"; // Completed
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "In Progress";
      case 2:
        return "Completed";
      default:
        return "Unknown";
    }
  };

  const renderItem = ({ item }: { item: IProject }) => (
    <View className="bg-white p-4 rounded-2xl mb-3 border border-gray-100 shadow-sm">
      <View className="flex-row justify-between items-start mb-2">
        <View
          className={`px-3 py-1 rounded-full ${getStatusColor(item.status).split(" ")[1]}`}
        >
          <Text
            className={`text-xs font-bold uppercase ${getStatusColor(item.status).split(" ")[0]}`}
          >
            {getStatusText(item.status)}
          </Text>
        </View>
        <Text className="text-gray-400 text-xs">
          Due: {dayjs(item.endDate).format("MMM DD, YYYY")}
        </Text>
      </View>

      <Text className="text-gray-900 font-bold text-lg mb-1">{item.name}</Text>
      <Text
        className="text-gray-500 text-sm line-clamp-2 mb-3"
        numberOfLines={2}
      >
        {item.description || "No description available."}
      </Text>

      {/* Progress Bar */}
      <View className="mb-3">
        <View className="flex-row justify-between mb-1">
          <Text className="text-xs text-gray-500">Progress</Text>
          <Text className="text-xs font-medium text-gray-700">
            {item.progress}%
          </Text>
        </View>
        <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <View
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${item.progress}%` }}
          />
        </View>
      </View>

      {/* Stats */}
      <View className="flex-row items-center border-t border-gray-50 pt-3 justify-between">
        <View className="flex-row items-center">
          <Ionicons name="list-outline" size={16} color="#6B7280" />
          <Text className="text-gray-600 text-xs ml-1">
            {item.tasks?.length || 0} Tasks
          </Text>
        </View>

        <View className="flex-row items-center">
          <View className="flex-row -space-x-2">
            {/* Creating dummy avatars visualization */}
            {(Array.isArray(item.teamMembers) ? item.teamMembers : [])
              .slice(0, 3)
              .map((_, i) => (
                <View
                  key={i}
                  className="w-6 h-6 rounded-full bg-gray-200 border border-white items-center justify-center"
                >
                  <Text className="text-[8px] text-gray-500">M</Text>
                </View>
              ))}
            {(Array.isArray(item.teamMembers) ? item.teamMembers : []).length >
              3 && (
              <View className="w-6 h-6 rounded-full bg-gray-100 border border-white items-center justify-center">
                <Text className="text-[8px] text-gray-500">
                  +
                  {(Array.isArray(item.teamMembers) ? item.teamMembers : [])
                    .length - 3}
                </Text>
              </View>
            )}
          </View>
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
        <Text className="text-xl font-bold text-gray-900">Projects</Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-4 pt-4">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-400">Loading projects...</Text>
          </View>
        ) : projects.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="briefcase-outline" size={40} color="#9CA3AF" />
            </View>
            <Text className="text-gray-500 font-medium">No projects found</Text>
          </View>
        ) : (
          <FlatList
            data={projects}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => {
                  setIsLoading(true);
                  fetchProjects();
                }}
                tintColor="#3B82F6"
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
