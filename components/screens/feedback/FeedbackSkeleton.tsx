import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

const SkeletonItem = () => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.7, { duration: 1000 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className="bg-white p-4 rounded-2xl mb-3 border border-gray-100 shadow-sm">
      <View className="flex-row justify-between items-center mb-3">
        {/* Category badge skeleton */}
        <Animated.View
          style={animatedStyle}
          className="w-20 h-6 bg-gray-200 rounded-full"
        />
        {/* Date skeleton */}
        <Animated.View
          style={animatedStyle}
          className="w-24 h-4 bg-gray-200 rounded"
        />
      </View>
      
      {/* Title skeleton */}
      <Animated.View
        style={animatedStyle}
        className="w-3/4 h-6 bg-gray-200 rounded mb-2"
      />
      
      {/* Content skeleton - 2 lines */}
      <Animated.View
        style={animatedStyle}
        className="w-full h-4 bg-gray-200 rounded mb-1"
      />
      <Animated.View
        style={animatedStyle}
        className="w-2/3 h-4 bg-gray-200 rounded mb-3"
      />
      
      {/* Anonymous badge skeleton */}
      <View className="flex-row items-center mt-2">
         <Animated.View
             style={animatedStyle}
             className="w-4 h-4 bg-gray-200 rounded-full mr-2"
         />
         <Animated.View
             style={animatedStyle}
             className="w-24 h-4 bg-gray-200 rounded"
         />
      </View>

      {/* Action buttons skeleton */}
      <View className="flex-row justify-end mt-4 pt-3 border-t border-gray-50 gap-3">
          <Animated.View
             style={animatedStyle}
             className="w-16 h-8 bg-gray-200 rounded-lg"
          />
          <Animated.View
             style={animatedStyle}
             className="w-16 h-8 bg-gray-200 rounded-lg"
          />
      </View>
    </View>
  );
};

export const FeedbackSkeleton = () => {
  return (
    <View className="flex-1">
      {[1, 2, 3, 4].map((key) => (
        <SkeletonItem key={key} />
      ))}
    </View>
  );
};
