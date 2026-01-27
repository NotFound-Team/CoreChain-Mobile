import { BottomSheet } from "@/components/BottomSheet";
import Checkbox from "@/components/customs/Checkbox";
import Input from "@/components/customs/Input";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { ScanQrCode, User } from "lucide-react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { z } from "zod";

const signInSchema = z.object({
  username: z
    .string()
    .min(1, "Email is required")
    .email("Email is not in the correct format."),
  password: z.string().min(1, "Password is required"),
  // .min(6, "Passwords must be 6 characters or more."),
});

export type SignInFormData = z.infer<typeof signInSchema>;

const SignInModal = ({ isVisible, onClose }: any) => {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const { isKeyboardOpen } = useKeyboard();

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
      setIsLoading(true);
      await login(data);
      router.replace("/(tabs)");
      onClose();
      reset();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <BottomSheet visible={isVisible} onClose={onClose}>
      <BottomSheet.Overlay />
      <BottomSheet.Content
        heightPercentage={
          isKeyboardOpen
            ? Platform.OS === "ios"
              ? 0.85
              : 1
            : Platform.OS === "ios"
              ? 0.75
              : 0.85
        }
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            enabled={Platform.OS === "android"}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingBottom: 32,
              }}
            >
              <View className="px-5">
                <View className="items-center mb-6">
                  <Text className="text-3xl font-bold text-gray-800">
                    Sign In
                  </Text>
                  <Text className="text-[#475467] mt-1">
                    Sign in to my account
                  </Text>
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
                  disabled={isLoading}
                  className={`flex items-center justify-center bg-violet-600 h-12 rounded-full shadow-lg mb-14 ${isLoading ? "opacity-70" : ""}`}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-center text-lg font-medium text-white">
                      Sign In
                    </Text>
                  )}
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
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </BottomSheet.Content>
    </BottomSheet>
  );
};

export default React.memo(SignInModal);
