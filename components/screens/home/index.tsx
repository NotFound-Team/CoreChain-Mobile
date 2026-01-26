import { useSocket } from "@/hooks/useSocket";
import { getUnreadCount } from "@/services/conversation.service";
import { getMeetings, joinMeeting, Meeting } from "@/services/meeting.service";
import { getTasks } from "@/services/task.service";
import { useAuthStore } from "@/stores/auth-store";
import { TypeTask } from "@/types/task";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { Image } from "expo-image";
import { Href, Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tasks, setTasks] = useState<TypeTask[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { onMessage, offMessage } = useSocket();

  const fetchUnreadCount = async () => {
    const res = await getUnreadCount();
    if (!res.isError && res.data) {
      setUnreadCount(res.data.total_unread_count);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    const handleNewMessage = (data: any) => {
      // Refetch unread count when a new message or mark_as_read event arrives
      fetchUnreadCount();
    };

    onMessage(handleNewMessage);
    return () => offMessage(handleNewMessage);
  }, [onMessage, offMessage]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchUnreadCount();
    fetchHomeData();
  };

  const handleNavigate = (href: Href) => {
    router.push(href);
  };

  const handleJoinMeeting = async (roomName: string) => {
    try {
      const res = await joinMeeting(roomName);
      if (!res.isError && res.data) {
        router.push({
          pathname: "/video-meeting",
          params: {
            token: res.data.token,
            url: res.data.server_url,
            roomName: res.data.room_name,
          },
        });
      }
    } catch (error) {
      console.error("Error joining meeting:", error);
    }
  };

  const fetchHomeData = async () => {
    try {
      setIsRefreshing(true);

      const [tasksRes, meetingsRes] = await Promise.all([
        getTasks({
          startDate: dayjs().startOf("day").toISOString(),
          assignedTo: user?.id,
          sort: "startDate",
          pageSize: 3,
        }),
        getMeetings(),
      ]);

      // Handle tasks
      if (!tasksRes.isError) {
        setTasks(tasksRes.data?.result || []);
      }

      // Handle meetings
      if (!meetingsRes.isError && meetingsRes.data) {
        const todayMeetings = meetingsRes.data.filter((m: Meeting) =>
          dayjs(m.start_time).isSame(dayjs(), "day")
        );
        setMeetings(todayMeetings);
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View className="flex-1 bg-[#F8F9FE]">
      <View
        className="bg-white border-b border-gray-200"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center justify-between px-5 pb-4">
          <View className="flex-row items-center">
            <Link href={"/profile"}>
              <Image
                source={{
                  uri: `${user?.avatar ?? "https://i.pravatar.cc/150?u=tonald"}`,
                }}
                style={{ width: 48, height: 48, borderRadius: 24 }}
                className="bg-pink-200"
              />
            </Link>
            <View className="ml-3">
              <View className="flex-row items-center">
                <Text className="text-lg font-bold text-[#1A1C1E]">
                  {user?.name || "User Name"}
                </Text>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color="#8862F2"
                  style={{ marginLeft: 4 }}
                />
              </View>
              <Text className="text-xs text-[#8862F2] font-medium">
                {user?.positionName}
              </Text>
            </View>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity
              className="p-2 bg-white rounded-full shadow-sm"
              onPress={() => handleNavigate("/meeting")}
            >
              <Ionicons name="videocam-outline" size={20} color="#5F6368" />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2 bg-white rounded-full shadow-sm relative"
              onPress={() => handleNavigate("/messages")}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={20}
                color="#5F6368"
              />
              {unreadCount > 0 && (
                <View className="absolute top-0 -right-[2px] bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1 border-2 border-white">
                  <Text className="text-white text-[8px] font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2 bg-white rounded-full shadow-sm"
              onPress={() => handleNavigate("/notifications")}
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#5F6368"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={["#8862F2", "#8862F2"]}
            tintColor="#8862F2"
          />
        }
      >
        {/* Purple Summary Card */}
        <View className="mx-5 mt-5 bg-[#8862F2] border border-gray-100 rounded-[12px] py-7 px-4 flex-row justify-between items-center overflow-hidden">
          <View>
            <Text className="text-white text-xl font-bold">
              My Work Summary
            </Text>
            <Text className="text-white/80 mt-1">
              Today task & presence activity
            </Text>
          </View>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/2554/2554304.png",
            }}
            className="w-20 h-20 opacity-90"
            contentFit="contain"
          />
        </View>

        {/* Shortcuts */}
        <View className="flex-row justify-between px-5 mt-5 gap-2">
          <TouchableOpacity
            className="flex-1 bg-white py-4 rounded-xl border border-gray-100 shadow-sm items-center justify-center"
            onPress={() => handleNavigate("/department" as Href)}
          >
            <Ionicons name="business-outline" size={20} color="#4F46E5" />
            <Text className="font-bold text-gray-700 text-xs mt-1">
              Departments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-white py-4 rounded-xl border border-gray-100 shadow-sm items-center justify-center"
            onPress={() => handleNavigate("/project" as Href)}
          >
            <Ionicons name="briefcase-outline" size={20} color="#3B82F6" />
            <Text className="font-bold text-gray-700 text-xs mt-1">
              Projects
            </Text>
          </TouchableOpacity>
        </View>

        {/* Today Meeting Section */}
        <View className="mt-6 px-5">
          <View className="bg-white rounded-[8px] px-4 py-3 border border-gray-100">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Text className="text-lg font-bold text-[#1A1C1E]">
                  Today Meeting
                </Text>
                <View className="ml-2 bg-[#E8E1FF] px-2 py-0.5 rounded-md">
                  <Text className="text-[#8862F2] font-bold text-xs">
                    {meetings.length}
                  </Text>
                </View>
              </View>
              {meetings.length > 2 && (
                <TouchableOpacity onPress={() => handleNavigate("/meeting")}>
                  <Text className="text-[#8862F2] text-xs font-bold">
                    See More
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <Text className="text-gray-400 -mt-3 mb-4 text-sm">
              Your schedule for the day
            </Text>

            {meetings.length > 0 ? (
              meetings.slice(0, 2).map((item) => (
                <View
                  key={item.id}
                  className="bg-[#F9FAFB] border border-gray-100 rounded-2xl p-4 mb-3 flex-row items-center justify-between shadow-sm"
                >
                  <View className="flex-row items-center flex-1">
                    <View className="bg-[#8862F2] p-2 rounded-full mr-3">
                      <Ionicons name="videocam" size={20} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-[#1A1C1E] text-[15px]">
                        {item.title}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <Ionicons
                          name="time-outline"
                          size={14}
                          color="#9AA0A6"
                        />
                        <Text className="text-gray-400 text-xs ml-1">
                          {item.start_time
                            ? dayjs(item.start_time).format("hh:mm A")
                            : "N/A"}
                          {item.end_time
                            ? ` - ${dayjs(item.end_time).format("hh:mm A")}`
                            : ""}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    className="bg-[#8862F2] px-4 py-2 rounded-full"
                    onPress={() => handleJoinMeeting(item.room_name)}
                  >
                    <Text className="text-white font-medium text-xs">
                      Join Meet
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View className="items-center justify-center py-5">
                <Text className="text-gray-400">No meetings today</Text>
              </View>
            )}
          </View>
        </View>

        {/* Today Task Section */}
        <View className="mt-4 px-5 ">
          <View className="bg-white rounded-[8px] px-4 py-3 border border-gray-100">
            <View className="flex-row items-center mb-1">
              <Text className="text-lg font-bold text-[#1A1C1E]">
                Today Task
              </Text>
              <View className="ml-2 bg-[#E8E1FF] px-2 py-0.5 rounded-md">
                <Text className="text-[#8862F2] font-bold text-xs">
                  {tasks.length}
                </Text>
              </View>
            </View>
            <Text className="text-gray-400 mb-4 text-sm">
              The tasks assigned to you for today
            </Text>

            {tasks.length > 0 ? (
              <>
                {tasks.map((task) => (
                  <TouchableOpacity
                    key={task._id}
                    className="bg-[#F9FAFB] border border-gray-100 rounded-2xl p-4 shadow-sm mb-3"
                    onPress={() =>
                      handleNavigate(`/task-details/${task._id}` as Href)
                    }
                  >
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center">
                        <View className="bg-[#8862F2] p-2 rounded-full mr-3">
                          <Ionicons name="flash" size={18} color="white" />
                        </View>
                        <Text className="font-bold text-[#1A1C1E] text-md">
                          {task.title}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row gap-2 mb-4">
                      <View className="bg-gray-100 px-3 py-1 rounded-full flex-row items-center">
                        <Ionicons name="ellipse" size={8} color="#9AA0A6" />
                        <Text className="text-gray-500 text-xs ml-1">
                          In Progress
                        </Text>
                      </View>
                      <View className="bg-red-100 px-3 py-1 rounded-full flex-row items-center">
                        <Ionicons name="flag" size={12} color="#FF5A5F" />
                        <Text className="text-[#FF5A5F] text-xs ml-1 font-bold">
                          {task.priority === 1
                            ? "High"
                            : task.priority === 2
                              ? "Medium"
                              : "Low"}
                        </Text>
                      </View>
                    </View>

                    {/* Progress Bar (Static for now as API doesn't seem to return progress percentage directly) */}
                    <View className="h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
                      <View className="h-full bg-[#8862F2] w-[80%]" />
                    </View>

                    <View className="flex-row justify-between items-center">
                      <View className="flex-row -space-x-2">
                        {/* Avatar placeholder - ideally we map assigned users here */}
                        <View className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 items-center justify-center">
                          <Text className="text-[10px] font-bold text-blue-500">
                            {task.assignedTo
                              ? task.assignedTo.slice(0, 2).toUpperCase()
                              : "NA"}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row gap-3">
                        <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-lg">
                          <Ionicons
                            name="calendar-outline"
                            size={14}
                            color="#9AA0A6"
                          />
                          <Text className="text-gray-500 text-[10px] ml-1">
                            {dayjs(task.dueDate).format("DD MMM")}
                          </Text>
                        </View>
                        <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-lg">
                          <Ionicons
                            name="chatbox-outline"
                            size={14}
                            color="#9AA0A6"
                          />
                          <Text className="text-gray-500 text-[10px] ml-1">
                            {/* Comments count placeholder */}0
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => handleNavigate("/challange" as Href)}
                  className="flex-row items-center justify-center gap-2 py-4 mb-4 rounded-2xl border border-dashed border-[#8862F2] bg-[#F5F2FF]"
                >
                  <Text className="text-[#8862F2] font-bold text-sm">
                    Xem thêm công việc
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#8862F2" />
                </TouchableOpacity>
              </>
            ) : (
              <View className="items-center justify-center py-5">
                <Text className="text-gray-400">No tasks for today</Text>
              </View>
            )}
          </View>
        </View>

        {/* Logout Button (Optional) */}
        {/* {isAuthenticated && (
          <TouchableOpacity
            onPress={logout}
            className="mt-8 mx-10 py-4 bg-gray-200 rounded-2xl items-center"
          >
            <Text className="text-gray-600 font-bold">Logout</Text>
          </TouchableOpacity>
        )} */}
      </ScrollView>
    </View>
  );
}
