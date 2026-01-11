import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
import { Animated, Dimensions, Text, TouchableOpacity, View } from "react-native";
const SignInModal = React.lazy(() => import("./SignInModal"));

const SignIn = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const toggleModal = useCallback(() => {
    setModalVisible((prev) => !prev);
  }, []);

  const fadeAnim = useState(new Animated.Value(0))[0];

  const handleImageLoaded = () => {
    setLoaded(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const { width, height } = Dimensions.get("window");

  return (
    <View className="flex-1 bg-white">
      {/* Gradient Background */}
      <LinearGradient
        colors={["#8862F2", "#BFAFFF", "#FFFFFF"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: height * 0.7,
        }}
      />

      <View className="flex-1 flex-col items-center justify-between py-12 px-6">
        {/* Banner Image */}
        <View className="flex-1 items-center justify-center w-full mt-10">
          <Animated.Image
            source={require("@/assets/images/onboarding-4.png")}
            style={{
              width: width * 0.85,
              height: width * 0.85,
              opacity: fadeAnim,
            }}
            onLoad={handleImageLoaded}
            resizeMode="contain"
          />
        </View>

        {/* Text Content */}
        <View className="items-center mb-10">
          <Text className="text-[42px] font-bold text-[#1A1C1E] mb-2 tracking-tight">
            CoreChain
          </Text>
          <Text className="text-[16px] font-medium text-[#5F6368] text-center px-6 leading-6">
            An intelligent HR solutions for businesses
          </Text>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          onPress={toggleModal}
          activeOpacity={0.8}
          className="w-full h-14 bg-[#7A5AF8] rounded-full items-center justify-center shadow-lg shadow-purple-200"
        >
          <Text className="text-white text-lg font-bold">Sign In</Text>
        </TouchableOpacity>
      </View>

      <SignInModal isVisible={isModalVisible} onClose={toggleModal} />
    </View>
  );
};

export default SignIn;
