import { useAuthStore } from "@/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Href, Link, router } from "expo-router";
import { useState } from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MEETINGS = [
  { id: 1, title: "Townhall Meeting", time: "01:30 AM - 02:00 AM" },
  { id: 2, title: "Dashboard Report", time: "01:30 AM - 02:00 AM" },
];

export default function Home() {
  const { isAuthenticated, logout } = useAuthStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const onRefresh = () => {
    setIsRefreshing(true);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const handleNavigate = (href: Href) => {
    router.push(href);
  };

  return (
    <View className="flex-1 bg-[#F8F9FE]">
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
        <SafeAreaView className="bg-white border-b border-gray-200">
          <View
            className={`flex-row items-center justify-between px-5 pb-4 ${Platform.OS === "android" && "pt-8"}`}
          >
            <View className="flex-row items-center">
              <Link href={"/profile"}>
                <Image
                  source={{
                    uri: "https://i.pravatar.cc/150?u=tonald",
                  }}
                  style={{ width: 48, height: 48, borderRadius: 24 }}
                  className="bg-pink-200"
                />
              </Link>
              <View className="ml-3">
                <View className="flex-row items-center">
                  <Text className="text-lg font-bold text-[#1A1C1E]">
                    Tonald Drump
                  </Text>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color="#8862F2"
                    style={{ marginLeft: 4 }}
                  />
                </View>
                <Text className="text-xs text-[#8862F2] font-medium">
                  Junior Full Stack Developer
                </Text>
              </View>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                className="p-2 bg-white rounded-full shadow-sm"
                onPress={() => handleNavigate("/messages")}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={20}
                  color="#5F6368"
                />
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
        </SafeAreaView>

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

        {/* Today Meeting Section */}
        <View className="mt-6 px-5">
          <View className="bg-white rounded-[8px] px-4 py-3 border border-gray-100">
            <View className="flex-row items-center mb-4">
              <Text className="text-lg font-bold text-[#1A1C1E]">
                Today Meeting
              </Text>
              <View className="ml-2 bg-[#E8E1FF] px-2 py-0.5 rounded-md">
                <Text className="text-[#8862F2] font-bold text-xs">2</Text>
              </View>
            </View>
            <Text className="text-gray-400 -mt-3 mb-4 text-sm">
              Your schedule for the day
            </Text>

            {MEETINGS.map((item) => (
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
                      <Ionicons name="time-outline" size={14} color="#9AA0A6" />
                      <Text className="text-gray-400 text-xs ml-1">
                        {item.time}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity className="bg-[#8862F2] px-4 py-2 rounded-full" onPress={() => router.push('/video-meeting')}>
                  <Text className="text-white font-medium text-xs">
                    Join Meet
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
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
                <Text className="text-[#8862F2] font-bold text-xs">1</Text>
              </View>
            </View>
            <Text className="text-gray-400 mb-4 text-sm">
              The tasks assigned to you for today
            </Text>

            <View className="bg-[#F9FAFB] border border-gray-100 rounded-2xl p-4 shadow-sm">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <View className="bg-[#8862F2] p-2 rounded-full mr-3">
                    <Ionicons name="flash" size={18} color="white" />
                  </View>
                  <Text className="font-bold text-[#1A1C1E] text-md">
                    Wiring Dashboard Analytics
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
                    High
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View className="h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
                <View className="h-full bg-[#8862F2] w-[80%]" />
              </View>

              <View className="flex-row justify-between items-center">
                <View className="flex-row -space-x-2">
                  {/* Mock Avatars */}
                  {[1, 2, 3].map((i) => (
                    <View
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-blue-100"
                    />
                  ))}
                </View>
                <View className="flex-row gap-3">
                  <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-lg">
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color="#9AA0A6"
                    />
                    <Text className="text-gray-500 text-[10px] ml-1">
                      27 April
                    </Text>
                  </View>
                  <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-lg">
                    <Ionicons
                      name="chatbox-outline"
                      size={14}
                      color="#9AA0A6"
                    />
                    <Text className="text-gray-500 text-[10px] ml-1">2</Text>
                  </View>
                </View>
              </View>
            </View>
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
