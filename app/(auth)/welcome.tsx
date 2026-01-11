import Onboarding from "@/components/screens/welcome/Onboarding";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

const WelcomeScreen = () => {
  const router = useRouter();

  const handleFinish = () => {
    router.replace("/(auth)/signin");
  };

  return (
    <View className="flex-1 bg-white">
      <Onboarding onFinish={handleFinish} />
    </View>
  );
};

export default WelcomeScreen;
