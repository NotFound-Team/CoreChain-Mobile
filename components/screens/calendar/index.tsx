import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_ATTENDANCE = [
  {
    id: "1",
    date: "27 September 2024",
    totalHours: "08:00:00 hrs",
    timeRange: "09:00 AM — 05:00 PM",
  },
  {
    id: "2",
    date: "26 September 2024",
    totalHours: "08:00:00 hrs",
    timeRange: "09:00 AM — 05:00 PM",
  },
  {
    id: "3",
    date: "25 September 2024",
    totalHours: "08:10:00 hrs",
    timeRange: "09:00 AM — 05:10 PM",
  },
];

export default function Calendar() {
  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FE]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="bg-[#8862F2] pt-12 pb-24 px-6 rounded-b-[40px] relative">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white text-3xl font-bold">
                Let&apos;s Clock-In!
              </Text>
              <Text className="text-purple-100 text-sm mt-1">
                Don&apos;t miss your clock in schedule
              </Text>
            </View>
            <View className="bg-white/20 p-2 rounded-full">
              <Ionicons name="time-outline" size={40} color="white" />
            </View>
          </View>
        </View>

        <View className="mx-6 -mt-16 bg-white rounded-[32px] p-6 shadow-sm border border-gray-50">
          <Text className="text-[#1A1C1E] font-bold text-lg">
            Total Working Hour
          </Text>
          <Text className="text-gray-400 text-xs mb-6">
            Paid Period 1 Sept 2024 - 30 Sept 2024
          </Text>

          <View className="flex-row justify-between mb-6">
            <View className="bg-gray-50 p-4 rounded-2xl flex-1 mr-2 border border-gray-100">
              <View className="flex-row items-center mb-2">
                <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                <Text className="text-gray-400 text-xs ml-1 font-medium">
                  Today
                </Text>
              </View>
              <Text className="text-[#1A1C1E] text-xl font-bold">
                00:00 Hrs
              </Text>
            </View>

            <View className="bg-gray-50 p-4 rounded-2xl flex-1 ml-2 border border-gray-100">
              <View className="flex-row items-center mb-2">
                <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                <Text className="text-gray-400 text-xs ml-1 font-medium">
                  This Pay Period
                </Text>
              </View>
              <Text className="text-[#1A1C1E] text-xl font-bold">
                32:00 Hrs
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-[#6C47FF] h-16 rounded-3xl items-center justify-center shadow-lg shadow-purple-200"
          >
            <Text className="text-white font-bold text-lg">Clock In</Text>
          </TouchableOpacity>
        </View>

        <View className="px-6 mt-8 pb-10">
          {MOCK_ATTENDANCE.map((item) => (
            <View
              key={item.id}
              className="bg-white p-5 rounded-[24px] mb-4 shadow-sm border border-gray-50"
            >
              <Text className="text-[#1A1C1E] font-bold mb-4">{item.date}</Text>

              <View className="bg-gray-50 p-4 rounded-2xl flex-row justify-between border border-gray-100">
                <View>
                  <Text className="text-gray-400 text-[10px] uppercase font-bold mb-1">
                    Total Hours
                  </Text>
                  <Text className="text-[#1A1C1E] font-bold text-base">
                    {item.totalHours}
                  </Text>
                </View>

                <View className="items-end">
                  <Text className="text-gray-400 text-[10px] uppercase font-bold mb-1">
                    Clock in & Out
                  </Text>
                  <Text className="text-[#1A1C1E] font-bold text-base">
                    {item.timeRange}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
