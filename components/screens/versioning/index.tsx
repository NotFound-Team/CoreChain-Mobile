import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const RELEASE_NOTES = [
  {
    version: "1.0.0",
    date: "Jan 15, 2026",
    notes: [
      "Initial public release of CoreChain Mobile.",
      "Support for secure sign-in and profile management.",
      "Integrated project and department management modules.",
      "Real-time notifications and feedback system.",
    ],
  },
  {
    version: "0.9.5",
    date: "Jan 02, 2026",
    notes: [
      "Beta testing version with core features.",
      "Enhanced UI responsiveness and performance.",
      "Added support for multiple file uploads in feedback.",
    ],
  },
];

export default function Versioning() {
  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-[#8862F2] pt-12 pb-6 px-5 flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-white/20 p-2 rounded-full"
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold ml-4">Versioning</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* App Info Card */}
        <View className="items-center mt-10 px-5">
          <View className="w-24 h-24 bg-[#F0EEFF] rounded-[24px] items-center justify-center shadow-sm">
            <Image
              source={require("@/assets/images/icon.png")}
              style={{ width: 64, height: 64 }}
              contentFit="contain"
            />
          </View>
          <Text className="text-2xl font-bold text-[#1A1C1E] mt-4">
            CoreChain Mobile
          </Text>
          <View className="flex-row items-center mt-1 bg-[#8862F2]/10 px-3 py-1 rounded-full">
            <Text className="text-[#8862F2] font-semibold">
              Version 1.0.0 (Build 1240)
            </Text>
          </View>
          <Text className="text-gray-500 text-sm mt-2">
            Production Environment
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="px-5 mt-8">
          <TouchableOpacity className="bg-[#8862F2] py-4 rounded-2xl items-center shadow-lg shadow-[#8862F2]/30">
            <Text className="text-white font-bold text-lg">
              Check for Updates
            </Text>
          </TouchableOpacity>
        </View>

        {/* Release Notes Section */}
        <View className="px-5 mt-10">
          <Text className="text-[#1A1C1E] font-bold text-lg mb-4">
            What&apos;s New
          </Text>

          {RELEASE_NOTES.map((release, index) => (
            <View
              key={index}
              className="mb-6 bg-[#F8F9FE] p-5 rounded-3xl border border-[#EEE]"
            >
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-[#8862F2] font-bold">
                  v{release.version}
                </Text>
                <Text className="text-gray-400 text-xs">{release.date}</Text>
              </View>
              {release.notes.map((note, idx) => (
                <View key={idx} className="flex-row items-start mb-2">
                  <View className="w-1.5 h-1.5 rounded-full bg-[#8862F2] mt-2 mr-3" />
                  <Text className="text-[#4B5563] flex-1 leading-5">
                    {note}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* System Info Breakdown */}
        <View className="px-5 mt-4">
          <View className="bg-gray-50 rounded-2xl p-4">
            <View className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-gray-500">Node Environment</Text>
              <Text className="font-medium text-gray-700">Production</Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-gray-500">Support Email</Text>
              <Text className="font-medium text-gray-700">
                support@corechain.com
              </Text>
            </View>
            <View className="flex-row justify-between py-2">
              <Text className="text-gray-500">Legal</Text>
              <Text className="font-medium text-[#8862F2]">
                Terms of Service
              </Text>
            </View>
          </View>
        </View>

        <Text className="text-center text-gray-300 text-xs mt-10">
          &copy; 2026 CoreChain Team. All rights reserved.
        </Text>
      </ScrollView>
    </View>
  );
}
