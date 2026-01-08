import { getTasks } from "@/services/task.service";
import { useAuthStore } from "@/stores/auth-store";
import { TypeTask } from "@/types/task";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TaskItem } from "./TaskItem";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Challange() {
  const [activeTab, setActiveTab] = useState("All");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tasks, setTasks] = useState<TypeTask[]>([]);

  const { user } = useAuthStore();

  const [filters, setFilters] = useState({
    priority: null as number | null,
    projectId: null as string | null,
    sortBy: "dueDate",
  });

  const [tempFilters, setTempFilters] = useState(filters);

  const uniqueProjectIds = useMemo(() => {
    return Array.from(new Set(tasks.map((t) => t?.projectId).filter(Boolean)));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (!filters) return [];

    let result = [...tasks];

    if (activeTab === "In Progress")
      result = result.filter((t) => t?.status === 2);
    else if (activeTab === "Finish")
      result = result.filter((t) => t?.status === 4);

    if (filters.priority !== null) {
      result = result.filter((t) => t?.priority === filters.priority);
    }

    if (filters.projectId) {
      result = result.filter((t) => t?.projectId === filters.projectId);
    }

    result.sort((a, b) => {
      const field = filters.sortBy as keyof typeof a;
      const valA = a?.[field] ? new Date(a[field] as string).getTime() : 0;
      const valB = b?.[field] ? new Date(b[field] as string).getTime() : 0;
      return valA - valB;
    });

    return result;
  }, [activeTab, filters, tasks]);

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setIsModalVisible(false);
  };

  const renderHeader = () => (
    <View>
      <View className="bg-[#8862F2] pt-12 pb-8 px-6 rounded-b-[40px] mb-6">
        <Text className="text-white text-3xl font-bold">
          Challanges Awaiting
        </Text>
        <Text className="text-purple-100 text-sm mt-1">
          Let&apos;s tackle your to do list
        </Text>
        <View className="flex-row justify-between mt-6">
          <View className="bg-white/10 p-4 rounded-3xl items-center flex-1 mx-1">
            <Text className="text-white text-2xl font-bold">5</Text>
            <Text className="text-purple-100 text-[10px]">To Do</Text>
          </View>
          <View className="bg-white/10 p-4 rounded-3xl items-center flex-1 mx-1">
            <Text className="text-white text-2xl font-bold">2</Text>
            <Text className="text-purple-100 text-[10px]">In Progress</Text>
          </View>
          <View className="bg-white/10 p-4 rounded-3xl items-center flex-1 mx-1">
            <Text className="text-white text-2xl font-bold">1</Text>
            <Text className="text-purple-100 text-[10px]">Done</Text>
          </View>
        </View>
      </View>

      {/* Tabs & Filter Icon */}
      <View className="flex-row px-4 mb-6 items-center">
        <View className="flex-row flex-1 bg-white p-1 rounded-full border border-gray-100 shadow-sm">
          {["All", "In Progress", "Finish"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-full items-center ${activeTab === tab ? "bg-[#8862F2]" : ""}`}
            >
              <Text
                className={`font-bold text-[13px] ${activeTab === tab ? "text-white" : "text-gray-400"}`}
              >
                {tab}
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

  const fetchTaskByMe = async () => {
    try {
      console.log(user?.id);
      const response = await getTasks({ assignedTo: user?.id });
      if (!response.isError) {
        setTasks(response.data.result);
      }
      console.log(response);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTaskByMe();
  }, [user?.id]);

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FE]">
      {tasks.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">No tasks found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item?._id || Math.random().toString()}
          renderItem={({ item }) => <TaskItem item={item} />}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* <Pressable onPress={() => handlePress("6832717fc58badba71ee8214")} className="w-full">
            <Text>OK</Text>
          </Pressable> */}

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/40">
          <View
            className="bg-white rounded-t-[40px] p-6"
            style={{ height: SCREEN_HEIGHT * 0.7 }}
          >
            <View className="w-10 h-1 bg-gray-200 rounded-full self-center mb-6" />
            <Text className="text-xl font-bold mb-6">Filter Settings</Text>

            <ScrollView>
              {/* Filter Priority */}
              <Text className="text-gray-400 font-bold text-xs mb-3 uppercase">
                Priority
              </Text>
              <View className="flex-row mb-6">
                {[null, 1, 2, 3].map((p) => (
                  <TouchableOpacity
                    key={String(p)}
                    onPress={() =>
                      setTempFilters({ ...tempFilters, priority: p })
                    }
                    className={`mr-2 px-5 py-2 rounded-full border ${tempFilters.priority === p ? "bg-[#8862F2] border-[#8862F2]" : "border-gray-200"}`}
                  >
                    <Text
                      className={
                        tempFilters.priority === p
                          ? "text-white"
                          : "text-gray-500"
                      }
                    >
                      {p === null
                        ? "All"
                        : p === 3
                          ? "High"
                          : p === 2
                            ? "Med"
                            : "Low"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-gray-400 font-bold text-xs mb-3 uppercase">
                Sort By
              </Text>
              <View className="flex-row flex-wrap mb-6">
                {["dueDate", "startDate", "createdAt"].map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() =>
                      setTempFilters({ ...tempFilters, sortBy: s })
                    }
                    className={`mr-2 mb-2 px-4 py-2 rounded-xl border ${tempFilters.sortBy === s ? "bg-[#F3EFff] border-[#8862F2]" : "border-gray-100"}`}
                  >
                    <Text
                      className={
                        tempFilters.sortBy === s
                          ? "text-[#8862F2] font-bold"
                          : "text-gray-500"
                      }
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                className="flex-1 bg-gray-100 h-14 rounded-2xl items-center justify-center"
              >
                <Text className="text-gray-500 font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApplyFilters}
                className="flex-[2] bg-[#8862F2] h-14 rounded-2xl items-center justify-center"
              >
                <Text className="text-white font-bold">Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
