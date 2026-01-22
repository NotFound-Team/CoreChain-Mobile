import { BottomSheet } from "@/components/BottomSheet";
import { createFeedback, updateFeedback } from "@/services/feedback.service";
import { useAuthStore } from "@/stores/auth-store";
import { IFeedback } from "@/types/feedback";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

interface CreateFeedbackModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: IFeedback | null;
}

const CATEGORIES = [
  "General",
  "Workplace",
  "Management",
  "Salary & Benefits",
  "Other",
];

const feedbackSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  isAnonymous: z.boolean().optional(),
  sender: z.string().min(1, "Sender is required"),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export const CreateFeedbackModal = ({
  isVisible,
  onClose,
  onSuccess,
  initialData,
}: CreateFeedbackModalProps) => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "General",
      isAnonymous: false,
      sender: user?.id || "",
    },
  });

  const category = watch("category");
  const isAnonymous = watch("isAnonymous");

  useEffect(() => {
    if (isVisible) {
      if (initialData) {
        setValue("title", initialData.title);
        setValue("content", initialData.content);
        setValue("category", initialData.category);
        setValue("isAnonymous", !!initialData.encryptedEmployeeId);
        setValue("sender", user?.id || "");
      } else {
        reset({
          title: "",
          content: "",
          category: "General",
          isAnonymous: false,
          sender: user?.id || "",
        });
      }
    }
  }, [initialData, isVisible, reset, setValue, user?.id]);

  const onSubmit: SubmitHandler<FeedbackFormValues> = async (data) => {
    try {
      setIsLoading(true);
      let res;
      if (initialData) {
        res = await updateFeedback(initialData._id, data);
      } else {
        res = await createFeedback(data);
      }

      if (!res.isError) {
        Alert.alert(
          "Success",
          initialData
            ? "Feedback updated successfully"
            : "Feedback sent successfully",
        );
        onSuccess();
        onClose();
      } else {
        Alert.alert("Error", res.message || "Failed to send feedback");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BottomSheet visible={isVisible} onClose={onClose}>
      <BottomSheet.Overlay />
      <BottomSheet.Content heightPercentage={0.8}>
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-800">
            {initialData ? "Update Feedback" : "New Feedback"}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <Text className="text-gray-500 mb-2 font-medium">Category</Text>
          <View className="flex-row flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setValue("category", cat)}
                className={`px-4 py-2 rounded-full border ${
                  category === cat
                    ? "bg-[#8862F2] border-[#8862F2]"
                    : "bg-white border-gray-200"
                }`}
              >
                <Text
                  className={`${
                    category === cat ? "text-white" : "text-gray-600"
                  } font-medium text-xs`}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-gray-500 mb-2 font-medium">Title</Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="What's this about?"
                className={`w-full bg-gray-50 p-4 rounded-xl border ${
                  errors.title ? "border-red-500" : "border-gray-100"
                } text-base`}
                placeholderTextColor="#9CA3AF"
              />
            )}
          />
          {errors.title && (
            <Text className="text-red-500 text-xs mt-1">
              {errors.title.message}
            </Text>
          )}
        </View>

        <View className="mb-4 flex-1">
          <Text className="text-gray-500 mb-2 font-medium">Content</Text>
          <Controller
            control={control}
            name="content"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Tell us more details..."
                multiline
                textAlignVertical="top"
                className={`w-full flex-1 bg-gray-50 p-4 rounded-xl border ${
                  errors.content ? "border-red-500" : "border-gray-100"
                } text-base`}
                placeholderTextColor="#9CA3AF"
              />
            )}
          />
          {errors.content && (
            <Text className="text-red-500 text-xs mt-1">
              {errors.content.message}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => setValue("isAnonymous", !isAnonymous)}
          className="flex-row items-center mb-6 bg-gray-50 p-3 rounded-xl self-start"
        >
          <View
            className={`w-5 h-5 rounded border ${
              isAnonymous
                ? "bg-[#8862F2] border-[#8862F2]"
                : "border-gray-300 bg-white"
            } items-center justify-center mr-2`}
          >
            {isAnonymous && (
              <Ionicons name="checkmark" size={14} color="white" />
            )}
          </View>
          <Text className="text-gray-600">Send anonymously</Text>
          <Ionicons
            name="lock-closed-outline"
            size={14}
            color="#666"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="w-full bg-[#8862F2] py-4 rounded-2xl items-center shadow-lg shadow-purple-200"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">
              {initialData ? "Update Feedback" : "Send Feedback"}
            </Text>
          )}
        </TouchableOpacity>
      </BottomSheet.Content>
    </BottomSheet>
  );
};
