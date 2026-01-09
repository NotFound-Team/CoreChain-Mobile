import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangePassword() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-[#F8F9FE]">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pb-4 pt-10 bg-white">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-[#F3F0FF]"
          >
            <Ionicons name="chevron-back" size={24} color="#8862F2" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-[#1A1C1E]">
            Change Password
          </Text>
          <View className="w-10" />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 px-3 pt-4"
        >
          <View className="bg-white rounded-lg py-6 px-4 shadow-sm">
            <Text className="text-lg font-bold text-[#1A1C1E]">
              Change Password Form
            </Text>
            <Text className="text-gray-400 text-sm mb-6">
              Fill information to change your password
            </Text>

            {/* Current Password */}
            <View className="mb-4">
              <Text className="text-gray-600 text-xs font-medium mb-2 ml-1">
                Current Password
              </Text>
              <View className="flex-row items-center border border-gray-200 rounded-xl px-4 h-14">
                <Ionicons
                  name="finger-print-outline"
                  size={20}
                  color="#8862F2"
                />
                <TextInput
                  secureTextEntry={!showCurrent}
                  placeholder="My Password"
                  className="flex-1 ml-3 text-gray-800"
                  placeholderTextColor="#C1C4CD"
                />
                <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                  <Ionicons
                    name={showCurrent ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#8862F2"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View className="mb-4">
              <Text className="text-gray-600 text-xs font-medium mb-2 ml-1">
                New Password
              </Text>
              <View className="flex-row items-center border border-gray-200 rounded-xl px-4 h-14">
                <Ionicons
                  name="finger-print-outline"
                  size={20}
                  color="#8862F2"
                />
                <TextInput
                  secureTextEntry={!showNew}
                  placeholder="My Password"
                  className="flex-1 ml-3 text-gray-800"
                  placeholderTextColor="#C1C4CD"
                />
                <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                  <Ionicons
                    name={showNew ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#8862F2"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm New Password */}
            <View className="mb-2">
              <Text className="text-gray-600 text-xs font-medium mb-2 ml-1">
                Confirm New Password
              </Text>
              <View className="flex-row items-center border border-gray-200 rounded-xl px-4 h-14">
                <Ionicons
                  name="finger-print-outline"
                  size={20}
                  color="#8862F2"
                />
                <TextInput
                  secureTextEntry={!showConfirm}
                  placeholder="My Password"
                  className="flex-1 ml-3 text-gray-800"
                  placeholderTextColor="#C1C4CD"
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  <Ionicons
                    name={showConfirm ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#8862F2"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* Footer Button */}
        <View className="p-6 bg-white border-t border-gray-50">
          <TouchableOpacity
            className="bg-[#6B4EFF] h-14 rounded-full items-center justify-center shadow-lg shadow-purple-300"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">
              Update Password
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
