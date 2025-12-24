import { useAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { ScanQrCode, User } from "lucide-react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Dimensions,
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { z } from "zod";
import Checkbox from "./customs/Checkbox";
import Input from "./customs/Input";

const screenHeight = Dimensions.get("window").height;
const modalHeight = screenHeight * (3 / 4);

const signInSchema = z.object({
  username: z
    .string()
    .min(1, "Email là bắt buộc")
    .email("Email không đúng định dạng"),
  password: z.string().min(6, "Mật khẩu phải từ 6 ký tự trở lên"),
});

export type SignInFormData = z.infer<typeof signInSchema>;

const SignInModal = ({ isVisible, onClose }: any) => {
  const { login } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    console.log("Form Data:", data);
    try {
      await login(data);
      router.replace("/(tabs)");
    } catch (error) {
      console.log(error);
    }
    onClose();
    reset();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <Modal
      isVisible={isVisible}
      onSwipeComplete={onClose}
      swipeDirection={["down"]}
      onBackdropPress={onClose}
      style={{ margin: 0, justifyContent: "flex-end" }}
      propagateSwipe={true}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View
          style={{ height: modalHeight }}
          className="relative bg-white rounded-t-3xl pt-[40px] px-[32px] shadow-2xl"
        >
          <View className="absolute top-4 left-1/2 w-16 h-1 bg-gray-300 rounded-full mb-4" />

          <View className="items-center mb-6">
            <Text className="text-3xl font-bold text-gray-800">Sign In</Text>
            <Text className="text-[#475467] mt-1">Sign in to my account</Text>
          </View>

          {/* Email Field */}
          <View className="mb-4">
            <Text className="text-lg text-[#475467] mb-2">Email</Text>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="My Email"
                  keyboardType="email-address"
                  leftIcon={<User color="#7A5AF8" />}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.username && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </Text>
            )}
          </View>

          {/* Password Field */}
          <View className="mb-4">
            <Text className="text-lg text-[#475467] mb-2">Password</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="My Password"
                  secure
                  leftIcon={<ScanQrCode color="#7A5AF8" />}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.password && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </Text>
            )}
          </View>

          {/* Remember Me & Forgot Password */}
          <View className="mb-4 flex flex-row items-center justify-between">
            <Checkbox label="Remember Me" />
            <TouchableOpacity>
              <Text className="text-[#7A5AF8]">Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className="flex items-center justify-center bg-violet-600 h-12 rounded-full shadow-lg mb-14"
          >
            <Text className="text-center text-lg font-medium text-white">
              Sign In
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex flex-row items-center justify-between mb-8">
            <View className="flex-1 h-[1px] bg-[#98A2B3]" />
            <Text className="mx-4 text-[#98A2B3]">OR</Text>
            <View className="flex-1 h-[1px] bg-[#98A2B3]" />
          </View>

          {/* Social/Alternative Options */}
          <TouchableOpacity className="flex items-center justify-center bg-transparent border border-[#7A5AF8] h-12 rounded-full mb-4">
            <Text className="text-[#7A5AF8] font-medium">
              Sign in With Employee ID
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex items-center justify-center bg-transparent border border-[#7A5AF8] h-12 rounded-full">
            <Text className="text-[#7A5AF8] font-medium">
              Sign in With Phone
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SignInModal;
