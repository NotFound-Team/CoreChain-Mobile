/* eslint-disable no-unused-expressions */
import { getProjects } from "@/services/project.service";
import { getTasks } from "@/services/task.service";
import { useAuthStore } from "@/stores/auth-store";
import { IProject } from "@/types/project";
import { TypeTask } from "@/types/task";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";

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
const PAGE_SIZE = 10;
export default function Challange() {
  const [activeTab, setActiveTab] = useState("All");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tasks, setTasks] = useState<TypeTask[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const isManager = user?.roleName === "MANAGER";

  const initialFilters = {
    priority: null as number | null,
    projectId: null as string | null,
    sortBy: "dueDate" as string,
    dateType: "dueDate" as "createdAt" | "startDate" | "dueDate",
    startDate: null as Date | null,
    endDate: null as Date | null,
  };

  const [filters, setFilters] = useState(initialFilters);

  const [tempFilters, setTempFilters] = useState(filters);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setPage(1);
    setHasMore(true);
  }, []);

  const getStatusFilter = () => {
    switch (activeTab) {
      case "In Progress":
        return 1;
      case "Review":
        return 2;
      case "Finish":
        return 3;
      default:
        return undefined;
    }
  };

  const getFilterParams = () => {
    const params: any = {};

    const status = getStatusFilter()?.toString();
    if (status) params.status = status;

    if (filters.priority !== null) {
      params.priority = filters.priority;
    }

    if (filters.projectId) {
      params.projectId = filters.projectId;
    }

    if (filters.startDate) {
      params[`${filters.dateType}`] = filters.startDate;
    }
    if (filters.endDate) {
      params[`${filters.dateType}`] = filters.endDate;
    }

    if (filters.sortBy) {
      params.sort = filters.sortBy;
    }

    return params;
  };

  const handleApplyFilters = useCallback(() => {
    setFilters(tempFilters);
    setIsModalVisible(false);
  }, [tempFilters]);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const fetchProjects = async (loadMore = false) => {
    try {
      if (loadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const res = await getProjects({
        manager: user?.id,
        current: page,
        pageSize: PAGE_SIZE,
        ...getFilterParams(),
      });

      if (!res.isError) {
        const { result, meta } = res.data;

        setProjects((prev) => (loadMore ? [...prev, ...result] : result));

        setHasMore(meta?.current < meta?.pages);
      }
    } catch (e) {
      console.error("Fetch project error:", e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  const fetchTaskByMe = async (loadMore = false) => {
    try {
      if (loadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const res = await getTasks({
        assignedTo: user?.id,
        current: page,
        pageSize: PAGE_SIZE,
        ...getFilterParams(),
      });

      if (!res.isError) {
        const { result, meta } = res.data;

        setTasks((prev) => (loadMore ? [...prev, ...result] : result));

        setHasMore(meta?.current < meta?.pages);
      }
    } catch (e) {
      console.error("Fetch task error:", e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setTasks([]);
    setProjects([]);
  }, [user?.id, isManager, activeTab, filters]);

  useEffect(() => {
    if (isManager) {
      fetchProjects(page > 1);
    } else {
      fetchTaskByMe(page > 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isManager, activeTab, filters, page]);

  const handleLoadMore = () => {
    if (isLoading || isLoadingMore || !hasMore) return;
    setPage((prev) => prev + 1);
  };

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
                : tasks.filter((t) => t.status === 1).length}
            </Text>
            <Text className="text-purple-100 text-[10px]">Active</Text>
          </View>
          <View className="bg-white/10 p-4 rounded-3xl items-center flex-1 mx-1">
            <Text className="text-white text-2xl font-bold">
              {isManager
                ? projects.filter((p) => p.status === 3).length
                : tasks.filter((t) => t.status === 3).length}
            </Text>
            <Text className="text-purple-100 text-[10px]">Done</Text>
          </View>
        </View>
      </View>

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
    if (isLoading && page === 1) {
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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={["#8862F2", "#8862F2"]}
              tintColor="#8862F2"
            />
          }
        >
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
            onRefresh={onRefresh}
            colors={["#8862F2", "#8862F2"]}
            tintColor="#8862F2"
          />
        }
        data={(isManager ? projects : tasks) as any}
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
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={isLoadingMore ? <TaskItemSkeleton /> : null}
      />
    );
  };

  return (
    <View className="flex-1 bg-[#F8F9FE]">
      {renderContent()}

      <FilterModal
        visible={isModalVisible}
        tempFilters={tempFilters as any}
        onClose={handleCloseModal}
        onApply={handleApplyFilters}
        onFilterChange={setTempFilters as any}
        onClear={() => setTempFilters(initialFilters)}
      />
    </View>
  );
}
