import Onboarding from "@/components/screens/welcome/Onboarding";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { View } from "react-native";

const WelcomeScreen = () => {
  const router = useRouter();

  const handleFinish = () => {
    SecureStore.setItem("has_seen_welcome", "true");
    router.replace("/(auth)/signin");
  };

  return (
    <View className="flex-1 bg-white">
      <Onboarding onFinish={handleFinish} />
    </View>
  );
};

export default WelcomeScreen;
