import React from "react";
import { ActivityIndicator, Modal, View } from "react-native";

interface LoadingOverlayProps {
  visible: boolean;
  color?: string;
}

export default function LoadingOverlay({
  visible,
  color = "#3B82F6",
}: LoadingOverlayProps) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View className="flex-1 bg-black/50 justify-center items-center">
        <ActivityIndicator size="large" color={color} />
      </View>
    </Modal>
  );
}