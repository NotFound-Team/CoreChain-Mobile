// src/components/InAppNotification.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onPress?: () => void;
  type?: "success" | "error" | "warning" | "info";
};

const TYPE_COLOR = {
  success: "#22C55E",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#6366F1",
};

export default function InAppNotification({
  visible,
  title,
  message,
  onClose,
  onPress,
  type = "info",
}: Props) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    onClose();
  };

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <SafeAreaView className="flex-1">
        <Pressable className="flex-1" onPress={onClose} />

        {/* Notification */}
        <View className="absolute top-2 left-0 right-0 items-center">
          <Pressable
            onPress={handlePress}
            className="w-[92%] bg-white rounded-2xl px-4 py-3 flex-row"
            style={{
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.05)",
              elevation: 10, // Android
              shadowColor: "#000", // iOS
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
            }}
          >
            {/* Accent bar */}
            <View
              style={{
                width: 4,
                borderRadius: 2,
                backgroundColor: TYPE_COLOR[type],
                marginRight: 10,
              }}
            />

            <View className="flex-1 pr-3">
              <Text className="text-[15px] font-semibold text-[#1A1C1E]">
                {title}
              </Text>
              <Text className="mt-1 text-[13px] text-gray-600 line-clamp-2">
                {message}
              </Text>
            </View>

            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onClose();
              }}
              hitSlop={10}
            >
              <Ionicons name="close" size={20} color="#6B7280" />
            </Pressable>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
