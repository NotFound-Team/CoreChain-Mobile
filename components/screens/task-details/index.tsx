import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const TaskDetails = ({ id }: { id: string }) => {
  console.log("TASKS DETAILS", id);
  return (
    <View className="flex-1 bg-[#F1F3F8]">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView className="bg-white">
          <View className="flex-row items-center justify-between px-4 py-3 mb-4 border-b border-gray-200">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-[#F3F0FF]"
            >
              <Ionicons name="chevron-back" size={24} color="#8862F2" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-slate-800">
              Task Details
            </Text>
            <View className="w-10" />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="px-5">
            {/* Title & Status */}
            <View className="flex-row justify-between items-start mt-4">
              <View>
                <Text className="text-xl font-extrabold text-slate-900">
                  Create On Boarding Screen
                </Text>
                <Text className="text-slate-400 text-xs mt-1">
                  Created 27 Sept 2024
                </Text>
              </View>
              <View className="bg-slate-100 px-3 py-1 rounded-full flex-row items-center">
                <View className="w-2 h-2 bg-slate-400 rounded-full mr-1" />
                <Text className="text-slate-500 text-xs font-medium">
                  In Progress
                </Text>
              </View>
            </View>

            {/* Main Image Slider Placeholder */}
            <View className="mt-5">
              <Image
                source={{ uri: "https://placeholder.com/600x400" }} // Thay bằng ảnh thật
                className="w-full h-56 rounded-3xl"
                resizeMode="cover"
              />
              {/* Pagination dots */}
              <View className="flex-row justify-center mt-3 space-x-1">
                <View className="w-6 h-1 bg-purple-600 rounded-full" />
                <View className="w-1.5 h-1 bg-slate-300 rounded-full" />
                <View className="w-1.5 h-1 bg-slate-300 rounded-full" />
              </View>
            </View>

            {/* Thumbnails */}
            <View className="flex-row mt-4 space-x-3">
              <Image
                source={{ uri: "https://placeholder.com/100" }}
                className="w-16 h-16 rounded-xl border border-slate-100"
              />
              <Image
                source={{ uri: "https://placeholder.com/100" }}
                className="w-16 h-16 rounded-xl border border-slate-100"
              />
            </View>

            {/* Description Box */}
            <View className="mt-6 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <Text className="font-bold text-slate-800 mb-2">Description</Text>
              <Text className="text-slate-500 leading-5 text-[13px]">
                Create on boarding page based on pic, pixel perfect, with the
                user story of i want to know what kind of apps is this so i need
                to view onboarding screen...
              </Text>
            </View>

            {/* Priority & Difficulty */}
            <View className="flex-row justify-between mt-6">
              <View className="flex-1 mr-2">
                <Text className="text-slate-500 text-xs font-bold mb-2">
                  Priority
                </Text>
                <View className="bg-red-500 flex-row items-center p-2 rounded-xl">
                  <Text className="text-white font-bold text-xs ml-1">
                    🚩 High
                  </Text>
                </View>
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-slate-500 text-xs font-bold mb-2">
                  Difficulty
                </Text>
                <View className="bg-green-50 flex-row items-center p-2 rounded-xl border border-green-100">
                  <Text className="text-green-600 font-bold text-[11px]">
                    😊 Very Easy (Less Than a Day)
                  </Text>
                </View>
              </View>
            </View>

            {/* Assignee */}
            <View className="mt-6">
              <Text className="text-slate-500 text-xs font-bold mb-3">
                Assignee
              </Text>
              <View className="flex-row items-center">
                <Image
                  source={{ uri: "https://i.pravatar.cc/150?u=alice" }}
                  className="w-12 h-12 rounded-full bg-orange-100"
                />
                <View className="ml-3">
                  <Text className="font-bold text-slate-800">Alice</Text>
                  <Text className="text-purple-600 text-xs">
                    Sr Front End Developer
                  </Text>
                </View>
              </View>
            </View>

            {/* Comment Section */}
            <View className="mt-8 mb-10">
              <Text className="text-slate-500 text-xs font-bold mb-4">
                Comment Section
              </Text>

              {/* Jason's Comment */}
              <View className="flex-row mb-6">
                <Image
                  source={{ uri: "https://i.pravatar.cc/150?u=jason" }}
                  className="w-10 h-10 rounded-full bg-pink-100"
                />
                <View className="ml-3 flex-1">
                  <View className="flex-row justify-between">
                    <Text className="font-bold text-slate-800 text-xs">
                      Jason{" "}
                      <Text className="text-purple-500 font-normal">
                        Product Manager
                      </Text>
                    </Text>
                    <Text className="text-[10px] text-slate-400">
                      28 Sept 2024 5:53 AM
                    </Text>
                  </View>
                  <Text className="text-slate-600 mt-1 text-[13px]">
                    Dude, how long it will take? any blocker? need the update
                    asap
                  </Text>
                </View>
              </View>

              {/* Alice's Comment */}
              <View className="flex-row mb-6">
                <Image
                  source={{ uri: "https://i.pravatar.cc/150?u=alice" }}
                  className="w-10 h-10 rounded-full bg-orange-100"
                />
                <View className="ml-3 flex-1">
                  <View className="flex-row justify-between">
                    <Text className="font-bold text-slate-800 text-xs">
                      Alice{" "}
                      <Text className="text-purple-500 font-normal">
                        Sr Front End Developer
                      </Text>
                    </Text>
                    <Text className="text-[10px] text-slate-400">
                      29 Sept 2024 5:53 AM
                    </Text>
                  </View>
                  <Text className="text-slate-600 mt-1 text-[13px]">
                    <Text className="text-purple-600">@Jason</Text> still
                    testing, will be push at 04:00 PM
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Input Field Fixed at Bottom */}
          <View className="px-5 py-4 border-t border-slate-50 flex-row items-center">
            <Image
              source={{ uri: "https://i.pravatar.cc/150?u=me" }}
              className="w-10 h-10 rounded-full bg-pink-100 mr-3"
            />
            <View className="flex-1 bg-slate-50 rounded-xl px-4 py-2 flex-row items-center">
              <TextInput
                placeholder="Write a comment..."
                className="flex-1 text-slate-600 h-10"
              />
              <TouchableOpacity className="bg-slate-400 p-2 rounded-lg">
                {/* <PaperAirplaneIcon size={16} color="white" /> */}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};
