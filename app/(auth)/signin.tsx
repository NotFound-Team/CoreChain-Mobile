import SignInModal from "@/components/SignInModal";
import React, { useState } from "react";
import {
  Animated,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// Sử dụng NativeWind cho styling
const SignInScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const fadeAnim = useState(new Animated.Value(0))[0];

  const handleImageLoaded = () => {
    setLoaded(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* <StatusBar barStyle="light-content" backgroundColor="#7C3AED" /> */}

      <View className="absolute h-2/3 inset-0 bg-violet-800/100" />
      <View className="flex-1 flex-col items-center justify-between p-6">
        {/* Phần Card thông tin (Mockup content) */}
        {!loaded && (
          <View className="w-full h-[190px] bg-gray-300 absolute top-0 left-0" />
        )}
        <View className="rounded-xl shadow-xl p-6 w-full max-w-sm absolute top-20 transform">
          <Animated.Image
            source={require('@/assets/images/banner-wellcome.png')}
            className="w-full h-auto"
            style={{
              opacity: fadeAnim,
            }}
            onLoad={handleImageLoaded}
            resizeMode="cover"
          />
        </View>

        <View className="absolute bottom-40 items-center">
          <Text className="text-4xl font-semibold text-black mb-2">CoreChain</Text>
          <Text className="text-lg font-medium text-[#475467] text-center px-8">
            An intelligent HR solutions for businesses
          </Text>
        </View>
        <TouchableOpacity
          onPress={toggleModal}
          className="absolute bottom-10 flex flex-row items-center justify-center w-11/12 h-12 max-w-md bg-[#8862F2] rounded-full shadow-lg"
        >
          <Text className="text-center text-lg font-medium text-white">
            Sign In
          </Text>
        </TouchableOpacity>
      </View>

      <SignInModal isVisible={isModalVisible} onClose={toggleModal} />
    </SafeAreaView>
  );
};

export default SignInScreen;
