import { updatePassword } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(3, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "The verification password does not match.",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePassword() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const { user } = useAuthStore();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = useCallback(
    async (data: ChangePasswordFormData) => {
      if (!user?.id) {
        toast.error("Error", {
          description: "User information not found.",
        });
        return;
      }

      try {
        setIsLoading(true);
        console.log({
          id: user.id,
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        });
        const response = await updatePassword({
          id: user.id,
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        });
        console.log(response);
        if (!response.isError) {
          toast.success("Success", {
            description: "Password changed successfully.",
          });
          reset();
          router.back();
        } else {
          toast.error("Failed", {
            description: response.message || "Failed to change password",
          });
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed", {
          description: "An error occurred, please try again",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, reset],
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-[#F8F9FE]">
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-4 pb-4 pt-10 bg-white"
          style={{ paddingTop: Math.max(insets.top, 20) }}
        >
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
              <Controller
                control={control}
                name="oldPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    className={`flex-row items-center border rounded-xl px-4 h-14 ${
                      errors.oldPassword ? "border-red-500" : "border-gray-200"
                    }`}
                  >
                    <Ionicons
                      name="finger-print-outline"
                      size={20}
                      color={errors.oldPassword ? "#EF4444" : "#8862F2"}
                    />
                    <TextInput
                      secureTextEntry={!showCurrent}
                      placeholder="My Password"
                      className="flex-1 ml-3 text-gray-800"
                      placeholderTextColor="#C1C4CD"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                    <TouchableOpacity
                      onPress={() => setShowCurrent(!showCurrent)}
                    >
                      <Ionicons
                        name={showCurrent ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color="#8862F2"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.oldPassword && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  {errors.oldPassword.message}
                </Text>
              )}
            </View>

            {/* New Password */}
            <View className="mb-4">
              <Text className="text-gray-600 text-xs font-medium mb-2 ml-1">
                New Password
              </Text>
              <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    className={`flex-row items-center border rounded-xl px-4 h-14 ${
                      errors.newPassword ? "border-red-500" : "border-gray-200"
                    }`}
                  >
                    <Ionicons
                      name="finger-print-outline"
                      size={20}
                      color={errors.newPassword ? "#EF4444" : "#8862F2"}
                    />
                    <TextInput
                      secureTextEntry={!showNew}
                      placeholder="My Password"
                      className="flex-1 ml-3 text-gray-800"
                      placeholderTextColor="#C1C4CD"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                    <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                      <Ionicons
                        name={showNew ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color="#8862F2"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.newPassword && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  {errors.newPassword.message}
                </Text>
              )}
            </View>

            {/* Confirm New Password */}
            <View className="mb-2">
              <Text className="text-gray-600 text-xs font-medium mb-2 ml-1">
                Confirm New Password
              </Text>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    className={`flex-row items-center border rounded-xl px-4 h-14 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  >
                    <Ionicons
                      name="finger-print-outline"
                      size={20}
                      color={errors.confirmPassword ? "#EF4444" : "#8862F2"}
                    />
                    <TextInput
                      secureTextEntry={!showConfirm}
                      placeholder="My Password"
                      className="flex-1 ml-3 text-gray-800"
                      placeholderTextColor="#C1C4CD"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirm(!showConfirm)}
                    >
                      <Ionicons
                        name={showConfirm ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color="#8862F2"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.confirmPassword && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* Footer Button */}
        <View className="p-6 bg-white border-t border-gray-50">
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            className={`h-14 rounded-full items-center justify-center shadow-lg shadow-purple-300 ${
              isLoading ? "bg-purple-400" : "bg-[#6B4EFF]"
            }`}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">
                Update Password
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
