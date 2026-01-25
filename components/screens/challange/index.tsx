import { getProjects } from "@/services/project.service";
import { getTasks } from "@/services/task.service";
import { useAuthStore } from "@/stores/auth-store";
import { IProject } from "@/types/project";
import { TypeTask } from "@/types/task";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProjectItem } from "./ProjectItem";
import { TaskItem } from "./TaskItem";
import { TaskItemSkeleton } from "./TaskItemSkeleton";

const FilterModal = React.lazy(() => import("./FilterModal"));

export default function Challange() {
  const [activeTab, setActiveTab] = useState("All");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tasks, setTasks] = useState<TypeTask[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const isManager = user?.roleName === "MANAGER";

  const [filters, setFilters] = useState({
    priority: null as number | null,
    projectId: null as string | null,
    sortBy: "dueDate",
  });

  const [tempFilters, setTempFilters] = useState(filters);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);

    // Call API reload
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const uniqueProjectIds = useMemo(() => {
    return Array.from(new Set(tasks.map((t) => t?.projectId).filter(Boolean)));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (!filters) return [];
    let result = [...tasks];
    if (activeTab === "In Progress")
      result = result.filter((t) => t?.status === 2);
    else if (activeTab === "Review")
      result = result.filter((t) => t?.status === 3);
    else if (activeTab === "Finish")
      result = result.filter((t) => t?.status === 4);
    if (filters.priority !== null)
      result = result.filter((t) => t?.priority === filters.priority);
    if (filters.projectId)
      result = result.filter((t) => t?.projectId === filters.projectId);
    return result;
  }, [activeTab, filters, tasks]);

  const filteredProjects = useMemo(() => {
    let result = [...projects];
    if (activeTab === "In Progress")
      result = result.filter((p) => p?.status === 1);
    else if (activeTab === "Review")
      result = result.filter((p) => p?.status === 3);
    else if (activeTab === "Finish")
      result = result.filter((p) => p?.status === 2);
    return result;
  }, [activeTab, projects]);

  const handleApplyFilters = useCallback(() => {
    setFilters(tempFilters);
    setIsModalVisible(false);
  }, [tempFilters]);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const renderHeader = () => (
    <View>
      <View
        className="bg-[#8862F2] pb-8 px-6 rounded-b-[40px] mb-6"
        style={{ paddingTop: Math.max(insets.top, 20) }}
      >
        <Text className="text-white text-3xl font-bold">
          {isManager ? "Projects Insight" : "Challanges Awaiting"}
        </Text>
        <Text className="text-purple-100 text-sm mt-1">
          {isManager
            ? "Manage your team efficiently"
            : "Let's tackle your to do list"}
        </Text>
        <View className="flex-row justify-between mt-6">
          <View className="bg-white/10 p-4 rounded-3xl items-center flex-1 mx-1">
            <Text className="text-white text-2xl font-bold">
              {isManager ? projects.length : tasks.length}
            </Text>
            <Text className="text-purple-100 text-[10px]">
              {isManager ? "Total" : "To Do"}
            </Text>
          </View>
          <View className="bg-white/10 p-4 rounded-3xl items-center flex-1 mx-1">
            <Text className="text-white text-2xl font-bold">
              {isManager
                ? projects.filter((p) => p.status === 1).length
                : tasks.filter((t) => t.status === 2).length}
            </Text>
            <Text className="text-purple-100 text-[10px]">Active</Text>
          </View>
          <View className="bg-white/10 p-4 rounded-3xl items-center flex-1 mx-1">
            <Text className="text-white text-2xl font-bold">
              {isManager
                ? projects.filter((p) => p.status === 2).length
                : tasks.filter((t) => t.status === 4).length}
            </Text>
            <Text className="text-purple-100 text-[10px]">Done</Text>
          </View>
        </View>
      </View>

      {/* Tabs & Filter Icon */}
      <View className="flex-row px-4 mb-6 items-center">
        <View className="flex-row flex-1 bg-white p-1 rounded-full border border-gray-100 shadow-sm">
          {["All", "In Progress", "Review", "Finish"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-full items-center ${activeTab === tab ? "bg-[#8862F2]" : ""}`}
            >
              <Text
                className={`font-bold text-[13px] ${activeTab === tab ? "text-white" : "text-gray-400"}`}
              >
                {tab === "Finish" ? "Done" : tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          className={`ml-3 w-12 h-12 rounded-2xl items-center justify-center border ${filters.priority !== null ? "bg-[#8862F2] border-[#8862F2]" : "bg-white border-gray-200"}`}
        >
          <Ionicons
            name="options-outline"
            size={24}
            color={filters.priority !== null ? "white" : "#8862F2"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <FlatList
          data={[1, 2, 3, 4]}
          renderItem={() => <TaskItemSkeleton />}
          keyExtractor={(item) => item.toString()}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      );
    }

    if (isManager ? projects.length === 0 : tasks.length === 0) {
      return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {renderHeader()}
          <View className="flex-1 justify-center items-center pt-20">
            <Text className="text-gray-500">
              {isManager ? "No projects found" : "No tasks found"}
            </Text>
          </View>
        </ScrollView>
      );
    }

    return (
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={isManager ? fetchProjects : fetchTaskByMe}
            colors={["#8862F2", "#8862F2"]}
            tintColor="#8862F2"
          />
        }
        data={(isManager ? filteredProjects : filteredTasks) as any}
        keyExtractor={(item: any) => item?._id || Math.random().toString()}
        renderItem={({ item }: { item: any }) =>
          isManager ? (
            <ProjectItem item={item as IProject} />
          ) : (
            <TaskItem item={item as TypeTask} />
          )
        }
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    );
  };

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await getProjects({ manager: user?.id });
      if (!response.isError) {
        setProjects(response.data.result || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchTaskByMe = async () => {
    try {
      setIsLoading(true);
      const response = await getTasks({ assignedTo: user?.id });
      if (!response.isError) {
        setTasks(response.data.result || []);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isManager) {
      fetchProjects();
    } else {
      fetchTaskByMe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isManager]);

  return (
    <View className="flex-1 bg-[#F8F9FE]">
      {renderContent()}

      {/* <Pressable onPress={() => handlePress("6832717fc58badba71ee8214")} className="w-full">
            <Text>OK</Text>
          </Pressable> */}

      <FilterModal
        visible={isModalVisible}
        tempFilters={tempFilters}
        onClose={handleCloseModal}
        onApply={handleApplyFilters}
        onFilterChange={setTempFilters}
      />
    </View>
  );
}
