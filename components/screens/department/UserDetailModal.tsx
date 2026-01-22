import { BottomSheet } from "@/components/BottomSheet";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface UserDetailModalProps {
  userData: any;
  visible: boolean;
  onClose: () => void;
}

function UserDetailModal({ userData, visible, onClose }: UserDetailModalProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <BottomSheet.Overlay />
      <BottomSheet.Content heightPercentage={0.52}>
        <View className="items-center mb-6">
          <View className="w-32 h-32 bg-indigo-50 rounded-[40px] p-1 mb-4 shadow-xl shadow-indigo-100">
            <View className="w-full h-full rounded-[38px] bg-white overflow-hidden items-center justify-center">
              {userData?.avatar ? (
                <Image
                  source={{ uri: userData.avatar }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              ) : (
                <Ionicons name="person" size={60} color="#4F46E5" />
              )}
            </View>
          </View>
          <Text className="text-2xl font-bold text-gray-900">
            {userData?.name}
          </Text>
          <View className="bg-indigo-50 px-3 py-1 rounded-full mt-2">
            <Text className="text-indigo-600 font-bold text-xs uppercase tracking-tighter">
              {userData?.roleName || "Team Member"}
            </Text>
          </View>
        </View>

        <View className="space-y-4">
          <View className="flex-row items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <View className="w-10 h-10 bg-white rounded-xl items-center justify-center mr-4">
              <Ionicons name="mail-outline" size={20} color="#4F46E5" />
            </View>
            <View>
              <Text className="text-gray-400 text-[10px] font-bold uppercase mb-0.5">
                Email Address
              </Text>
              <Text className="text-gray-700 font-medium">
                {userData?.email || "Not available"}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <View className="w-10 h-10 bg-white rounded-xl items-center justify-center mr-4">
              <Ionicons name="briefcase-outline" size={20} color="#4F46E5" />
            </View>
            <View>
              <Text className="text-gray-400 text-[10px] font-bold uppercase mb-0.5">
                Position
              </Text>
              <Text className="text-gray-700 font-medium">
                {typeof userData?.position === "object"
                  ? userData.position.title
                  : userData?.position || "Staff"}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={onClose}
          className="mt-8 bg-indigo-600 py-4 rounded-3xl items-center"
        >
          <Text className="text-white font-bold text-base">Close Detail</Text>
        </TouchableOpacity>
      </BottomSheet.Content>
    </BottomSheet>
  );
}

export default React.memo(UserDetailModal);
