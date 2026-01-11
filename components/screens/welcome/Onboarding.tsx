import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  image: any;
  color: string;
}

const STEPS: OnboardingStep[] = [
  {
    id: "1",
    title: "Welcome to CoreChain!",
    description:
      "A comprehensive HR management system that is secure, convenient, and fast.",
    image: require("@/assets/images/onboarding-1.png"),
    color: "#8862F2",
  },
  {
    id: "2",
    title: "Manage Project Effectively",
    description:
      "Stay Balanced! Track your progress of the project particularly.",
    image: require("@/assets/images/onboarding-2.png"),
    color: "#6C47FF",
  },
  {
    id: "3",
    title: "Plan for Success",
    description:
      "Manage personnel information comprehensive, secure and utility.",
    image: require("@/assets/images/onboarding-3.png"),
    color: "#7A5AF8",
  },
  {
    id: "4",
    title: "Navigate Your Work Journey Efficient & Easy",
    description:
      "Increase your employees work management & career development radically.",
    image: require("@/assets/images/onboarding-4.png"),
    color: "#5F33E1",
  },
];

interface OnboardingProps {
  onFinish: () => void;
}

const Onboarding = ({ onFinish }: OnboardingProps) => {
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (activeIndex < STEPS.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    } else {
      onFinish();
    }
  };

  const handleSkip = () => {
    onFinish();
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: OnboardingStep;
    index: number;
  }) => {
    return (
      <View style={{ width, height }} className="flex-1 bg-white">
        <LinearGradient
          colors={["#8862F2", "#BFAFFF", "#FFFFFF"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: height * 0.6,
          }}
        />

        <View className="flex-[0.6] items-center justify-center pt-20 px-4">
          <Image
            source={item.image}
            style={{ width: width * 0.8, height: width * 0.8 }}
            resizeMode="contain"
          />
        </View>

        <View className="flex-[0.4] px-10 items-center justify-start pt-10">
          <Text className="text-3xl font-bold text-center text-slate-900 mb-4 tracking-tight">
            {item.title}
          </Text>
          <Text className="text-sm text-center text-slate-500 leading-6 px-4">
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1">
      <FlatList
        ref={flatListRef}
        data={STEPS}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(item) => item.id}
      />

      {/* Progress Indicator */}
      <View className="absolute bottom-44 left-0 right-0 flex-row justify-center items-center gap-1">
        {STEPS.map((_, index) => (
          <React.Fragment key={index}>
            <View
               className={`h-1.5 rounded-full ${activeIndex === index ? "w-8 bg-purple-600" : "w-1.5 bg-purple-200"}`}
            />
            {index < STEPS.length - 1 && (
               <View className="w-4 h-[1px] bg-purple-100" />
            )}
          </React.Fragment>
        ))}
      </View>

      {/* Action Buttons */}
      <View 
        style={{ paddingBottom: Math.max(insets.bottom, 20) }} 
        className="absolute bottom-0 left-0 right-0 px-8 gap-4"
      >
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.8}
          className="w-full bg-[#6C47FF] h-14 rounded-full items-center justify-center shadow-lg shadow-purple-300"
        >
          <Text className="text-white text-lg font-bold">
            {activeIndex === STEPS.length - 1 ? "Sign In" : "Next"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSkip}
          activeOpacity={0.6}
          className={`w-full h-14 items-center justify-center rounded-full border border-purple-100 ${activeIndex === STEPS.length - 1 ? "hidden" : ""}`}
        >
          <Text className="text-purple-400 text-lg font-medium">Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Onboarding;
