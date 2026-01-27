import { getProjects } from "@/services/project.service";
import { getTasks } from "@/services/task.service";
import { useAuthStore } from "@/stores/auth-store";
import { IProject } from "@/types/project";
import { TypeTask } from "@/types/task";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CalendarScreenIndex() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const router = useRouter();
  const [tasks, setTasks] = useState<TypeTask[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const [viewMode, setViewMode] = useState<"month">("month");

  const ALLOWED_ROLES = ["MANAGER", "ADMIN"];

  const isManager = ALLOWED_ROLES.some((r) =>
    user?.roleName?.toUpperCase().startsWith(r),
  );

  const fetchData = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      if (isManager) {
        // 1. Lấy projects
        const projectRes = await getProjects({ manager: user.id });
        const projectList: IProject[] =
          projectRes?.data?.result || projectRes?.data?.projects || [];

        setProjects(projectList);

        // 2. Lấy tasks theo từng projectId
        if (projectList.length > 0) {
          const taskPromises = projectList.map((project) =>
            getTasks({ projectId: project._id }),
          );

          const taskResults = await Promise.all(taskPromises);

          const taskList: TypeTask[] = taskResults
            .map((res) => res?.data?.result || [])
            .flat();

          setTasks(taskList);
        } else {
          setTasks([]);
        }
      } else {
        const taskRes = await getTasks({ assignedTo: user.id });
        setTasks(taskRes?.data?.result || []);
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeViewMode = useCallback((mode: "month") => {
    setViewMode(mode);
  }, []);

  const handleNavigate = ({ type, id }: { type: string; id: string }) => {
    if (isManager) {
      router.push(
        type === "task" ? `/task-details/${id}` : `/project-details/${id}`,
      );
    } else {
      router.push(`/task-details/${id}`);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isManager]);

  const markedDates = useMemo(() => {
    const marks: any = {};

    const addMark = (date: string, dot: any) => {
      if (!marks[date]) {
        marks[date] = { dots: [] };
      }
      if (!marks[date].dots.find((d: any) => d.key === dot.key)) {
        marks[date].dots.push(dot);
      }
    };

    tasks.forEach((task) => {
      if (task.startDate) {
        addMark(dayjs(task.startDate).format("YYYY-MM-DD"), {
          key: `taskStart-${task._id}`,
          color: "#3B82F6",
        });
      }
      if (task.dueDate) {
        addMark(dayjs(task.dueDate).format("YYYY-MM-DD"), {
          key: `taskEnd-${task._id}`,
          color: "#F59E0B",
        });
      }
    });

    if (isManager) {
      projects.forEach((project) => {
        if (project.startDate) {
          addMark(dayjs(project.startDate).format("YYYY-MM-DD"), {
            key: `projStart-${project._id}`,
            color: "#10B981",
          });
        }
        if (project.endDate) {
          addMark(dayjs(project.endDate).format("YYYY-MM-DD"), {
            key: `projEnd-${project._id}`,
            color: "#EF4444",
          });
        }
      });
    }

    if (marks[selectedDate]) {
      marks[selectedDate].selected = true;
      marks[selectedDate].selectedColor = "#8862F2";
    } else {
      marks[selectedDate] = { selected: true, selectedColor: "#8862F2" };
    }

    return marks;
  }, [tasks, projects, selectedDate, isManager]);

  const itemsOnSelectedDate = useMemo(() => {
    const dayItems: any[] = [];

    tasks.forEach((task) => {
      const start = dayjs(task.startDate).format("YYYY-MM-DD");
      const end = dayjs(task.dueDate).format("YYYY-MM-DD");
      if (start === selectedDate || end === selectedDate) {
        dayItems.push({
          ...task,
          type: "task",
          isStart: start === selectedDate,
        });
      }
    });

    if (isManager) {
      projects.forEach((project) => {
        const start = dayjs(project.startDate).format("YYYY-MM-DD");
        const end = dayjs(project.endDate).format("YYYY-MM-DD");
        if (start === selectedDate || end === selectedDate) {
          dayItems.push({
            ...project,
            type: "project",
            isStart: start === selectedDate,
          });
        }
      });
    }

    return dayItems;
  }, [tasks, projects, selectedDate, isManager]);

  return (
    <View className="flex-1 bg-[#F8F9FE]">
      {/* Header */}
      <View
        className="px-6 py-4 bg-white border-b border-gray-100 flex-row justify-between items-center"
        style={{ paddingTop: insets.top }}
      >
        <Text className="text-xl font-bold text-[#1A1C1E]">
          Activity Calendar
        </Text>

        {/* View Toggle Tabs */}
        <View className="flex-row bg-gray-100 p-1 rounded-2xl">
          <Pressable
            onPress={() => handleChangeViewMode("month")}
            className={`px-4 py-1.5 rounded-xl ${viewMode === "month" ? "bg-white shadow-sm" : ""}`}
          >
            <Text
              className={`text-xs font-bold ${viewMode === "month" ? "text-purple-600" : "text-gray-400"}`}
            >
              Month
            </Text>
          </Pressable>
          {/* <Pressable
            onPress={() => handleChangeViewMode("week")}
            className={`px-4 py-1.5 rounded-xl ${viewMode === "week" ? "bg-white shadow-sm" : ""}`}
          >
            <Text
              className={`text-xs font-bold ${viewMode === "week" ? "text-purple-600" : "text-gray-400"}`}
            >
              Week
            </Text>
          </Pressable> */}
        </View>
      </View>
      {/* <CalendarProvider
        date={selectedDate}
        onDateChanged={(date) => setSelectedDate(date)}
      > */}
      <View className="bg-white pb-2 shadow-sm">
        {viewMode === "month" ? (
          <Calendar
            markingType={"multi-dot"}
            markedDates={markedDates}
            current={selectedDate}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            theme={{
              selectedDayBackgroundColor: "#8862F2",
              todayTextColor: "#8862F2",
              arrowColor: "#8862F2",
              monthTextColor: "#1A1C1E",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "bold",
            }}
          />
        ) : (
          <Text>Week</Text>
          // <View className="flex-row justify-between px-2 py-4">
          //   {Array.from({ length: 7 }, (_, i) => {
          //     const date = dayjs(selectedDate).startOf("week").add(i, "day");
          //     const dateStr = date.format("YYYY-MM-DD");
          //     const isSelected = dateStr === selectedDate;
          //     const isToday = dateStr === dayjs().format("YYYY-MM-DD");
          //     const marks = markedDates[dateStr];

          //     return (
          //       <TouchableOpacity
          //         key={i}
          //         onPress={() => setSelectedDate(dateStr)}
          //         className={`flex-1 items-center py-3 mx-1 rounded-2xl ${
          //           isSelected ? "bg-[#8862F2]" : "bg-transparent"
          //         }`}
          //       >
          //         <Text
          //           className={`text-[10px] font-bold mb-1 ${
          //             isSelected ? "text-white/70" : "text-gray-400"
          //           }`}
          //         >
          //           {date.format("ddd").toUpperCase()}
          //         </Text>
          //         <Text
          //           className={`text-base font-black ${
          //             isSelected
          //               ? "text-white"
          //               : isToday
          //                 ? "text-[#8862F2]"
          //                 : "text-[#1A1C1E]"
          //           }`}
          //         >
          //           {date.date()}
          //         </Text>

          //         {/* Dots Container */}
          //         <View className="flex-row mt-1 h-1.5 gap-0.5">
          //           {marks?.dots?.map((dot: any, dotIdx: number) => (
          //             <View
          //               key={dotIdx}
          //               className="w-1 h-1 rounded-full"
          //               style={{
          //                 backgroundColor: isSelected ? "white" : dot.color,
          //               }}
          //             />
          //           ))}
          //         </View>
          //       </TouchableOpacity>
          //     );
          //   })}
          // </View>
        )}
      </View>

      <View className="flex-1 px-6 pt-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-[#1A1C1E]">
            {dayjs(selectedDate).format("DD MMMM, YYYY")}
          </Text>
          <View className="flex-row gap-2">
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-[#3B82F6] mr-1" />
              <Text className="text-[10px] text-gray-400">Task</Text>
            </View>
            {isManager && (
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-[#10B981] mr-1" />
                <Text className="text-[10px] text-gray-400">Project</Text>
              </View>
            )}
          </View>
        </View>

        {isLoading ? (
          <ActivityIndicator color="#8862F2" size="large" className="mt-10" />
        ) : itemsOnSelectedDate.length === 0 ? (
          <View className="flex-1 items-center justify-center -mt-20">
            <Ionicons name="calendar-outline" size={60} color="#E5E7EB" />
            <Text className="text-gray-400 mt-4 font-medium">
              No activities for this day
            </Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {itemsOnSelectedDate.map((item, idx) => (
              <TouchableOpacity
                key={item._id}
                onPress={() =>
                  handleNavigate({ id: item._id, type: item.type })
                }
                className="bg-white p-4 rounded-3xl mb-3 border border-gray-50 flex-row items-center"
              >
                <View
                  className={`w-12 h-12 rounded-2xl items-center justify-center mr-4 ${item.type === "task" ? "bg-blue-50" : "bg-green-50"}`}
                >
                  <Ionicons
                    name={item.type === "task" ? "list" : "briefcase"}
                    size={24}
                    color={item.type === "task" ? "#3B82F6" : "#10B981"}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-[#1A1C1E] font-bold text-base"
                    numberOfLines={1}
                  >
                    {item.type === "task" ? item.title : item.name}
                  </Text>
                  z``
                  <Text className="text-gray-400 text-xs">
                    {item.isStart ? "Starts today" : "Due today"} •{" "}
                    {item.type === "task" ? "Task" : "Project"}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
            <View style={{ height: 40 }} />
          </ScrollView>
        )}
      </View>
      {/* </CalendarProvider> */}
    </View>
  );
}
